<script setup>
import { onMounted } from "vue";
import { useUserStore } from "./stores/userPinia.ts";
const userStore = useUserStore();
onMounted(() => {
  userStore.checkAuth();
});
</script>

<template>
  <router-view />
</template>

<style scoped></style>
