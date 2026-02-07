<template>
  <nav class="nav">
    <div class="logo">💳 PayFlow Admin</div>
    <div class="links">
      <router-link to="/">Home</router-link>
      <router-link to="/users">Users</router-link>
      <router-link to="/payments">Payments</router-link>
    </div>
  </nav>
</template>

<script lang="ts">
export default {
  name: "NavBar",
};
</script>

<style scoped>
.nav {
  background: linear-gradient(90deg, #09064b, #1f2189);
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 16px 30px;
  align-items: center;
  position: sticky;
  top: 0;
}

.logo {
  font-weight: 600;
  font-size: 18px;
}

.links a {
  color: white;
  margin-left: 20px;
  text-decoration: none;
  font-weight: 500;
}

.links a:hover {
  opacity: 0.8;
}
</style>
