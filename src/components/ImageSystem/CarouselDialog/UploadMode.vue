<script setup>
import { defineProps } from "vue";

const props = defineProps({
  previewUrls: Array,
  selectedFiles: File | null,
});
</script>
<template >

  <v-card-text v-if="selectedFiles.length > 0">
    以下是你即將新增的圖片(單張圖片大小請勿超過10MB)
  </v-card-text>
  <div  class="flex gap-2 flex-wrap my-2">
    <div
      class="carousel__image--editing"
      v-for="(image, index) in props.previewUrls"
      :key="index"
      v-if="props.selectedFiles"
    >
      <img
        :src="image.src"
        alt="carousel__image__tmp"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  </div>
</template>
