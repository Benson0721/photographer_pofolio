<script setup>
import { useUserStore } from "../../../stores/userPinia.js";
import { useSectionStore } from "../../../stores/sectionPinia.ts";
import { ref, watch, defineProps, computed } from "vue";
import { useIsDesktop } from "../../../utils/useIsDesktop";
import { useDragHandler } from "../../../utils/useDragHandler.ts";
import { useUploadHandler } from "@/utils/UploadImageHandler";
import { useOffsetYHandler } from "@/utils/useOffsetYHandler";
const {
  selectedFiles,
  previewUrls,
  resetUpload,
  handleDragOver,
  handleDrop,
  handleSingleFileChange,
} = useUploadHandler();
const userStore = useUserStore();
const sectionStore = useSectionStore();
const errormessage = ref("");
const successmessage = ref("");
const isDesktop = useIsDesktop();

const newTitle = ref("");

const { url, title, id, publicID, width, height, updateSizes, curOffsetY } =
  defineProps({
    url: String,
    title: String,
    id: String,
    publicID: String,
    width: Number,
    height: Number,
    updateSizes: Function,
    curOffsetY: Number,
  });

const { offsetY, startDrag, onDrag, endDrag } = useDragHandler(
  400,
  "section",
  id,
  curOffsetY
);

const handleOpen = async () => {
  await sectionStore.fetchImages();
  updateSizes();
  newTitle.value = title;
};

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) return;
  try {
    console.log("upload image");
    console.log(selectedFiles.value, newTitle.value, id, publicID);
    const res = await sectionStore.updateImage(
      selectedFiles.value,
      newTitle.value,
      id,
      publicID
    );
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

watch(endDrag, async () => {
  await sectionStore.fetchImages();
});
</script>

<template>
  <v-dialog
    :max-width="isDesktop ? '60vw' : '100vw'"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="surface-variant"
        text="編輯"
        variant="flat"
        :disabled="!userStore.isEditing"
        class="absolute z-10 top-1/18 left-5/6"
        @click="handleOpen"
        :class="!userStore.isEditing ? 'hidden' : 'block'"
      ></v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card title="編輯分區圖片" class="p-4 z-20">
        <v-card-text class="text-red-500" v-if="errormessage">{{
          errormessage
        }}</v-card-text>
        <v-card-text class="text-green-500" v-if="successmessage">{{
          successmessage
        }}</v-card-text>
        <v-card-text> 以下是現有的分區圖片... </v-card-text>
        <div class="flex justify-center gap-2 flex-wrap">
          <div
            @mousedown="startDrag"
            @touchstart="startDrag"
            @mousemove="onDrag"
            @touchmove="onDrag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
            @touchend="endDrag"
            class="relative overflow-hidden"
            :style="{ width: `${width}px`, height: `${height}px` }"
          >
            <img
              :src="previewImage"
              alt="previewImage"
              class="draggable-image"
              :style="{ top: `${offsetY}px` }"
              draggable="false"
              pre
            />
            <h2
              class="category-section__title absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-playfair text-[28px] md:text-[40px] lg:text-[72px]"
            >
              {{ newTitle }}
            </h2>
          </div>
        </div>
        <v-card-actions>
          <div class="flex w-full h-[75px] items-center relative">
            <FormKit
              v-model="newTitle"
              type="text"
              name="title"
              label="標題"
              placeholder="請輸入標題"
              outerClass="mb-4 w-full md:w-full"
              innerClass="mt-4 border-b-2 border-black"
              labelClass="text-black font-noto "
              validation="required"
              messages-class="text-red-500 text-sm"
              :validation-messages="{
                required: '請輸入標題',
              }"
              :classes="{
                outer: '',
                inner: 'mt-4 border-b-2',
                input: 'w-full border-none bg-transparent focus:outline-none',
                inputInvalid: 'border-red-500', // 加紅線
              }"
            />
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
<style scoped lang="scss">
.draggable-image {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  user-select: none;
  transition: top 0.1s ease-out;
}
</style>
