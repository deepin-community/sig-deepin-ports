<script lang="ts" setup>
const testdocs = (
    await useAsyncData(
        "docs-test",
        async () => await queryContent("docs", "test").sort({ _id: -1 }).find(),
    )
).data;

const installdocs = (
    await useAsyncData(
        "docs-install",
        async () =>
            await queryContent("docs", "install").sort({ _id: -1 }).find(),
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
        <title-card
            title="文档列表"
            subtitle="最新文档列表"
            icon="mdi-newspaper"
        />
        <v-row>
            <v-col cols="12" lg="6">
                <v-card
                    variant="tonal"
                    color="secondary"
                    title="测试报告"
                    prepend-icon="mdi-chart-box-outline"
                />
                <v-card
                    class="my-2 align-self-stretch"
                    variant="outlined"
                    color="primary"
                    width="100%"
                >
                    <v-empty-state
                        v-if="testdocs.length === 0"
                        title="暂无测试报告"
                        text="等您来写"
                        icon="mdi-book-open-variant"
                        color="primary"
                    />
                </v-card>
                <blog-item
                    v-for="post in testdocs"
                    :key="post.title"
                    :post="parseArticle(post)"
                />
            </v-col>
            <v-col cols="12" lg="6">
                <v-card
                    variant="tonal"
                    color="secondary"
                    title="安装指南"
                    prepend-icon="mdi-package-down"
                />
                <v-empty-state
                    v-if="installdocs.length === 0"
                    title="暂无安装指南"
                    text="等您来写"
                    icon="mdi-book-open-variant"
                />
                <blog-item
                    v-for="post in installdocs"
                    :key="post.title"
                    :post="parseArticle(post)"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.main-content {
    max-width: 1400px;
}
</style>
