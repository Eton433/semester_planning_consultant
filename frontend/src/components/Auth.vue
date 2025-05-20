<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const message  = ref('')

const router = useRouter()
const route  = useRoute()

/* ✅ 監聽 query 參數，決定是否顯示「請先登入」 */
watch(
  () => route.query.reason,
  (reason) => {
    message.value = reason === 'login_required'
      ? '⚠️ 請先登入才能使用系統'
      : ''
  },
  { immediate: true }   // → 元件一掛載就先跑一次
)

const login = async () => {
  try {
    const { data } = await axios.post('http://localhost:3000/auth/login', {
      username: username.value,
      password: password.value
    })

    const student = data.user
    if (student?.student_id) {
      localStorage.setItem('student_id', student.student_id)
      message.value = '✅ 登入成功'
      router.push('/dashboard')
    } else {
      message.value = '❌ 登入失敗：找不到使用者資訊'
    }
  } catch (err) {
    message.value =
      '❌ 登入失敗：' + (err.response?.data?.message || err.message)
  }
}
</script>

<template>
  <div class="login-container">
    <h2>🎓 使用者登入</h2>

    <div class="form">
      <input v-model="username" placeholder="使用者名稱" />
      <input v-model="password" type="password" placeholder="密碼" />
      <button @click="login">登入</button>
    </div>

    <p class="message" v-if="message">{{ message }}</p>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to right, #f0f4ff, #e1ecf4);
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 250px;
}

input {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #fff;
  transition: border-color 0.3s;
}
input:focus {
  outline: none;
  border-color: #4285f4;
}

button {
  padding: 0.6rem;
  border: none;
  background-color: #4285f4;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}
button:hover {
  background-color: #3367d6;
}

.message {
  margin-top: 1rem;
  color: #856404;
  background-color: #fff3cd;
  padding: 0.6rem 1rem;
  border: 1px solid #ffeeba;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
}
</style>
