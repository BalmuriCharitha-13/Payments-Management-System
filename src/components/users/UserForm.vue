<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import type { User } from "@/types/User";

const router = useRouter();
const store = useStore();

const name = ref("");
const email = ref("");
const phone = ref("");

const users = computed<User[]>(() => store.state.users);

/* Generate next user ID */
const getNextUserId = () => {
  if (users.value.length === 0) return 1;
  return Math.max(...users.value.map((u) => u.id)) + 1;
};

const submitForm = () => {
  name.value = name.value.trim();
  email.value = email.value.trim();
  phone.value = phone.value.trim();

  // Required validation
  if (!name.value || !email.value || !phone.value) {
    alert("Please fill all fields");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    alert("Enter a valid email");
    return;
  }

  // Phone validation → exactly 10 digits
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone.value)) {
    alert("Phone number must be exactly 10 digits");
    return;
  }

  // Duplicate email check
  const emailExists = users.value.some(
    (u) => u.email.toLowerCase() === email.value.toLowerCase()
  );

  if (emailExists) {
    alert("User already exists");
    return;
  }

  const newUser: User = {
    id: getNextUserId(),
    name: name.value,
    email: email.value,
    phone: phone.value,
  };

  store.commit("ADD_USER", newUser);

  alert("User added successfully!");

  name.value = "";
  email.value = "";
  phone.value = "";

  router.push("/users");
};
</script>

<template>
  <div class="container">
    <div class="header">
      <h2>Add New User</h2>
      <button class="back-btn" @click="router.push('/users')">← Back</button>
    </div>

    <div class="form-card">
      <form @submit.prevent="submitForm" class="form-grid">
        <div class="form-group">
          <label>Full Name</label>
          <input v-model="name" type="text" placeholder="Enter full name" />
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input
            v-model="email"
            type="email"
            placeholder="Enter email address"
          />
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <input
            v-model="phone"
            type="tel"
            maxlength="10"
            placeholder="Enter 10-digit phone number"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="primary-btn">Create User</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.container {
  max-width: 900px;
  margin: auto;
  padding: 30px 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  color: #1f2937;
}

.back-btn {
  background: #e5e7eb;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.back-btn:hover {
  background: #d1d5db;
}

.form-card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.form-grid {
  display: grid;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  margin-bottom: 6px;
  color: #374151;
}

input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.primary-btn {
  padding: 12px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.primary-btn:hover {
  background: #6366f1;
}
</style>
