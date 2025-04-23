<script setup>
import { onMounted, computed, ref, watch } from "vue";
import Navbar from "../../components/Navbar/Navbar.vue";
import Footer from "../../components/Footer.vue";
import NewTopic from "../../components/ImageSystem/PortfolioDialog/NewTopic/NewTopic.vue";
import { useRoute } from "vue-router";
import { useTopicStore } from "../../stores/topicPinia";
import { useIsDesktop } from "../../utils/useIsDesktop";
import { useSectionStore } from "../../stores/sectionPinia";
import Handing from "../../components/Handing.vue";
import EditTopic from "../../components/ImageSystem/PortfolioDialog/EditTopic/EditTopic.vue";
import DeleteTopic from "../../components/ImageSystem/PortfolioDialog/DeleteTopic.vue";
import "./Portfolio.scss";

const isDesktop = useIsDesktop();
const topicStore = useTopicStore();
const sectionStore = useSectionStore();
const route = useRoute();
const curCategory = ref("");
const HeadingStyle = ref(
  "mt-4 text-[48px] md:text-[72px] lg:text-[96px] font-playfair text-white text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
);

const categorys = ref([
  "All",
  "Architecture",
  "Landscape",
  "Portrait",
  "Street",
  "Motocycle",
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
    return {
      backgroundImage: `url(${topicStore.topicImages[0]?.imageURL})`,
    };
  }
  return {};
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
      <Handing v-model:category="curCategory" :HeadingStyle="HeadingStyle" />
      <NewTopic />
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
              loadImage();
            }
          "
        >
          {{ category }}
        </button>
      </div>
    </div>
    <div class="portfolio__gallery">
      <masonry-wall
        :items="topicStore.topicImages"
        :ssr-columns="2"
        :column-width="500"
        :gap="4"
      >
        <template #default="{ item, index }">
          <div class="portfolio__gallery__image" :key="index">
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
            <div class="portfolio__gallery__image__info">
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
    </div>

    <Footer />
  </main>
</template>
<style scoped></style>
