<script setup lang="ts">
import "./CategorySection.scss";
import { defineProps } from "vue";
import { Image } from "../../types/api";

defineProps<{
  sectionsImages: Array<Image>;
  isSectionPastScroll: boolean;
}>();
</script>
<template>
  <div class="category-section__wrapper">
    <section class="category-section">
      <div class="category-section__images">
        <div
          v-for="(image, index) in sectionsImages"
          :key="index"
          class="category-section__image"
          :class="{ 'fade-controller': isSectionPastScroll }"
          :style="`background-image: url(${image?.url})`"
        >
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
