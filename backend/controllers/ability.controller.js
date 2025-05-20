const db = require('../config/db');

const getAllAbilities = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM Ability');
    res.json(rows);
  } catch (error) {
    console.error('查詢失敗:', error);
    res.status(500).json({ error: '資料查詢錯誤' });
  }
};

const createAbility = async (req, res) => {
  const { ability_name, description, ability_level } = req.body;

  try {
   await db.promise().query(
  `INSERT INTO Student_Ability
     (student_id, ability_id, ability_level, description)
   VALUES (?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE
     ability_level = VALUES(ability_level),
     description   = VALUES(description);`,
  [studentId, abilityId, level, desc]
  )
    res.status(201).json({ message: '新增能力成功' });
  } catch (error) {
    console.error('新增失敗:', error);
    res.status(500).json({ error: '新增資料錯誤' });
  }
};

module.exports = {
  getAllAbilities,
  createAbility
};
