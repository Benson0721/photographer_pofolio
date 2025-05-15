<script setup>
import { useUserStore } from "../../../stores/userPinia.ts";
import { useCarouselStore } from "../../../stores/carouselPinia.ts";
import { ref, watch, defineProps } from "vue";
import ButtonArea from "./ButtonArea.vue";
import OrderMode from "./OrderMode.vue";
import UploadMode from "./UploadMode.vue";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useUploadHandler } from "../../../utils/useUploadHandler.ts";
import { useWindowSize } from "../../../utils/useWindowSize.js";
import Loading from "../../Loading.vue";
const {
  selectedFiles,
  previewUrls,
  handleFileChange,
  resetUpload,
  handleDragOver,
  handleDrop,
} = useUploadHandler();
const userStore = useUserStore();
const carouselStore = useCarouselStore();
const { device } = useWindowSize();
const editMode = ref("");
const errormessage = ref("");
const successmessage = ref("");
const loadingmessage = ref("");
const isLoading = ref(false);

const { orderMode, uploadMode, deleteMode } = defineProps({
  orderMode: Boolean,
  uploadMode: Boolean,
  deleteMode: Boolean,
});

const resetMode = () => {
  editMode.value = "";
  previewUrls.value = [];
  selectedFiles.value = [];
  carouselStore.fetchImages();
  errormessage.value = "";
  successmessage.value = "";
  loadingmessage.value = "";
  isLoading.value = false;
};

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) return;
  try {
    console.log("upload image");
    loadingmessage.value = "上傳圖片中...";
    isLoading.value = true;
    const res = await carouselStore.addImages(selectedFiles.value);
    resetUpload();
    successmessage.value = res.data.message;
    carouselStore.fetchImages();
    isLoading.value = false;
  } catch (error) {
    errormessage.value = error.response.data.message;
    resetUpload();
    carouselStore.fetchImages();
    console.error("上傳失敗：", error.response.data.message);
  }
};

const handleOrder = async () => {
  const newOrderArray = carouselStore.sortedImages.map((image, index) => ({
    ...image,
    order: index + 1,
  }));
  try {
    loadingmessage.value = "調整順序中...";
    isLoading.value = true;
    const res = await carouselStore.adjustOrder(newOrderArray);
    successmessage.value = res.data.message;
    carouselStore.fetchImages();
    isLoading.value = false;
  } catch (error) {
    errormessage.value = error.response.data.message;
    carouselStore.fetchImages();
    console.error("調整順序失敗：", error.response.data.message);
  }
};
const handleDelete = async (public_Id, id) => {
  try {
    loadingmessage.value = "刪除圖片中...";
    isLoading.value = true;
    const res = await carouselStore.deleteImage(public_Id, id);
    successmessage.value = res?.data?.message;
    carouselStore.fetchImages();
    isLoading.value = false;
  } catch (error) {
    errormessage.value = error.response.data.message;
    carouselStore.fetchImages();
    console.error("刪除失敗：", error.response.data.message);
  }
};

watch(editMode, () => {
  errormessage.value = ""; // 切換模式時清空錯誤訊息
  successmessage.value = "";
  loadingmessage.value = "";
  isLoading.value = false;
});
</script>

<template>
  <v-dialog
    :max-width="device !== 'mobile' ? '60vw' : '100vw'"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="surface-variant"
        text="編輯"
        variant="flat"
        :disabled="!userStore.showEdit()"
        class="absolute z-10 top-0 left-5/6 md:left-11/12"
        @click="carouselStore.fetchImages"
        :class="userStore.showEdit() ? 'block' : 'hidden'"
      ></v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card title="編輯輪播圖片" class="p-4 relative">
        <Loading :isLoading="isLoading" :loadingmessage="loadingmessage" />
        <v-card-text
          class="text-red-500 absolute top-1/10 right-1/8"
          v-if="errormessage"
          >{{ errormessage }}</v-card-text
        >
        <v-card-text
          class="text-green-500 absolute top-1/10 right-1/8"
          v-if="successmessage"
          >{{ successmessage }}</v-card-text
        >
        <v-card-text> 以下是現有的輪播圖片... </v-card-text>
        <div v-if="editMode !== 'order'" class="flex gap-2 flex-wrap">
          <div
            v-for="(image, index) in carouselStore.sortedImages"
            :key="index"
            class="carousel__image--editing relative"
          >
            <FontAwesomeIcon
              v-if="editMode === 'delete'"
              @click="handleDelete(image?.public_id, image._id)"
              :icon="faXmark"
              class="absolute left-1 text-white"
            />
            <img
              :src="image.imageURL"
              alt="carousel__image"
              class="w-full h-full object-cover"
              loading="lazy"
              :class="{ 'cursor-move': editMode === 'order' }"
            />
          </div>
        </div>
        <OrderMode v-if="editMode === 'order'" />
        <UploadMode
          v-if="editMode === 'upload'"
          :previewUrls="previewUrls"
          :selectedFiles="selectedFiles"
        />
        <v-card-actions>
          <v-spacer></v-spacer>
          <div class="flex items-center">
            <ButtonArea
              v-model:editMode="editMode"
              :orderMode="orderMode"
              :uploadMode="uploadMode"
              :deleteMode="deleteMode"
              :handleFileChange="handleFileChange"
              :handleUpload="handleUpload"
              :handleOrder="handleOrder"
              :selectedFiles="selectedFiles"
              :resetMode="resetMode"
            />

            <v-btn text="關閉" @click="isActive.value = false"></v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
