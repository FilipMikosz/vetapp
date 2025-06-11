const pool = require('../db/db')

const allowedTables = {
  litters: ['year', 'description'],
  illnesses: ['name', 'date', 'notes'],
  vaccinations: ['name', 'date', 'mandatory'],
  prescriptions: ['medication_name', 'dosage', 'date_prescribed', 'notes'],
  administered_medications: ['medication_name', 'dosage', 'date_administered'],
  imaging: ['type', 'image_url', 'date', 'description'],
  lab_tests: ['test_name', 'result', 'date', 'document_url'],
  special_notes: ['note', 'date_added'],
  visits: ['doctor_id', 'visit_date', 'reason', 'notes'],
}

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

const insertAnimalRecord = async (req, res) => {
  const { animalId, tableName } = req.params
  const fields = allowedTables[tableName]
  // const user = req.user

  if (!fields) {
    return res.status(400).json({ error: 'Invalid table name' })
  }

  const data = req.body

  // Build SQL
  const columns = ['animal_id', ...fields]
  const values = [animalId, ...fields.map((f) => data[f])]
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')

  try {
    // const animalRes = await pool.query(
    //   'SELECT owner_id FROM animals WHERE id = $1',
    //   [animalId]
    // )
    // if (animalRes.rows.length === 0) {
    //   return res.status(404).json({ error: 'Animal not found' })
    // }

    // const ownerId = animalRes.rows[0].owner_id

    // // 2. Check if this doctor is linked to that owner
    // const linkRes = await pool.query(
    //   'SELECT * FROM user_doctor WHERE owner_id = $1 AND doctor_id = $2',
    //   [ownerId, user.id]
    // )

    // if (linkRes.rows.length === 0) {
    //   return res.status(403).json({
    //     error: 'You are not assigned to this animal’s owner',
    //   })
    // }

    const result = await pool.query(
      `INSERT INTO ${tableName} (${columns.join(
        ', '
      )}) VALUES (${placeholders}) RETURNING *`,
      values
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Insert error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = {
  getAnimalRecordsByUserId,
  insertAnimalRecord,
}
