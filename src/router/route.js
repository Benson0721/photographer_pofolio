import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home/Home.vue";
import Portfolio from "../views/Portfolio.vue";
import About from "../views/About/About.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: true,
  },
  {
    path: "/portfolio/:category?",
    name: "Portfolio",
    component: Portfolio,
    props: true,
  },
  {
    path: "/about",
    name: "About",
    component: About,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    return { top: 0 };
  },
});

export default router;
