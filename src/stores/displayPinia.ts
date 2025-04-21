import { defineStore } from "pinia";
import {
  getDisplayImages,
  addDisplayImage,
  deleteDisplayImage,
} from "../apis/Display_api";
import { DisplayImage } from "../types/apiType";

export const useDisplayStore = defineStore("displayStore", {
  state: () => ({
    displayImages: [] as DisplayImage[],
  }),

  actions: {
    async fetchImages() {
      const carouselPath = "home/carousel";
      this.displayImages = await getDisplayImages(carouselPath);
    },
    async addImages(files: File[]) {
      const carouselPath = "home/carousel";

      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`images`, file);
      });
      const res = await addDisplayImage(carouselPath, formData);
      return res;
    },
  
    async deleteImage(public_Id: string, id: string) {
      this.displayImages = this.displayImages.filter(
        (image) => image.public_id !== public_Id
      );
      const carouselPath = "home/carousel";
      const res = await deleteDisplayImage(carouselPath, public_Id, id);
    },
  },
});
