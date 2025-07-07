<template>
  <TableOfContentsMobile class="my-12 mr-6" :toc="article.body.toc" />
  <v-row class="justify-center" no-gutters>
    <v-col class="hidden-md-and-down" cols="2">
      <TableOfContents class="my-12 mr-6" :toc="article.body.toc" />
    </v-col>
    <v-col cols="12" lg="10" class="main-content">
      <v-card class="my-6" variant="text" color="primary">
        <div class="d-flex flex-column">
          <v-card variant="tonal" class="pa-4 pb-2 mb-2">
            <v-card-title>
              <div class="text-h4 mb-2" style="text-wrap: auto">
                {{ article.title }}
              </div>
            </v-card-title>
            <v-card-actions class="mb-1">
              <v-chip
                variant="text"
                prepend-icon="mdi-account"
                :text="article.author || 'deepin-ports SIG'"
              />
              <v-chip
                variant="text"
                prepend-icon="mdi-clock-outline"
                :text="
                  (article.date
                    ? new Date(article.date.toString())
                    : new Date()
                  ).toLocaleDateString()
                "
              />
            </v-card-actions>
          </v-card>
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
  article: { type: JSON, required: true },
});
</script>
