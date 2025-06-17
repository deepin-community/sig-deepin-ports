<template>
    <v-fab
        v-show="showfab"
        v-scroll="onScroll"
        class="hidden-xs"
        icon="mdi-arrow-up"
        position="sticky"
        app
        appear
        variant="outlined"
        @click="scrolltop"
    />
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
