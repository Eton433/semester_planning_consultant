const express = require('express');
const router = express.Router();
const db = require('../config/db'); // ✅ 加上這行：引入資料庫模組

// ✅ GET /api/courses：前端下拉選單會呼叫這裡
router.get('/', (req, res) => {
  const sql = 'SELECT course_id, course_name FROM course';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ 課程查詢失敗:', err);
      return res.status(500).json({ error: '資料庫錯誤' });
    }
    res.json(results);
  });
});

module.exports = router;
