<script setup lang="ts">
import { faInstagram, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { ref, defineProps } from "vue";

const { isSocialScrolledPast } = defineProps<{
  isSocialScrolledPast: { type: boolean; default: false };
}>();

const socialMedias = ref([
  {
    name: "instagram",
    herf: "https://www.instagram.com/paicheng0902/",
    icon: faInstagram,
  },
  {
    name: "github",
    herf: "https://github.com/Benson0721",
    icon: faGithub,
  },
  {
    name: "gmail",
    to: "/about",
    hash: "#gmail",
    icon: faEnvelope,
  },
]);
</script>
<template>
  <div class="social-media-buttons__wrapper">
    <div
      class="social-media-buttons"
      v-for="socialMedia in socialMedias"
      :key="socialMedia.name"
    >
      <a v-if="socialMedia.herf" :href="socialMedia.herf" target="_blank">
        <FontAwesomeIcon
          :icon="socialMedia.icon"
          class="social-media-buttons__icon"
          :class="isSocialScrolledPast || false ? 'text-black' : 'text-white'"
        />
      </a>
      <router-link
        v-if="socialMedia.to"
        :to="{ path: socialMedia.to, hash: socialMedia.hash }"
      >
        <FontAwesomeIcon
          :icon="socialMedia.icon"
          class="social-media-buttons__icon"
          :class="isSocialScrolledPast || false ? 'text-black' : 'text-white'"
        />
      </router-link>
    </div>
  </div>
</template>
<style scoped lang="scss">
.social-media-buttons__wrapper {
  display: none;
}
@media only screen and (min-width: 768px) {
  .social-media-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    &__wrapper {
      display: block;
      position: fixed;
      top: 50%;
      left: 95%;
    }
    &__icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
  }
}
</style>
