<script setup lang="ts">
import { useStore } from "vuex";
import NavBar from "@/components/layout/NavBar.vue";

const store = useStore();
store.dispatch("loadInitialData");
</script>

<template>
  <NavBar />
  <router-view />
</template>

<style>
body {
  margin: 0;
  font-family: "Inter", sans-serif;
  background: #f5f7fb;
  color: #1f2937;
}

.container {
  max-width: 1100px;
  margin: auto;
  padding: 30px 20px;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}
</style>
