const express = require('express');
const router = express.Router();
const abilityController = require('../controllers/ability.controller');

// 取得所有能力
router.get('/', abilityController.getAllAbilities);

// 新增一個能力
router.post('/', abilityController.createAbility);

module.exports = router;
