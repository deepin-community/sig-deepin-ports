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
    <ImageList :loading="loading" :items="items" />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const items = ref([]);
const latestitem = reactive({});

const loading = ref(true);

const dataurl =
  "https://deepin-community.github.io/sig-deepin-ports-images/images-riscv64.json";

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
