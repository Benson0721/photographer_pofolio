<script setup lang="ts">
import "./CategorySection.scss";
import { defineProps, watch, ref, onMounted, nextTick } from "vue";
import { useSectionStore } from "../../stores/sectionPinia";
import SectionDialog from "../ImageSystem/SectionDialog/SectionDialog.vue";
import { useImageSizeList } from "../../utils/useImageSizeList";
import { useWindowSize } from "../../utils/useWindowSize";

const { imageRefs, imageSizes, updateSizes } = useImageSizeList();
const sectionStore = useSectionStore();
const { isSectionPastScroll } = defineProps<{
  isSectionPastScroll: boolean;
}>();

const { device } = useWindowSize();
const currentImage = ref(0);
let intervalId: ReturnType<typeof setInterval> | null = null;

const changeImage = () => {
  intervalId = setInterval(() => {
    currentImage.value =
      (currentImage.value + 1) % sectionStore.sectionImages.length;
  }, 5000);
};

onMounted(async () => {
  await nextTick();
  changeImage();
});
</script>
<template>
  <div class="category-section__wrapper">
    <section class="category-section">
      <div class="category-section__images">
        <div
          v-for="(image, index) in sectionStore.sectionImages"
          :key="image._id"
          :class="{
            'fade-controller': isSectionPastScroll,
            '--padding': currentImage === index && device === 'mobile',
          }"
          :style="{ '--i': index }"
          class="category-section__image-wrapper"
          :ref="(el) => (imageRefs[index] = el as HTMLElement)"
          draggable="false"
        >
          <SectionDialog
            :updateSizes="updateSizes"
            :url="image.imageURL"
            :title="image.title"
            :id="image._id"
            :publicID="image.public_id"
            :width="imageSizes[index]?.width"
            :height="imageSizes[index]?.height"
            :curOffsetY="image.offsetY"
          />
          <router-link :to="`/portfolio/${image.type}`">
            <img
              :src="image?.imageURL"
              alt=""
              class="category-section__image"
              :class="{
                '--visible': currentImage === index && device === 'mobile',
              }"
              :style="{
                top: `${image.offsetY[device]}px`,
              }"
              draggable="false"
            />
          </router-link>
          <div class="category-section__content">
            <h2
              class="category-section__title text-white font-playfair text-[28px] md:text-[40px] lg:text-[56px]"
            >
              {{ image.title }}
            </h2>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<style scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.--padding {
  padding: 28.26%;
}

.--visible {
  filter: none;
}

.fade-controller {
  opacity: 0;
  animation: fade-in 1s forwards;
  animation-delay: calc(0.3s + var(--i) * 0.2s);
}
</style>
