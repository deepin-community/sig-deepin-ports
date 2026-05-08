<script setup lang="ts">
import { ref, computed, watch } from "vue";
import presetsData from "~/assets/image-presets.json";
import { buildImageWorker, exportFromOPFS } from "~/utils/imager";
import PartitionUploader from "~/components/PartitionUploader.vue";
import type { ImagePresets } from "~/types/generator";

useSeoMeta({
  title: "镜像生成器 (Beta)",
  description: "Beta 版本的镜像生成器，用于生成 deepin 镜像。",
});
definePageMeta({ title: "镜像生成器 (Beta)" });

const presets = ref(presetsData as unknown as ImagePresets);
const presetOptions = computed(() => {
  return Object.entries(presets.value).map(([key, val]) => ({
    key,
    title: val.title,
    // 将设备列表包含进来，如果类型报错可以使用 (val as any).devices
    devices: (val as any).devices || [],
  }));
});

const selectedPresetKey = ref<string | null>(null);
const currentSchema = computed(() => {
  if (!selectedPresetKey.value) return null;
  return presets.value[selectedPresetKey.value].data;
});
const partitions = computed(() => {
  if (!currentSchema.value) return [];
  return currentSchema.value.partitions;
});

const filesPayload = ref<Record<string, File>>({});

const onFileUpdate = (partitionId: string, file: File | null) => {
  if (file) {
    filesPayload.value[partitionId] = file;
  } else {
    delete filesPayload.value[partitionId];
  }
};

// --- 状态控制 ---
const isGenerating = ref(false);
const generatedFileName = ref<string | null>(null);
const statusMessage = ref("");
const statusColor = ref("info");
const showJson = ref(false); // 控制 JSON 显示/隐藏状态

// 新增：下载相关状态
const isDownloading = ref(false);
const downloadProgress = ref(0);

watch(
  [selectedPresetKey, filesPayload],
  () => {
    if (generatedFileName.value) {
      generatedFileName.value = null;
      statusMessage.value = "配置已修改，请重新生成镜像。";
      statusColor.value = "info";
    }
    // 切换预设时重置 JSON 展开状态（可选）
    showJson.value = false;
  },
  { deep: true },
);

// 第一步：生成镜像
const handleGenerate = async () => {
  if (!currentSchema.value) return;

  isGenerating.value = true;
  generatedFileName.value = null;
  statusColor.value = "info";
  statusMessage.value = "正在后台合成镜像中，请勿关闭页面...";

  try {
    const outputName = "custom_os_image.img";

    const fileName = await buildImageWorker(
      currentSchema.value,
      filesPayload.value,
      outputName,
    );

    generatedFileName.value = fileName;
    statusColor.value = "success";
    statusMessage.value =
      "镜像合成成功！请点击下方「保存到本地」按钮导出文件。";
  } catch (err) {
    const error = err as Error;
    console.error(error);
    statusColor.value = "error";
    statusMessage.value = `构建失败: ${error.message || String(error)}`;
  } finally {
    isGenerating.value = false;
  }
};

// 第二步：触发下载并监听进度
const handleDownload = async () => {
  if (!generatedFileName.value) return;

  isDownloading.value = true;
  downloadProgress.value = 0;
  statusColor.value = "info";
  statusMessage.value = "正在唤起系统保存弹窗...";

  try {
    await exportFromOPFS(generatedFileName.value, (loaded, total) => {
      // 弹窗确认后开始写入，更新状态信息
      statusMessage.value = "正在下载镜像，请勿关闭页面...";
      // 计算百分比并保留整数
      downloadProgress.value = Math.floor((loaded / total) * 100);
    });

    statusColor.value = "success";
    statusMessage.value = "文件导出成功完成！";
  } catch (err) {
    const error = err as Error;
    if (error.name === "AbortError") {
      statusColor.value = "info";
      statusMessage.value = "已取消保存。";
      return;
    }
    console.error(error);
    statusColor.value = "error";
    statusMessage.value = `导出失败: ${error.message || String(error)}`;
  } finally {
    isDownloading.value = false;
  }
};
</script>

