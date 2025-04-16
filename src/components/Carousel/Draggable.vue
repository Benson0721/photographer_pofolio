<script setup>
import { onMounted, ref } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import { useCarouselStore } from "../../stores/carouselPinia.ts";
const carouselStore = useCarouselStore();

onMounted(() => {
  carouselStore.fetchImages();
});

const selectedFiles = ref([]);
const previewUrls = ref([]);

const handleFileChange = (e) => {
  console.log("file change!");
  const files = e.target.files;
  selectedFiles.value.push(...files); // 儲存原始檔案
  previewUrls.value = selectedFiles.value.map((file) => ({
    file,
    src: URL.createObjectURL(file),
  }));
  console.log("選擇的檔案：", selectedFiles.value);
  /*if (e.target.files.length === 1) {
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
    }*/
};

const handleDragOver = (event) => {
  event.preventDefault();
  event.stopPropagation();
};
const handleDrop = (event) => {
  event.preventDefault();
  event.stopPropagation();
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    // 模擬 change 事件，將拖放的檔案傳遞給 handleFileChange
    const fakeEvent = { target: { files } };
    handleFileChange(fakeEvent);
  }
};

const handleEnd = () => {
  carouselStore.carouselImages = carouselStore.carouselImages.map(
    (image, index) => ({ ...image, order: index + 1 })
  );
  console.log(carouselStore.carouselImages);
};
/*
<template>
  <div style="display: flex; justify-content: center">
    <VueDraggable
      v-model="carouselStore.carouselImages"
      :animation="250"
      direction="horizontal"
      @end="handleEnd"
      @start="() => console.log('start')"
      class="flex"
    >
      <div
        v-for="(image, index) in carouselStore.carouselImages"
        :key="index"
        class="carousel__image--editing relative"
      >
        <div class="absolute text-white">{{ image.order }}</div>
        <img
          :src="image.imageURL"
          alt="carousel__image"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </VueDraggable>
  </div>
</template>*/
</script>

<template>
  <div
    class="flex gap-2 flex-wrap my-2 relative"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <v-file-input
      name="images"
      @change="handleFileChange"
      variant="outlined"
      multiple
      chips
      show-size
      class="w-[600px] h-[300px]"
    >
      <template #selection="{ selectedFiles }">
        <template>
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
        </template>
      </template>
    </v-file-input>

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
  
  <template>
      <v-file-input
        v-model="files"
        label="File input"
        placeholder="Upload your documents"
        prepend-icon="mdi-paperclip"
        multiple
      >
        <template v-slot:selection="{ fileNames }">
          <template v-for="fileName in fileNames" :key="fileName">
            <v-chip class="me-2" color="primary" size="small" label>
              {{ fileName }}
            </v-chip>
          </template>
        </template>
      </v-file-input>
    </template>
</template>
