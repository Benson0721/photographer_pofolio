import { defineStore } from "pinia";
import { getImages, updateImage, adjustOffsetY } from "../apis/Section_Api";
import { SectionImage } from "../types/apiType";
export const useSectionStore = defineStore("sectionStore", {
  state: () => ({
    sectionImages: [] as SectionImage[],
  }),

  actions: {
    async fetchImages() {
      const sectionPath = "home/sections";

      this.sectionImages = await getImages(sectionPath);
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
      const res = await updateImage(sectionPath, formData, title, id, publicID);
      console.log(res);
      return res;
    },
    async adjustOffsetY(id: string, offsetY: number) {
      const sectionPath = "home/sections";
      const response = await adjustOffsetY(sectionPath, id, offsetY);
      console.log(response);
      return response;
    },
  },
});
