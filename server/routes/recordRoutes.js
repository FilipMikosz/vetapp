const express = require('express')
const router = express.Router()
const {
  getAnimalRecordsByUserId,
  insertAnimalRecord,
} = require('../controllers/recordController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/:userId', authMiddleware, getAnimalRecordsByUserId)
router.post('/:animalId/:tableName', authMiddleware, insertAnimalRecord)

module.exports = router
