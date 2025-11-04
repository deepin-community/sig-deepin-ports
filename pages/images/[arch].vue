<template>
  <v-container class="my-6">
    <v-alert
      v-if="arch == 'riscv64'"
      title="RISC-V 架构目前仍在预览（Preview）阶段"
      text="请注意，RISC-V 架构的镜像仍在预览阶段，可能存在不稳定性和不完整性。"
      type="warning"
      variant="tonal"
      class="mb-4"
      rounded="lg"
    />
    <ImageList :loading="loading" :items="items" :arch="arch" />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ImageInfo } from "~/types/image";
import { fetchimglist } from "~/utils/fetch";
const { params } = useRoute();

const arch = typeof params.arch != "string" ? params.arch[0] : params.arch;

const items: Ref<ImageInfo[]> = ref([]);

const loading = ref(true);

const fetchImages = async () => {
  items.value = await fetchimglist(arch);
  loading.value = false;
};

fetchImages();

useSeoMeta({
  title: `镜像列表`,
  description: "",
});
definePageMeta({ title: `镜像列表` });
</script>
