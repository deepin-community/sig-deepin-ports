<script lang="ts" setup>
import "github-markdown-css/github-markdown-light.css";
definePageMeta({ title: "文档" });

const { params } = useRoute();

const { data: articles, error } = await useAsyncData(
    `docs-${params.path}`,
    () => queryContent("/docs/", params.path.join("/")).findOne(),
);

if (error.value)
    throw showError({
        statusCode: error.value.status,
        statusMessage: error.value.name,
        data: error.value.toString(),
    });

const data = parseArticle(articles.value);

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
    <v-container class="main-content my-6">
        <v-card variant="text" color="primary">
            <div class="d-flex flex-column">
                <DocTitleCard
                    :title="data.title"
                    :author="data.author"
                    :date="data.date"
                />
                <v-divider />
                <v-card-text class="mt-2">
                    <ContentRendererMarkdown
                        v-if="articles"
                        class="mdshow markdown-body"
                        :value="articles"
                    />
                </v-card-text>
            </div>
        </v-card>
    </v-container>
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
