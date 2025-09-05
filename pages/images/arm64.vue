<template>
  <v-container class="my-6">
    <ImageList :loading="loading" :items="items" />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const items = ref([]);
const latestitem = reactive({});

const loading = ref(true);

const dataurl =
  "https://deepin-community.github.io/sig-deepin-ports-images/images-arm64.json";

const fetchImages = async () => {
  const response = await fetch(dataurl);
  let data = await response.json();

  for (const i of data) {
    if (Object.keys(latestitem).includes(i.device)) {
      if (i.date > latestitem[i.device].date) latestitem[i.device] = i;
    } else latestitem[i.device] = i;
  }
  data = data.map((i) => {
    if (latestitem[i.device].date == i.date) i["tags"] = ["latest"];
    return i;
  });

  data = data.filter((i) => i.device != "generic");

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
