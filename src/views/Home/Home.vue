<script setup lang="ts">
import Navbar from "../../components/Navbar/Navbar.vue";
import Carousel from "../../components/Carousel/Carousel.vue";
import CategorySection from "../../components/CategorySection/CategorySection.vue";
import Footer from "../../components/Footer.vue";
import SocialMediaButtons from "../../components/SocialMediaButtons.vue";
import {
  ref,
  onMounted,
  onUnmounted,
  computed,
  defineProps,
  onBeforeUnmount,
} from "vue";
import carouselImage1 from "@/assets/images/carousel/carousel1.jpg";
import carouselImage2 from "@/assets/images/carousel/carousel2.jpg";
import carouselImage3 from "@/assets/images/carousel/carousel3.jpg";
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
const isSectionPastScroll = ref(false);

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
  const categorySection = document.querySelector(".category-section");

  if (!categorySection) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      isSectionPastScroll.value = entry.isIntersecting;
    },
    {
      threshold: 0.05,
    }
  );

  observer.observe(categorySection);

  onBeforeUnmount(() => {
    observer.disconnect();
  });
});

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
  <main :class="`home transition`" :style="backgroundStyle">
    <Navbar />
    <Carousel
      :images="images"
      :currentImage="currentImage"
      :isDesktop="isDesktop"
    />
    <CategorySection :isSectionPastScroll="isSectionPastScroll" />
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
