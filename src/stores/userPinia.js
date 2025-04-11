import { defineStore, createPinia } from "pinia";
import { login, register, logout } from "../apis/userAPI.js";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: null,
    isLoggedIn: false,
  }),
  actions: {
    async login(credentials) {
      const data = await login(credentials);
      this.user = data.user;
      this.error = data?.error;
    },
    async register(userData) {
      const data = await register(userData);
      this.user = data.user;
      this.error = data?.error;
    },
    async logout() {
      const response = await logout();
      this.user = null;
      this.token = null;
    },
    persist: {
      enabled: true,
      strategies: [
        {
          key: "userStore",
          storage: localStorage,
          paths: ["user"],
        },
      ],
    },
  },
});
