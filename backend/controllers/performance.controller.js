const db = require('../config/db');

// ✅ 回傳所有課程（給下拉選單用）
const getAllCourses = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT course_id, course_name FROM course'
    );
    res.json(rows);
  } catch (error) {
    console.error('查詢課程失敗:', error);
    res.status(500).json({ error: '課程資料查詢失敗' });
  }
};

// ✅ 新增或更新成績
const addPerformance = async (req, res) => {
  const { student_id, course_id, course_score, performance_info } = req.body;

  try {
    await db.promise().query(
      `INSERT INTO Performance (student_id, course_id, course_score, performance_info)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         course_score = VALUES(course_score),
         performance_info = VALUES(performance_info)`,
      [student_id, course_id, course_score, performance_info || null]
    );

    res.status(201).json({ message: '成績新增或更新成功！' });
  } catch (error) {
    console.error('新增成績失敗:', error);
    res.status(500).json({ error: '新增失敗' });
  }
};

// ✅ 查詢某學生已輸入的所有成績
const getPerformanceByStudent = async (req, res) => {
  const { student_id } = req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT p.course_id, c.course_name, p.course_score
       FROM Performance p
       JOIN Course c ON p.course_id = c.course_id
       WHERE p.student_id = ?`,
      [student_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('查詢成績失敗:', error);
    res.status(500).json({ error: '查詢失敗' });
  }
};

module.exports = {
  getAllCourses,
  addPerformance,
  getPerformanceByStudent
};
