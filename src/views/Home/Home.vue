<script setup lang="ts">
import Navbar from "../../components/Navbar/Navbar.vue";
import Carousel from "../../components/Carousel/Carousel.vue";
import CategorySection from "../../components/CategorySection/CategorySection.vue";
import Footer from "../../components/Footer.vue";
import SocialMediaButtons from "../../components/SocialMediaButtons.vue";
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";

import "./Home.scss";

import { useCarouselStore } from "../../stores/carouselPinia.ts";
import { useSectionStore } from "../../stores/sectionPinia.ts";

const carouselStore = useCarouselStore();
const sectionStore = useSectionStore();

const isLoading = ref(true);
const currentImage = ref(0);
const isSectionPastScroll = ref(false);
let observer: IntersectionObserver | null = null;
let intervalId1: ReturnType<typeof setInterval> | null = null;
let intervalId2: ReturnType<typeof setInterval> | null = null;

/*const currentBackgroundStyle = computed(() => {
  if (
    device.value !== "mobile" &&
    carouselStore.sortedImages[currentImage.value]
  ) {
    return {
      backgroundImage: `url("${
        carouselStore.sortedImages[currentImage.value].imageURL
      }")`,
      opacity: curBgOpacity.value,
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

/*let intervalId: ReturnType<typeof setInterval> | null = null;
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

    setTimeout(() => {
      preBgOpacity.value = 0;
      curBgOpacity.value = 1;
    }, 50); // 延遲一點點，確保樣式已經更新
  }, 5000);
};*/

const currentLayer = ref(0); // 0 or 1，控制哪一層在上面
const layerImages = ref([]);

let index = 0;

const switchBgImage = async () => {
  const nextIndex = (index + 1) % carouselStore.sortedImages.length;
  const backLayer = 1 - currentLayer.value;

  // 設定下一張圖到備用層，並顯示它（被上一層蓋住）
  layerImages.value[backLayer].imageURL =
    carouselStore.sortedImages[nextIndex].imageURL;
  layerImages.value[backLayer].opacity = 1;

  // 淡出當前層
  layerImages.value[currentLayer.value].opacity = 0;

  // 等待淡出動畫完成後，切換層
  setTimeout(() => {
    currentLayer.value = backLayer;
    index = nextIndex;
  }, 1000);
};
const switchMbImage = () => {
  currentImage.value =
    (currentImage.value + 1) % carouselStore.sortedImages.length;
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
  layerImages.value = [
    { imageURL: carouselStore.sortedImages[0].imageURL, opacity: 1 },
    { imageURL: carouselStore.sortedImages[1].imageURL, opacity: 0 },
  ];
  await sectionStore.fetchImages();
  isLoading.value = false;
  await nextTick(() => {
    observerFunc();
    intervalId1 = setInterval(switchBgImage, 8000);
    intervalId2 = setInterval(switchMbImage, 8000);
  });
});

onBeforeUnmount(() => {
  observer.disconnect();
  clearInterval(intervalId1);
  clearInterval(intervalId2);
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
    <div class="background-container">
      <div
        v-for="(layer, i) in layerImages"
        :key="i"
        class="bg-layer"
        :style="{
          backgroundImage: `url(${layer.imageURL})`,
          opacity: layer.opacity,
          zIndex: i,
        }"
      ></div>
    </div>
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

.background-container {
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: -1;
}

.bg-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 1s ease-in-out;
  pointer-events: none;
}
</style>
