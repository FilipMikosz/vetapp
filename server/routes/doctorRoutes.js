const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const {
  getAllDoctors,
  addDoctor,
  getMyDoctors,
  removeDoctor,
} = require('../controllers/doctorController')

router.get('/all', authMiddleware, getAllDoctors)
router.get('/mine', authMiddleware, getMyDoctors)
router.post('/add', authMiddleware, addDoctor)
router.delete('/remove', authMiddleware, removeDoctor)

module.exports = router
