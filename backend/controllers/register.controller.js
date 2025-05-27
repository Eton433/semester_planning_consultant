const db = require('../config/db');

// ✅ 註冊學生帳號（含 major, weekly_available_hours）
const registerStudent = async (req, res) => {
  const {
    student_id,
    name,
    email, // 若未使用可省略
    password,
    major,
    weekly_available_hours,
  } = req.body;

  // 檢查欄位完整性
  if (
    !student_id ||
    !name ||
    !password ||
    !major ||
    weekly_available_hours === undefined
  ) {
    return res.status(400).json({ error: '❌ 缺少必要欄位' });
  }

  try {
    // 查重學號
    const [existing] = await db
      .promise()
      .query('SELECT * FROM student WHERE student_id = ?', [student_id]);

    if (existing.length > 0) {
      return res.status(409).json({ error: '此學號已註冊' });
    }

    // 插入新學生資料
    await db.promise().query(
      `INSERT INTO student (student_id, name, major, weekly_available_hours, password)
       VALUES (?, ?, ?, ?, ?)`,
      [student_id, name, major, weekly_available_hours, password]
    );

    res.status(201).json({ message: '✅ 註冊成功' });
  } catch (err) {
    console.error('❌ 註冊失敗:', err);
    res.status(500).json({ error: '❌ 伺服器內部錯誤' });
  }
};

module.exports = {
  registerStudent,
};
