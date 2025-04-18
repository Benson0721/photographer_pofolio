import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";

export function useImageSizeList() {
  const imageRefs = ref<HTMLElement[]>([]);
  const imageSizes = ref<{ width: number; height: number }[]>([]);

  const updateSizes = async () => {
    await nextTick(); // 確保 DOM 更新完畢
    imageSizes.value = imageRefs.value.map((el) => {
      const rect = el?.getBoundingClientRect?.();
      console.log(rect.width);
      console.log(rect.height);
      return {
        width: rect?.width || 0,
        height: rect?.height || 0,
      };
    });
  };

  const handleResize = () => {
    updateSizes();
  };

  onMounted(() => {
    window.addEventListener("resize", handleResize);
    updateSizes(); // 初始化一次
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize);
  });

  return {
    imageRefs,
    imageSizes,
    updateSizes,
  };
}
