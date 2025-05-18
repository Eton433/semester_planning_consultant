<template>
  <div>
    <h2>🏸 社團選擇與總覽</h2>

    <form @submit.prevent="submit">
      <h3>可選社團列表</h3>
      <div v-if="clubList.length === 0">載入中...</div>
      <div v-else>
        <div v-for="club in clubList" :key="club.activity_id">
          <label>
            <input
              type="checkbox"
              :value="club.activity_id"
              v-model="selected"
              :disabled="joinedIds.includes(club.activity_id)"
            />
            {{ club.activity_name }}（{{ club.weekly_time_commitment }} 小時/週）
            <span v-if="joinedIds.includes(club.activity_id)">✅ 已加入</span>
          </label>
        </div>

        <button type="submit">提交新增社團</button>
      </div>
    </form>

    <hr />

    <div>
      <h3>📋 已加入社團</h3>
      <ul v-if="joined.length > 0">
        <li v-for="club in joined" :key="club.activity_id">
          {{ club.activity_name }}（{{ club.weekly_time_commitment }} 小時/週）
        </li>
      </ul>
      <p v-else>尚未加入任何社團。</p>

      <p v-if="totalHours > 0">
        🎯 每週總社團時數：<strong>{{ totalHours }}</strong> 小時
      </p>
    </div>

    <p v-if="message" style="margin-top: 16px;"><strong>{{ message }}</strong></p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const studentId = 112306001
const clubList = ref([])
const selected = ref([])
const joined = ref([])
const message = ref('')

const joinedIds = computed(() => joined.value.map(c => c.activity_id))
const totalHours = computed(() => joined.value.reduce((sum, c) => sum + c.weekly_time_commitment, 0))

const fetchAll = async () => {
  const [clubsRes, joinedRes] = await Promise.all([
    fetch(`http://localhost:3000/clubs/activities`),
    fetch(`http://localhost:3000/clubs/${studentId}/activities/list`)
  ])
  clubList.value = await clubsRes.json()
  joined.value = await joinedRes.json()
}

const submit = async () => {
  const res = await fetch(`http://localhost:3000/clubs/${studentId}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(selected.value)
  })

  const result = await res.json()
  if (res.ok) {
    message.value = '✅ 新增社團成功！'
    selected.value = []
    await fetchAll()
  } else {
    message.value = `❌ 錯誤：${result.error}`
  }
}

onMounted(fetchAll)
</script>
