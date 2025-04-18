import debounce from "lodash.debounce";
import { useAboutStore } from "../stores/aboutPinia";
import { useSectionStore } from "../stores/sectionPinia";

const useOffsetYHandler = debounce(
  (path: string, id: string, newOffset: number) => {
    const aboutStore = useAboutStore();
    const sectionStore = useSectionStore();

    if (path === "about") {
      aboutStore.adjustOffsetY(id, newOffset);
    } else if (path === "section") {
      sectionStore.adjustOffsetY(id, newOffset);
    } else {
      console.warn(`Unknown path: ${path}`);
    }
  },
  1000
);

export { useOffsetYHandler };
