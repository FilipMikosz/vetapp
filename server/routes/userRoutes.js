const express = require('express')
const router = express.Router()
const { createUser } = require('../controllers/userController')

router.post('/users', createUser)

// router.post('/users', (req, res) => {
//   const { firstName, lastName, email, password } = req.body
//   if (!firstName || !lastName || !email || !password) {
//     return res.status(400).json({ error: 'Please fill all required fields.' })
//   }
//   res.send('User created successfully!')
// })

router.get('/users', (req, res) => {
  res.status(200).json({ message: 'GET request to /users' })
})

module.exports = router
