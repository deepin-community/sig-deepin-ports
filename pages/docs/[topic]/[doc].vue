<script lang="ts" setup>
import "github-markdown-css/github-markdown-light.css";
definePageMeta({ title: "文档" });

const { params, path } = useRoute();

const { data: article, error } = await useAsyncData(
  `docs-${params.topic}-${params.doc}`,
  () => queryCollection(`${params.topic}docs`).path(path).first(),
);

if (error.value)
  throw showError({
    statusCode: error.value.status || 404,
    statusMessage: error.value.name,
    data: error.value.toString(),
  });

const data = article.value!;

useSeoMeta({
  title: data.title || "文档",
  description: data.description || "docs",
});

useSchemaOrg([
  {
    "@type": "BlogPosting",
    headline: data.title || "Document",
    description: data.description || "document",
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
.mdshow * {
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
