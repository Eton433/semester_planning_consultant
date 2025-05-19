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
  <div class="container">
    <h2>🎓 學生能力選擇</h2>

    <form @submit.prevent="createStudentAbility">
      <label>選擇能力：
        <select v-model.number="newAbility.ability_id" required>
          <option disabled value="">請選擇</option>
          <option v-for="a in abilities" :key="a.ability_id" :value="a.ability_id">
            {{ a.ability_name }}
          </option>
        </select>
      </label>

      <label>說明：
        <input v-model="newAbility.description" placeholder="自訂說明" />
      </label>

      <label>能力等級（1~5）：
        <input type="number" v-model.number="newAbility.ability_level" min="1" max="5" />
      </label>

      <button type="submit">提交</button>
    </form>

    <div v-if="message" class="msg"><strong>{{ message }}</strong></div>

    <hr />
    <h3>📋 能力清單</h3>
    <ul>
      <li v-for="a in abilities" :key="a.ability_id">
        {{ a.ability_name }}（等級：{{ a.ability_level }}） - {{ a.description }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  max-width: 600px;
  margin: auto;
  font-family: Arial;
  background-color: #f9f9ff;
  border: 1px solid #ccc;
  border-radius: 8px;
}

form label {
  display: block;
  margin-bottom: 12px;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 6px;
  margin-top: 4px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  padding: 8px 16px;
  margin-top: 12px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #3367d6;
}

.msg {
  margin-top: 16px;
  color: #d93025;
  font-weight: bold;
}
</style>
