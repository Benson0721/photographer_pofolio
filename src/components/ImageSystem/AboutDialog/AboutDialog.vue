<script setup>
import { useUserStore } from "../../../stores/userPinia.js";
import { ref, watch, defineProps, computed } from "vue";
import { useUploadHandler } from "@/utils/UploadImageHandler";
import { useAboutStore } from "../../../stores/aboutPinia";
const aboutStore = useAboutStore();
const {
  selectedFiles,
  previewUrls,
  resetUpload,
  handleDragOver,
  handleDrop,
  handleSingleFileChange,
} = useUploadHandler();
const userStore = useUserStore();

const errormessage = ref("");
const successmessage = ref("");

const { url, publicID, width, height } = defineProps({
  url: String,
  publicID: String,
  width: Number,
  height: Number,
});

const handleOpen = async () => {
  await aboutStore.fetchImages();
};

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) return;
  try {
    console.log("upload image");
    console.log(selectedFiles.value, publicID);
    const res = await aboutStore.updateImage(selectedFiles.value, publicID);
    resetUpload();
    successmessage.value = res.data.message;
    await aboutStore.fetchImages();
  } catch (error) {
    errormessage.value = error?.response?.data?.message;
    resetUpload();
    await aboutStore.fetchImages();
    console.error(error);
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};

const previewImage = computed(() => {
  if (previewUrls?.value.length > 0) {
    return previewUrls.value[0].src;
  }
  return url;
});

watch(previewUrls, () => {
  console.log("selectedFile changed!");
});

watch(handleOpen, () => {
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
        class="absolute z-10 top-1/18 left-1/12"
        @click="handleOpen"
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
        <v-card-text> 以下是現有的圖片... </v-card-text>
        <div class="flex gap-2 flex-wrap">
          <div
            class="relative object-contain"
            :style="{ width: `${width}px`, height: `${height}px` }"
          >
            <div
              class="category-section__image--dialog"
              :style="`background-image: url(${previewImage})`"
            ></div>
          </div>
        </div>
        <v-card-actions>
          <div class="flex w-full h-[75px] items-center relative">
            <v-file-input
              class="w-full h-full mt-4 mr-6"
              name="images"
              @change="handleSingleFileChange"
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
