const express = require('express')
const router = express.Router()
const {
  createUser,
  loginUser,
  getUsers,
  getUserProfile,
  getUsernameById,
} = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/getusers', getUsers)
router.get('/profile', authMiddleware, getUserProfile)
router.get('/username/:userId', authMiddleware, getUsernameById)

module.exports = router
