import { defineStore } from "pinia";
import { getImages } from "../apis/image-api.js";

export const useCarouselStore = defineStore("carouselStore", {
  state: () => ({
    carouselImagesTmp: [],
  }),
  actions: {
    async fetchImages() {
      const carouselPath = "home/carousel";
      this.carouselImagesTmp = await getImages(carouselPath);
    },
  },
});
