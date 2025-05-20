<template>
  <div class="card p-4">
    <h3>輸入課程成績</h3>

    <!-- 選課 -->
    <div class="mb-3">
      <label class="form-label">選擇課程</label>
      <select v-model="selectedCourse">
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

    <!-- 分數 -->
    <div class="mb-3">
      <label class="form-label">輸入分數</label>
      <input type="number" v-model="score" class="form-control" />
    </div>

    <button @click="submitPerformance" class="btn btn-primary">提交</button>

    <!-- 提示 -->
    <div v-if="successMessage" class="alert alert-success mt-3">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </div>

    <!-- 已填成績 -->
    <div class="mt-5">
      <h4>📋 已填成績</h4>
      <table class="table table-bordered mt-2">
        <thead>
          <tr>
            <th>課程代碼</th><th>課程名稱</th><th>成績</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in performanceRecords" :key="r.course_id">
            <td>{{ r.course_id }}</td>
            <td>{{ r.course_name }}</td>
            <td>{{ r.course_score }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const courses            = ref([])
const selectedCourse     = ref('')
const score              = ref('')
const successMessage     = ref('')
const errorMessage       = ref('')
const performanceRecords = ref([])

const student_id = localStorage.getItem('student_id')

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
    errorMessage.value = '請填寫完整資訊'
    successMessage.value = ''
    return
  }

  try {
    await axios.post('http://localhost:3000/api/performance', {
      student_id,
      course_id: selectedCourse.value,
      course_score: score.value
    })
    successMessage.value = '成績上傳成功！'
    errorMessage.value = ''
    selectedCourse.value = ''
    score.value = ''
    await fetchPerformance()
    setTimeout(() => (successMessage.value = ''), 3000)
  } catch (e) {
    console.error('上傳失敗:', e)
    errorMessage.value = '成績上傳失敗'
    successMessage.value = ''
  }
}
</script>

<style scoped>
.card { max-width: 800px; margin: auto; }
select { padding: 0.375rem 0.75rem; border: 1px solid #ced4da; border-radius: 0.25rem; color:#000; }
</style>
