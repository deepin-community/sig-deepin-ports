<template>
  <v-fab
    class="hidden-xs"
    v-show="showfab"
    icon="mdi-arrow-up"
    position="sticky"
    app
    appear
    variant="outlined"
    @click="scrolltop"
    v-scroll="onScroll"
  ></v-fab>
</template>

<script setup>
import { useGoTo } from "vuetify";
import { ref } from "vue";

const goTo = useGoTo();
const showfab = ref(false);

function scrolltop() {
  goTo(0);
}
function onScroll(e) {
  showfab.value = e.target.scrollingElement.scrollTop > window.innerHeight;
}
</script>
