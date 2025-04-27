<script setup>
import { useUserStore } from "../../../../../stores/userPinia.js";
import { useTopicStore } from "../../../../../stores/topicPinia.js";
import { useUploadHandler } from "../../../../../utils/useUploadHandler.ts";
import { useIsDesktop } from "../../../../../utils/useIsDesktop.js";
import { ref, computed } from "vue";
import UploadArea from "./UploadArea.vue";
import Loading from "../../../../../components/Loading.vue";

const userStore = useUserStore();
const topicStore = useTopicStore();
const errormessage = ref("");
const successmessage = ref("");
const loadingmessage = ref("");
const isLoading = ref(false);

const { isDesktop } = useIsDesktop();
const { selectedFiles, handleSingleFileChange, resetUpload, previewUrls } =
  useUploadHandler();

const handleOpen = async () => {
  errormessage.value = "";
  successmessage.value = "";
  await topicStore.fetchImages();
};

const handleAddImage = async (data) => {
  if (selectedFiles.value.length === 0) return;
  console.log(data);
  try {
    console.log("upload image");
    const { category, notes, topic } = data;
    isLoading.value = true;
    loadingmessage.value = "新增主題中...";
    const message = await topicStore.addImage(
      selectedFiles.value,
      category,
      topic,
      notes
    );
    resetUpload();
    successmessage.value = message;
    isLoading.value = false;
    await topicStore.fetchImages();
  } catch (error) {
    errormessage.value = error?.response?.data?.message;
    resetUpload();
    await topicStore.fetchImages();
    isLoading.value = false;
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};

const previewUrl = computed(() => {
  return previewUrls.value[0]?.src;
});
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
        class="bg-green-500 absolute z-10 top-1/18 left-5/6 md:top-1/10 md:left-7/8"
        @click="handleOpen"
        :class="!userStore.isEditing ? 'hidden' : 'block'"
      ></v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card title="新增圖片" class="p-4 z-20">
        <Loading :isLoading="isLoading" :loadingmessage="loadingmessage" />
        <v-card-text
          class="absolute top-1/12 right-1/10 text-red-500"
          v-if="errormessage"
          >{{ errormessage }}</v-card-text
        >
        <v-card-text
          class="absolute top-1/12 right-1/10 text-green-500"
          v-if="successmessage"
          >{{ successmessage }}</v-card-text
        >
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
          <div class="flex w-full h-full gap-2">
            <div class="flex-1 pl-16 mt-8">
              <UploadArea
                :handleSingleFileChange="handleSingleFileChange"
                :handleAddImage="handleAddImage"
                :selectedFiles="selectedFiles"
                :previewUrl="previewUrl"
              />
            </div>
            <div v-if="previewUrl" class="flex-2">
              <img
                :src="previewUrl"
                alt="previewImage"
                class="flex-1 w-full h-full object-contain"
                draggable="false"
              />
            </div>
          </div>
          <v-card-actions>
            <div class="flex gap-2 absolute left-5/6">
              <FormKit
                type="submit"
                label="送出"
                :classes="{
                  outer: 'mt-2 text-center  transform',
                  input: 'text-black rounded bg-white transition duration-300',
                }"
              />
              <v-btn text="關閉" @click="isActive.value = false"></v-btn>
            </div>
          </v-card-actions>
        </FormKit>
      </v-card>
    </template>
  </v-dialog>
</template>
<style scoped lang="scss"></style>
