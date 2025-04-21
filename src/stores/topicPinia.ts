import { defineStore } from "pinia";
import {
  getTopicImages,
  updateTopicImage,
  updateTopicInfo,
  deleteTopicImage,
  addTopicImage,
} from "../apis/Topic_api";
import { TopicImage } from "../types/apiType";
export const useTopicStore = defineStore("topicStore", {
  state: () => ({
    topicImages: [] as TopicImage[],
  }),

  actions: {
    async fetchAllImages() {
      this.topicImages = await getTopicImages();
    },
    async fetchImages(category: string) {
      const Path = `portfolio/${category}`;

      this.topicImages = await getTopicImages(Path);
    },
    async addImage(
      files: File[],
      category: string,
      topic: string,
      notes: string
    ) {
      const path = "portfolio";
      const formData = new FormData();
      files.forEach((file) => formData.append("image", file));
      const res = await addTopicImage(path, formData, {
        category,
        topic,
        notes,
      });
      console.log(res);
      return res;
    },
    async updateImage(
      files: File[],
      topic: string,
      notes: string,
      id: string,
      publicID: string
    ) {
      const sectionPath = `portfolio/${r}`;

      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`image`, file);
      });
      console.log(formData);
      console.log("前端");
      const res = await updateTopicImage(
        sectionPath,
        formData,
        topic,
        notes,
        id,
        publicID
      );
      console.log(res);
      return res;
    },

    async updateTopicInfo(id: string, title: string) {
      const response = await updateTopicInfo(id, title);
      console.log(response);
      return response;
    },
    async deleteImage(public_Id: string, id: string) {
      this.topicImages = this.topicImages.filter(
        (image) => image.public_id !== public_Id
      );
      const sectionPath = "home/sections";
      const res = await deleteTopicImage(sectionPath, public_Id, id);
      return res;
    },
  },
});
