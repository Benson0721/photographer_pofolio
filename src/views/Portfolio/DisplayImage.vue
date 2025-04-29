<script setup>
import {
  defineProps,
  defineModel,
  onMounted,
  ref,
  watch,
  nextTick,
  onBeforeUnmount,
} from "vue";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDisplayStore } from "../../stores/displayPinia.ts";

const displayStore = useDisplayStore();
const curTopicID = defineModel("curTopicID", { type: String });
import VueEasyLightbox from "vue-easy-lightbox";
const props = defineProps({
  mode: String,
  deleteMode: Boolean,
  displayImages: Array,
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

watch(deleteMessage, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      deleteMessage.value = "";
    }, 3000);
  }
});
let observer = null;

const imageStates = ref(new Map());

const setupObserver = async () => {
  let attempts = 0;
  const maxAttempts = 5;
  const expectedImages = displayStore.displayImages.length; // 期望的圖片數量（13）

  while (attempts < maxAttempts) {
    await nextTick(); // 等待 DOM 更新
    const imageElements = document.querySelectorAll(
      ".portfolio__gallery__image"
    );

    if (imageElements.length >= expectedImages) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              imageStates.value.set(entry.target.dataset.id, true);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.01 }
      );
      imageElements.forEach((el) => observer.observe(el));
      return;
    }

    attempts++;
    await new Promise((resolve) => setTimeout(resolve, 100)); // 等待 100ms
  }
};

// 監控 TopicImage 變化
watch(
  () => displayStore.displayImages,
  async () => {
    if (observer) {
      observer.disconnect();
    }
    imageStates.value.clear();
    await setupObserver();
  },
  { deep: true, immediate: true } // 立即執行以初始化
);
onBeforeUnmount(() => {
  observer.disconnect();
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
      <div
        class="portfolio__gallery__image"
        :class="imageStates.get(item._id) ? 'fade-controller' : ''"
        :style="{ '--i': index }"
        :data-id="item._id"
      >
        <FontAwesomeIcon
          v-if="deleteMode"
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
<style scoped>
.fade-controller {
  opacity: 0;
  animation: fade-in 1s forwards;
  animation-delay: calc(0.3s + var(--i) * 0.2s);
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
