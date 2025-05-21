const db = require('../config/db');

exports.getAllCourses = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM course');
    res.json(rows);
  } catch (err) {
    console.error('❌ Failed to fetch courses:', err); // Or a more generic message
    res.status(500).json({ error: '資料讀取失敗' }); // Or a more generic message
  }
};
exports.getCourseById = async (req, res) => {
  const courseId = req.params.id;

  try {
    const [rows] = await db.promise().query(
      'SELECT name FROM course WHERE course_id = ?',
      [courseId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: '查無此課程' });
    }

    res.json(rows[0]); // 回傳 { name: '課程名稱' }
  } catch (err) {
    console.error('查詢課程失敗:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
};

