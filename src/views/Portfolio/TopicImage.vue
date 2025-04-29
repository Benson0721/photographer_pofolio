<script setup>
import {
  ref,
  defineProps,
  defineModel,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import EditTopic from "../../components/ImageSystem/PortfolioDialog/TopicSystem/EditTopic/EditTopic.vue";
import DeleteTopic from "../../components/ImageSystem/PortfolioDialog/TopicSystem/DeleteTopic.vue";
import { useTopicStore } from "../../stores/topicPinia.ts";

const topicStore = useTopicStore();

const curTopicID = defineModel("curTopicID", { type: String });
const curTopic = defineModel("curTopic", { type: String });
const curNotes = defineModel("curNotes", { type: String });

const props = defineProps({
  TopicImage: Array,
  mode: String,
});

const mode = defineModel("mode", { type: String });

const handleTopicClick = (item) => {
  curTopicID.value = item._id;
  curTopic.value = item.topic;
  curNotes.value = item.notes;
  mode.value = "display";
};

let observer = null;

const imageStates = ref(new Map());

const setupObserver = async () => {
  let attempts = 0;
  const maxAttempts = 5;
  const expectedImages = topicStore.topicImages.length; // 期望的圖片數量（13）

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
        { threshold: 0.1 }
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
  () => topicStore.topicImages,
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
  if (observer) {
    observer.disconnect();
  }
});
</script>
<template>
  <masonry-wall
    :items="topicStore.topicImages"
    :ssr-columns="2"
    :column-width="500"
    :gap="4"
  >
    <template #default="{ item, index }">
      <div
        class="portfolio__gallery__image"
        :class="imageStates.get(item._id) ? 'fade-controller' : ''"
        :style="{ '--i': index }"
        :key="index"
        :data-id="item._id"
      >
        <EditTopic
          :id="item._id"
          :topic="item.topic"
          :notes="item.notes"
          :category="item.category"
          :imageURL="item.imageURL"
          :publicId="item.public_id"
        />
        <DeleteTopic
          :topic="item.topic"
          :id="item._id"
          :publicId="item.public_id"
        />
        <img
          :src="item.imageURL"
          alt="portfolio"
          class="w-full h-auto object-cover"
          loading="lazy"
        />
        <div
          class="portfolio__gallery__image__info"
          @click="handleTopicClick(item)"
        >
          <p
            class="text-[24px] md:text-[36px] lg:text-[48px] font-playfair text-white text-center"
          >
            {{ item.topic }}
          </p>
          <p
            class="text-[14px] md:text-[18px] lg:text-[20px] font-playfair text-white text-center"
          >
            {{ item.notes }}
          </p>
        </div>
      </div>
    </template>
  </masonry-wall>
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
