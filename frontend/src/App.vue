<template>
  <div>
    <nav>
      <router-link to="/dashboard">🏠 Dashboard</router-link>
      <router-link to="/student">📘 學生選課</router-link>
      <router-link to="/abilities">🧠 能力管理</router-link>
      <router-link to="/clubs">🎽 社團活動</router-link>
      <router-link to="/Login">🚪 登出</router-link>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
// router 控制切換，不需額外 import
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-around; /* ✅ 平均分配 */
  align-items: center;
  padding: 1rem;
  background-color: #f0f4f8;
  border-bottom: 2px solid #ddd;
  font-family: 'Segoe UI', sans-serif;
}

router-link {
  padding: 0.6rem 1rem;
  background-color: #e3eaf5;
  color: #333;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

router-link:hover {
  background-color: #cbdcf3;
  color: #1a73e8;
}
</style>
