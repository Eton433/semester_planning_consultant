<template>
  <div class="container">
    <h2>能力管理</h2>

    <form @submit.prevent="createAbility">
      <label>能力名稱：
        <input v-model="newAbility.ability_name" required />
      </label>
      <label>說明：
        <input v-model="newAbility.description" />
      </label>
      <label>能力等級（1~5）：
        <input type="number" v-model.number="newAbility.ability_level" min="1" max="5" />
      </label>
      <button type="submit">新增能力</button>
    </form>

    <hr />

    <h3>目前能力清單</h3>
    <ul>
      <li v-for="(ability, index) in abilities" :key="index">
        {{ ability.ability_name }}（等級：{{ ability.ability_level }}） - {{ ability.description }}
      </li>
    </ul>

    <div v-if="message" style="margin-top: 20px;"><strong>{{ message }}</strong></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const abilities = ref([])
const newAbility = ref({
  ability_name: '',
  description: '',
  ability_level: 1
})
const message = ref('')

const fetchAbilities = async () => {
  try {
    const res = await fetch('http://localhost:3000/abilities')
    abilities.value = await res.json()
  } catch (err) {
    message.value = '❌ 載入能力列表失敗'
  }
}

const createAbility = async () => {
  try {
    const res = await fetch('http://localhost:3000/abilities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAbility.value)
    })

    const result = await res.json()

    if (res.ok) {
      message.value = '✅ 新增成功'
      await fetchAbilities()  // 重新載入能力列表
      newAbility.value = { ability_name: '', description: '', ability_level: 1 }
    } else {
      message.value = `❌ 錯誤：${result.error}`
    }
  } catch (err) {
    message.value = '❌ 無法與伺服器連線'
  }
}

onMounted(fetchAbilities)
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: Arial;
}
label {
  display: block;
  margin: 8px 0;
}
</style>
