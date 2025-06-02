const express = require('express')
const router = express.Router()
const {
  createUser,
  loginUser,
  getUsers,
  getUserProfile,
} = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/getusers', getUsers)
router.get('/profile', authMiddleware, getUserProfile)

module.exports = router
