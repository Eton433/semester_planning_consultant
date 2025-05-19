<template>
  <div class="container">
    <h2>學生選課規劃</h2>

    <h3>選課資訊</h3>
    <div v-for="(course, index) in courseList" :key="index" class="course-block">
      <label>課程：
        <select v-model="course.course_id" @change="updateCourseName(index)">
          <option disabled value="">請選擇課程</option>
          <option v-for="opt in courseOptions" :key="opt.id" :value="opt.id">
            {{ opt.id }} - {{ opt.name }}
          </option>
        </select>
      </label>

      <label>學期：
        <input v-model="course.semester" placeholder="如 2025-1" />
      </label>
      <label>期望成績：
        <input v-model="course.expected_grade" type="number" />
      </label>
      <label>預估讀書時數：
        <input v-model="course.estimated_study_hours" type="number" />
      </label>
      <button @click="removeCourse(index)">移除</button>
    </div>

    <button @click="addCourse">➕ 新增一筆課程</button>
    <br /><br />
    <button @click="submitCourses">📤 提交選課</button>

    <div v-if="message" style="margin-top: 20px;">
      <strong>{{ message }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 模擬學生 ID（從 localStorage 取得）
const studentId = ref(localStorage.getItem('student_id') || '1')

// 下拉式選單用的課程資料
const courseOptions = ref([])

// 儲存學生選的課程
const courseList = ref([
  {
    course_id: '',
    course_name: '',
    semester: '2025-1',
    expected_grade: 85,
    estimated_study_hours: 5
  }
])

const message = ref('')

// 頁面載入時抓取課程選單
onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/courses') // ← 改成你的後端 API
    if (!res.ok) throw new Error('Fetch failed')
    const data = await res.json()
    courseOptions.value = data
  } catch (err) {
    message.value = '❌ 課程資料載入失敗'
  }
})

// 根據 course_id 設定對應的 course_name
function updateCourseName(index) {
  const selected = courseOptions.value.find(c => c.id == courseList.value[index].course_id)
  courseList.value[index].course_name = selected ? selected.name : '❌ 查無此課程'
}

// 新增一筆選課
function addCourse() {
  courseList.value.push({
    course_id: '',
    course_name: '',
    semester: '',
    expected_grade: '',
    estimated_study_hours: ''
  })
}

// 移除一筆課程
function removeCourse(index) {
  courseList.value.splice(index, 1)
}

// 送出選課清單
async function submitCourses() {
  if (!studentId.value || courseList.value.length === 0) {
    message.value = '❌ 登入失效或沒有選課內容'
    return
  }

  try {
    const res = await fetch(`http://localhost:3000/students/${studentId.value}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseList.value)
    })
    const result = await res.json()
    message.value = res.ok ? `✅ 成功：${result.message}` : `❌ 錯誤：${result.error}`
  } catch {
    message.value = '❌ 提交失敗，伺服器未回應'
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: Arial;
}
.course-block {
  margin-bottom: 15px;
  border: 1px solid #ccc;
  padding: 10px;
}
.course-block label {
  display: block;
  margin: 5px 0;
}
input[disabled] {
  background-color: #eee;
  color: #666;
}
button {
  margin-top: 10px;
}
</style>
