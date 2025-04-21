import { useAboutStore } from "../stores/aboutPinia";
import { useSectionStore } from "../stores/sectionPinia";

const useOffsetYHandler = async (
  path: string,
  id: string,
  newOffset: number
) => {
  const aboutStore = useAboutStore();
  const sectionStore = useSectionStore();

  if (path === "about") {
    await aboutStore.adjustOffsetY(id, newOffset);
  } else if (path === "section") {
    await sectionStore.adjustOffsetY(id, newOffset);
  } else {
    console.warn(`Unknown path: ${path}`);
  }
  await sectionStore.fetchImages();
};

export { useOffsetYHandler };
