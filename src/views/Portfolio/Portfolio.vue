<script setup>
import { onMounted, computed, ref, watch } from "vue";
import Navbar from "../../components/Navbar/Navbar.vue";
import Footer from "../../components/Footer.vue";
import NewTopic from "../../components/ImageSystem/PortfolioDialog/TopicSystem/NewTopic/NewTopic.vue";
import NewDisplay from "../../components/ImageSystem/PortfolioDialog/DisplaySystem/NewDisplay.vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../../stores/userPinia";
import { useTopicStore } from "../../stores/topicPinia";
import { useIsDesktop } from "../../utils/useIsDesktop";
import Handing from "../../components/Handing.vue";
import TopicImage from "./TopicImage.vue";
import DisplayImage from "./DisplayImage.vue";
import "./Portfolio.scss";

const isDesktop = useIsDesktop();
const topicStore = useTopicStore();
const userStore = useUserStore();
const route = useRoute();
const curCategory = ref("");
const curTopic = ref("");
const curNotes = ref("");
const mode = ref("Topic");
const curTopicID = ref("");
const deleteMode = ref(false);
const HeadingStyle = ref(
  "mt-4 text-[48px] md:text-[60px] lg:text-[72px] font-playfair text-white text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
);
const ContentStyle = ref(
  "text-[18px] md:text-[36px] lg:text-[48px] font-playfair text-white absolute top-3/5 left-1/2 -translate-x-1/2 "
);

const categorys = ref([
  "All",
  "Architecture",
  "Landscape",
  "Portrait",
  "Street",
  "Motorcycle",
  "Others",
]);
const loadImage = async () => {
  const category = route.params.category;
  curCategory.value = category;

  if (category && category !== "All") {
    await topicStore.fetchImages(category);
  } else {
    await topicStore.fetchImages();
  }
};

const backgroundStyle = computed(() => {
  if (isDesktop) {
    if (curTopicID.value) {
      const image = topicStore.topicImages.find(
        (image) => image._id === curTopicID.value
      );
      return {
        backgroundImage: `url(${image?.imageURL})`,
      };
    } else {
      return {
        backgroundImage: `url(${topicStore.topicImages[0]?.imageURL})`,
      };
    }
  }
  return {};
});

const handleDelete = () => {
  deleteMode.value = true;
};

watch(curTopicID, () => {
  console.log(curTopic.value);
  console.log(curNotes.value);
});
watch(mode, () => {
  console.log(mode.value);
});

onMounted(() => {
  loadImage();
});
</script>
<template>
  <main class="portfolio__bg transition" :style="backgroundStyle">
    <Navbar />
    <div class="portfolio__banner relative md:static">
      <img
        v-if="!isDesktop"
        :src="topicStore.topicImages[0]?.imageURL"
        alt="portfolio"
        class="w-full h-auto object-cover md:hidden"
      />
      <Handing
        v-if="mode === 'Topic'"
        v-model:category="curCategory"
        :HeadingStyle="HeadingStyle"
      />
      <Handing
        v-else
        v-model:topic="curTopic"
        v-model:notes="curNotes"
        :HeadingStyle="HeadingStyle"
        :ContentStyle="ContentStyle"
      />

      <NewTopic v-if="mode === 'Topic'" />
      <div v-else class="flex justify-end gap-2 pr-8">
        <NewDisplay :curTopicID="curTopicID" />
        <v-btn
          color="surface-variant"
          text="刪除"
          variant="flat"
          :disabled="!userStore.isEditing"
          class="bg-red-500"
          @click="deleteMode = true"
          :class="userStore.isEditing ? 'block' : 'hidden'"
        ></v-btn>
        <v-btn
          color="surface-variant"
          text="取消刪除模式"
          variant="flat"
          :disabled="!userStore.isEditing"
          class="bg-blue-500"
          @click="deleteMode = false"
          :class="deleteMode ? 'block' : 'hidden'"
        ></v-btn>
      </div>
    </div>
    <div class="portfolio__category">
      <div class="portfolio__category__list">
        <button
          v-for="(category, index) in categorys"
          :key="index"
          class="portfolio__category__list__item font-noto textShadow"
          :class="
            route.params.category === category
              ? 'portfolio__category__list__item--active'
              : ''
          "
          @click="
            () => {
              route.params.category = category;
              title = category;
              mode = 'Topic';
              curTopicID = '';
              loadImage();
            }
          "
        >
          {{ category }}
        </button>
      </div>
    </div>
    <div class="portfolio__gallery">
      <TopicImage
        v-if="mode === 'Topic'"
        :TopicImage="topicStore.topicImages"
        v-model:mode="mode"
        v-model:curTopicID="curTopicID"
        v-model:curTopic="curTopic"
        v-model:curNotes="curNotes"
      />
      <DisplayImage
        v-else
        :deleteMode="deleteMode"
        v-model:mode="mode"
        v-model:curTopicID="curTopicID"
      />
    </div>
    <Footer />
  </main>
</template>
<style scoped></style>
