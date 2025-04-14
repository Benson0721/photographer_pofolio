<script setup lang="ts">
import Handing from "../Handing.vue";
import { defineProps, ref } from "vue";
import "./Carousel.scss";
import { Image } from "../../types/api";
import EditDialog from "./EditDialog.vue";

defineProps<{
  carouselImages: Array<Image>;
  currentImage: number;
  isDesktop: boolean;
}>();

const title = ref("PaiCheng");
const content = ref("Photographer");

const HeadingStyle = ref(
  "text-[36px] md:text-[72px] lg:text-[96px] text-white font-bold font-playfair"
);
const ContentStyle = ref(
  "text-[18px] md:text-[24px] lg:text-[36px] font-playfair text-white"
);
</script>

<template>
  <div class="carousel">
    <EditDialog />
    <div
      v-if="!isDesktop"
      class="carousel__image"
      v-for="(image, index) in carouselImages"
      :key="index"
      :class="currentImage === index ? 'carousel__image--active' : ''"
    >
      <img
        :src="image.url"
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
