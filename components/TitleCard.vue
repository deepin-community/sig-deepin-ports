<template>
  <v-card
    variant="tonal"
    class="pa-6 mb-4 rounded-lg d-flex align-center position-relative overflow-hidden"
    color="primary"
  >
    <div class="position-relative z-index-1">
      <div class="d-flex align-center mb-2">
        <v-icon size="32" class="mr-3">{{ icon }}</v-icon>
        <h1 class="text-h5 font-weight-bold">{{ title }}</h1>
      </div>
      <div class="text-h6 opacity-90 mb-2">{{ subtitle }}</div>
      <div class="text-body-1 opacity-80" style="max-width: 700px">
        {{ text }}
      </div>
    </div>

    <v-icon
      size="200"
      class="position-absolute"
      style="
        right: -40px;
        bottom: -40px;
        opacity: 0.1;
        transform: rotate(-15deg);
      "
    >
      {{ icon }}
    </v-icon>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: false, default: null },
  text: { type: String, required: false, default: null },
  icon: { type: String, required: false, default: null },
});
</script>
