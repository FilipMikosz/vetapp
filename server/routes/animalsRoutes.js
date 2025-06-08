const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const {
  getMyAnimals,
  addAnimal,
  deleteAnimal,
} = require('../controllers/animalController')

router.get('/mine', authMiddleware, getMyAnimals)
router.post('/add', authMiddleware, addAnimal)
router.delete('/:id', authMiddleware, deleteAnimal)

module.exports = router