<template>
  <v-container class="main-content my-6">
    <title-card
      title="镜像生成器 (Beta)"
      text="纯前端驱动的系统镜像生成器，直接将本地文件合成系统镜像。"
      icon="mdi-harddisk"
    />

    <v-alert
      text="由于依赖 WASM 和 OPFS，此功能需要较新版本的 Chromium 系浏览器，Firefox 暂不支持 (不支持大文件)。本功能尚在测试中，可能输出预期之外甚至错误的镜像。"
      variant="tonal"
      color="warning"
      :dismissible="false"
      class="mb-6"
      icon="mdi-alert"
    />

    <v-row>
      <v-col cols="12">
        <v-card variant="outlined" color="primary">
          <v-card-title class="py-3"> 1. 选择镜像预设方案 </v-card-title>
          <v-card-text class="pt-6">
            <v-select
              v-model="selectedPresetKey"
              :items="presetOptions"
              item-title="title"
              item-value="key"
              label="请选择需要的系统分区方案"
              variant="outlined"
              prepend-inner-icon="mdi-file-document-outline"
              :disabled="isGenerating || isDownloading"
            >
              <!-- 自定义选中项展示内容 -->
              <template #selection="{ item }">
                <div class="d-flex align-center">
                  <span class="mr-2">{{ item.raw.title }}</span>
                  <v-chip
                    v-for="device in item.raw.devices"
                    :key="device"
                    size="x-small"
                    color="primary"
                    variant="tonal"
                    class="mr-1"
                  >
                    {{ device }}
                  </v-chip>
                </div>
              </template>

              <!-- 自定义下拉列表展示内容 -->
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #title>
                    <div class="d-flex align-center">
                      <span class="mr-2">{{ item.raw.title }}</span>
                      <v-chip
                        v-for="device in item.raw.devices"
                        :key="device"
                        size="x-small"
                        color="primary"
                        variant="tonal"
                        class="mr-1"
                      >
                        {{ device }}
                      </v-chip>
                    </div>
                  </template>
                </v-list-item>
              </template>
            </v-select>

            <!-- JSON Schema 展开/收起区 -->
            <div v-if="currentSchema">
              <div class="d-flex align-center">
                <v-btn
                  variant="text"
                  color="primary"
                  :append-icon="
                    showJson ? 'mdi-chevron-up' : 'mdi-chevron-down'
                  "
                  @click="showJson = !showJson"
                >
                  JSON Schema
                </v-btn>
              </div>
              <v-expand-transition>
                <pre
                  v-show="showJson"
                  class="pa-4 mt-2 rounded overflow-y-auto"
                  style="max-height: 250px; font-size: 0.85rem"
                  >{{ JSON.stringify(currentSchema, null, 2) }}</pre
                >
              </v-expand-transition>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="currentSchema">
      <v-col cols="12">
        <v-card variant="outlined" color="secondary">
          <v-card-title class="py-3"> 2. 选择本地分区数据 </v-card-title>
          <v-card-text class="pt-6">
            <PartitionUploader
              v-for="partition in partitions"
              :key="partition.id"
              :partition="partition"
              :disabled="isGenerating || isDownloading"
              @update:file="(f) => onFileUpdate(partition.id, f)"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="currentSchema">
      <v-col cols="12" class="d-flex flex-column flex-sm-row gap-4">
        <!-- 步骤1: 生成镜像 -->
        <v-btn
          color="primary"
          size="x-large"
          prepend-icon="mdi-cog-play"
          variant="flat"
          class="flex-grow-1"
          :loading="isGenerating"
          :disabled="isGenerating || isDownloading"
          @click="handleGenerate"
        >
          {{ isGenerating ? "正在生成..." : "生成镜像" }}
        </v-btn>

        <!-- 步骤2: 唤起下载 (只有生成完成后才显示/启用) -->
        <v-btn
          v-if="generatedFileName"
          color="success"
          size="x-large"
          prepend-icon="mdi-download"
          variant="flat"
          class="flex-grow-1"
          :loading="isDownloading"
          :disabled="isDownloading"
          @click="handleDownload"
        >
          {{ isDownloading ? "正在保存..." : "保存到本地" }}
        </v-btn>
      </v-col>

      <!-- 下载进度条区 -->
      <v-col
        v-if="isDownloading && downloadProgress > 0"
        cols="12"
        class="py-0"
      >
        <div
          class="d-flex justify-space-between mb-1 text-caption text-medium-emphasis"
        >
          <span>写入进度</span>
          <span>{{ downloadProgress }}%</span>
        </div>
        <v-progress-linear
          v-model="downloadProgress"
          color="success"
          height="8"
          rounded
          striped
        />
      </v-col>

      <v-col cols="12">
        <v-alert
          v-if="statusMessage"
          :type="statusColor as any"
          variant="tonal"
          density="compact"
          class="mb-0 flex-grow-1 w-100"
        >
          {{ statusMessage }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.gap-4 {
  gap: 16px;
}
pre {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
}
</style>
