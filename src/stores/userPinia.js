import { defineStore } from "pinia";
import { login, register, logout } from "../apis/user-api.js";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: null,
    error: null,
  }),
  actions: {
    async login(userData) {
      const data = await login(userData);
      this.user = data._id;
      this.error = data?.error;
    },
    async register(userData) {
      const data = await register(userData);
      this.user = data.user;
      this.error = data?.error;
    },
    async logout() {
      await logout();
      this.user = null;
    },
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
});
