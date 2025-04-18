import { ref } from "vue";
import { useOffsetYHandler } from "./useOffsetYHandler";
export function useDragHandler(
  maxScrollY: number,
  path: string,
  id: string,
  initialOffsetY: number
) {
  const offsetY = ref(initialOffsetY);
  let startY = 0;
  let dragging = false;

  function startDrag(event) {
    dragging = true;
    startY = event.touches ? event.touches[0].clientY : event.clientY;
  }

  function onDrag(event) {
    if (!dragging) return;
    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const deltaY = y - startY;
    startY = y;

    // 限制拖拉範圍：根據圖片高度與容器高度計算
    offsetY.value = Math.max(Math.min(offsetY.value + deltaY, 0), -maxScrollY);
  }

  function endDrag() {
    dragging = false;
    useOffsetYHandler(path, id, offsetY.value);
  }
  return {
    offsetY,
    startDrag,
    onDrag,
    endDrag,
  };
}
