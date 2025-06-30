<template>
  <v-fab
    class="hidden-lg-and-up"
    icon="mdi-list-box-outline"
    position="sticky"
    app
    appear
    location="bottom left"
    variant="outlined"
    @click="showtoc = true"
  />
  <v-navigation-drawer v-model="showtoc" class="mx-2 hidden-lg-and-up" temporary>
    <v-list-item title="# 目录" />
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
  </v-navigation-drawer>
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

const showtoc = ref(false);
</script>
