require('dotenv').config({ path: './backend/.env' }); // 確保加這行
const app = require('./app');

console.log("🕵️‍♂️ process.env.PORT =", process.env.PORT); // ← 加這行看看結果

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
