<template>
    <v-card variant="tonal" class="pa-4 pb-2 mb-2">
        <v-card-title>
            <div class="text-h4 mb-2">
                {{ title }}
            </div>
        </v-card-title>
        <v-card-actions class="mb-1">
            <v-chip variant="text" prepend-icon="mdi-account" :text="author" />
            <v-chip
                variant="text"
                prepend-icon="mdi-clock-outline"
                :text="new Date(date).toLocaleDateString()"
            />
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
defineProps({
    title: { type: String, required: true },
    author: { type: String, required: false, default: "Unknown" },
    date: {
        type: String,
        required: false,
        default: Date.now(),
    },
});
</script>
