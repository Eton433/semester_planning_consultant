<template>
  <div class="container">
    <h2>學生選課規劃</h2>

    <h3>選課資訊</h3>
    <div v-for="(course, index) in courseList" :key="index" class="course-block">
      <label>課程選擇：
        <!-- ✅ 只顯示一個 select -->
        <select v-model="course.course_id" @change="onCourseSelected(index)">
          <option disabled value="">請選擇課程</option>
          <option v-for="c in allCourses" :key="c.course_id" :value="c.course_id">
            {{ c.course_id }} - {{ c.course_name }}
          </option>
        </select>
      </label>

      <!-- 🛑 已移除課程名稱 input -->

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

    <!-- ✅ 已選課清單 -->
    <div v-if="existingCourses.length > 0" style="margin-top: 40px;">
      <h3>📚 已選課清單</h3>
      <table border="1" cellpadding="8" style="border-collapse: collapse;">
        <thead>
          <tr>
            <th>課程代碼</th>
            <th>課程名稱</th>
            <th>學期</th>
            <th>期望成績</th>
            <th>預估時數</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in existingCourses" :key="course.course_id">
            <td>{{ course.course_id }}</td>
            <td>{{ course.course_name }}</td>
            <td>{{ course.semester }}</td>
            <td>{{ course.expected_grade }}</td>
            <td>{{ course.estimated_study_hours }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const studentId = ref(localStorage.getItem('student_id') || '')
const message = ref('')
const allCourses = ref([])
const existingCourses = ref([])

const courseList = ref([
  {
    course_id: '',
    course_name: '',
    semester: '',
    expected_grade: '',
    estimated_study_hours: ''
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

function onCourseSelected(index) {
  const selectedId = courseList.value[index].course_id
  const course = allCourses.value.find(c => c.course_id == selectedId)
  if (course) {
    courseList.value[index].course_name = course.name // 儲存下來供後端使用
  }
}

async function fetchAllCourses() {
  try {
    const res = await fetch('http://localhost:3000/api/courses')
    allCourses.value = await res.json()
  } catch (err) {
    console.error('❌ 載入課程清單失敗', err)
  }
}

async function fetchExistingCourses() {
  if (!studentId.value) return

  try {
    const res = await fetch(`http://localhost:3000/students/${studentId.value}/courses/list`)
    existingCourses.value = await res.json()
  } catch (err) {
    console.error('❌ 載入已選課失敗', err)
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
    if (response.ok) {
      message.value = `✅ 成功：${result.message}`
      courseList.value = [] // 清空填寫區
      await fetchExistingCourses()
    } else {
      message.value = `❌ 錯誤：${result.error}`
    }
  } catch (err) {
    message.value = '❌ 錯誤：伺服器無回應'
  }
}

onMounted(() => {
  if (studentId.value) {
    fetchExistingCourses()
  }
  fetchAllCourses()
})
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
</style>
