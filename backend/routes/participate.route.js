const express = require('express');
const router = express.Router();
const participateController = require('../controllers/participate.controller');

// 取得所有社團清單
router.get('/activities', participateController.getAllClubs);

// 學生提交選擇的社團
router.post('/:id/activities', participateController.selectClubs);

router.get('/:id/activities/list', participateController.getStudentClubs);


module.exports = router;
