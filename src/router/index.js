import Vue from "vue";
import VueRouter from "vue-router";
import IpCalculator from "../views/IpCalculator.vue";
import SubnetCalculator from "../views/SubnetCalculator.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Ip Calculator",
    component: IpCalculator
  },
  {
    path: "/ip-calc",
    name: "Ip Calculator",
    component: IpCalculator
  },
  {
    path: "/subnet-calc",
    name: "Subnet calculator",
    component: SubnetCalculator
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
