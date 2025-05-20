<template>
    <div class="p-4">
      <h2>Time Plan for Student {{ studentId }}</h2>
      <h3>平均成績: {{ avgScore }}</h3>
  
      <h4>每門課複習時數:</h4>
      <ul>
        <li v-for="(time, name) in courseReviewTimes" :key="name">
          {{ name }}: {{ time }} 小時/週
        </li>
      </ul>
  
      <h4>社團活動:</h4>
      <ul>
        <li v-for="activity in activities" :key="activity.activity_name">
          {{ activity.activity_name }} - {{ activity.weekly_time_commitment }} 小時/週
        </li>
      </ul>
  
      <h4>每週時間分配表格：</h4>
      <table border="1" class="table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Class (h)</th>
            <th>Review (h)</th>
            <th>Club (h)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(day, name) in weeklyPlan" :key="name">
            <td>{{ name }}</td>
            <td>{{ day.class_hours }}</td>
            <td>{{ day.review_hours }}</td>
            <td>{{ day.club_hours }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const studentId = 112306055; // 或從 localStorage 拿：localStorage.getItem('student_id')
  const avgScore = ref(0);
  const courseReviewTimes = ref({});
  const activities = ref([]);
  const weeklyPlan = ref({});
  
  onMounted(async () => {
    try {
      const res = await axios.get(`/api/time-plan/${studentId}`);
      avgScore.value = res.data.avg_score;
      courseReviewTimes.value = res.data.courseReviewTimes;
      activities.value = res.data.activities;
      weeklyPlan.value = res.data.weeklyPlan;
    } catch (err) {
      console.error('❌ 無法載入 Time Plan:', err);
      alert('載入失敗，請確認資料是否齊全');
    }
  });
  </script>
  