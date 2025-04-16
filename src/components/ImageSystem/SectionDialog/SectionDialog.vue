<script setup>
import { useUserStore } from "../../../stores/userPinia.js";
import { useSectionStore } from "../../../stores/sectionPinia.ts";
import { ref, watch, defineProps } from "vue";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useUploadHandler } from "@/utils/UploadImageHandler";
const {
  selectedFiles,
  previewUrls,
  handleFileChange,
  resetUpload,
  handleDragOver,
  handleDrop,
} = useUploadHandler();
const userStore = useUserStore();
const sectionStore = useSectionStore();
const editMode = ref("");
const errormessage = ref("");
const successmessage = ref("");

const { url, title } = defineProps({
  url: String,
  title: String,
});

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) return;
  try {
    console.log("upload image");
    const res = await sectionStore.updateImage(selectedFiles.value);
    console.log(res);
    resetUpload();
    successmessage.value = res.data.message;
    sectionStore.fetchImages();
  } catch (error) {
    errormessage.value = error?.response?.data?.message;
    resetUpload();
    sectionStore.fetchImages();
    console.error(error);
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};

watch(previewUrls, () => {
  console.log("selectedFile changed!");
});

watch(editMode, () => {
  errormessage.value = ""; // 切換模式時清空錯誤訊息
  successmessage.value = "";
});
</script>

<template>
  <v-dialog max-width="50vw" @dragover="handleDragOver" @drop="handleDrop">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="surface-variant"
        text="編輯"
        variant="flat"
        :disabled="!userStore.isEditing"
        class="absolute z-10 top-1/18 left-5/6"
        @click="sectionStore.fetchImages"
        :class="!userStore.isEditing ? 'hidden' : 'block'"
      ></v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card title="編輯分區圖片" class="p-4">
        <v-card-text class="text-red-500" v-if="errormessage">{{
          errormessage
        }}</v-card-text>
        <v-card-text class="text-green-500" v-if="successmessage">{{
          successmessage
        }}</v-card-text>
        <v-card-text> 以下是現有的分區圖片... </v-card-text>
        <div class="flex gap-2 flex-wrap">
          <div class="relative w-full h-[300px]">
            <div
              class="category-section__image--dialog"
              :style="`background-image: url(${url})`"
            >
              <h2
                class="category-section__title absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-playfair text-[28px] md:text-[40px] lg:text-[72px]"
              >
                {{ title }}
              </h2>
            </div>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div class="flex w-[600px] h-[150px] items-center relative">
            <v-file-input
              class="w-full h-full"
              name="images"
              @change="handleFileChange"
              variant="outlined"
              label="圖片上傳"
              show-size
              clip
            >
            </v-file-input>
            <v-btn text="送出" @click="handleUpload"></v-btn>
            <v-btn text="關閉" @click="isActive.value = false"></v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<style scoped lang="scss"></style>
