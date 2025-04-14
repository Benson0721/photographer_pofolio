<script setup lang="ts">
import Navbar from "../../components/Navbar/Navbar.vue";
import Carousel from "../../components/Carousel/Carousel.vue";
import CategorySection from "../../components/CategorySection/CategorySection.vue";
import Footer from "../../components/Footer.vue";
import SocialMediaButtons from "../../components/SocialMediaButtons.vue";
import { getImages } from "../../apis/image-api.js";
import {
  ref,
  onMounted,
  onUnmounted,
  computed,
  defineProps,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";

import "./Home.scss";
import { Image } from "../../types/api";

const carouselImages = ref<Image[]>([]);
const sectionsImages = ref<Image[]>([]);
const isLoading = ref(true);
const isEditing = ref(false);
const props = defineProps<{
  isDesktop: boolean;
}>();

const currentImage = ref(0);
const isSectionPastScroll = ref(false);

const backgroundStyle = computed(() => {
  if (props.isDesktop) {
    return {
      backgroundImage: `url(${carouselImages.value[currentImage.value]?.url})`,
    };
  }
  return {};
});

let intervalId: ReturnType<typeof setInterval> | null = null;

const changeImage = () => {
  intervalId = setInterval(() => {
    currentImage.value = (currentImage.value + 1) % carouselImages.value.length;
  }, 10000);
};
const observerFunc = () => {
  const categorySection = document.querySelector(".category-section");
  console.log(categorySection);
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
};

onMounted(async () => {
  const carouselPath = "home/carousel";
  const sectionPath = "home/sections";
  carouselImages.value = await getImages(carouselPath);
  sectionsImages.value = await getImages(sectionPath);
  isLoading.value = false;
  await nextTick(() => {
    observerFunc();
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

watch(isEditing, (newVal, oldVal) => {
  console.log(`isEditing changed from ${oldVal} to ${newVal}`);
});
</script>
<template>
  <div
    v-if="isLoading"
    class="absolute inset-0 flex flex-col justify-center items-center bg-white z-10"
  >
    <div
      class="spinner border-4 border-gray-200 border-t-blue-500 rounded-full w-12 h-12 animate-spin"
    ></div>
    <p class="mt-2 text-gray-500 text-sm">Loading...</p>
  </div>
  <main v-else :class="`home transition`" :style="backgroundStyle">
    <Navbar />
    <Carousel
      :carouselImages="carouselImages"
      :currentImage="currentImage"
      :isDesktop="isDesktop"
    />
    <CategorySection
      :isSectionPastScroll="isSectionPastScroll"
      :sectionsImages="sectionsImages"
    />
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
