const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const {
  getAllDoctors,
  addDoctor,
  getMyDoctors,
} = require('../controllers/doctorController')

router.get('/all', authMiddleware, getAllDoctors)
router.post('/add', authMiddleware, addDoctor)
router.get('/mine', authMiddleware, getMyDoctors)

module.exports = router
