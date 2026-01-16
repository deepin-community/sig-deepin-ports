<script lang="ts" setup>
import "github-markdown-css/github-markdown-light.css";
const route = useRoute();

definePageMeta({ title: "博客文章" });

const { params } = useRoute();

const { data: article, error } = await useAsyncData(
  `blog-post-${params.blog}`,
  () => queryCollection("blogs").path(route.path).first(),
);

if (error.value)
  throw showError({
    statusCode: error.value.status || 404,
    statusMessage: error.value.name,
    data: error.value.toString(),
  });

const data = article.value!;

useSeoMeta({
  title: data.title || "博客文章",
  description: data.description || "blog post",
});

useSchemaOrg([
  {
    "@type": "BlogPosting",
    headline: data.title || "Blog Post",
    description: data.description || "blog post",
    dateModified: data.date,
    datePublished: data.date_created,
    author: [{ name: data.author }],
  },
]);
</script>

<template>
  <ArticleRenderer :article="article" />
</template>

<style lang="scss">
.mdshow *:not(.asciinema-player-wrapper):not(.asciinema-player-wrapper *) {
  margin-block-start: 0.5em;
  margin-block-end: 0.5em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding: revert;
}

.mdshow {
  h1,
  h2,
  h3,
  h4,
  h5 {
    a,
    a::before {
      all: unset !important;
    }
  }
}
</style>
