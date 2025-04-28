<script setup lang="ts">
import "./Navbar.scss";
import { ref, computed, defineProps, withDefaults } from "vue";
import { useRouter, useRoute } from "vue-router";
import logo_B from "../../assets/images/icons/logo__small__black.png";
import logo_W from "../../assets/images/icons/logo__small__white.png";
import menu from "../../assets/images/icons/menu.png";
import cancel from "../../assets/images/icons/cancel.png";
import { faInstagram, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "../../stores/userPinia.ts";

const userStore = useUserStore();
const isMenuOpen = ref(false);
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
]);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const goToHome = () => {
  router.push("/");
};

const goToLogin = () => {
  router.push("/login");
};
const handleLogout = async () => {
  await userStore.logout();
};

const props = withDefaults(
  defineProps<{
    isScrolledPast?: boolean;
  }>(),
  {
    isScrolledPast: false,
  }
);

const router = useRouter();
const route = useRoute();

const currentLogo = computed(() => {
  return props.isScrolledPast ? logo_B : logo_W;
});

/*const linkClass = computed(() => {
  return isScrolledPast ? "text-black" : "text-black md:text-white";
});*/
</script>
<template>
  <nav
    class="navbar bg-white relative"
    :class="{
      'navbar--fixed': route.path === '/' || route.path === '/about',
      'md:bg-white': props.isScrolledPast,
      'md:bg-transparent': !props.isScrolledPast,
    }"
  >
    <button
      class="absolute top-1/2 -translate-y-1/2 right-1/3 md:hidden font-bellefair cursor-pointer lg:text-xl text-black textShadow"
      @click="userStore.isEditing = !userStore.isEditing"
    >
      Edit Mode : {{ userStore.isEditing ? "ON" : "OFF" }}
    </button>
    <img
      :src="logo_B"
      alt="logo"
      class="logo mr-auto md:hidden cursor-pointer"
      @click="goToHome"
    />
    <img
      :src="currentLogo"
      alt="logo"
      class="logo mr-auto hidden md:block cursor-pointer"
      @click="goToHome"
    />
    <div
      class="navbar__list md:flex"
      :class="isMenuOpen ? 'navbar__list--open' : ''"
    >
      <button @click="toggleMenu" class="md:hidden cancel">
        <img :src="cancel" alt="cancel_button" />
      </button>
      <router-link
        to="/"
        class="font-bellefair cursor-pointer lg:text-xl textShadow"
        :class="route.name === 'Home' ? 'text-black' : 'text-white'"
        >Home</router-link
      >
      <router-link
        :to="{ name: 'Portfolio', params: { category: 'All' } }"
        class="font-bellefair cursor-pointer lg:text-xl textShadow"
        :class="route.name === 'Portfolio' ? 'text-black' : 'text-white'"
        >Portfolio</router-link
      >
      <router-link
        to="/about"
        class="font-bellefair cursor-pointer lg:text-xl textShadow"
        :class="route.name === 'About' ? 'text-black' : 'text-white'"
        >About</router-link
      >
      <router-link
        v-if="!userStore.user"
        to="/login"
        class="hidden md:block font-bellefair cursor-pointer lg:text-xl textShadow"
        >Login</router-link
      >
      <template v-else>
        <button
          class="hidden md:block font-bellefair text-white cursor-pointer lg:text-xl textShadow"
          @click=""
        >
          Logout
        </button>
        <button
          class="hidden md:block font-bellefair text-white cursor-pointer lg:text-xl textShadow"
          @click="userStore.isEditing = !userStore.isEditing"
        >
          Edit Mode : {{ userStore.isEditing ? "ON" : "OFF" }}
        </button>
      </template>
      <div class="mt-4 md:hidden">
        <div class="flex">
          <div
            class="m-2"
            v-for="socialMedia in socialMedias"
            :key="socialMedia.name"
          >
            <a :href="socialMedia.herf" target="_blank">
              <FontAwesomeIcon :icon="socialMedia.icon" class="icon" />
            </a>
          </div>
          <button class="ml-2" v-if="!userStore.user" @click="goToLogin">
            <FontAwesomeIcon :icon="faArrowRightToBracket" class="icon" />
          </button>
          <button class="ml-2" v-else @click="userStore.logout()">
            <FontAwesomeIcon :icon="faArrowRightFromBracket" class="icon" />
          </button>
        </div>
      </div>
    </div>
    <div class="md:hidden" :class="isMenuOpen ? 'hidden' : ''">
      <button @click="toggleMenu">
        <img :src="menu" alt="menu_button" class="menu" />
      </button>
    </div>
  </nav>
</template>
<style scoped>
.logo {
  width: 60px;
}
.menu {
  width: 30px;
  background-color: white;
}
.cancel {
  width: 18px;
  background-color: inherit;
  margin-left: auto;
}
.icon {
  font-size: 1.5rem;
}
.textShadow {
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>
