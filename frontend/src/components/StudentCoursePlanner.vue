<template>
  <div class="container">
    <h2>學生選課規劃</h2>

    <h3>選課資訊</h3>
    <div v-for="(course, index) in courseList" :key="index" class="course-block">
      <label>課程代碼：
        <input v-model="course.course_id" type="number" @blur="fetchCourseName(index)" />
      </label>
      <label>課程名稱：
        <input :value="course.course_name" disabled />
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

    <div v-if="message" :style="{ marginTop: '20px' }">
      <strong>{{ message }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const studentId = ref(localStorage.getItem('student_id') || '')
const message = ref('')
const courseList = ref([
  {
    course_id: 306009001,
    course_name: '',
    semester: '2025-1',
    expected_grade: 85,
    estimated_study_hours: 5
  }
])

function addCourse() {
  courseList.value.push({
    course_id: '',
    course_name: '',
    semester: '',
    expected_grade: '',
    estimated_study_hours: ''
  })
}

function removeCourse(index) {
  courseList.value.splice(index, 1)
}

async function fetchCourseName(index) {
  const id = courseList.value[index].course_id
  if (!id) return

  try {
    const res = await fetch(`http://localhost:3000/api/courses/${id}`)
    if (!res.ok) throw new Error()
    const data = await res.json()
    courseList.value[index].course_name = data.name
  } catch {
    courseList.value[index].course_name = '❌ 查無此課程'
  }
}

async function submitCourses() {
  if (!studentId.value || courseList.value.length === 0) {
    message.value = '❌ 登入失效或無選課內容'
    return
  }

  try {
    const response = await fetch(`http://localhost:3000/students/${studentId.value}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseList.value)
    })

    const result = await response.json()
    message.value = response.ok ? `✅ 成功：${result.message}` : `❌ 錯誤：${result.error}`
  } catch (err) {
    message.value = '❌ 錯誤：伺服器無回應'
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
</style>
