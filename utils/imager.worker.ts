import init, { generate_layout, type LayoutResult } from "wasm-imager";

self.onmessage = async (e: MessageEvent) => {
  const { schema, filesPayload, outputName } = e.data;

  try {
    await init();

    // 解析文件真实大小给 Wasm 进行 Layout 推导
    const fileSizes: Record<string, number> = {};
    for (const id in filesPayload) {
      if (filesPayload[id]) {
        fileSizes[id] = filesPayload[id].size;
      }
    }

    const layoutResult = generate_layout(schema, fileSizes) as LayoutResult;

    // OPFS API (Origin Private File System)
    const root = await navigator.storage.getDirectory();
    await root.removeEntry(outputName).catch(() => {});

    const fileHandle = await root.getFileHandle(outputName, { create: true });
    // Web Worker 中可以直接使用同步句柄进行高性能读写
    const syncHandle = await fileHandle.createSyncAccessHandle();

    // 扩展文件大小
    syncHandle.truncate(Number(layoutResult.disk_size));

    // 写入 MBR/GPT 表头表尾元数据
    for (const chunk of layoutResult.metadata_chunks) {
      const dataView = new Uint8Array(chunk.data);
      syncHandle.write(dataView, { at: Number(chunk.offset) });
    }

    const BUFFER_SIZE = 4 * 1024 * 1024; // 4MB Buffer

    // 写入真实文件 Payload
    for (const resolved of layoutResult.resolved_partitions) {
      const fileBlob = filesPayload[resolved.id] as File;
      if (!fileBlob) continue;

      const reader = fileBlob.stream().getReader();
      let currentOffset = Number(resolved.offset);

      const buffer = new Uint8Array(BUFFER_SIZE);
      let bufLen = 0;

      while (true) {
        const { done, value } = await reader.read();

        if (value) {
          let valueOffset = 0;
          while (valueOffset < value.length) {
            const space = BUFFER_SIZE - bufLen;
            const chunkToCopy = Math.min(space, value.length - valueOffset);

            buffer.set(
              value.subarray(valueOffset, valueOffset + chunkToCopy),
              bufLen,
            );
            bufLen += chunkToCopy;
            valueOffset += chunkToCopy;

            if (bufLen === BUFFER_SIZE) {
              syncHandle.write(buffer, { at: currentOffset });
              currentOffset += BUFFER_SIZE;
              bufLen = 0;
            }
          }
        }

        if (done) {
          if (bufLen > 0) {
            syncHandle.write(buffer.subarray(0, bufLen), { at: currentOffset });
            currentOffset += bufLen;
            bufLen = 0;
          }
          break;
        }
      }
    }

    syncHandle.flush();
    syncHandle.close();

    self.postMessage({ status: "done", fileName: outputName });
  } catch (err) {
    const error = err as Error;
    console.error("[Worker Error]", error);
    self.postMessage({
      status: "error",
      error: error.message ? error.message : String(error),
    });
  }
};
