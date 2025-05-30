const pool = require('../db/db')

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

    // Insert user into DB
    const newUser = await pool.query(
      'INSERT INTO owners (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstName, lastName, email, password]
    )

    res.status(201).json({ user: newUser.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
}

module.exports = { createUser }
