const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const courseRoutes = require('./routes/course.route');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/courses', courseRoutes);

// 測試首頁路由
app.get('/', (req, res) => {
  res.send('Semester Planning Consultant Backend is running!');
});

module.exports = app;
