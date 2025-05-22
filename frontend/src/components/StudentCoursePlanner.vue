<template>
  <div class="app-background">
    <div class="container">
      <div class="header">
        <h2 class="title">📊 輸入課程成績</h2>
        <div class="subtitle">管理您的學習成果</div>
      </div>

      <div class="form-section">
        <form @submit.prevent="submitPerformance" class="grade-form">
          <div class="form-group">
            <label class="form-label">選擇課程：</label>
            <select v-model="selectedCourse" required class="form-select">
              <option disabled value="">請選擇課程</option>
              <option
                v-for="c in courses"
                :key="c.course_id"
                :value="c.course_id"
              >
                {{ `${c.course_id} - ${c.course_name}` }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">輸入期望分數：</label>
            <input 
              type="number" 
              v-model="score" 
              class="form-input" 
              placeholder="請輸入 0-100 分數"
              min="0" 
              max="100"
              required
            />
          </div>

          <button type="submit" class="submit-btn">
            <span>📝 提交成績</span>
          </button>
        </form>

        <div v-if="successMessage" class="message success">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="message error">
          {{ errorMessage }}
        </div>
      </div>

      <div class="records-section">
        <div class="section-header">
          <h3 class="section-title">📋 已選課程</h3>
          <div v-if="performanceRecords.length > 0" class="stats-info">
            <span class="stat-item">
              📚 總科目：{{ performanceRecords.length }}
            </span>
            <span class="stat-item">
              📈 平均分數：{{ averageScore }}
            </span>
          </div>
        </div>

        <div v-if="performanceRecords.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h4>尚未填寫任何成績</h4>
          <p>開始輸入您的課程成績吧！</p>
        </div>

        <div v-else class="records-grid">
          <div v-for="r in performanceRecords" :key="r.course_id" class="record-card">
            <div class="course-info">
              <div class="course-code">{{ r.course_id }}</div>
              <div class="course-name">{{ r.course_name }}</div>
            </div>
            <div class="score-section">
              <div class="score-value" :class="getScoreClass(r.course_score)">
                {{ r.course_score }}
              </div>
              <div class="score-label">分</div>
            </div>
            <div class="grade-badge" :class="getGradeClass(r.course_score)">
              {{ getGradeLetter(r.course_score) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const courses            = ref([])
const selectedCourse     = ref('')
const score              = ref('')
const successMessage     = ref('')
const errorMessage       = ref('')
const performanceRecords = ref([])

const student_id = localStorage.getItem('student_id')

// 計算平均分數
const averageScore = computed(() => {
  if (performanceRecords.value.length === 0) return '0'
  const total = performanceRecords.value.reduce((sum, record) => sum + Number(record.course_score), 0)
  return Math.round(total / performanceRecords.value.length)
})

// ---------- API ----------
const fetchCourses = async () => {
  const res = await axios.get('http://localhost:3000/api/courses')
  courses.value = res.data                              // ✅ 寫進 courses
}

const fetchPerformance = async () => {
  const res = await axios.get(
    `http://localhost:3000/api/performance/${student_id}`
  )
  performanceRecords.value = res.data
}

// ---------- lifecycle ----------
onMounted(async () => {
  try {
    await fetchCourses()
    await fetchPerformance()
  } catch (e) {
    console.error('初始化失敗:', e)
  }
})

// ---------- submit ----------
const submitPerformance = async () => {
  if (!selectedCourse.value || !score.value) {
    errorMessage.value = '❌ 請填寫完整資訊'
    successMessage.value = ''
    setTimeout(() => (errorMessage.value = ''), 3000)
    return
  }

  if (score.value < 0 || score.value > 100) {
    errorMessage.value = '❌ 分數必須在 0-100 之間'
    successMessage.value = ''
    setTimeout(() => (errorMessage.value = ''), 3000)
    return
  }

  try {
    await axios.post('http://localhost:3000/api/performance', {
      student_id,
      course_id: selectedCourse.value,
      course_score: score.value
    })
    successMessage.value = '✅ 成績上傳成功！'
    errorMessage.value = ''
    selectedCourse.value = ''
    score.value = ''
    await fetchPerformance()
    setTimeout(() => (successMessage.value = ''), 3000)
  } catch (e) {
    console.error('上傳失敗:', e)
    errorMessage.value = '❌ 成績上傳失敗，請稍後再試'
    successMessage.value = ''
    setTimeout(() => (errorMessage.value = ''), 3000)
  }
}

// 根據分數返回對應的樣式類別
const getScoreClass = (score) => {
  const numScore = Number(score)
  if (numScore >= 90) return 'excellent'
  if (numScore >= 80) return 'good'
  if (numScore >= 70) return 'average'
  if (numScore >= 60) return 'pass'
  return 'fail'
}

// 根據分數返回等級樣式
const getGradeClass = (score) => {
  const numScore = Number(score)
  if (numScore >= 90) return 'grade-a'
  if (numScore >= 80) return 'grade-b'
  if (numScore >= 70) return 'grade-c'
  if (numScore >= 60) return 'grade-d'
  return 'grade-f'
}

// 根據分數返回等級字母
const getGradeLetter = (score) => {
  const numScore = Number(score)
  if (numScore >= 90) return 'A'
  if (numScore >= 80) return 'B'
  if (numScore >= 70) return 'C'
  if (numScore >= 60) return 'D'
  return 'F'
}
</script>

<style scoped>
.app-background {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 900px;
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

.grade-form {
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
  color: #2d3748;
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

.records-section {
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

.stats-info {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.stat-item {
  background: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  color: #4a5568;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
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

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.record-card {
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
  justify-content: space-between;
}

.record-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.record-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.course-info {
  flex: 1;
}

.course-code {
  font-size: 0.9em;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 4px;
}

.course-name {
  font-size: 1.1em;
  font-weight: 700;
  color: #2d3748;
  line-height: 1.3;
}

.score-section {
  display: flex;
  align-items: baseline;
  margin: 0 20px;
}

.score-value {
  font-size: 2em;
  font-weight: 700;
  line-height: 1;
}

.score-value.excellent { color: #38a169; }
.score-value.good { color: #3182ce; }
.score-value.average { color: #d69e2e; }
.score-value.pass { color: #dd6b20; }
.score-value.fail { color: #e53e3e; }

.score-label {
  font-size: 0.9em;
  color: #4a5568;
  margin-left: 4px;
}

.grade-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2em;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.grade-a { background: linear-gradient(135deg, #48bb78, #38a169); }
.grade-b { background: linear-gradient(135deg, #4299e1, #3182ce); }
.grade-c { background: linear-gradient(135deg, #ed8936, #dd6b20); }
.grade-d { background: linear-gradient(135deg, #ecc94b, #d69e2e); }
.grade-f { background: linear-gradient(135deg, #f56565, #e53e3e); }

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
  
  .form-section, .records-section {
    padding: 20px;
  }
  
  .grade-form {
    padding: 20px;
  }
  
  .records-grid {
    grid-template-columns: 1fr;
  }
  
  .title {
    font-size: 1.8em;
  }
  
  .stats-info {
    gap: 15px;
  }
  
  .record-card {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .score-section {
    margin: 0;
  }
}
</style>