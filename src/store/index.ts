import { createStore } from "vuex";
import type { Payment } from "@/types/Payment";
import type { User } from "@/types/User";

export default createStore({
  state: {
    payments: [] as Payment[],
    users: [] as User[],
  },

  getters: {
    getPaymentById: (state) => (id: number) =>
      state.payments.find((p) => p.id === id),

    getUserById: (state) => (id: number) =>
      state.users.find((u) => u.id === id),
  },

  mutations: {
    SET_PAYMENTS(state, payments: Payment[]) {
      state.payments = payments;
    },

    SET_USERS(state, users: User[]) {
      state.users = users;
    },

    ADD_USER(state, user: User) {
      state.users.push(user);
    },

    ADD_PAYMENT(state, payment: Payment) {
      state.payments.push(payment);
    },

    UPDATE_PAYMENT(state, updated: Payment) {
      const index = state.payments.findIndex((p) => p.id === updated.id);
      if (index !== -1) state.payments[index] = updated;
    },

    DELETE_PAYMENT(state, id: number) {
      state.payments = state.payments.filter((p) => p.id !== id);
    },
  },

  actions: {
    loadInitialData({ commit }) {
      const users: User[] = [
        {
          id: 1,
          name: "Charitha",
          email: "charitha@mail.com",
          phone: "9876543210",
        },
        { id: 2, name: "Rahul", email: "rahul@mail.com", phone: "9123456780" },
        { id: 3, name: "Sneha", email: "sneha@mail.com", phone: "9988776655" },
        { id: 4, name: "Arjun", email: "arjun@mail.com", phone: "9012345678" },
        { id: 5, name: "Meena", email: "meena@mail.com", phone: "9090909090" },
      ];

      const payments: Payment[] = [
        {
          id: 1,
          userId: 1,
          amount: 500,
          status: "SUCCESS",
          category: "Subscription",
          date: "2026-01-10",
        },
        {
          id: 2,
          userId: 2,
          amount: 1200,
          status: "PENDING",
          category: "Course Fee",
          date: "2026-01-12",
        },
        {
          id: 3,
          userId: 3,
          amount: 750,
          status: "FAILED",
          category: "Shopping",
          date: "2026-01-15",
        },
        {
          id: 4,
          userId: 1,
          amount: 300,
          status: "SUCCESS",
          category: "Recharge",
          date: "2026-01-18",
        },
        {
          id: 5,
          userId: 4,
          amount: 2200,
          status: "PENDING",
          category: "Laptop EMI",
          date: "2026-01-20",
        },
        {
          id: 6,
          userId: 5,
          amount: 950,
          status: "SUCCESS",
          category: "Electricity Bill",
          date: "2026-01-22",
        },
        {
          id: 7,
          userId: 2,
          amount: 400,
          status: "FAILED",
          category: "Food Order",
          date: "2026-01-25",
        },
      ];

      commit("SET_USERS", users);
      commit("SET_PAYMENTS", payments);
    },
  },
});
