<script setup>
import { ref } from "vue";

const offsetY = ref(0);
let startY = 0;
let dragging = false;

function startDrag(event) {
  dragging = true;
  startY = event.touches ? event.touches[0].clientY : event.clientY;
}

function onDrag(event, maxScrollY) {
  if (!dragging) return;
  const y = event.touches ? event.touches[0].clientY : event.clientY;
  const deltaY = y - startY;
  startY = y;

  // 限制拖拉範圍：根據圖片高度與容器高度計算
  offsetY.value = Math.max(Math.min(offsetY.value + deltaY, 0), -maxScrollY);
}

function endDrag() {
  dragging = false;
}

// maxScrollY 是圖片超出的高度
const maxScrollY = 400; // 你需要根據實際圖片和容器大小來算
</script>

<template>
  <div
    class="image-frame"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @mousemove="onDrag"
    @touchmove="onDrag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
    @touchend="endDrag"
  >
    <img
      src="https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/architecture_rlmvem"
      class="draggable-image"
      :style="{ top: offsetY + 'px' }"
      draggable="false"
    />
  </div>
</template>
<style scoped>
.image-frame {
  width: 600px;
  height: 500px; /* 或任何手機上的固定高度 */
  overflow: hidden;
  position: relative;
  touch-action: none; /* 防止手機滾動干擾拖曳 */
}

.draggable-image {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  user-select: none;
  transition: top 0.1s ease-out;
}
</style>
