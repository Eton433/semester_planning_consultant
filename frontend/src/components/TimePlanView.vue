<template>
    <div class="app-background">
      <div class="container">
        <div class="header">
          <h2 class="title">⏰ 學生時間規劃</h2>
          
        </div>
  
        <!-- 平均成績卡片 -->
        <div class="stats-section">
          <div class="stats-card score-card">
            <div class="stats-icon">📊</div>
            <div class="stats-content">
              <h3 class="stats-title">平均成績</h3>
              <div class="stats-value">{{ avgScore }}</div>
            </div>
          </div>
        </div>
  
        <!-- 課程複習時數 -->
        <div class="section">
          <div class="section-header">
            <h3 class="section-title">📚 每門課複習時數</h3>
          </div>
          <div class="courses-grid">
            <div v-for="(time, name) in courseReviewTimes" :key="name" class="course-card">
              <div class="course-name">{{ name }}</div>
              <div class="course-time">{{ time }} 小時/週</div>
            </div>
          </div>
        </div>
  
        <!-- 社團活動 -->
        <div class="section">
          <div class="section-header">
            <h3 class="section-title">🎭 社團活動</h3>
          </div>
          <div class="activities-grid">
            <div v-for="activity in activities" :key="activity.activity_name" class="activity-card">
              <div class="activity-name">{{ activity.activity_name }}</div>
              <div class="activity-time">{{ activity.weekly_time_commitment }} 小時/週</div>
            </div>
          </div>
        </div>
  
        <!-- 每週時間分配表格 -->
        <div class="section">
          <div class="section-header">
            <h3 class="section-title">🗓️ 每週時間分配表</h3>
          </div>
          <div class="table-container">
            <table class="schedule-table">
              <thead>
                <tr>
                  <th class="table-header">星期</th>
                  <th class="table-header">上課 (小時)</th>
                  <th class="table-header">複習 (小時)</th>
                  <th class="table-header">社團 (小時)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(day, name) in weeklyPlan" :key="name" class="table-row">
                  <td class="table-cell day-cell">{{ name }}</td>
                  <td class="table-cell">{{ day.class_hours }}</td>
                  <td class="table-cell">{{ day.review_hours }}</td>
                  <td class="table-cell">{{ day.club_hours }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const studentId = {studentId};
  const avgScore = ref(0);
  const courseReviewTimes = ref({});
  const activities = ref([]);
  const weeklyPlan = ref({});
  
  onMounted(async () => {
    const res = await axios.get(`/api/time-plan/${studentId}`);
    avgScore.value = res.data.avg_score;
    courseReviewTimes.value = res.data.courseReviewTimes;
    activities.value = res.data.activities;
    weeklyPlan.value = res.data.weeklyPlan;
  });
  </script>
  
  <style scoped>
  .app-background {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .container {
    max-width: 1000px;
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
  
  .student-info {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1em;
    font-weight: 500;
    position: relative;
    z-index: 1;
  }
  
  .stats-section {
    padding: 30px 40px;
    background: linear-gradient(145deg, #f8f9ff 0%, #e8f4f8 100%);
  }
  
  .stats-card {
    background: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 300px;
    margin: 0 auto;
    transition: all 0.3s ease;
  }
  
  .stats-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  .stats-icon {
    font-size: 3em;
    margin-right: 20px;
  }
  
  .stats-content {
    text-align: left;
  }
  
  .stats-title {
    color: #2d3748;
    font-size: 1.2em;
    font-weight: 600;
    margin: 0 0 8px 0;
  }
  
  .stats-value {
    color: #667eea;
    font-size: 2.5em;
    font-weight: 700;
    margin: 0;
  }
  
  .section {
    padding: 40px;
    background: linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%);
    border-top: 1px solid rgba(255, 255, 255, 0.5);
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .section-title {
    color: #2d3748;
    font-size: 1.8em;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .courses-grid, .activities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .course-card, .activity-card {
    background: white;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    text-align: center;
  }
  
  .course-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
  
  .activity-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .course-card:hover, .activity-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  .course-name, .activity-name {
    font-size: 1.3em;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 12px;
  }
  
  .course-time, .activity-time {
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 1em;
    font-weight: 600;
  }
  
  .table-container {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .schedule-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 16px;
  }
  
  .table-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 16px;
    text-align: center;
    font-weight: 700;
    font-size: 1.1em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .table-row {
    transition: all 0.3s ease;
  }
  
  .table-row:hover {
    background: linear-gradient(135deg, rgba(79, 172, 254, 0.05) 0%, rgba(0, 242, 254, 0.05) 100%);
  }
  
  .table-row:nth-child(even) {
    background: rgba(248, 249, 255, 0.7);
  }
  
  .table-row:nth-child(even):hover {
    background: linear-gradient(135deg, rgba(79, 172, 254, 0.08) 0%, rgba(0, 242, 254, 0.08) 100%);
  }
  
  .table-cell {
    padding: 18px 16px;
    text-align: center;
    border-bottom: 1px solid rgba(226, 232, 240, 0.5);
    color: #4a5568;
    font-weight: 500;
  }
  
  .day-cell {
    font-weight: 700;
    color: #2d3748;
    background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%);
  }
  
  /* 響應式設計 */
  @media (max-width: 768px) {
    .app-background {
      padding: 10px;
    }
    
    .section {
      padding: 20px;
    }
    
    .stats-section {
      padding: 20px;
    }
    
    .courses-grid, .activities-grid {
      grid-template-columns: 1fr;
    }
    
    .title {
      font-size: 1.8em;
    }
    
    .stats-card {
      flex-direction: column;
      text-align: center;
    }
    
    .stats-icon {
      margin-right: 0;
      margin-bottom: 15px;
    }
    
    .stats-content {
      text-align: center;
    }
    
    .schedule-table {
      font-size: 14px;
    }
    
    .table-header, .table-cell {
      padding: 12px 8px;
    }
  }
  
  @media (max-width: 480px) {
    .schedule-table {
      font-size: 12px;
    }
    
    .table-header, .table-cell {
      padding: 10px 6px;
    }
    
    .section-title {
      font-size: 1.5em;
    }
  }
  </style>