// backend/controllers/studentAbility.controller.js
const db = require('../config/db');

const addStudentAbility = async (req, res) => {
  const { student_id, ability_id, ability_level, description } = req.body;

  console.log('📦 收到的資料:', req.body);

  try {
    await db.promise().query(
      `INSERT INTO Student_Ability (student_id, ability_id, ability_level, description)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         ability_level = VALUES(ability_level), 
         description = VALUES(description)`,
      [student_id, ability_id, ability_level, description]
    );

    res.status(201).json({ message: '✅ 能力已新增或更新至學生資料表' });
  } catch (error) {
    console.error('❌ 新增失敗:', error);
    res.status(500).json({ error: '❌ 儲存資料錯誤' });
  }
};

const getStudentAbilities = async (req, res) => {
  const { student_id } = req.params;

  try {
    const [results] = await db.promise().query(
      `SELECT 
         a.ability_id, 
         a.ability_name, 
         sa.ability_level, 
         sa.description
       FROM Student_Ability sa
       JOIN Ability a ON sa.ability_id = a.ability_id
       WHERE sa.student_id = ?`,
      [student_id]
    );

    res.json({ abilities: results });
  } catch (error) {
    console.error('❌ 查詢能力失敗:', error);
    res.status(500).json({ error: '❌ 查詢學生能力時發生錯誤' });
  }
};

module.exports = {
  addStudentAbility
  ,getStudentAbilities
};
