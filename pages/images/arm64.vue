<template>
  <v-container class="my-6">
    <ImageList :loading="loading" :items="items" arch="arm64" />
  </v-container>
</template>

<script setup lang="ts">
import type { Reactive } from "vue";
import type { ImageInfo } from "~/types/image";

const items: Ref<ImageInfo[]> = ref([]);
const latestitem: Reactive<Map<string, ImageInfo>> = reactive(new Map());

const loading = ref(true);

const dataurl =
  "https://deepin-community.github.io/sig-deepin-ports-images/images-arm64.json";

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
  title: "镜像列表 - ARM",
  description: "",
});
definePageMeta({ title: "镜像列表 - ARM" });
</script>
