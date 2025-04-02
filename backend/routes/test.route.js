const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller');

router.get('/ping', testController.ping);

module.exports = router;
