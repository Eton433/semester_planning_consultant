<template>
  <div class="app-background">
    <div class="container">
      <div class="header">
        <h2 class="title">🏸 社團選擇與總覽</h2>
        <div class="subtitle">探索並加入您感興趣的社團活動</div>
      </div>

      <div class="form-section">
        <form @submit.prevent="submit" class="club-form">
          <div class="form-header">
            <h3 class="form-title">可選社團列表</h3>
          </div>

          <div v-if="clubList.length === 0" class="loading-state">
            <div class="loading-icon">⏳</div>
            <p>載入中...</p>
          </div>

          <div v-else class="clubs-grid">
            <div 
              v-for="club in clubList" 
              :key="club.activity_id" 
              class="club-card"
              :class="{ 'joined': joinedIds.includes(club.activity_id), 'selected': selected.includes(club.activity_id) }"
            >
              <label class="club-label">
                <input
                  type="checkbox"
                  :value="club.activity_id"
                  v-model="selected"
                  :disabled="joinedIds.includes(club.activity_id)"
                  class="club-checkbox"
                />
                <div class="club-content">
                  <div class="club-name">{{ club.activity_name }}</div>
                  <div class="club-time">⏰ {{ club.weekly_time_commitment }} 小時/週</div>
                  <div v-if="joinedIds.includes(club.activity_id)" class="joined-badge">
                    ✅ 已加入
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button v-if="clubList.length > 0 && selected.length > 0" type="submit" class="submit-btn">
            <span>🎯 提交新增社團 ({{ selected.length }})</span>
          </button>
        </form>

        <div v-if="message" class="message" :class="{ 
          success: message.includes('✅'), 
          error: message.includes('❌') 
        }">
          {{ message }}
        </div>
      </div>

      <div class="summary-section">
        <div class="section-header">
          <h3 class="section-title">📋 已加入社團</h3>
          <div v-if="totalHours > 0" class="total-hours">
            🎯 每週總時數：<span class="hours-value">{{ totalHours }}</span> 小時
          </div>
        </div>

        <div v-if="joined.length === 0" class="empty-state">
          <div class="empty-icon">🏸</div>
          <h4>尚未加入任何社團</h4>
          <p>快來選擇您感興趣的社團活動吧！</p>
        </div>

        <div v-else class="joined-clubs-grid">
          <div v-for="club in joined" :key="club.activity_id" class="joined-club-card">
            <div class="club-icon">🎭</div>
            <div class="club-info">
              <div class="club-name">{{ club.activity_name }}</div>
              <div class="club-commitment">
                <span class="time-badge">{{ club.weekly_time_commitment }} 小時/週</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// ✅ 從 localStorage 或硬編碼取得學生 ID
const studentId = ref(localStorage.getItem('student_id'))

const clubList = ref([])
const selected = ref([])
const joined = ref([])
const message = ref('')

const joinedIds = computed(() => joined.value.map(c => c.activity_id))
const totalHours = computed(() => joined.value.reduce((sum, c) => sum + c.weekly_time_commitment, 0))

const fetchAll = async () => {
  try {
    const [clubsRes, joinedRes] = await Promise.all([
      fetch(`http://localhost:3000/api/clubs/activities`),
      fetch(`http://localhost:3000/api/clubs/${studentId.value}/activities/list`)
    ])
    clubList.value = await clubsRes.json()
    joined.value = await joinedRes.json()
  } catch (err) {
    message.value = '❌ 載入社團資料失敗'
    console.error(err)
  }
}

const submit = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/clubs/${studentId.value}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selected.value)
    })

    const result = await res.json()
    if (res.ok) {
      message.value = '✅ 新增社團成功！'
      selected.value = []
      await fetchAll()
      setTimeout(() => (message.value = ''), 3000)
    } else {
      message.value = `❌ 錯誤：${result.error}`
      setTimeout(() => (message.value = ''), 3000)
    }
  } catch (err) {
    message.value = '❌ 發送失敗，請確認伺服器是否運作中'
    setTimeout(() => (message.value = ''), 3000)
    console.error(err)
  }
}

onMounted(() => {
  if (!studentId.value) {
    message.value = '❌ 請先登入'
    return
  }
  fetchAll()
})
</script>

<style scoped>
.app-background {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 1000px;
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

.club-form {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-header {
  margin-bottom: 24px;
}

.form-title {
  color: #2d3748;
  font-size: 1.5em;
  font-weight: 700;
  margin: 0;
  text-align: center;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
  color: #4a5568;
}

.loading-icon {
  font-size: 3em;
  margin-bottom: 15px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.clubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.club-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.club-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.club-card.selected {
  border-color: #4facfe;
  background: linear-gradient(145deg, #e6f3ff 0%, #f0f8ff 100%);
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.2);
}

.club-card.joined {
  border-color: #48bb78;
  background: linear-gradient(145deg, #e6fffa 0%, #f0fff4 100%);
  opacity: 0.8;
}

.club-label {
  display: block;
  padding: 20px;
  cursor: pointer;
  margin: 0;
  width: 100%;
  height: 100%;
}

.club-card.joined .club-label {
  cursor: not-allowed;
}

.club-checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.club-content {
  position: relative;
}

.club-name {
  font-size: 1.2em;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
  line-height: 1.3;
}

.club-time {
  color: #4a5568;
  font-size: 0.95em;
  margin-bottom: 8px;
}

.joined-badge {
  display: inline-block;
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
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

.summary-section {
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
  margin: 0 0 15px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.total-hours {
  background: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  color: #4a5568;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: inline-block;
}

.hours-value {
  color: #667eea;
  font-size: 1.2em;
  font-weight: 700;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #4a5568;
}

.empty-icon {
  font-size: 4em;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-state h4 {
  margin: 0 0 10px 0;
  font-size: 1.5em;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  font-size: 1.1em;
  opacity: 0.8;
}

.joined-clubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.joined-club-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 16px;
}

.joined-club-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.joined-club-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.club-icon {
  font-size: 2.5em;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.club-info {
  flex: 1;
}

.club-info .club-name {
  font-size: 1.2em;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
}

.club-commitment {
  display: flex;
  align-items: center;
}

.time-badge {
  background: linear-gradient(135deg, #ed8936, #dd6b20);
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.9em;
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
  
  .form-section, .summary-section {
    padding: 20px;
  }
  
  .club-form {
    padding: 20px;
  }
  
  .clubs-grid, .joined-clubs-grid {
    grid-template-columns: 1fr;
  }
  
  .title {
    font-size: 1.8em;
  }
  
  .joined-club-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .club-icon {
    margin: 0 auto;
  }
}
</style>