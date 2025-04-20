<script setup lang="ts">
import Navbar from "../../components/Navbar/Navbar.vue";
import Carousel from "../../components/Carousel/Carousel.vue";
import CategorySection from "../../components/CategorySection/CategorySection.vue";
import Footer from "../../components/Footer.vue";
import SocialMediaButtons from "../../components/SocialMediaButtons.vue";
import { useIsDesktop } from "../../utils/useIsDesktop";
import {
  ref,
  onMounted,
  onUnmounted,
  computed,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";

import "./Home.scss";

import { useCarouselStore } from "../../stores/carouselPinia.ts";
import { useSectionStore } from "../../stores/sectionPinia.ts";

const carouselStore = useCarouselStore();
const sectionStore = useSectionStore();

const isDesktop = useIsDesktop();
const isLoading = ref(true);
const isEditing = ref(false);

const currentImage = ref(0);
const isSectionPastScroll = ref(false);
const previousImage = ref(-1); // 用於儲存前一張圖片索引

const currentBackgroundStyle = computed(() => {
  if (isDesktop.value && carouselStore.sortedImages[currentImage.value]) {
    return {
      backgroundImage: `url("${
        carouselStore.sortedImages[currentImage.value].imageURL
      }")`,
      opacity: 1,
      transition: "opacity 1s ease-in-out",
    };
  }
  return { opacity: 0 };
});

// 前一張圖片的背景樣式
const previousBackgroundStyle = computed(() => {
  if (
    isDesktop.value &&
    previousImage.value >= 0 &&
    carouselStore.sortedImages[previousImage.value]
  ) {
    return {
      backgroundImage: `url("${
        carouselStore.sortedImages[previousImage.value].imageURL
      }")`,
      opacity: 0,
      transition: "opacity 1s ease-in-out",
    };
  }
  return { opacity: 0 };
});

const backgroundStyle = computed(() => {
  if (isDesktop.value) {
    return {
      backgroundImage: `url(${
        carouselStore.sortedImages[currentImage.value]?.imageURL || ""
      })`,
      opacity: bgOpacity.value,
      transition: "opacity 1s ease-in-out",
    };
  }
  return {};
});

let intervalId: ReturnType<typeof setInterval> | null = null;
const bgOpacity = ref(0);
const changeImage = () => {
  intervalId = setInterval(() => {
    previousImage.value = currentImage.value; // 儲存當前圖片作為前一張
    currentImage.value =
      (currentImage.value + 1) % carouselStore.sortedImages.length;
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
  await carouselStore.fetchImages();
  await sectionStore.fetchImages();
  isLoading.value = false;
  await nextTick(() => {
    observerFunc();
  });
});

const handleDrag = (event) => {
  event.preventDefault();
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
  <main v-else :class="`home transition`">
    <!-- 前一張圖片的背景層 -->
    <div class="background-layer" :style="previousBackgroundStyle"></div>
    <!-- 當前圖片的背景層 -->
    <div class="background-layer" :style="currentBackgroundStyle"></div>
    <Navbar />
    <Carousel :currentImage="currentImage" />
    <CategorySection :isSectionPastScroll="isSectionPastScroll" />
    <Footer />
    <SocialMediaButtons />
  </main>
</template>
<style scoped>
.home {
  width: 100vw;
  min-height: calc(var(--vh, 1vh) * 100);
  position: relative;
  overflow: hidden;
}
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: -1;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
}
</style>
