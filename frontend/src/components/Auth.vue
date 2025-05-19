<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const message = ref('')
const router = useRouter()

const login = async () => {
  try {
    const res = await axios.post('http://localhost:3000/auth/login', {
      username: username.value,
      password: password.value
    })

    message.value = res.data.message || '登入成功！'
    console.log('✅ 登入成功：', res.data.user)
     localStorage.setItem('student_id', res.data.user.student_id)

    router.push('/dashboard')
  } catch (err) {
    message.value = '登入失敗：' + (err.response?.data?.message || err.message)
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

    <p class="message">{{ message }}</p>
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
  color: #d93025;
  font-weight: bold;
}
</style>
