// routes/timePlan.route.js
const express = require('express');
const router = express.Router();
const { getTimePlan } = require('../controllers/timePlan.controller');

router.get('/:id', getTimePlan);

module.exports = router;
