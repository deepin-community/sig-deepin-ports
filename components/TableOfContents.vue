<template>
  <v-card
    width="100%"
    style="overflow-y: scroll; position: sticky; top: 56px; margin-top: 56px;"
    height="calc(100vh - 56px)"
    variant="plain"
  >
    <v-list-item title="# 目录" />
    <v-divider />
    <v-list
      density="compact"
      :items="toc.links"
      item-title="text"
      item-value="id"
      nav
      :opened="toc.links.map((x) => x.id)"
      open-strategy="multiple"
      @click:select="goto"
    />
  </v-card>
</template>

<script setup>
import { useGoTo } from "vuetify";

defineProps({
  toc: { type: JSON, required: true },
});

const navto = useGoTo();

const goto = (it) => {
  navto(`#${it.id}`);
};
</script>
