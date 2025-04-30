<script setup lang="ts">
import Navbar from "../../components/Navbar/Navbar.vue";
import Carousel from "../../components/Carousel/Carousel.vue";
import CategorySection from "../../components/CategorySection/CategorySection.vue";
import Footer from "../../components/Footer.vue";
import SocialMediaButtons from "../../components/SocialMediaButtons.vue";
import { useWindowSize } from "../../utils/useWindowSize.js";
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

const { device } = useWindowSize();
const isLoading = ref(true);
const curBgOpacity = ref(0);
const preBgOpacity = ref(1);
const currentImage = ref(0);
const isSectionPastScroll = ref(false);
const previousImage = ref(0); // 用於儲存前一張圖片索引
let observer: IntersectionObserver | null = null;

const currentBackgroundStyle = computed(() => {
  if (
    device.value !== "mobile" &&
    carouselStore.sortedImages[currentImage.value]
  ) {
    return {
      backgroundImage: `url("${
        carouselStore.sortedImages[currentImage.value].imageURL
      }")`,
      opacity: curBgOpacity.value,
      transition: "opacity 1s ease-in-out",
    };
  }
  return {};
});

// 前一張圖片的背景樣式
const previousBackgroundStyle = computed(() => {
  if (
    device.value !== "mobile" &&
    previousImage.value >= 0 &&
    carouselStore.sortedImages[previousImage.value]
  ) {
    return {
      backgroundImage: `url("${
        carouselStore.sortedImages[previousImage.value].imageURL
      }")`,
      opacity: preBgOpacity.value,
      transition: "opacity 1s ease-in-out",
    };
  }
  return {};
});

/*const backgroundStyle = computed(() => {
  if (device.value !== "mobile") {
    return {
      backgroundImage: `url(${
        carouselStore.sortedImages[currentImage.value]?.imageURL || ""
      })`,
      opacity: curBgOpacity.value,
      transition: "opacity 1s ease-in-out",
    };
  }
  return {};
});*/

let intervalId: ReturnType<typeof setInterval> | null = null;
const preloadImage = (src: string) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(true);
  });
};

const changeImage = () => {
  intervalId = setInterval(async () => {
    const nextIndex =
      (currentImage.value + 1) % carouselStore.sortedImages.length;
    const nextImageURL = carouselStore.sortedImages[nextIndex].imageURL;

    await preloadImage(nextImageURL); // 預先載入下一張圖

    previousImage.value = currentImage.value;
    currentImage.value = nextIndex;

    // 重設 opacity 為初始狀態
    curBgOpacity.value = 0;
    preBgOpacity.value = 1;

    setTimeout(() => {
      preBgOpacity.value = 0;
      curBgOpacity.value = 1;
    }, 50); // 延遲一點點，確保樣式已經更新
  }, 5000);
};
const observerFunc = () => {
  const categorySection = document.querySelector(".category-section");
  if (!categorySection) return;

  observer = new IntersectionObserver(
    ([entry]) => {
      isSectionPastScroll.value = entry.isIntersecting;
    },
    {
      threshold: 0.05,
    }
  );

  observer.observe(categorySection);
};

onMounted(async () => {
  await carouselStore.fetchImages();
  await sectionStore.fetchImages();
  isLoading.value = false;
  await nextTick(() => {
    observerFunc();
    changeImage();
  });
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
});

onBeforeUnmount(() => {
  observer.disconnect();
});

watch(currentImage, (newIndex) => {
  //預載
  const img = new Image();
  img.src = carouselStore.sortedImages[newIndex].imageURL;
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
    <p class="mt-2 text-gray-500 text-sm">網站加載中...</p>
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
  transition: opacity 1s ease-in-out;
  pointer-events: none; /* 避免干擾 */
}
</style>
