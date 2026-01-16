<template>
  <v-card class="asciinema-player-wrapper my-4" variant="outlined">
    <div ref="playerContainer"></div>
  </v-card>
</template>

<script setup>
import "asciinema-player/dist/bundle/asciinema-player.css";
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  cols: {
    type: [Number, String],
    default: undefined,
  },
  rows: {
    type: [Number, String],
    default: undefined,
  },
  autoPlay: {
    type: Boolean,
    default: false,
  },
  preload: {
    type: Boolean,
    default: true,
  },
  loop: {
    type: [Boolean, Number], // true, false, or number of loops
    default: false,
  },
  startAt: {
    type: [Number, String],
    default: 0,
  },
  speed: {
    type: [Number, String],
    default: 1,
  },
  idleTimeLimit: {
    type: [Number, String],
    default: undefined,
  },
  theme: {
    type: String,
    default: "solarized-light", // 'asciinema', 'tango', 'solarized-dark', 'solarized-light', etc.
  },
  poster: {
    type: String,
    default: undefined, // 'npt:1:23' or data URI
  },
  fit: {
    type: String, // 'width', 'height', 'both', 'none'
    default: "width",
  },
  terminalFontSize: {
    type: String,
    default: "big", // 'small', 'medium', 'big'
  },
});

const playerContainer = ref(null);
let playerInstance = null;

const initPlayer = async () => {
  if (!playerContainer.value || !props.src) return;

  const AsciinemaPlayer = await import("asciinema-player");

  if (playerInstance) {
    playerInstance.dispose();
  }

  const options = {
    cols: props.cols ? Number(props.cols) : undefined,
    rows: props.rows ? Number(props.rows) : undefined,
    autoPlay: props.autoPlay,
    preload: props.preload,
    loop: props.loop,
    startAt: props.startAt,
    speed: props.speed ? Number(props.speed) : 1,
    idleTimeLimit: props.idleTimeLimit
      ? Number(props.idleTimeLimit)
      : undefined,
    theme: props.theme,
    poster: props.poster,
    fit: props.fit,
    fontSize: props.fontSize,
  };

  try {
    playerInstance = AsciinemaPlayer.create(
      props.src,
      playerContainer.value,
      options,
    );
  } catch (e) {
    console.error("Failed to initialize asciinema player:", e);
  }
};

onMounted(() => {
  initPlayer();
});

onUnmounted(() => {
  if (playerInstance) {
    playerInstance.dispose();
  }
});

watch(
  () => props.src,
  () => {
    initPlayer();
  },
);
</script>

<style scoped>
.asciinema-player-wrapper {
  max-width: 100%;
  overflow: hidden;
}

:deep(.asciinema-player) {
  font-family:
    "Menlo", "Monaco", "Consolas", "Courier New", monospace !important;
}
</style>
