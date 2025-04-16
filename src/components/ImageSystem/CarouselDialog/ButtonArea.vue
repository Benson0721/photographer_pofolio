<script setup>
import { defineModel, defineProps } from "vue";
const editMode = defineModel("editMode", { type: String });
const {
  orderMode,
  uploadMode,
  deleteMode,
  handleFileChange,
  handleUpload,
  handleOrder,
  selectedFiles,
  resetMode,
} = defineProps({
  orderMode: Boolean,
  uploadMode: Boolean,
  deleteMode: Boolean,
  handleFileChange: Function,
  handleUpload: Function,
  handleOrder: Function,
  selectedFiles: Array,
  resetMode: Function,
});
</script>
<template>
  <div class="flex" v-if="editMode === ''">
    <v-btn v-if="orderMode" text="調整順序" @click="editMode = 'order'"></v-btn>
    <v-btn v-if="uploadMode" text="上傳" @click="editMode = 'upload'"></v-btn>
    <v-btn v-if="deleteMode" text="刪除" @click="editMode = 'delete'"></v-btn>
  </div>
  <div class="" v-if="editMode === 'order'">
    <v-btn text="儲存" @click="handleOrder"></v-btn>
    <v-btn text="重置模式" @click="resetMode"></v-btn>
  </div>
  <div
    class="flex w-[600px] h-[150px] items-center relative"
    v-if="editMode === 'upload'"
  >
    <div class="flex gap-2 flex-wrap w-[400px] absolute top-1/12 left-1/12">
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
      class="w-full h-full"
      name="images"
      @change="handleFileChange"
      variant="outlined"
      label="圖片上傳"
      multiple
      show-size
      clip
    >
    </v-file-input>
    <v-btn text="送出" @click="handleUpload"></v-btn>
    <v-btn text="重置模式" @click="resetMode"></v-btn>
  </div>
  <div class="" v-if="editMode === 'delete'">
    <v-btn text="重置模式" @click="resetMode"></v-btn>
  </div>
</template>
