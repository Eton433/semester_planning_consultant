const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const courseRoutes = require('./routes/course.route');
const studentRoutes = require('./routes/students.route'); // 注意檔名對不對
const abilityRoutes = require('./routes/ability.route');
const participateRoutes = require('./routes/participate.route');
const app = express();
const authRoutes = require('./routes/auth.route');
// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/courses', courseRoutes);
app.use('/students', studentRoutes); // 非常關鍵：URL prefix 是 /students
app.use('/abilities', abilityRoutes);
app.use('/clubs', participateRoutes);
app.use('/auth', authRoutes);
// 測試首頁路由
app.get('/', (req, res) => {
  res.send('Semester Planning Consultant Backend is running!');
});




module.exports = app;
