<script setup lang="ts">
import { ref, onMounted } from "vue";

// 假設你有一組圖片 URL
const images = [
  "https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/v1745937642/Pai/views/home/carousel/hc7igvpffddl1oaau9u6.jpg",
  "https://res.cloudinary.com/dk1yh5mdu/image/upload/v1744783387/Pai/views/home/carousel/dt7t71xizcc9drgo8dra.jpg",
  "https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/v1745156421/Pai/views/home/carousel/bnlwfrs7g4vcg38vitd7.jpg",
];

const currentLayer = ref(0); // 0 or 1，控制哪一層在上面
const layerImages = ref([
  { imageURL: images[0], opacity: 1 },
  { imageURL: images[1], opacity: 0 },
]);

let index = 0;

const switchImage = async () => {
  const nextIndex = (index + 1) % images.length;
  const backLayer = 1 - currentLayer.value;

  // 設定下一張圖到備用層，並顯示它（被上一層蓋住）
  layerImages.value[backLayer].imageURL = images[nextIndex];
  layerImages.value[backLayer].opacity = 1;

  // 淡出當前層
  layerImages.value[currentLayer.value].opacity = 0;

  // 等待淡出動畫完成後，切換層
  setTimeout(() => {
    currentLayer.value = backLayer;
    index = nextIndex;
  }, 1000);
};

onMounted(() => {
  setInterval(switchImage, 5000); // 每 5 秒切換
});
</script>

<template>
  <div class="background-container">
    <div
      v-for="(layer, i) in layerImages"
      :key="i"
      class="bg-layer"
      :style="{
        backgroundImage: `url(${layer.imageURL})`,
        opacity: layer.opacity,
        zIndex: i,
      }"
    ></div>
  </div>
</template>

<style scoped>
.background-container {
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: -1;
}

.bg-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 1s ease-in-out;
}
</style>
