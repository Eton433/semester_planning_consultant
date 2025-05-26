const db = require('../config/db');

const addStudentCourses = async (req, res) => {
  const studentId = req.params.id;
  const courses = req.body;

  try {
    for (const course of courses) {
      const { course_id, expected_grade, estimated_study_hours, semester } = course;

      await db.promise().query(
        `INSERT INTO student_course_selection (student_id, course_id, expected_grade, estimated_study_hours)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           expected_grade = VALUES(expected_grade),
           estimated_study_hours = VALUES(estimated_study_hours)
        `,
        [studentId, course_id, expected_grade, estimated_study_hours, semester]
      );
    }

    res.status(201).json({ message: '選課成功' });
  } catch (error) {
    console.error('新增選課失敗:', error);
    res.status(500).json({ error: '新增選課失敗' });
  }
};

const getStudentCourses = async (req, res) => {
  const studentId = req.params.id;

  try {
    const [rows] = await db.promise().query(`
      SELECT s.course_id, c.course_name, s.expected_grade, s.estimated_study_hours
      FROM student_course_selection s
      JOIN course c ON s.course_id = c.course_id
      WHERE s.student_id = ?
    `, [studentId]);

    res.json(rows);
  } catch (err) {
    console.error('查詢選課失敗:', err);
    res.status(500).json({ error: '查詢選課失敗' });
  }
};

module.exports = {
  addStudentCourses,
  getStudentCourses,
};
