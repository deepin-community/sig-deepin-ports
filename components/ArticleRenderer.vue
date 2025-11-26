<template>
  <TableOfContentsMobile class="my-12 mr-6" :toc="article.body.toc" />
  <v-row class="justify-center" no-gutters>
    <v-col class="hidden-md-and-down" cols="2">
      <TableOfContents class="my-12 mr-6" :toc="article.body.toc" />
    </v-col>
    <v-col cols="12" lg="10" class="main-content">
      <v-card class="mb-6" variant="flat" color="transparent">
        <div class="d-flex flex-column">
          <div class="mb-6 mx-4">
            <v-breadcrumbs :items="breadcrumbs" class="px-0 py-2">
              <template #divider>
                <v-icon icon="mdi-chevron-right" />
              </template>
            </v-breadcrumbs>
            <h1 class="text-h4 font-weight-bold mb-4 text-primary">
              {{ article.title }}
            </h1>
            <div
              class="d-flex flex-wrap gap-2 align-center text-medium-emphasis"
            >
              <v-avatar size="24" color="primary" variant="tonal" class="mr-2">
                <v-icon size="16">mdi-account</v-icon>
              </v-avatar>
              <span class="mr-4">{{
                article.author || "deepin-ports SIG"
              }}</span>

              <v-icon size="16" class="mr-1">mdi-calendar</v-icon>
              <span class="mr-4">{{
                (article.date
                  ? new Date(article.date)
                  : new Date()
                ).toLocaleDateString()
              }}</span>

              <v-chip
                v-for="tag in article.tags"
                :key="tag"
                size="x-small"
                color="secondary"
                variant="outlined"
                class="ml-1"
              >
                {{ tag }}
              </v-chip>
            </div>
          </div>
          <v-divider />
          <v-card-text class="mt-2">
            <ContentRenderer
              v-if="article"
              class="mdshow markdown-body"
              :value="article"
            />
          </v-card-text>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  article: { type: Object, required: true },
});

const route = useRoute();
const breadcrumbs = computed(() => {
  const paths = route.path.split("/").filter(Boolean);
  return paths
    .map((p, index) => ({
      title: p.charAt(0).toUpperCase() + p.slice(1),
      disabled: index !=0,
    }))
    .filter((i) => i.title !== "Sig-deepin-ports"); // 过滤 base url
});
</script>

<style scoped>
.sticky-toc {
  position: sticky;
  top: 80px;
}
:deep(.markdown-body) {
  line-height: 1.8;
}
:deep(.markdown-body h2, code) {
  color: rgb(var(--v-theme-primary));
}
:deep(.markdown-body code) {
  color: rgb(var(--v-theme-primary));
}
</style>
