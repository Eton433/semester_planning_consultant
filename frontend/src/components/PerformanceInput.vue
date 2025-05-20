<template>
    <div class="card p-4">
      <h3>輸入課程成績</h3>
  
      <div class="mb-3">
        <label for="course" class="form-label">選擇課程</label>
        <select v-model="selectedCourse" class="form-select">
          <option disabled value="">請選擇課程</option>
          <option v-for="course in courses" :key="course.course_id" :value="course.course_id">
            {{ `${course.course_id} - ${course.course_name}` }}
          </option>
        </select>
      </div>
  
      <div class="mb-3">
        <label for="score" class="form-label">輸入分數</label>
        <input type="number" v-model="score" class="form-control" />
      </div>
  
      <button @click="submitPerformance" class="btn btn-primary">提交</button>
  
      <div v-if="successMessage" class="alert alert-success mt-3">
        {{ successMessage }}
      </div>
  
      <div class="mt-5">
        <h4>📋 已填成績</h4>
        <table class="table table-bordered mt-2">
          <thead>
            <tr>
              <th>課程代碼</th>
              <th>課程名稱</th>
              <th>成績</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in performanceRecords" :key="record.course_id">
              <td>{{ record.course_id }}</td>
              <td>{{ record.course_name }}</td>
              <td>{{ record.course_score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const courses = ref([])
  const selectedCourse = ref('')
  const score = ref('')
  const successMessage = ref('')
  const performanceRecords = ref([])
  const student_id = localStorage.getItem('student_id')
  
  async function fetchCourses() {
  try {
    const res = await fetch('http://localhost:3000/api/courses')
    courses.value = await res.json()
  } catch (err) {
    console.error('❌ 載入課程清單失敗', err)
  }
}
  const fetchPerformance = async () => {
    const res = await axios.get(`/api/performance/${student_id}`)
    performanceRecords.value = res.data
  }
  
  onMounted(async () => {
    try {
      await fetchCourses()
      await fetchPerformance()
    } catch (err) {
      console.error('初始化失敗:', err)
    }
  })
  
  const submitPerformance = async () => {
    if (!selectedCourse.value || !score.value) {
      alert('請填寫完整資訊')
      return
    }
  
    try {
      await axios.post('/api/performance', {
        student_id,
        course_id: selectedCourse.value,
        course_score: score.value,
      })
      successMessage.value = '成績上傳成功！'
      selectedCourse.value = ''
      score.value = ''
      await fetchPerformance()
      setTimeout(() => (successMessage.value = ''), 3000)
    } catch (err) {
      console.error('上傳失敗:', err)
      alert('成績上傳失敗')
    }
  }
  </script>
  
  <style scoped>
  .card {
    max-width: 800px;
    margin: auto;
  }
  </style>
  