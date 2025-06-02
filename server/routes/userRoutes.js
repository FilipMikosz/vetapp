const express = require('express')
const router = express.Router()
const {
  createUser,
  loginUser,
  getUsers,
  getUserProfile,
} = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/users/register', createUser)
router.post('/users/login', loginUser)
router.get('/users/getusers', getUsers)
router.get('/users/profile', authMiddleware, getUserProfile)

module.exports = router
