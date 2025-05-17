const db = require('../config/db');

const addStudentCourses = async (req, res) => {
  const studentId = req.params.id;
  const courses = req.body;

  try {
    for (const course of courses) {
      const { course_id, semester, expected_grade, estimated_study_hours } = course;

      await db.promise().query(
        `INSERT INTO Student_Course_Selection (student_id, course_id, semester, expected_grade, estimated_study_hours)
         VALUES (?, ?, ?, ?, ?)`,
        [studentId, course_id, semester, expected_grade, estimated_study_hours]
      );
    }

    res.status(201).json({ message: '選課成功' });
  } catch (error) {
    console.error('新增選課失敗:', error);
    res.status(500).json({ error: '新增選課失敗' });
  }
};

module.exports = {
  addStudentCourses
};
