const express = require('express');
const router = express.Router();
const { registerStudent } = require('../controllers/register.controller');

// 註冊功能路由：POST /api/register
router.post('/', registerStudent);

module.exports = router;
