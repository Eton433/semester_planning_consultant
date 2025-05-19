const express = require('express');
const router = express.Router();
const { addStudentAbility } = require('../controllers/studentAbility.controller');

router.post('/student-ability', addStudentAbility);

module.exports = router;
