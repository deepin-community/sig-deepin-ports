<script lang="ts" setup>
const { data } = await useAsyncData("home", () =>
  queryContent("/blog/").sort({ _id: -1 }).find()
);

const elementPerPage = ref(8);
const pageNumber = ref(1);

const formattedData = computed(() => {
  return data.value?.map(parseArticle) || [];
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
    <title-card title="博客" subtitle="最新博客文章" />
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
      ></v-pagination>
    </div>
  </v-container>
</template>
