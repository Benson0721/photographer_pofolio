<script setup>
import { useUserStore } from "../../../../stores/userPinia.js";
import { useTopicStore } from "../../../../stores/topicPinia.js";
import { useUploadHandler } from "../../../../utils/useUploadHandler.js";
import { useIsDesktop } from "../../../../utils/useIsDesktop.js";
import { ref, computed, defineProps } from "vue";
import UploadArea from "./UploadArea.vue";

const props = defineProps({
  id: String,
  publicId: String,
  topic: String,
  notes: String,
  category: String,
  imageURL: String,
});

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
  console.log("handleOpen");
};

const handleEdit = async (data) => {
  console.log(data);
  try {
    console.log("upload image");
    const { category, notes, topic } = data;
    console.log(selectedFiles.value);
    console.log(category, notes, topic);
    const newData = {
      image: selectedFiles.value,
      category,
      topic,
      notes,
      publicID: props.publicId,
      id: props.id,
    };
    const res = await topicStore.updateImage(newData);
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
        text="編輯"
        variant="flat"
        :disabled="!userStore.isEditing"
        class="bg-blue-500 absolute z-10 top-1/18 left-5/6 md:top-1/10 md:left-6/8"
        @click="handleOpen"
        :class="!userStore.isEditing ? 'hidden' : 'block'"
      ></v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card title="編輯圖片" class="p-4 z-20">
        <v-card-text class="text-red-500" v-if="errormessage">{{
          errormessage
        }}</v-card-text>
        <v-card-text class="text-green-500" v-if="successmessage">{{
          successmessage
        }}</v-card-text>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleEdit"
          :value="{
            topic: props.topic,
            notes: props.notes,
            category: props.category,
          }"
          outerClass="w-full"
          validation="required"
          :validation-visibility="'submit'"
          incomplete-message="請填入必要資訊以完成編輯"
          messages-class="text-red-500 text-lg absolute sm:top-1/5 md:top-1/4"
        >
          <div class="flex w-full h-full gap-2">
            <div class="flex-1 pl-16 mt-8">
              <UploadArea
                :handleSingleFileChange="handleSingleFileChange"
                :selectedFiles="selectedFiles"
              />
            </div>
            <div class="flex-2">
              <div class="w-full h-full">
                <img
                  v-if="previewUrl"
                  :src="previewUrl"
                  alt="previewImage"
                  class="flex-1 w-full h-full object-contain"
                  draggable="false"
                />
                <img
                  v-else
                  :src="props.imageURL"
                  alt="currentImage"
                  class="flex-1 w-full h-full object-contain"
                  draggable="false"
                />
              </div>
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
