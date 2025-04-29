import { ref, onMounted, onUnmounted } from "vue";
export function useWindowSize() {
  const device = ref("");
  const check = () => {
    if (window.innerWidth >= 1440) {
      device.value = "desktop";
    } else if (window.innerWidth >= 768) {
      device.value = "tablet";
    } else {
      device.value = "mobile";
    }
  };

  onMounted(() => {
    check();
    window.addEventListener("resize", check);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", check);
  });

  return { device };
}
