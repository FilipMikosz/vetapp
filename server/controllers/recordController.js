const pool = require('../db/db')

// GET /api/records/:userId
const getAnimalRecordsByUserId = async (req, res) => {
  const userId = req.params.userId

  try {
    // Step 1: Get all animals owned by the user
    const animalsResult = await pool.query(
      'SELECT * FROM animals WHERE owner_id = $1',
      [userId]
    )

    const animals = animalsResult.rows

    // If no animals, return empty array with 200 OK
    if (animals.length === 0) {
      return res.status(200).json([])
    }

    // Step 2: For each animal, get related records
    const records = await Promise.all(
      animals.map(async (animal) => {
        const [
          litters,
          illnesses,
          vaccinations,
          prescriptions,
          administeredMeds,
          imaging,
          labTests,
          specialNotes,
          visits,
        ] = await Promise.all([
          pool.query('SELECT * FROM litters WHERE animal_id = $1', [animal.id]),
          pool.query('SELECT * FROM illnesses WHERE animal_id = $1', [
            animal.id,
          ]),
          pool.query('SELECT * FROM vaccinations WHERE animal_id = $1', [
            animal.id,
          ]),
          pool.query('SELECT * FROM prescriptions WHERE animal_id = $1', [
            animal.id,
          ]),
          pool.query(
            'SELECT * FROM administered_medications WHERE animal_id = $1',
            [animal.id]
          ),
          pool.query('SELECT * FROM imaging WHERE animal_id = $1', [animal.id]),
          pool.query('SELECT * FROM lab_tests WHERE animal_id = $1', [
            animal.id,
          ]),
          pool.query('SELECT * FROM special_notes WHERE animal_id = $1', [
            animal.id,
          ]),
          pool.query('SELECT * FROM visits WHERE animal_id = $1', [animal.id]),
        ])

        return {
          animal,
          litters: litters.rows,
          illnesses: illnesses.rows,
          vaccinations: vaccinations.rows,
          prescriptions: prescriptions.rows,
          administered_medications: administeredMeds.rows,
          imaging: imaging.rows,
          lab_tests: labTests.rows,
          special_notes: specialNotes.rows,
          visits: visits.rows,
        }
      })
    )

    res.json(records)
  } catch (error) {
    console.error('Error fetching animal records:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = {
  getAnimalRecordsByUserId,
}
