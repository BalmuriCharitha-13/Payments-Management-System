<template>
  <div class="container">
    <div class="card form-card">
      <h2>{{ isEdit ? "Update Payment" : "Add Payment" }}</h2>

      <form @submit.prevent="submitForm">
        <label>User</label>
        <select v-model.number="userId">
          <option disabled value="">Select User</option>
          <option v-for="u in userList" :key="u.id" :value="u.id">
            {{ u.name }}
          </option>
        </select>

        <label>Amount</label>
        <input v-model.number="amount" type="number" />

        <label>Status</label>
        <select v-model="status">
          <option>PENDING</option>
          <option>SUCCESS</option>
          <option>FAILED</option>
        </select>

        <label>Category</label>
        <input v-model="category" />

        <label>Date</label>
        <input v-model="date" type="date" />

        <button type="submit">
          {{ isEdit ? "Update Payment" : "Save Payment" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import type { Payment } from "@/types/Payment";
import type { User } from "@/types/User";

const router = useRouter();
const route = useRoute();
const store = useStore();

/* Reactive data from Vuex store */
const userList = computed<User[]>(() => store.state.users);
const payments = computed<Payment[]>(() => store.state.payments);

const userId = ref<number | null>(null);
const amount = ref<number>(0);
const status = ref<"PENDING" | "SUCCESS" | "FAILED">("PENDING");
const category = ref<string>("Subscription");
const date = ref<string>(new Date().toISOString().split("T")[0]);

// If route contains an ID → form is in EDIT mode
const paymentId = Number(route.params.id || 0);
const isEdit = ref(false);

if (route.params.id) {
  isEdit.value = true;
  // Load existing payment data into form fields
  const paymentToEdit = payments.value.find((p) => p.id === paymentId);
  if (paymentToEdit) {
    userId.value = paymentToEdit.userId;
    amount.value = paymentToEdit.amount;
    status.value = paymentToEdit.status;
    category.value = paymentToEdit.category;
    date.value = paymentToEdit.date;
  }
}

/* Generates next payment ID (frontend-only logic, backend will replace this) */
const generatePaymentId = (): number => {
  if (payments.value.length === 0) return 1;
  return Math.max(...payments.value.map((p) => p.id)) + 1;
};

const submitForm = () => {
  // Basic form validation
  if (!userId.value || amount.value <= 0) {
    alert("Please fill all fields correctly");
    return;
  }

  if (isEdit.value) {
    // Updating an existing payment
    const updated: Payment = {
      id: paymentId,
      userId: userId.value,
      amount: amount.value,
      status: status.value,
      category: category.value,
      date: date.value,
    };

    store.commit("UPDATE_PAYMENT", updated);
    alert("Payment updated!");
  } else {
    // Creating a new payment
    const newPayment: Payment = {
      id: generatePaymentId(),
      userId: userId.value,
      amount: amount.value,
      status: status.value,
      category: category.value,
      date: date.value,
    };

    store.commit("ADD_PAYMENT", newPayment);
    alert("Payment added!");
  }

  // Redirect back to payments list after save
  router.push("/payments");
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}

.form-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.form-card form {
  display: grid;
  gap: 12px;
}

input,
select {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

button {
  background: #2563eb;
  color: white;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  border: none;
}

button:hover {
  background: #1e40af;
}
</style>
