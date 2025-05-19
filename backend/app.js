const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const courseRoutes = require('./routes/course.route');
const studentRoutes = require('./routes/students.route');
const abilityRoutes = require('./routes/ability.route');
const participateRoutes = require('./routes/participate.route');
const authRoutes = require('./routes/auth.route');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API 路由掛載
app.use('/api/courses', courseRoutes);         // 課程資料，供下拉式選單載入
app.use('/students', studentRoutes);           // 學生提交選課用
app.use('/abilities', abilityRoutes);          // 能力管理
app.use('/clubs', participateRoutes);          // 社團活動
app.use('/auth', authRoutes);                  // 登入驗證

// ✅ 測試首頁
app.get('/', (req, res) => {
  res.send('Semester Planning Consultant Backend is running!');
});

// ✅ 啟動伺服器（建議你在此檔案就啟動）
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 伺服器已啟動：http://localhost:${PORT}`);
});

module.exports = app;





module.exports = app;
