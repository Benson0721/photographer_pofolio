import { useSectionStore } from "../stores/sectionPinia";

const useOffsetYHandler = async (
  path: string,
  id: string,
  newOffset: object
) => {
  const sectionStore = useSectionStore();
  if (path === "section") {
    await sectionStore.adjustOffsetY(id, newOffset);
  } else {
    console.warn(`Unknown path: ${path}`);
  }
  await sectionStore.fetchImages();
};

export { useOffsetYHandler };
