import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home/Home.vue";
import Draggable from "../components/Carousel/draggable.vue";
import Portfolio from "../views/Portfolio/Portfolio.vue";
import About from "../views/About/About.vue";
import Login from "../views/Login/Login.vue";
import register from "../views/Register/Register.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: true,
  },
  {
    path: "/portfolio/",
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
  {
    path: "/login",
    name: "Login",
    component: Login,
    props: true,
  },
  {
    path: "/register",
    name: "Register",
    component: register,
    props: true,
  },
  {
    path: "/draggable",
    name: "Draggable",
    component: Draggable,
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
