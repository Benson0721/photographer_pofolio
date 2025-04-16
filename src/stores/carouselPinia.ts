import { defineStore } from "pinia";
import {
  getCarouselImages,
  addCarouselImage,
  adjustCarouselOrder,
  deleteCarouselImage,
} from "../apis/Carousel_Api";
import { CarouselImage } from "../types/apiType";

export const useCarouselStore = defineStore("carouselStore", {
  state: () => ({
    carouselImages: [] as CarouselImage[],
  }),
  getters: {
    sortedImages: (state) => {
      return [...state.carouselImages].sort((a, b) => a.order - b.order);
    },
  },
  actions: {
    async fetchImages() {
      const carouselPath = "home/carousel";
      this.carouselImages = await getCarouselImages(carouselPath);
    },
    async addImages(files: File[]) {
      const carouselPath = "home/carousel";

      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`images`, file);
      });
      const res = await addCarouselImage(carouselPath, formData);
      return res;
    },
    async adjustOrder(newOrderArray: CarouselImage[]) {
      const carouselPath = "home/carousel";
      this.carouselImages = newOrderArray;
      const res = await adjustCarouselOrder(carouselPath, newOrderArray);
      return res;
    },
    async deleteImage(public_Id: string, id: string) {
      this.carouselImages = this.carouselImages.filter(
        (image) => image.public_id !== public_Id
      );
      const carouselPath = "home/carousel";
      const res = await deleteCarouselImage(carouselPath, public_Id, id);
    },
  },
});
