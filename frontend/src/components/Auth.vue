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
  <div class="app-background">
    <div class="container">
      <div class="header">
        <h2 class="title">🎓 使用者登入</h2>
        <div class="subtitle">歡迎使用學生能力管理系統</div>
      </div>

      <div class="form-section">
        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <label class="form-label">使用者名稱：</label>
            <input 
              v-model="username" 
              placeholder="請輸入使用者名稱" 
              required 
              class="form-input"
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label class="form-label">密碼：</label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="請輸入密碼" 
              required 
              class="form-input"
              autocomplete="current-password"
            />
          </div>

          <button type="submit" class="submit-btn">
            <span>🔐 登入系統</span>
          </button>
        </form>

        <div v-if="message" class="message" :class="{ 
          success: message.includes('✅'), 
          error: message.includes('❌'),
          warning: message.includes('⚠️')
        }">
          {{ message }}
        </div>
      </div>

      <div class="footer-section">
        <div class="footer-text">
          <p>💡 首次使用？請聯繫系統管理員申請帳號</p>
          <p>🔒 您的資料安全是我們的首要考量</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-background {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 450px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 40px 30px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.title {
  color: white;
  margin: 0 0 10px 0;
  font-size: 2.2em;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1em;
  font-weight: 400;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.form-section {
  padding: 40px;
  background: linear-gradient(145deg, #f8f9ff 0%, #e8f4f8 100%);
}

.login-form {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2d3748;
  font-size: 1.1em;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  transform: translateY(-1px);
}

.form-input::placeholder {
  color: #a0aec0;
}

.submit-btn {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.submit-btn:hover::before {
  left: 100%;
}

.message {
  margin-top: 20px;
  padding: 16px 20px;
  border-radius: 12px;
  font-weight: 600;
  text-align: center;
  animation: slideIn 0.3s ease;
}

.message.success {
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
}

.message.error {
  background: linear-gradient(135deg, #f56565, #e53e3e);
  color: white;
  box-shadow: 0 4px 15px rgba(245, 101, 101, 0.3);
}

.message.warning {
  background: linear-gradient(135deg, #ed8936, #dd6b20);
  color: white;
  box-shadow: 0 4px 15px rgba(237, 137, 54, 0.3);
}

.footer-section {
  padding: 30px 40px;
  background: linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%);
  text-align: center;
}

.footer-text p {
  margin: 8px 0;
  color: #4a5568;
  font-size: 0.95em;
  line-height: 1.5;
}

.footer-text p:first-child {
  font-weight: 600;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .app-background {
    padding: 10px;
  }
  
  .container {
    max-width: 350px;
  }
  
  .form-section, .footer-section {
    padding: 20px;
  }
  
  .login-form {
    padding: 20px;
  }
  
  .title {
    font-size: 1.8em;
  }
  
  .subtitle {
    font-size: 1em;
  }
  
  .header {
    padding: 30px 20px;
  }
}

/* 載入動畫 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container {
  animation: fadeInUp 0.6s ease-out;
}

/* 輸入框聚焦時的特效 */
.form-input:focus {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
}

/* 按鈕點擊效果 */
.submit-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}
</style>