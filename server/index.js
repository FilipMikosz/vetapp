const express = require('express')
const pool = require('./db/db')
const userRoutes = require('./routes/userRoutes')
require('dotenv').config()

const app = express()
app.use(express.json())

app.use('/api', userRoutes)

app.get('/', (req, res) => {
  res.send('VetApp backend is running!')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:3000')
})
