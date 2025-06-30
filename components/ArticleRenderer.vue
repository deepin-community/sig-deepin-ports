<template>
  <TableOfContentsMobile class="my-12 mr-6" :toc="article.body.toc" />
  <v-row class="justify-center" no-gutters>
    <v-col class="hidden-md-and-down" cols="2">
      <TableOfContents class="my-12 mr-6" :toc="article.body.toc" />
    </v-col>
    <v-col cols="12" lg="10" class="main-content">
      <v-card class="my-6" variant="text" color="primary">
        <div class="d-flex flex-column">
          <DocTitleCard
            :title="article.title"
            :author="article.author"
            :date="article.date.toString()"
          />
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
