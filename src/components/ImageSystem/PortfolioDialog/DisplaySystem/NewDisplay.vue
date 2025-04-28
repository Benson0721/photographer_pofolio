<script setup>
import { useUserStore } from "../../../../stores/userPinia.ts";
import { useUploadHandler } from "../../../../utils/useUploadHandler.ts";
import { useDisplayStore } from "../../../../stores/displayPinia.ts";
import { defineProps, ref } from "vue";
import Loading from "../../../../components/Loading.vue";
const userStore = useUserStore();
const displayStore = useDisplayStore();
const {
  selectedFiles,
  previewUrls,
  handleFileChange,
  resetUpload,
  handleDragOver,
  handleDrop,
} = useUploadHandler();
const props = defineProps({
  curTopicID: String,
});
const successmessage = ref("");
const errormessage = ref("");
const isLoading = ref(false);
const loadingmessage = ref("");
const handleOpen = () => {
  userStore.isEditing = true;
  resetUpload();
};
const handleUpload = async () => {
  if (selectedFiles.value.length === 0) return;
  try {
    console.log(selectedFiles.value, props.curTopicID);
    console.log("upload image");
    loadingmessage.value = "上傳圖片中...";
    isLoading.value = true;
    const message = await displayStore.addImages(
      selectedFiles.value,
      props.curTopicID
    );
    console.log(message);
    resetUpload();
    successmessage.value = message;
    displayStore.fetchImages(props.curTopicID);
    isLoading.value = false;
  } catch (error) {
    console.error(error);
    isLoading.value = false;
    errormessage.value = error?.response?.data?.message;
    resetUpload();
    displayStore.fetchImages(props.curTopicID);
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};
</script>
<template>
  <v-dialog max-width="500" @dragover="handleDragOver" @drop="handleDrop">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="surface-variant"
        text="新增展示"
        variant="flat"
        :disabled="!userStore.isEditing"
        class="bg-green-500"
        @click="handleOpen"
        :class="!userStore.isEditing ? 'hidden' : 'block'"
      ></v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card title="新增展示圖片" class="p-1 md:p-4 relative">
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
        <v-card-text v-if="selectedFiles.length > 0">
          以下是你即將新增的圖片(單張圖片大小請勿超過10MB)
        </v-card-text>
        <v-card-text v-else> 請點擊新增按鈕來新增圖片 </v-card-text>
        <div class="flex gap-1 md:gap-2 flex-wrap my-2">
          <div
            class="carousel__image--editing"
            v-for="(image, index) in previewUrls"
            :key="index"
            v-if="selectedFiles"
          >
            <img
              :src="image.src"
              alt="carousel__image__tmp"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>

          <div
            class="flex h-auto flex-col md:flex-row items-center relative"
            :class="selectedFiles.length > 0 ? 'w-auto' : 'w-[300px]'"
          >
            <v-file-input
              class="w-full h-auto"
              name="images"
              @change="handleFileChange"
              variant="outlined"
              label="圖片上傳"
              multiple
              show-size
              clip
              prepend-icon=""
            >
            </v-file-input>
            <div class="flex gap-2">
              <v-btn text="送出" @click="handleUpload"></v-btn>
              <v-btn text="關閉" @click="isActive.value = false"></v-btn>
            </div>
          </div>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
