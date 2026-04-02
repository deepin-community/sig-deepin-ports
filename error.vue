<template>
  <v-app>
    <NavBar />
    <v-main>
      <v-container class="main-content my-6">
        <div class="d-flex flex-column align-center">
          <v-empty-state icon="$error">
            <template #media>
              <v-icon color="surface-variant" />
            </template>

            <template #headline>
              <div class="text-h4">
                {{ error.status }}
              </div>
            </template>

            <template #title>
              <div class="text-h6">
                {{ error.statusText }}
              </div>
            </template>

            <template #text>
              <div v-if="error.data" class="text-medium-emphasis text-caption">
                {{ error.data }}
              </div>
            </template>
            <template #actions>
              <v-btn class="mt-8" variant="outlined" to="/">Back to Home</v-btn>
            </template>
          </v-empty-state>
        </div>
      </v-container>
    </v-main>
    <BackToTop />
    <FooterBar />
  </v-app>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

useSeoMeta({
  title: "错误页",
});

defineProps({
  error: {
    type: Object as () => NuxtError,
    default: () => ({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    }),
  },
});
</script>

<style>
html {
  overflow-y: auto !important;
}

.main-content {
  max-width: 900px;
}

a:not([class*="v"])::before {
  font-family: "Material Design Icons";
  content: "\F0339 ";
}
</style>
