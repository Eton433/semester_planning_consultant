const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 測試首頁路由
app.get('/', (req, res) => {
  res.send('Semester Planning Consultant Backend is running!');
});

module.exports = app;
