const express = require('express')
const router = express.Router()
const { getAnimalRecordsByUserId } = require('../controllers/recordController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/:userId', authMiddleware, getAnimalRecordsByUserId)

module.exports = router
