<script setup>
import { defineProps, defineModel, watch } from "vue";
import EditTopic from "../../components/ImageSystem/PortfolioDialog/TopicSystem/EditTopic/EditTopic.vue";
import DeleteTopic from "../../components/ImageSystem/PortfolioDialog/TopicSystem/DeleteTopic.vue";

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

watch(curTopicID, () => {
  console.log(curTopicID.value);
});
</script>
<template>
  <masonry-wall
    :items="TopicImage"
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
