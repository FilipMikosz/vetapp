const express = require('express')
const pool = require('./db/db')
const userRoutes = require('./routes/userRoutes')
const recordRoutes = require('./routes/recordRoutes')
const doctorRoutes = require('./routes/doctorRoutes')
const cors = require('cors')

require('dotenv').config()

const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173', // frontend origin here
    credentials: true, // enable Set-Cookie headers and cookies
  })
)
app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/records', recordRoutes)
app.use('/api/doctors', doctorRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:3000')
})
