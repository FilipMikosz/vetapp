// server.js
const express = require('express')
const pool = require('./db/db')

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('VetApp backend is running!')
})

// Example route: get all dogs
app.get('/dogs', async (req, res) => {
  const result = await pool.query('SELECT * FROM dogs')
  res.json(result.rows)
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
