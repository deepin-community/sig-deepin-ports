<script lang="ts" setup>
const testdocs = (
  await useAsyncData(
    "docs-test",
    async () => await queryCollection("testdocs").order("date", "DESC").all(),
  )
).data;

const installdocs = (
  await useAsyncData(
    "docs-install",
    async () =>
      await queryCollection("installdocs").order("date", "DESC").all(),
  )
).data;

useSeoMeta({
  title: "文档列表",
  description: "",
});
definePageMeta({ title: "文档列表" });
</script>

<template>
  <v-container class="main-content my-6">
    <title-card title="文档列表" subtitle="最新文档列表" icon="mdi-newspaper" />
    <v-row>
      <v-col cols="12" lg="6">
        <v-card variant="tonal" color="secondary">
          <v-card-title>
            <v-icon start icon="mdi-chart-box-outline" />
            测试报告
            <v-btn
              class="ml-2"
              size="small"
              text="订阅 RSS"
              variant="outlined"
              prepend-icon="mdi-rss"
              href="https://deepin-community.github.io/sig-deepin-ports/feed.testdocs.xml"
            />
          </v-card-title>
        </v-card>
        <v-card
          v-if="testdocs?.length === 0"
          class="my-2 align-self-stretch"
          variant="outlined"
          color="primary"
          width="100%"
        >
          <v-empty-state
            title="暂无测试报告"
            text="等您来写"
            icon="mdi-book-open-variant"
            color="primary"
          />
        </v-card>
        <blog-item v-for="post in testdocs" :key="post.title" :post="post" />
      </v-col>
      <v-col cols="12" lg="6">
        <v-card variant="tonal" color="secondary">
          <v-card-title>
            <v-icon start icon="mdi-package-down" />
            安装指南
            <v-btn
              class="ml-2"
              size="small"
              text="订阅 RSS"
              variant="outlined"
              prepend-icon="mdi-rss"
              href="https://deepin-community.github.io/sig-deepin-ports/feed.installdocs.xml"
            />
          </v-card-title>
        </v-card>
        <v-empty-state
          v-if="installdocs?.length === 0"
          title="暂无安装指南"
          text="等您来写"
          icon="mdi-book-open-variant"
        />
        <blog-item v-for="post in installdocs" :key="post.title" :post="post" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.main-content {
  max-width: 1400px;
}
</style>
