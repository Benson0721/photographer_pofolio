<script setup lang="ts">
import "./CategorySection.scss";
import { defineProps, watch } from "vue";
import { useSectionStore } from "../../stores/sectionPinia";
import SectionDialog from "../ImageSystem/SectionDialog/SectionDialog.vue";
import { useImageSizeList } from "../../utils/useImageSizeList";

const { imageRefs, imageSizes, updateSizes } = useImageSizeList();
const sectionStore = useSectionStore();
const { isSectionPastScroll } = defineProps<{
  isSectionPastScroll: boolean;
}>();
</script>
<template>
  <div class="category-section__wrapper">
    <section class="category-section">
      <div class="category-section__images">
        <div
          v-for="(image, index) in sectionStore.sectionImages"
          :key="image._id"
          :class="{ 'fade-controller': isSectionPastScroll }"
          :style="{ '--i': index }"
          class="category-section__image-wrapper"
          :ref="(el) => (imageRefs[index] = el)"
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
              :style="{
                top: `${image.offsetY}px`,
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
.fade-controller {
  opacity: 0;
  animation: fade-in 1s forwards;
  animation-delay: calc(0.3s + var(--i) * 0.2s);
}
</style>
