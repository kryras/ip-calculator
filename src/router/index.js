import Vue from "vue";
import VueRouter from "vue-router";
import IpCalculator from "../views/IpCalculator.vue";
import SubnetCalculator from "../views/SubnetCalculator.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "IP Calculator",
    component: IpCalculator
  },
  {
    path: "/subnet-calc",
    name: "Subnet Calculator",
    component: SubnetCalculator
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
