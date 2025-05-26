// routes/studentAbility.route.js
const express = require('express');
const router = express.Router();

// ✅ 正確一起引入
const {
  addStudentAbility,
  getStudentAbilities
} = require('../controllers/studentAbility.controller');

// ✅ 設定路由
router.post('/student-ability', addStudentAbility);
router.get('/student-abilities/:student_id', getStudentAbilities);

module.exports = router;
