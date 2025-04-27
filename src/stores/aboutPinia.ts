import { defineStore } from "pinia";
import {
  getAboutImages,
  updateAboutImage,
  adjustOffsetY,
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
      console.log(images);
      this.aboutImages = images;
    },
    async updateImage(files: File[], publicID: string, id: string) {
      const aboutPath = "about";
      console.log(files, publicID);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`image`, file);
      });
      console.log(formData);
      console.log("前端");
      const message = await updateAboutImage(aboutPath, formData, publicID, id);

      return message;
    },
    async adjustOffsetY(id: string, offsetY: number) {
      const aboutPath = "about";
      const response = await adjustOffsetY(aboutPath, id, offsetY);
      console.log(response);
      return response;
    },
  },
});
