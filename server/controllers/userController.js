const pool = require('../db/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const createUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body

  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ error: 'Please fill all required fields.' })
  }

  try {
    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists.' })
    }

    // TODO: hash password here with bcrypt (we'll add it later)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user into DB
    const newUser = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [firstName, lastName, email, hashedPassword, role]
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
      'SELECT * FROM users WHERE email = $1',
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

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    )

    res.json({ message: 'Login successful', token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE role = $1', [
      'owner',
    ])
    res.status(200).json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getUserProfile = async (req, res) => {
  try {
    // userId comes from authMiddleware via req.user
    const userId = req.user.userId

    // Get user info from DB
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, role FROM users WHERE id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
}

const getUsernameById = async (req, res) => {
  const userId = req.params.userId

  try {
    const result = await pool.query(
      'SELECT first_name, last_name FROM users WHERE id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = result.rows[0]
    res.json({ firstName: user.first_name, lastName: user.last_name })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  createUser,
  loginUser,
  getUsers,
  getUserProfile,
  getUsernameById,
}
