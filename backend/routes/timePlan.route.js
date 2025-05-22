const express = require('express')
const router  = express.Router()
const { getTimePlan } = require('../controllers/timePlan.controller')

// ✅ 加上 /time-plan 前綴
router.get('/time-plan/:id', getTimePlan)

module.exports = router
