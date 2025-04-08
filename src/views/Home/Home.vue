<script setup lang="ts">
import Navbar from "../../components/Navbar/Navbar.vue";
import Carousel from "../../components/Carousel/Carousel.vue";
import CategorySection from "../../components/CategorySection.vue";
import Footer from "../../components/Footer.vue";
import SocialMediaButtons from "../../components/SocialMediaButtons.vue";
import { ref, onMounted, onUnmounted, computed, defineProps } from "vue";
import carouselImage1 from "../../assets/images/carousel1.jpg";
import carouselImage2 from "../../assets/images/carousel2.jpg";
import carouselImage3 from "../../assets/images/carousel3.jpg";
import "./Home.scss";

const images = ref([
  {
    src: carouselImage1,
  },
  {
    src: carouselImage2,
  },
  {
    src: carouselImage3,
  },
]);

const props = defineProps<{
  isDesktop: boolean;
}>();

const currentImage = ref(0);

const backgroundStyle = computed(() => {
  if (props.isDesktop) {
    return { backgroundImage: `url(${images.value[currentImage.value].src})` };
  }
  return {};
});

let intervalId: ReturnType<typeof setInterval> | null = null;

const changeImage = () => {
  intervalId = setInterval(() => {
    currentImage.value = (currentImage.value + 1) % images.value.length;
  }, 10000);
};

onMounted(() => {
  changeImage();
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
});
</script>
<template>
  <main :class="`home`" :style="backgroundStyle">
    <Navbar />
    <Carousel
      :images="images"
      :currentImage="currentImage"
      :isDesktop="isDesktop"
    />
    <CategorySection />
    <Footer />
    <SocialMediaButtons />
  </main>
</template>
<style scoped>
.home {
  width: 100vw;
  min-height: calc(var(--vh, 1vh) * 100);
  height: 100vh;
}
</style>
