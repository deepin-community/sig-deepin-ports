<template>
  <v-app>
    <NavBar />
    <v-main>
      <v-container class="main-content my-6">
        <div class="d-flex flex-column align-center">
          <v-empty-state icon="$error">
            <template v-slot:media>
              <v-icon color="surface-variant"></v-icon>
            </template>

            <template v-slot:headline>
              <div class="text-h4">
                {{ error.statusCode }}
              </div>
            </template>

            <template v-slot:title>
              <div class="text-h6">
                {{ error.statusMessage }}
              </div>
            </template>

            <template v-slot:text>
              <div class="text-medium-emphasis text-caption" v-if="error.data">
                {{ error.data }}
              </div>
            </template>
            <template v-slot:actions>
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

<script setup lang="ts">
useSeoMeta({
  title: "错误页",
});

import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});
</script>
