<template>
  <section class="hero">
    <div class="hero-content">
      <h1>Smart Payment Management</h1>
      <p>Track, monitor, and control every transaction effortlessly.</p>

      <p class="total-users">👥 Total Users: {{ totalUsers }}</p>

      <router-link to="/payments" class="total-users dashboard-link">
        Go to Dashboard
      </router-link>
    </div>
  </section>

  <section class="stats container">
    <div class="stat-card total">
      <h3>Total Payments</h3>
      <p>{{ totalPayments }}</p>
    </div>
    <div class="stat-card success">
      <h3>Successful Payments</h3>
      <p>{{ successPayments }}</p>
    </div>
    <div class="stat-card failed">
      <h3>Failed Payments</h3>
      <p>{{ failedPayments }}</p>
    </div>
    <div class="stat-card pending">
      <h3>Pending Payments</h3>
      <p>{{ pendingPayments }}</p>
    </div>
  </section>

  <section class="recent container">
    <h2>Recent Payments</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in recentPayments" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ getUserName(p.userId) }}</td>
          <td>₹{{ p.amount }}</td>
          <td :class="p.status.toLowerCase()">{{ p.status }}</td>
          <td>{{ p.category }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import type { Payment } from "@/types/Payment";
import type { User } from "@/types/User";

const store = useStore();

const users = computed<User[]>(() => store.state.users);
const payments = computed<Payment[]>(() => store.state.payments);

const totalUsers = computed(() => users.value.length);
const totalPayments = computed(() => payments.value.length);

/* Count payments by status */
const pendingPayments = computed(
  () => payments.value.filter((p) => p.status === "PENDING").length
);

const successPayments = computed(
  () => payments.value.filter((p) => p.status === "SUCCESS").length
);

const failedPayments = computed(
  () => payments.value.filter((p) => p.status === "FAILED").length
);

/* Shows latest 5 payments (sorted by newest ID first) */
const recentPayments = computed(() =>
  [...payments.value].sort((a, b) => b.id - a.id).slice(0, 5)
);

/* Converts userId → user name for display */
const getUserName = (userId: number) => {
  const user = users.value.find((u) => u.id === userId);
  return user ? user.name : "Unknown";
};
</script>

<style scoped>
body {
  background: #f5f7fb;
}

.container {
  width: 92%;
  max-width: 1200px;
  margin: auto;
}

section {
  margin-bottom: 70px;
}

.hero {
  background: white;
  border-radius: 16px;
  padding: 50px 40px;
  margin: 40px auto;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.hero-content h1 {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.hero-content p {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 20px;
}

.total-users,
.dashboard-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  margin: 8px;
  font-size: 14px;
  min-width: 160px;
}

.total-users {
  background: #eef2ff;
  color: #4338ca;
}

.dashboard-link {
  background: #4f46e5;
  color: white;
  text-decoration: none;
  transition: 0.2s;
}

.dashboard-link:hover {
  background: #4338ca;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
  transition: 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card h3 {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-card p {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
}

.stat-card.total {
  border-left: 5px solid #4f46e5;
}
.stat-card.success {
  border-left: 5px solid #10b981;
}
.stat-card.failed {
  border-left: 5px solid #ef4444;
}
.stat-card.pending {
  border-left: 5px solid #f59e0b;
}

.recent h2 {
  margin-bottom: 18px;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.recent table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}

.recent th {
  background: #f9fafb;
  padding: 14px;
  text-align: left;
  font-size: 13px;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.recent td {
  padding: 14px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}

.recent tr:hover {
  background: #f8fafc;
}

.recent .success {
  color: #10b981;
  font-weight: 600;
}
.recent .failed {
  color: #ef4444;
  font-weight: 600;
}
.recent .pending {
  color: #f59e0b;
  font-weight: 600;
}
</style>
