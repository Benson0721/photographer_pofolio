<script setup lang="ts">
import { useUserStore } from "../../../stores/userPinia.ts";
import { useSectionStore } from "../../../stores/sectionPinia.ts";
import { ref, watch, defineProps, computed, withDefaults } from "vue";
import { useIsDesktop } from "../../../utils/useIsDesktop";
import { useDragHandler } from "../../../utils/useDragHandler.ts";
import { useUploadHandler } from "../../../utils/useUploadHandler.ts";
import ButtonArea from "./ButtonArea.vue";
import Loading from "../../Loading.vue";
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
const editMode = ref("");
const isDesktop = useIsDesktop();
const newTitle = ref("");
const uploadMode = ref(true);
const changeTitleMode = ref(true);
const isLoading = ref(false);
const loadingmessage = ref("");

const props = withDefaults(
  defineProps<{
    url: string;
    title: string;
    id: string;
    publicID: string;
    width: number;
    height: number;
    updateSizes: Function;
    curOffsetY: number;
  }>(),
  {
    url: () => "",
    title: () => "",
    id: () => "",
    publicID: () => "",
    width: () => 0,
    height: () => 0,
    updateSizes: () => {},
    curOffsetY: () => 0,
  }
);

const { offsetY, startDrag, onDrag, endDrag, isDragging } = useDragHandler(
  720,
  "section",
  props.id,
  props.curOffsetY
);

const handleOpen = async () => {
  await sectionStore.fetchImages();
  props.updateSizes();
  newTitle.value = props.title;
  editMode.value = "";
};

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) return;
  try {
    console.log("upload image");
    isLoading.value = true;
    loadingmessage.value = "編輯圖片中...";
    const message = await sectionStore.updateImage(
      selectedFiles.value,
      newTitle.value,
      props.id,
      props.publicID
    );
    resetUpload();
    isLoading.value = false;
    successmessage.value = message;
    await sectionStore.fetchImages();
  } catch (error) {
    errormessage.value = error?.response?.data?.message;
    resetUpload();
    isLoading.value = false;
    await sectionStore.fetchImages();
    console.error(error);
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};
const handleTitleUpload = async () => {
  if (newTitle.value === props.title) return;
  try {
    const message = await sectionStore.updateSectionName(
      props.id,
      newTitle.value
    );
    successmessage.value = message;
    isLoading.value = true;
    loadingmessage.value = "編輯圖片中...";
    await sectionStore.fetchImages();
    isLoading.value = false;
  } catch (error) {
    errormessage.value = error?.response?.data?.message;
    await sectionStore.fetchImages();
    isLoading.value = false;
    console.error(error);
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};

const resetMode = async () => {
  console.log("reset mode");
  editMode.value = "";
  errormessage.value = ""; // 切換模式時清空錯誤訊息
  successmessage.value = "";
  resetUpload();
  await sectionStore.fetchImages();
};

const previewImage = computed(() => {
  if (previewUrls.value && previewUrls.value.length > 0) {
    return previewUrls?.value[0]?.src;
  }
  return props.url || "";
});

watch(previewUrls, () => {
  console.log("selectedFile changed!");
});

watch(handleOpen, () => {
  errormessage.value = ""; // 切換模式時清空錯誤訊息
  successmessage.value = "";
});

watch(isDragging, async () => {
  console.log("更新");
  await sectionStore.fetchImages();
});
</script>

<template>
  <v-dialog
    :width="isDesktop ? '60vw' : '100vw'"
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
        <Loading :isLoading="isLoading" :loadingmessage="loadingmessage" />
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
            @mousemove="onDrag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
            @touchstart="startDrag"
            @touchmove="onDrag"
            @touchend="endDrag"
            class="relative overflow-hidden"
            :style="{ width: `${width}px`, height: `${height}px` }"
          >
            <img
              :src="previewImage"
              alt="previewImage"
              class="draggable-image"
              :style="{ top: `${offsetY}px` }"
              @dragstart.prevent
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
          <div class="flex w-3/4 h-[75px] items-center justify-end relative">
            <FormKit
              v-if="editMode === 'changeTitle'"
              v-model="newTitle"
              type="text"
              name="title"
              label="標題"
              placeholder="請輸入標題"
              outerClass="mb-4 mr-16 w-full md:w-full"
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
            <ButtonArea
              v-model:editMode="editMode"
              :changeTitleMode="changeTitleMode"
              :uploadMode="uploadMode"
              :handleFileChange="handleSingleFileChange"
              :handleUpload="handleUpload"
              :handleTitleUpload="handleTitleUpload"
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
<style scoped lang="scss">
.draggable-image {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  user-select: none;
  transition: top 0.1s ease-out;
  cursor: grab;
}
.draggable-image:active {
  cursor: grabbing;
}
</style>
