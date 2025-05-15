<script setup>
import { useUserStore } from "../../../stores/userPinia.ts";
import { ref, watch, defineProps, computed } from "vue";
import { useUploadHandler } from "../../../utils/useUploadHandler.ts";
import { useAboutStore } from "../../../stores/aboutPinia.ts";
import { useWindowSize } from "../../../utils/useWindowSize.js";
import Loading from "../../Loading.vue";

const { device } = useWindowSize();
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

const isLoading = ref(false);
const loadingmessage = ref("");
const errormessage = ref("");
const successmessage = ref("");

const props = defineProps({
  url: String,
  publicID: String,
  id: String,
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
    console.log(selectedFiles.value, props.publicID, props.id);
    isLoading.value = true;
    loadingmessage.value = "更新圖片中...";
    const message = await aboutStore.updateImage(
      selectedFiles.value,
      props.publicID,
      props.id
    );
    resetUpload();
    isLoading.value = false;
    successmessage.value = message;
    await aboutStore.fetchImages();
  } catch (error) {
    errormessage.value = error?.response?.data?.message;
    resetUpload();
    isLoading.value = false;
    await aboutStore.fetchImages();
    console.error(error);
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};

const previewImage = computed(() => {
  if (previewUrls?.value.length > 0) {
    return previewUrls.value[0].src;
  }
  return props.url;
});

watch(previewUrls, () => {
  console.log("selectedFile changed!");
});

watch(handleOpen, () => {
  errormessage.value = ""; // 切換模式時清空錯誤訊息
  successmessage.value = "";
});
watch(props, () => {
  console.log(props);
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
        class="absolute z-10 top-1/18 left-1/12"
        @click="handleOpen"
        :class="userStore.showEdit() ? 'block' : 'hidden'"
      ></v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card title="編輯圖片" class="p-4">
        <Loading :isLoading="isLoading" :loadingmessage="loadingmessage" />
        <v-card-text class="text-red-500" v-if="errormessage">{{
          errormessage
        }}</v-card-text>
        <v-card-text class="text-green-500" v-if="successmessage">{{
          successmessage
        }}</v-card-text>
        <v-card-text> 以下是現有的圖片... </v-card-text>
        <div
          class="flex gap-2 flex-wrap my-2"
          :style="{
            width: `${props.width}px`,
            height: `${props.height}px`,
          }"
        >
          <img :src="previewImage" alt="previewImage" draggable="false" />
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
