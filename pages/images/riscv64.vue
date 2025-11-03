<template>
  <v-container class="my-6">
    <v-alert
      title="RISC-V 架构目前仍在预览（Preview）阶段"
      text="请注意，RISC-V 架构的镜像仍在预览阶段，可能存在不稳定性和不完整性。"
      type="warning"
      variant="tonal"
      class="mb-4"
      rounded="lg"
    />
    <ImageList :loading="loading" :items="items" arch="riscv64" />
  </v-container>
</template>

<script setup lang="ts">
import type { Reactive } from "vue";
import { ref } from "vue";
import type { ImageInfo } from "~/types/image";

const items: Ref<ImageInfo[]> = ref([]);
const latestitem: Reactive<Map<string, ImageInfo>> = reactive(new Map());

const loading = ref(true);

const dataurl =
  "https://deepin-community.github.io/sig-deepin-ports-images/images-riscv64.json";

const fetchImages = async () => {
  const response = await fetch(dataurl);
  let data: ImageInfo[] = await response.json();

  for (const i of data) {
    const j = latestitem.get(i.device);
    if (j)
      if (i.date > j.date) latestitem.set(i.device, i);
      else latestitem.set(i.device, i);
  }
  data = data.map((i) => {
    if (latestitem.get(i.device)?.date == i.date) i["tags"] = ["latest"];
    return i;
  });

  items.value = data;
  loading.value = false;
};

fetchImages();

useSeoMeta({
  title: "镜像列表 - RISC-V",
  description: "",
});
definePageMeta({ title: "镜像列表 - RISC-V" });
</script>
