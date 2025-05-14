const db = require('../config/db');

exports.getAllCourses = (req, res) => {
  const sql = 'SELECT * FROM course';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Failed to fetch courses:', err);
      return res.status(500).json({ error: '資料讀取失敗' });
    }
    res.json(results);
  });
};
