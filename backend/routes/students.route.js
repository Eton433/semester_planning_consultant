const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// POST /students/:id/courses → 提交選課
router.post('/:id/courses', studentController.addStudentCourses);

module.exports = router;
