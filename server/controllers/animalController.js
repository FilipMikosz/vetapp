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

const addAnimal = async (req, res) => {
  const ownerId = req.user.userId
  const { name, breed, birth_year, chip_number, kennel_name } = req.body

  if (!name) {
    return res.status(400).json({ error: 'Name is required' })
  }

  try {
    const result = await pool.query(
      `INSERT INTO animals (owner_id, name, breed, birth_year, chip_number, kennel_name)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, breed, birth_year, chip_number, kennel_name`,
      [
        ownerId,
        name,
        breed || null,
        birth_year || null,
        chip_number || null,
        kennel_name || null,
      ]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error adding animal:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

const deleteAnimal = async (req, res) => {
  const ownerId = req.user.userId
  const { id } = req.params

  try {
    // Delete only if the animal belongs to the logged-in owner
    const result = await pool.query(
      'DELETE FROM animals WHERE id = $1 AND owner_id = $2 RETURNING id',
      [id, ownerId]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Animal not found or unauthorized' })
    }

    res.status(200).json({ message: 'Animal deleted successfully', id })
  } catch (err) {
    console.error('Error deleting animal:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  getMyAnimals,
  addAnimal,
  deleteAnimal,
}
