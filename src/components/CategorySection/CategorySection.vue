<script setup>
import "./CategorySection.scss";
import architecture from "@/assets/images/category/architecture.jpg";
import landscape from "@/assets/images/category/landscape.jpg";
import portrait from "@/assets/images/category/portrait.jpg";
import street from "@/assets/images/category/street.jpg";
import motorcycle from "@/assets/images/category/motorcycle.jpg";
import others from "@/assets/images/category/others.jpg";
import { ref, defineProps } from "vue";

const props = defineProps({
  isSectionPastScroll: {
    type: Boolean,
    default: false,
  },
});

const images = ref([
  {
    title: "Architecture",
    src: architecture,
  },
  {
    title: "Landscape",
    src: landscape,
  },
  {
    title: "Portrait",
    src: portrait,
  },
  {
    title: "Street",
    src: street,
  },
  {
    title: "Motorcycle",
    src: motorcycle,
  },
  {
    title: "Others",
    src: others,
  },
]);
</script>
<template>
  <div class="category-section__wrapper">
    <section class="category-section">
      <div class="category-section__images">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="category-section__image"
          :class="{ 'fade-controller': isSectionPastScroll }"
          :style="`background-image: url(${image.src})`"
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
