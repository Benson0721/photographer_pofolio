import { defineStore } from "pinia";
import { getImages, updateImage } from "../apis/Section_Api";
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
      console.log("前端");
      const res = await updateImage(sectionPath, formData, title, id, publicID);
      console.log(res);
      return res;
    },
  },
});
