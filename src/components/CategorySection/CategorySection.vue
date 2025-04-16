<script setup lang="ts">
import "./CategorySection.scss";
import { defineProps } from "vue";
import { useSectionStore } from "../../stores/sectionPinia";
import SectionDialog from "../ImageSystem/SectionDialog/SectionDialog.vue";
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
          class="category-section__image"
          :class="{ 'fade-controller': isSectionPastScroll }"
          :style="`background-image: url(${image?.imageURL})`"
        >
          <SectionDialog :url="image.imageURL" :title="image.title" />
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
