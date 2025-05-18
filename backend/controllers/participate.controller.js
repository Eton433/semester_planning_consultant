const db = require('../config/db');

// 取得所有社團清單
const getAllClubs = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM extracurricular_activity');
    res.json(rows);
  } catch (err) {
    console.error('載入社團失敗:', err);
    res.status(500).json({ error: '無法載入社團清單' });
  }
};
// 查詢某位學生參加的社團清單
const getStudentClubs = async (req, res) => {
  const studentId = req.params.id;

  try {
    const [rows] = await db.promise().query(
      `SELECT 
         ea.activity_id,
         ea.activity_name,
         ea.weekly_time_commitment
       FROM participate p
       JOIN extracurricular_activity ea ON p.activity_id = ea.activity_id
       WHERE p.student_id = ?`,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error('查詢學生社團失敗:', err);
    res.status(500).json({ error: '查詢失敗' });
  }
};


// 學生選擇社團（寫入 participate 表）
const selectClubs = async (req, res) => {
  const studentId = req.params.id;
  const activityIds = req.body; // e.g. [1, 2, 3]

  try {
    for (const activityId of activityIds) {
      await db.promise().query(
        `INSERT IGNORE INTO participate (student_id, activity_id) VALUES (?, ?)`,
        [studentId, activityId]
      );
    }
    res.status(201).json({ message: '社團選擇成功' });
  } catch (err) {
    console.error('新增社團參與失敗:', err);
    res.status(500).json({ error: '社團參與失敗' });
  }
};

module.exports = {
  getAllClubs,
  selectClubs,
  getStudentClubs
};
