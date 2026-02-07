<template>
  <div class="container">
    <h2>Payment Details</h2>

    <div v-if="payment" class="detail-card">
      <div class="detail-row">
        <span>ID</span>
        <strong>#{{ payment.id }}</strong>
      </div>

      <div class="detail-row">
        <span>User</span>
        <strong>{{ getUserName(payment.userId) }}</strong>
      </div>

      <div class="detail-row">
        <span>Amount</span>
        <strong>₹ {{ payment.amount }}</strong>
      </div>

      <div class="detail-row">
        <span>Status</span>
        <strong :class="payment.status.toLowerCase()">
          {{ payment.status }}
        </strong>
      </div>

      <div class="detail-row">
        <span>Category</span>
        <strong>{{ payment.category }}</strong>
      </div>

      <div class="detail-row">
        <span>Date</span>
        <strong>{{ payment.date }}</strong>
      </div>
    </div>

    <div v-else class="not-found">Payment not found.</div>

    <div class="buttons">
      <button class="back-btn" @click="goBack">← Back</button>
      <button v-if="isAdmin" class="edit-btn" @click="goToUpdate">
        ✏ Update
      </button>
      <button v-if="isAdmin" class="delete-btn" @click="deletePayment">
        🗑 Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const route = useRoute();

const paymentId = Number(route.params.id);
const isAdmin = true;

/* Reactive access to Vuex data */
const payments = computed(() => store.state.payments);
const users = computed(() => store.state.users);

/* Find the payment using ID from URL */
const payment = computed(
  () => payments.value.find((p: any) => p.id === paymentId) || null
);

/* Map userId → user name (since payment only stores userId) */
const getUserName = (userId: number) => {
  const user = users.value.find((u: any) => u.id === userId);
  return user ? user.name : "Unknown";
};

/* Remove payment from store and redirect back to list */
const deletePayment = () => {
  if (!confirm("Are you sure you want to delete this payment?")) return;

  store.commit("DELETE_PAYMENT", paymentId);
  alert("Payment deleted successfully!");
  router.push("/payments");
};

const goBack = () => router.push("/payments");
const goToUpdate = () => router.push(`/payments/edit/${paymentId}`);
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #1f2937;
}

.detail-card {
  background: white;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row span {
  color: #6b7280;
  font-weight: 500;
}

.detail-row strong {
  color: #111827;
}

.buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

button {
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.back-btn {
  background: #e0e7ff;
  color: #3730a3;
}

.edit-btn {
  background: #4f46e5;
  color: white;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

button:hover {
  opacity: 0.9;
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

.not-found {
  padding: 20px;
  background: #fee2e2;
  border-radius: 8px;
  color: #b91c1c;
}
</style>
