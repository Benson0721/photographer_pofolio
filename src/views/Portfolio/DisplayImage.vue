<script setup>
import { defineProps, defineModel, onMounted, ref, watch } from "vue";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDisplayStore } from "../../stores/displayPinia";
import { useUserStore } from "../../stores/userPinia";

const userStore = useUserStore();
const displayStore = useDisplayStore();
const curTopicID = defineModel("curTopicID", { type: String });
import VueEasyLightbox from "vue-easy-lightbox";
defineProps({
  mode: String,
  deleteMode: Boolean,
});

const deleteMessage = ref("");

const visible = ref(false);
const index = ref(0);

// 當點擊小圖時
const showLightbox = (idx) => {
  index.value = idx;
  visible.value = true;
};

const hideLightbox = () => {
  visible.value = false;
};

const handleDelete = async (public_id, _id) => {
  const message = await displayStore.deleteImage(public_id, _id);
  deleteMessage.value = message;
  await displayStore.fetchImages(curTopicID.value);
};

watch(userStore.isEditing, () => {
  deleteMessage.value = "";
});

onMounted(async () => {
  await displayStore.fetchImages(curTopicID.value);
});
</script>
<template>
  <p v-if="deleteMessage" class="text-red-500">{{ deleteMessage }}</p>
  <masonry-wall
    :items="displayStore.displayImages || []"
    :ssr-columns="2"
    :column-width="500"
    :gap="4"
  >
    <template #default="{ item, index }">
      <div class="portfolio__gallery__image">
        <FontAwesomeIcon
          v-if="userStore.isEditing"
          @click="handleDelete(item?.public_id, item?._id)"
          :icon="faXmark"
          class="absolute right-3 top-1 text-black md:text-3xl cursor-pointer"
        />
        <img
          :src="item?.imageURL"
          :key="index"
          alt="portfolio"
          class="w-full h-auto object-cover cursor-pointer rounded shadow"
          loading="lazy"
          @click="showLightbox(index)"
        />
      </div>
    </template>
  </masonry-wall>
  <VueEasyLightbox
    v-if="displayStore.displayImages.length > 0"
    :visible="visible"
    :imgs="displayStore.displayImages.map((item) => item.imageURL)"
    :index="index"
    @hide="hideLightbox"
  />
</template>
