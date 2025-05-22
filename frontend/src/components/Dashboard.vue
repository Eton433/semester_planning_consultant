<template>
  <div class="container">
    <!-- 頁面標題區塊 -->
    <div class="header">
      <h1>Dashboard 首頁</h1>
      <p>歡迎回來！這裡是您的數據總覽中心，一目了然掌握所有重要指標和最新動態。</p>
    </div>

    <!-- 統計數據卡片 -->
    <div class="stats-grid">
      <div class="stat-card blue">
        <h3>總訪問量</h3>
        <div class="stat-number">12,847</div>
        <div class="stat-change positive">↗ +8.2% 本週</div>
      </div>
      <div class="stat-card green">
        <h3>新用戶</h3>
        <div class="stat-number">1,205</div>
        <div class="stat-change positive">↗ +12.5% 本週</div>
      </div>
      <div class="stat-card orange">
        <h3>轉換率</h3>
        <div class="stat-number">3.8%</div>
        <div class="stat-change negative">↘ -2.1% 本週</div>
      </div>
      <div class="stat-card purple">
        <h3>營收</h3>
        <div class="stat-number">$28.4K</div>
        <div class="stat-change positive">↗ +15.3% 本週</div>
      </div>
    </div>

    <!-- 內容區塊 -->
    <div class="content-grid">
      <div class="chart-card">
        <h3 class="card-title">📊 流量趨勢分析</h3>
        <div class="chart-placeholder loading-animation">
          互動式圖表將在此顯示<br />
          <small>可整合 Chart.js 或其他圖表庫</small>
        </div>
      </div>

      <div class="activity-card">
        <h3 class="card-title">🔔 最新動態</h3>
        <div class="activity-item">
          <div class="activity-icon blue">📈</div>
          <div class="activity-content">
            <h4>流量突破新高</h4>
            <p>今日訪問量達到新紀錄</p>
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-icon green">✅</div>
          <div class="activity-content">
            <h4>系統更新完成</h4>
            <p>新功能已上線運行</p>
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-icon orange">⚠️</div>
          <div class="activity-content">
            <h4>伺服器維護通知</h4>
            <p>預計明日凌晨進行</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作按鈕 -->
    <div class="quick-actions">
      <button class="action-btn">📊 查看詳細報告</button>
      <button class="action-btn">👥 用戶管理</button>
      <button class="action-btn">⚙️ 系統設定</button>
      <button class="action-btn">📨 發送通知</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  mounted() {
    const statCards = document.querySelectorAll(".stat-card");
    statCards.forEach((card) => {
      card.addEventListener("click", function () {
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
        }, 150);
      });
    });

    const actionBtns = document.querySelectorAll(".action-btn");
    actionBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        alert("功能開發中，敬請期待！");
      });
    });

    setInterval(() => {
      const numbers = document.querySelectorAll(".stat-number");
      numbers.forEach((num) => {
        num.style.transform = "scale(1.05)";
        setTimeout(() => {
          num.style.transform = "scale(1)";
        }, 200);
      });
    }, 10000);
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.header h1 {
  color: #333;
  font-size: 2.5em;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header p {
  color: #666;
  font-size: 1.1em;
  line-height: 1.6;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 4px solid;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.stat-card.blue { border-left-color: #3498db; }
.stat-card.green { border-left-color: #27ae60; }
.stat-card.orange { border-left-color: #f39c12; }
.stat-card.purple { border-left-color: #9b59b6; }

.stat-card h3 {
  color: #333;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  opacity: 0.8;
}

.stat-number {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-card.blue .stat-number { color: #3498db; }
.stat-card.green .stat-number { color: #27ae60; }
.stat-card.orange .stat-number { color: #f39c12; }
.stat-card.purple .stat-number { color: #9b59b6; }

.stat-change {
  font-size: 0.9em;
  display: flex;
  align-items: center;
  gap: 5px;
}

.stat-change.positive { color: #27ae60; }
.stat-change.negative { color: #e74c3c; }

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card,
.activity-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card-title {
  color: #333;
  font-size: 1.3em;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.chart-placeholder {
  height: 250px;
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.1em;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-weight: bold;
  color: white;
}

.activity-icon.blue { background: #3498db; }
.activity-icon.green { background: #27ae60; }
.activity-icon.orange { background: #f39c12; }

.activity-content h4 {
  color: #333;
  margin-bottom: 5px;
}

.activity-content p {
  color: #666;
  font-size: 0.9em;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.action-btn {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 15px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-size: 1em;
  font-weight: 500;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 2em;
  }

  .stat-number {
    font-size: 2em;
  }
}

.loading-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}
</style>
