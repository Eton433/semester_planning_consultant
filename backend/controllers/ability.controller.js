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
      'INSERT INTO Ability (ability_name, description, ability_level) VALUES (?, ?, ?)',
      [ability_name, description, ability_level]
    );
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
