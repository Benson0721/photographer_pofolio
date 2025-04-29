import { defineStore } from "pinia";
import {
  getSectionImages,
  updateSectionImage,
  adjustOffsetY,
  updateSectionName,
} from "../apis/Section_Api";
import { SectionImage } from "../types/apiType";
export const useSectionStore = defineStore("sectionStore", {
  state: () => ({
    sectionImages: [] as SectionImage[],
  }),

  actions: {
    async fetchImages() {
      const sectionPath = "home/sections";

      this.sectionImages = await getSectionImages(sectionPath);
    },
    async updateImage(
      files: File[],
      title: string,
      id: string,
      publicID: string
    ) {
      const sectionPath = "home/sections";

      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`image`, file);
      });
      console.log(formData);
      console.log("前端");
      const message = await updateSectionImage(
        sectionPath,
        formData,
        title,
        id,
        publicID
      );
      return message;
    },
    async adjustOffsetY(id: string, offsetY: object) {
      const sectionPath = "home/sections";
      console.log(offsetY);
      const message = await adjustOffsetY(sectionPath, id, offsetY);
      return message;
    },
    async updateSectionName(id: string, title: string) {
      const message = await updateSectionName(id, title);
      return message;
    },
  },
});
