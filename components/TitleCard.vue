<template>
    <v-card
        :title="title"
        :subtitle="subtitle"
        :text="text"
        class="mb-4"
        color="primary"
        variant="tonal"
        :prepend-icon="icon"
    />
</template>

<script setup lang="ts">
defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, required: false, default: null },
    text: { type: String, required: false, default: null },
    icon: { type: String, required: false, default: null },
});
</script>
