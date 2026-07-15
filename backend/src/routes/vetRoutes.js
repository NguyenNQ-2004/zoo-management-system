const express = require('express');
const router = express.Router();
const vetController = require('../controllers/vetController');

// Routes for Veterinary module
router.get('/dashboard', vetController.getDashboardStats);
router.get('/animals/health-status', vetController.getAnimalHealthStatus);
router.get('/health-records', vetController.getHealthRecordsArchive);

// Animal specific routes
router.get('/animals/:id/health', vetController.getAnimalHealthDetail);
router.put('/animals/:id/health-status', vetController.updateAnimalHealthStatus);
router.post('/animals/:id/medical-logs', vetController.createMedicalLog);
router.post('/animals/:id/treatments', vetController.createTreatmentPlan);

// Treatment specific routes
router.get('/treatments', vetController.getAllTreatments);
router.get('/treatments/:id', vetController.getTreatmentDetail);
router.put('/treatments/:id/status', vetController.updateTreatmentStatus);

module.exports = router;
