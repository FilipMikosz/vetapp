const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { getMyAnimals } = require('../controllers/animalController')

router.get('/mine', authMiddleware, getMyAnimals)

module.exports = router
