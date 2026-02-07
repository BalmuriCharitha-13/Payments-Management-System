<template>
  <div class="container">
    <h2>Payment Dashboard</h2>

    <div class="top-bar">
      <div class="left-controls">
        <div class="search-wrapper">
          <input v-model="search" placeholder="Search by user name..." />
          <span class="search-icon">🔍</span>
        </div>
      </div>

      <div class="right-controls">
        <div class="select-wrapper">
          <select v-model="statusFilter">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        <button class="add-btn" @click="goToAddPayment">+ Add Payment</button>
      </div>
    </div>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payment in filteredPayments" :key="payment.id">
            <td>{{ payment.id }}</td>
            <td>{{ getUserName(payment.userId) }}</td>
            <td>₹ {{ payment.amount }}</td>
            <td :class="payment.status.toLowerCase()">{{ payment.status }}</td>
            <td>{{ payment.category }}</td>
            <td>
              <button class="view-btn" @click="goToDetail(payment.id)">
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import type { Payment } from "@/types/Payment";
import type { User } from "@/types/User";

const router = useRouter();
const store = useStore();

const search = ref("");
const statusFilter = ref("");

const userList = computed<User[]>(() => store.state.users);
const payments = computed<Payment[]>(() => store.state.payments);

/* Converts userId → user name for display in table */
const getUserName = (userId: number) => {
  const user = userList.value.find((u) => u.id === userId);
  return user ? user.name : "Unknown";
};

/* Combines search + status filter logic */
const filteredPayments = computed(() => {
  return payments.value.filter((p) => {
    const matchesSearch = getUserName(p.userId)
      .toLowerCase()
      .includes(search.value.toLowerCase());

    const matchesStatus = statusFilter.value
      ? p.status === statusFilter.value
      : true;

    return matchesSearch && matchesStatus;
  });
});

const goToDetail = (id: number) => router.push(`/payments/${id}`);
const goToAddPayment = () => router.push("/payments/new");
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #1f2937;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.left-controls {
  flex: 1;
  min-width: 250px;
}

.right-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-wrapper {
  position: relative;
  max-width: 300px;
}

.search-wrapper input {
  width: 100%;
  padding: 10px 36px 10px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.add-btn {
  background: #4f46e5;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.view-btn {
  background: #e0e7ff;
  color: #3730a3;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.add-btn:hover {
  background: #6366f1;
}

.view-btn:hover {
  background: #c7d2fe;
}

.table-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 14px 16px;
  text-align: left;
}

th {
  background: #eef2ff;
  color: #1f2937;
}

td {
  border-top: 1px solid #e5e7eb;
}

tr:hover {
  background: #f9fafb;
}

.pending {
  color: #d97706;
  font-weight: 600;
}
.success {
  color: #16a34a;
  font-weight: 600;
}
.failed {
  color: #dc2626;
  font-weight: 600;
}

.select-wrapper {
  position: relative;
}

select {
  appearance: none;
  padding: 10px 36px 10px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

.select-wrapper::after {
  content: "▼";
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 12px;
  color: #6b7280;
}
</style>
