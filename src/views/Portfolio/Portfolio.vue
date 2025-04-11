<script setup>
import { useUserStore } from "@/stores/userPinia";
import axios from "axios";
import { onMounted } from "vue";

onMounted(async () => {
  const userStore = useUserStore();

  try {
    const res = await axios.get("/api/checkAuth");

    if (res.data.isValid) {
      userStore.setLogin(res.data.userInfo); // ✅ 更新登入狀態
    } else {
      userStore.logout();
    }
  } catch (error) {
    console.error("Session check failed:", error);
    userStore.logout();
  }
});
</script>
<template>
  <div></div>
</template>
<style scoped></style>
