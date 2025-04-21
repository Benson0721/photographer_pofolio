<script setup>
import { useUserStore } from "../../../stores/userPinia.js";
import { useTopicStore } from "../../../stores/topicPinia";
import { useUploadHandler } from "../../../utils/useUploadHandler.js";
import { useIsDesktop } from "../../../utils/useIsDesktop";
import { reactive, ref, computed } from "vue";

const formData = reactive({
  category: "",
  topic: "",
  notes: "",
});

const userStore = useUserStore();
const topicStore = useTopicStore();
const errormessage = ref("");
const successmessage = ref("");
const { isDesktop } = useIsDesktop();
const { selectedFiles, handleSingleFileChange, resetUpload, previewUrls } =
  useUploadHandler();

const handleOpen = async () => {
  await topicStore.fetchImages();
};

const handleAddImage = async (data) => {
  console.log(data);
  try {
    console.log("upload image");
    const { category, notes, topic } = data;
    console.log(data);
    console.log(selectedFiles.value);
    console.log(category, notes, topic);
    const res = await topicStore.addImage(
      selectedFiles.value,
      category,
      topic,
      notes
    );
    resetUpload();
    successmessage.value = res.data.message;
    await topicStore.fetchImages();
  } catch (error) {
    errormessage.value = error?.response?.data?.message;
    resetUpload();
    await topicStore.fetchImages();
    console.error(error);
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};
const previewImage = computed(() => {
  if (previewUrls?.value.length > 0) {
    return previewUrls.value[0].src;
  }
  return null;
});

const handleTitleUpload = async () => {
  if (newTitle.value === title) return;
  try {
    const res = await sectionStore.updateSectionName(id, newTitle.value);
    successmessage.value = res.data.message;
    await sectionStore.fetchImages();
  } catch (error) {
    errormessage.value = error?.response?.data?.message;
    await sectionStore.fetchImages();
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
</script>

<template>
  <v-dialog :max-width="isDesktop ? '60vw' : '100vw'">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="surface-variant"
        text="新增"
        variant="flat"
        :disabled="!userStore.isEditing"
        class="absolute z-10 top-1/18 left-5/6"
        @click="handleOpen"
        :class="!userStore.isEditing ? 'hidden' : 'block'"
      ></v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card title="新增圖片" class="p-4 z-20">
        <v-card-text class="text-red-500" v-if="errormessage">{{
          errormessage
        }}</v-card-text>
        <v-card-text class="text-green-500" v-if="successmessage">{{
          successmessage
        }}</v-card-text>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleAddImage"
          outerClass="w-full"
          validation="required"
          :validation-visibility="'submit'"
          incomplete-message="請填入必要資訊以完成新增"
          messages-class="text-red-500 text-lg absolute sm:top-1/5 md:top-1/4"
        >
          <div class="flex flex-col">
            <FormKit
              v-model="formData.category"
              type="select"
              name="category"
              label="分類"
              :options="[
                'Architecture',
                'Motorcycle',
                'Portrait',
                'Landscape',
                'Street',
                'Others',
              ]"
              outerClass="mb-4 md:mr-8 w-full md:w-1/2"
              innerClass="mt-4 border-b-2 border-black"
              labelClass=" font-noto "
              messages-class="text-red-500 text-sm"
              :classes="{
                outer: '',
                inner: 'mt-4 border-b-2',
                input: 'w-full border-none bg-transparent focus:outline-none',
                inputInvalid: 'border-red-500', // 加紅線
              }"
            />
            <FormKit
              v-model="formData.topic"
              type="text"
              name="topic"
              label="主題"
              outerClass="mb-4 w-full md:w-1/2"
              innerClass="mt-4 border-b-2 border-black"
              labelClass="text-black font-noto "
              validation="required"
              messages-class="text-red-500 text-sm"
              :validation-messages="{
                required: '請輸入主題',
              }"
              :classes="{
                outer: '',
                inner: 'mt-4 border-b-2',
                input: 'w-full border-none bg-transparent focus:outline-none',
                inputInvalid: 'border-red-500', // 加紅線
              }"
            />
            <FormKit
              v-model="formData.notes"
              type="text"
              name="notes"
              label="敘述"
              outerClass="mb-4 w-full md:w-full"
              innerClass="mt-4 border-b-2 border-black"
              labelClass="text-black font-noto "
              validation="required"
              messages-class="text-red-500 text-sm"
              :validation-messages="{
                required: '請輸入敘述',
              }"
              :classes="{
                outer: '',
                inner: 'mt-4 border-b-2',
                input: 'w-full border-none bg-transparent focus:outline-none',
                inputInvalid: 'border-red-500', // 加紅線
              }"
            />
            <div
              class="flex gap-2 flex-wrap w-[400px] absolute top-1/12 left-1/12"
            >
              <img
                v-if="selectedFiles"
                :src="previewImage"
                alt="previewImage"
                class="draggable-image"
                draggable="true"
                pre
              />
              <v-chip
                v-for="(file, index) in selectedFiles"
                :key="index"
                class="me-2"
                color="primary"
                size="small"
                label
              >
                {{ file.name }}
              </v-chip>
            </div>
            <v-file-input
              class="w-full h-[50px]"
              name="images"
              @change="handleSingleFileChange"
              variant="outlined"
              label="圖片上傳"
              multiple
              show-size
              clip
            >
            </v-file-input>
          </div>
          <FormKit
            type="submit"
            label="送出"
            :classes="{
              outer: 'my-8 text-center',
              input:
                'bg-gray-300 text-black font-semibold py-2 px-16 rounded hover:bg-gray-400 transition duration-300',
            }"
          />
        </FormKit>
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
}
</style>
