<template>
  <div>
    <nav>
      <router-link to="/dashboard">🏠 Dashboard</router-link> |
      <router-link to="/student">📘 學生選課</router-link> |
      <router-link to="/abilities">🧠 能力管理</router-link>
      <router-link to="/clubs">🎽 社團活動</router-link>
    </nav>

    <hr />

    <router-view />
  </div>
</template>

<script setup>
// 不需要再 import 組件，由 router 控制切換
</script>

<style scoped>
nav {
  padding: 12px;
  background-color: #f5f5f5;
}
router-link {
  margin: 0 10px;
  text-decoration: none;
}
</style>
