<script setup lang="ts">
import "./CategorySection.scss";
import { defineProps } from "vue";
import { useSectionStore } from "../../stores/sectionPinia";
import SectionDialog from "../ImageSystem/SectionDialog/SectionDialog.vue";
import { useImageSizeList } from "../../utils/useImageSizeList";

const { imageRefs, imageSizes, updateSizes } = useImageSizeList();

const sectionStore = useSectionStore();
defineProps<{
  isSectionPastScroll: boolean;
}>();


</script>
<template>
  <div class="category-section__wrapper">
    <section class="category-section">
      <div class="category-section__images">
        <div
          v-for="(image, index) in sectionStore.sectionImages"
          :key="index"
          :class="{ 'fade-controller': isSectionPastScroll }"
          class="category-section__image-wrapper"
          :ref="(el) => (imageRefs[index] = el)"
        >
          <SectionDialog
            :updateSizes="updateSizes"
            :url="image.imageURL"
            :title="image.displayName"
            :id="image._id"
            :publicID="image.public_id"
            :width="imageSizes[index]?.width"
            :height="imageSizes[index]?.height"
            :curOffsetY="image.offsetY"
          />
          <img
            :src="image?.imageURL"
            alt=""
            class="category-section__image"
            :style="{
              top: `${image.offsetY}px`,
            }"
          />
          <div class="category-section__content">
            <h2
              class="category-section__title text-white font-playfair text-[28px] md:text-[40px] lg:text-[72px]"
            >
              {{ image.title }}
            </h2>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<style scoped></style>
