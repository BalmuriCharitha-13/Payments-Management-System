import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import UserList from "@/components/users/UserList.vue";
import UserForm from "@/components/users/UserForm.vue";
import PaymentList from "@/components/payments/PaymentList.vue";
import PaymentForm from "@/components/payments/PaymentForm.vue";
import PaymentDetail from "@/components/payments/PaymentDetail.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/users", component: UserList },
  { path: "/users/new", component: UserForm },
  { path: "/payments", component: PaymentList },
  { path: "/payments/new", component: PaymentForm },
  { path: "/payments/edit/:id", component: PaymentForm },
  { path: "/payments/:id", component: PaymentDetail },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
