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
const studentAbilityRoutes = require('./routes/studentAbility.route');
const performanceRoutes = require('./routes/performance.route');
const timePlanRoutes = require('./routes/timePlan.route');
app.use('/api/time-plan', timePlanRoutes);


// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes); // 非常關鍵：URL prefix 是 /students
app.use('/api/abilities', abilityRoutes);
app.use('/api/clubs', participateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', studentAbilityRoutes);
app.use('/api/performance', performanceRoutes);
// 測試首頁路由
app.get('/', (req, res) => {
  res.send('Semester Planning Consultant Backend is running!');
});




module.exports = app;
