import { defineStore } from "pinia";
import {
  getAboutImages,
  updateAboutImage,
} from "../apis/About_api";
import { AboutImage } from "../types/apiType";
export const useAboutStore = defineStore("aboutStore", {
  state: () => ({
    aboutImages: [] as AboutImage[],
  }),

  actions: {
    async fetchImages() {
      const aboutPath = "about";
      const images = await getAboutImages(aboutPath);
      this.aboutImages = images;
    },
    async updateImage(files: File[], publicID: string, id: string) {
      const aboutPath = "about";
      console.log(files, publicID);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`image`, file);
      });
      console.log("前端");
      const message = await updateAboutImage(aboutPath, formData, publicID, id);

      return message;
    },
  },
});
