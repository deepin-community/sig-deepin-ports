<template>
  <v-card
    class="my-2 align-self-stretch"
    variant="outlined"
    color="primary"
    width="100%"
    :title="post.title"
    :subtitle="'By ' + (post.author || 'deepin-ports SIG')"
  >
    <v-card-text class="text-truncate">{{ post.description }}</v-card-text>
    <v-card-actions>
      <v-chip variant="text" prepend-icon="mdi-clock-outline">
        {{ new Date(post.date).toLocaleDateString() }}
      </v-chip>
      <v-spacer />
      <v-btn text :to="post.path"> 阅读全文 </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  post: { type: JSON, required: true },
});
</script>
