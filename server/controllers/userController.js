const pool = require('../db/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const createUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Please fill all required fields.' })
  }

  try {
    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM owners WHERE email = $1',
      [email]
    )
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists.' })
    }

    // TODO: hash password here with bcrypt (we'll add it later)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user into DB
    const newUser = await pool.query(
      'INSERT INTO owners (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstName, lastName, email, hashedPassword]
    )

    res.status(201).json({ user: newUser.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'Please enter both email and password' })
  }

  try {
    const userResult = await pool.query(
      'SELECT * FROM owners WHERE email = $1',
      [email]
    )

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = userResult.rows[0]
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    res.json({ message: 'Login successful', token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { createUser, loginUser }
