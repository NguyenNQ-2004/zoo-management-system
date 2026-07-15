const express = require('express');
const router = express.Router();
const vetController = require('../controllers/vetController');

// Routes for Veterinary module
router.get('/dashboard', vetController.getDashboardStats);
router.get('/animals/health-status', vetController.getAnimalHealthStatus);
router.get('/health-records', vetController.getHealthRecordsArchive);

module.exports = router;
