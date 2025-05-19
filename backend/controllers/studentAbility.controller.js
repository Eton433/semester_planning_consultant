// backend/controllers/studentAbility.controller.js
const db = require('../config/db');

const addStudentAbility = async (req, res) => {
  const { student_id, ability_id, ability_level, description } = req.body;

  console.log('📦 收到的資料:', req.body);

  try {
    await db.promise().query(
      `INSERT INTO Student_Ability (student_id, ability_id, ability_level, description)
       VALUES (?, ?, ?, ?)`,
      [student_id, ability_id, ability_level, description]
    );

    res.status(201).json({ message: '✅ 能力已新增至學生資料表' });
  } catch (error) {
    console.error('❌ 新增失敗:', error);
    res.status(500).json({ error: '❌ 儲存資料錯誤' });
  }
};

module.exports = {
  addStudentAbility
};
