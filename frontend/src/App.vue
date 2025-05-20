<template>
  <div>
    <nav>
      <router-link to="/dashboard">🏠 Dashboard</router-link>
      <router-link to="/student">📘 學生選課</router-link>
      <router-link to="/abilities">🧠 能力管理</router-link>
      <router-link to="/clubs">🎽 社團活動</router-link>
      <router-link to="/performance">📊 課程成績</router-link>
      <a href="#" @click.prevent="logout">🚪 登出</a>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('student_id') // ✅ 清除登入狀態
  router.push('/login')                 // ✅ 導向登入頁
}
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem;
  background-color: #f0f4f8;
  border-bottom: 2px solid #ddd;
  font-family: 'Segoe UI', sans-serif;
}

router-link,
a {
  padding: 0.6rem 1rem;
  background-color: #e3eaf5;
  color: #333;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

router-link:hover,
a:hover {
  background-color: #cbdcf3;
  color: #1a73e8;
}
</style>
