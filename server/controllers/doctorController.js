const pool = require('../db/db')
require('dotenv').config()

const getAllDoctors = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, email FROM users WHERE role = 'doctor'"
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching doctors:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// ➕ Add doctor to logged-in user (owner)
const addDoctor = async (req, res) => {
  const ownerId = req.user.userId
  const { doctorId } = req.body

  try {
    // Check if already added
    const exists = await pool.query(
      'SELECT 1 FROM user_doctor WHERE owner_id = $1 AND doctor_id = $2',
      [ownerId, doctorId]
    )

    if (exists.rowCount > 0) {
      return res.status(400).json({ error: 'Doctor already added' })
    }

    await pool.query(
      'INSERT INTO user_doctor (owner_id, doctor_id) VALUES ($1, $2)',
      [ownerId, doctorId]
    )

    res.status(201).json({ message: 'Doctor added' })
  } catch (error) {
    console.error('Error adding doctor:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

const getMyDoctors = async (req, res) => {
  const ownerId = req.user.userId

  try {
    const result = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email
       FROM user_doctor ud
       JOIN users u ON ud.doctor_id = u.id
       WHERE ud.owner_id = $1`,
      [ownerId]
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching my doctors:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  getAllDoctors,
  addDoctor,
  getMyDoctors,
}
