<script setup>
import { useUserStore } from "@/stores/userPinia";
import axios from "axios";
import { onMounted } from "vue";
import Navbar from "../../components/Navbar/Navbar.vue";
import Footer from "../../components/Footer.vue";
import NewTopic from "../../components/ImageSystem/PortfolioDialog/NewTopic.vue";
import { useTopicStore } from "../../stores/topicPinia";
const topicStore = useTopicStore();
/*onMounted(async () => {
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
});*/
</script>
<template>
  <main>
    <Navbar />
    <div class="portfolio">
      <h1>Portfolio</h1>
      <div
        class=""
        v-for="topicImage in topicStore.topicImages"
        :key="topicImage._id"
      >
        <div class="flex">
          <div class="">
            <img
              :src="topicImage.imageURL"
              alt="topic"
              class="w-full h-auto object-cover"
            />
          </div>
          <div class="">
            <p>{{ topicImage.topic }}</p>
            <p>{{ topicImage.notes }}</p>
          </div>
        </div>
      </div>
      <NewTopic />
    </div>
    <Footer />
  </main>
</template>
<style scoped></style>
