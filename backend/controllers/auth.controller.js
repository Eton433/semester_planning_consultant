const db = require('../config/db');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM Student WHERE student_id = ? AND password = ?',
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: '帳號或密碼錯誤' });
    }

    res.status(200).json({ message: '登入成功', user: rows[0] });
  } catch (error) {
    console.error('登入失敗:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

module.exports = { login };
