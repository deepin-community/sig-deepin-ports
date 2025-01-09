<template>
  <v-card
    :title="title"
    :subtitle="subtitle"
    :text="text"
    class="mb-4"
    color="primary"
  />
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: false },
  text: { type: String, required: false },
});
</script>
