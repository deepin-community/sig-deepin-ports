<template>
  <v-container class="main-content my-6">
    <title-card title="选择您的硬件" subtitle="获取安装指南" />
    <v-row no-gutters class="d-flex flex-wrap">
      <v-col v-for="doc in data" cols="4" class="d-flex flex-column">
        <v-card
          class="ma-2"
          :title="doc.meta_device || '未知设备'"
          :text="doc.meta_device_desc || null"
          append-icon="mdi-arrow-right"
          :to="doc._path"
        >
          <v-img
            height="200"
            class="ma-2"
            :src="
              doc.meta_device_img
                ? config.app.baseURL + doc.meta_device_img
                : 'https://upload.wikimedia.org/wikipedia/commons/9/9a/RISC-V-logo.svg'
            "
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { data } = await useAsyncData("home", () =>
  queryContent("/docs/install/riscv/").sort({ _id: -1 }).find()
);

const config = useRuntimeConfig();

useSeoMeta({
  title: "RISC-V 安装文档",
  description: "",
});
definePageMeta({ title: "RISC-V 安装文档" });
</script>
