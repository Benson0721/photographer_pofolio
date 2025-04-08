<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const isDesktop = ref(false);
const resize = () => {
  isDesktop.value = window.innerWidth > 768;
};

onMounted(() => {
  resize();
  window.addEventListener("resize", resize);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  window.removeEventListener("resize", resize);
});
</script>

<template>
  <router-view :isDesktop="isDesktop" />
</template>

<style scoped></style>
