const express = require('express')
const router = express.Router()
const { getAnimalRecordsByUserId } = require('../controllers/recordController')

router.get('/:userId', getAnimalRecordsByUserId)

module.exports = router
