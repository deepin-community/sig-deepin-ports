<template>
  <v-container class="main-content my-6">
    <v-card class="mb-4" color="primary">
      <v-card-title class="text-h4 font-weight-bold">
        多架构支持，由 deepin-ports 为您呈现
      </v-card-title>
      <v-card-subtitle class="text-h6">
        全球知名的桌面 Linux 发行版，现已支持最新最热的 RISC-V 和 LoongArch 架构
      </v-card-subtitle>
      <v-card-actions>
        <v-btn
          text
          size="large"
          to="/images/riscv/download"
          prepend-icon="mdi-download"
          >下载 RISC-V 镜像</v-btn
        >
        <v-btn
          text
          size="large"
          href="https://www.deepin.org/zh/download/"
          prepend-icon="mdi-open-in-new"
          >下载 LoongArch 和其它架构镜像</v-btn
        >
        <v-spacer />
        <v-btn
          text
          size="large"
          href="https://deepin.org"
          prepend-icon="mdi-open-in-new"
          >deepin 主页</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-row no-gutters>
      <v-col cols="6" v-for="indexlink in indexlinks" :key="indexlink.title">
        <v-card
          class="ma-2"
          :prepend-icon="indexlink.icon"
          :title="indexlink.title"
          :subtitle="indexlink.subtitle"
          :text="indexlink.text"
        >
          <v-card-actions
            v-for="action in indexlink.actions"
            :key="action.text"
          >
            <v-btn
              text
              v-if="action.type == 'internal' || action.type == 'external'"
              :to="action.type == 'internal' ? action.target : null"
              :href="action.type == 'external' ? action.target : null"
              :append-icon="
                action.type == 'external' ? 'mdi-open-in-new' : null
              "
              >{{ action.text }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import indexlinks from "~/assets/indexlinks.json";

useSeoMeta({
  title: "主页",
});
definePageMeta({ title: "主页" });
</script>
