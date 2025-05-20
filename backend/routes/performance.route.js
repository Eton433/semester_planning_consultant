const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performance.controller');

router.post('/', performanceController.addPerformance);
router.get('/:student_id', performanceController.getPerformanceByStudent);

module.exports = router;
