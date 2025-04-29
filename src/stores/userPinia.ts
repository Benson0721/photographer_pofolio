import { defineStore } from "pinia";
import { login, register, logout, checkAuth } from "../apis/user_Api.js";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: null,
    error: null,
    isEditing: false,
  }),
  actions: {
    async login(userData: object) {
      const data = await login(userData);
      this.user = data._id;
      this.error = data?.error;
    },
    async register(userData: object) {
      const data = await register(userData);
      this.user = data.user;
      this.error = data?.error;
    },
    async logout() {
      await logout();
      this.user = null;
    },
    async checkAuth() {
      const data = await checkAuth();
      this.user = data.user;
      this.error = data?.error;
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
