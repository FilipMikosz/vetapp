const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { getAllDoctors } = require('../controllers/doctorController')

router.get('/all', authMiddleware, getAllDoctors)

module.exports = router
