const express = require('express');
const router = express.Router();
const {
  getAllServices,
  createService,
  updateService,
  toggleServiceStatus,
  deleteService,
} = require('../controllers/serviceController');

router.get('/', getAllServices);
router.post('/', createService);
router.put('/:id', updateService);
router.put('/:id/status', toggleServiceStatus);
router.delete('/:id', deleteService);

module.exports = router;
