const express = require('express')
const router = express.Router()
const {
  createUser,
  loginUser,
  getUsers,
} = require('../controllers/userController')

router.post('/users/register', createUser)
router.post('/users/login', loginUser)
router.get('/users/getusers', getUsers)

module.exports = router
