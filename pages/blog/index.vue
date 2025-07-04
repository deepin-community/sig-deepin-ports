<script lang="ts" setup>
const { data } = await useAsyncData("blogs", () =>
  queryCollection("blogs").order("date", "DESC").all(),
);

const elementPerPage = ref(8);
const pageNumber = ref(1);

const formattedData = computed(() => {
  return data.value || [];
});

const paginatedData = computed(() => {
  return (
    formattedData.value.filter((data, idx) => {
      const startInd = (pageNumber.value - 1) * elementPerPage.value;
      const endInd = pageNumber.value * elementPerPage.value - 1;

      if (idx >= startInd && idx <= endInd) return true;
      else return false;
    }) || []
  );
});

const totalPage = computed(() => {
  const ttlContent = formattedData.value.length || 0;
  const totalPage = Math.ceil(ttlContent / elementPerPage.value);
  return totalPage;
});

useSeoMeta({
  title: "博客",
  description: "",
});
definePageMeta({ title: "博客" });
</script>

<template>
  <v-container class="main-content my-6">
    <title-card title="博客" subtitle="最新博客文章" icon="mdi-newspaper" />
    <v-alert
      class="mb-2"
      closable
      icon="mdi-rss"
      density="compact"
      color="secondary"
      title="订阅我们的最新消息"
      text="deepin-ports SIG 的博客和文档均支持 RSS 订阅，欢迎使用！"
      variant="tonal"
    >
      <v-btn
        class="ml-2"
        size="small"
        text="订阅 RSS"
        variant="outlined"
        prepend-icon="mdi-rss"
        href="https://deepin-community.github.io/sig-deepin-ports/feed.blog.xml"
      />
    </v-alert>
    <v-empty-state
      v-if="formattedData.length === 0"
      title="暂无博客文章"
      text="等您来写"
      icon="mdi-book-open-variant"
    />
    <div class="d-flex flex-column align-center">
      <blog-item v-for="post in paginatedData" :key="post.title" :post="post" />
      <v-pagination
        v-model="pageNumber"
        :length="totalPage"
        :total-visible="5"
      />
    </div>
  </v-container>
</template>
