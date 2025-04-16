<script setup>
import { VueDraggable } from "vue-draggable-plus";
import { useCarouselStore } from "../../../stores/carouselPinia.ts";
const carouselStore = useCarouselStore();

const handleEnd = () => {
  carouselStore.carouselImages = carouselStore.carouselImages.map(
    (image, index) => ({ ...image, order: index + 1 })
  );
};
</script>
<template>
  <VueDraggable
    v-model="carouselStore.carouselImages"
    :animation="250"
    direction="horizontal"
    @end="handleEnd"
    @start="() => console.log('start')"
    class="flex gap-2 flex-wrap"
  >
    <div
      v-for="image in carouselStore.sortedImages"
      :key="image._id"
      class="carousel__image--editing relative"
    >
      <div class="absolute text-white text-2xl">{{ image.order }}</div>
      <img
        :src="image.imageURL"
        alt="carousel__image"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  </VueDraggable>
</template>
