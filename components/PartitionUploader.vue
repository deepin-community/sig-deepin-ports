<script setup lang="ts">
import { ref, watch } from "vue";
import guidData from "~/assets/guid.json";
import fileSize from "file-size";
import type { PartitionConfig } from "~/wasm-imager/pkg/wasm_imager";

const guids = guidData as Record<string, string>;

const props = defineProps<{
  partition: PartitionConfig;
}>();

const emit = defineEmits<{
  (e: "update:file", file: File | null): void;
}>();

const fileInput = ref<File | File[] | null>(null);

watch(fileInput, (newVal) => {
  // 兼容 Vuetify 文件数组 / 单文件
  const actualFile = Array.isArray(newVal) ? newVal[0] : newVal;
  emit("update:file", actualFile || null);
});
</script>

<template>
  <v-card variant="outlined" class="mb-4">
    <v-card-text>
      <div class="d-flex justify-space-between align-center mb-4">
        <div>
          <div class="text-subtitle-1 font-weight-bold text-primary">
            分区: [ {{ props.partition.id }} ]
          </div>
          <div class="text-caption text-medium-emphasis mt-1">
            类型: {{ props.partition.type ? guids[props.partition.type] || props.partition.type: "N/A" }} | 尺寸限制:
            {{ props.partition.size ? fileSize(props.partition.size).human() : "自适应推导大小" }}
            <span v-if="props.partition.hidden"> | (Hidden)</span>
          </div>
        </div>
      </div>

      <v-file-input
        v-model="fileInput"
        label="选择本地分区文件 (留空将不写入数据)"
        density="compact"
        variant="filled"
        prepend-icon="mdi-harddisk"
        show-size
        clearable
        hide-details
      />
    </v-card-text>
  </v-card>
</template>
