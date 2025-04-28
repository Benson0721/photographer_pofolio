import { ref, onMounted, onUnmounted } from "vue";
export function useIsDesktop() {
  const isDesktop = ref(false);
  const check = () => {
    isDesktop.value = window.innerWidth >= 768;
  };

  onMounted(() => {
    check();
    window.addEventListener("resize", check);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", check);
  });

  return isDesktop;
}
