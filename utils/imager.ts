// Vite 专门用于导入 worker 的特殊语法
import type { SchemaLayout } from '~/wasm-imager/pkg/wasm_imager';
import ImagerWorker from './imager.worker.ts?worker'
import { toRaw } from 'vue';

export function buildImageWorker(schema: SchemaLayout, filesPayload: Record<string, File>, outputName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!import.meta.client) {
      return reject(new Error("Image creation must run in the browser client."));
    }

    const worker = new ImagerWorker();

    worker.onmessage = async (e: MessageEvent) => {
      if (e.data.status === "done") {
        worker.terminate();
        resolve(e.data.fileName);
      } else {
        worker.terminate();
        reject(new Error(e.data.error || "Unknown worker error"));
      }
    };

    worker.onerror = (err) => {
      worker.terminate();
      reject(err);
    };

    worker.postMessage({
      schema: toRaw(schema),
      filesPayload: toRaw(filesPayload),
      outputName: toRaw(outputName),
    });
  });
}

export async function exportFromOPFS(
  fileName: string, 
  onProgress?: (loaded: number, total: number) => void
) {
  const root = await navigator.storage.getDirectory();
  const fileHandle = await root.getFileHandle(fileName);
  const file = await fileHandle.getFile();
  const totalSize = file.size;

  if ("showSaveFilePicker" in window) {
    const saveHandle = await (window as any).showSaveFilePicker({
      suggestedName: fileName,
      types:[
        {
          description: "Raw Disk Image",
          accept: { "application/octet-stream":[".img"] },
        },
      ],
    });
    const writable = await saveHandle.createWritable();
    
    // 改为手动读取数据流以获取进度
    const reader = file.stream().getReader();
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      await writable.write(value);
      loaded += value.length;
      
      if (onProgress) {
        onProgress(loaded, totalSize);
      }
    }
    
    await writable.close();
    return;
  }
  
  // 降级方案: Blob URL 自动下载
  // 降级方案是由浏览器原生下载器接管的，瞬间交接完成，所以直接触发 100%
  if (onProgress) onProgress(totalSize, totalSize);
  
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
