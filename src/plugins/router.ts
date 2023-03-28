import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/components/Main.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/web3-rock-paper-scissors-vue/"),
  routes,
});

export default router;
