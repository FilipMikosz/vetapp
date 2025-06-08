const pool = require('../db/db')
require('dotenv').config()

const getMyAnimals = async (req, res) => {
  const ownerId = req.user.userId

  try {
    const result = await pool.query(
      'SELECT id, name, breed, birth_year, chip_number, kennel_name FROM animals WHERE owner_id = $1',
      [ownerId]
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching animals:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  getMyAnimals,
}
