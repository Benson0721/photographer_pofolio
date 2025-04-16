<script setup lang="ts">
import Handing from "../Handing.vue";
import { defineProps, ref, computed } from "vue";
import "./Carousel.scss";
import CarouselDialog from "../ImageSystem/CarouselDialog/CarouselDialog.vue";
import { useCarouselStore } from "../../stores/carouselPinia.ts";

defineProps<{
  currentImage: number;
  isDesktop: boolean;
}>();

const carouselStore = useCarouselStore();
const title = ref("PaiCheng");
const content = ref("Photographer");
const orderMode = ref(true);
const uploadMode = ref(true);
const deleteMode = ref(true);

const HeadingStyle = ref(
  "text-[36px] md:text-[72px] lg:text-[96px] text-white font-bold font-playfair"
);
const ContentStyle = ref(
  "text-[18px] md:text-[24px] lg:text-[36px] font-playfair text-white"
);
</script>

<template>
  <div class="carousel">
    <CarouselDialog
      :orderMode="orderMode"
      :uploadMode="uploadMode"
      :deleteMode="deleteMode"
    />
    <div
      v-if="!isDesktop"
      class="carousel__image"
      v-for="(image, index) in carouselStore.sortedImages"
      :key="image._id"
      :class="currentImage === index ? 'carousel__image--active' : ''"
    >
      <img
        :src="image.imageURL"
        alt="carousel_image"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    <div class="carousel__text">
      <Handing
        v-model:title="title"
        v-model:content="content"
        :HeadingStyle="HeadingStyle"
        :ContentStyle="ContentStyle"
      />
    </div>
  </div>
</template>
