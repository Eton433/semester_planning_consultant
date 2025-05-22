<script setup>
import { ref, onMounted } from 'vue'

// ✅ 從 localStorage 拿到目前登入者的 student_id
const studentId = localStorage.getItem('student_id')

const abilities = ref([])
const newAbility = ref({
  ability_id: null,
  description: '',
  ability_level: 1
})
const message = ref('')

const fetchAbilities = async () => {
  try {
    const res = await fetch('http://localhost:3000/abilities')
    const data = await res.json()
    abilities.value = data
    console.log('✅ 能力清單載入成功:', data)
  } catch (err) {
    message.value = '❌ 載入能力列表失敗'
  }
}

const createStudentAbility = async () => {
  const payload = {
    student_id: studentId,
    ability_id: Number(newAbility.value.ability_id),
    ability_level: newAbility.value.ability_level,
    description: newAbility.value.description
  }

  console.log('📤 送出的資料:', payload)

  try {
    const res = await fetch('http://localhost:3000/api/student-ability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const result = await res.json()

    if (res.ok) {
      message.value = '✅ 儲存成功'
      await fetchAbilities()
      newAbility.value = { ability_id: null, description: '', ability_level: 1 }
    } else {
      message.value = `❌ 錯誤：${result.error}`
    }
  } catch (err) {
    message.value = '❌ 無法與伺服器連線'
  }
}

onMounted(fetchAbilities)
</script>

<template>
  <div class="app-background">
    <div class="container">
      <div class="header">
        <h2 class="title">🎓 學生能力選擇</h2>
      </div>

      <div class="form-section">
        <form @submit.prevent="createStudentAbility" class="ability-form">
          <div class="form-group">
            <label class="form-label">選擇能力：</label>
            <select v-model.number="newAbility.ability_id" required class="form-select">
              <option disabled value="">請選擇</option>
              <option v-for="a in abilities" :key="a.ability_id" :value="a.ability_id">
                {{ a.ability_name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">說明：</label>
            <input v-model="newAbility.description" placeholder="自訂說明" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">能力等級（1~5）：</label>
            <input type="number" v-model.number="newAbility.ability_level" min="1" max="5" class="form-input" />
          </div>

          <button type="submit" class="submit-btn">
            <span>📝 提交能力</span>
          </button>
        </form>

        <div v-if="message" class="message" :class="{ success: message.includes('✅'), error: message.includes('❌') }">
          {{ message }}
        </div>
      </div>

      <div class="abilities-section">
        <div class="section-header">
          <h3 class="section-title">📋 能力清單</h3>
        </div>
        <div class="abilities-grid">
          <div v-for="a in abilities" :key="a.ability_id" class="ability-card">
            <div class="ability-name">{{ a.ability_name }}</div>
            <div class="ability-level">等級 {{ a.ability_level }}</div>
            <div class="ability-description">{{ a.description }}</div>
          </div>
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
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 30px;
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
  margin: 0;
  font-size: 2.2em;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.form-section {
  padding: 40px;
  background: linear-gradient(145deg, #f8f9ff 0%, #e8f4f8 100%);
}

.ability-form {
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

.form-input, .form-select {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  transform: translateY(-1px);
}

.form-select {
  cursor: pointer;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%234facfe"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
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

.abilities-section {
  padding: 40px;
  background: linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-title {
  color: #2d3748;
  font-size: 1.8em;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.abilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.ability-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.ability-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.ability-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.ability-name {
  font-size: 1.3em;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
}

.ability-level {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 600;
  margin-bottom: 12px;
}

.ability-description {
  color: #4a5568;
  line-height: 1.6;
  font-size: 0.95em;
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
  
  .form-section, .abilities-section {
    padding: 20px;
  }
  
  .ability-form {
    padding: 20px;
  }
  
  .abilities-grid {
    grid-template-columns: 1fr;
  }
  
  .title {
    font-size: 1.8em;
  }
}
</style>