const db = require('../config/db');

// ✅ 只選取下拉式選單需要的欄位
exports.getAllCourses = (req, res) => {
  const sql = 'SELECT course_id, course_name FROM course';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ 課程查詢失敗:', err);
      return res.status(500).json({ error: '資料讀取失敗' });
    }

    console.log('✅ 傳回的課程資料:', results);
    res.json(results);
  });
};
