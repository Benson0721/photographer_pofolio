<script setup>
import { useUserStore } from "../../stores/userPinia";
import { useCarouselStore } from "../../stores/carouselPinia";
import { ref, watch } from "vue";
const userStore = useUserStore();
const carouselStore = useCarouselStore();

const selectedFile = ref(null);
const previewUrl = ref([]);

const handleFileChange = (e) => {
  console.log("file change!");
  if (e.target.files.length === 1) {
    const file = e.target.files[0];
    if (!file) return;
    selectedFile.value = file;
    previewUrl.value.push({ src: URL.createObjectURL(file) }); // 預覽圖片
  } else if (e.target.files.length > 1) {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;
      selectedFile.value = file;
      previewUrl.value.push({ src: URL.createObjectURL(file) });
    }
  }
};
const handleSave = () => {
  console.log(previewUrl.value);
  selectedFile.value = null;
  previewUrl.value = [];
};

watch(previewUrl, () => {
  console.log("selectedFile changed!");
});
</script>

<template>
  <v-dialog max-width="50vw">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="surface-variant"
        text="編輯"
        variant="flat"
        :disabled="!userStore.isEditing"
        class="absolute z-10 top-0 right-0"
        @click="carouselStore.fetchImages"
        :class="!userStore.isEditing ? 'hidden' : 'block'"
      ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="編輯輪播圖片" class="p-4">
        <v-card-text> 以下是現有的輪播圖片... </v-card-text>
        <div class="flex gap-2 flex-wrap">
          <div
            v-for="(image, index) in carouselStore.carouselImagesTmp"
            :key="index"
            class="carousel__image--editing"
          >
            <img
              :src="image.url"
              alt="carousel__image"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div
            class="carousel__image--editing"
            v-for="(image, index) in previewUrl"
            :key="index"
            v-if="selectedFile"
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
          <v-file-input
            label="上傳圖片"
            @change="handleFileChange"
            multiple
          ></v-file-input>
          <v-btn text="儲存" @click="handleSave"></v-btn>
          <v-btn text="關閉" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
