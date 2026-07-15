const express = require('express');
const router = express.Router();
const {
  getAllAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  updateAnimalArea,
  updateAnimalStatus,
} = require('../controllers/animalController');

router.get('/', getAllAnimals);
router.get('/:id', getAnimalById);
router.post('/', createAnimal);
router.put('/:id', updateAnimal);
router.delete('/:id', deleteAnimal);
router.put('/:id/area', updateAnimalArea);
router.put('/:id/status', updateAnimalStatus);

module.exports = router;
