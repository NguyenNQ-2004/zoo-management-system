const express = require('express');
const {
  createAnimalCareLog,
  getAnimalCareDetail,
  getAnimalCareLogs,
  getStaffAnimals,
  getStaffCareLogs,
  getStaffDashboard,
  getStaffSchedule,
  getStaffTaskById,
  getStaffTasks,
  updateAnimalCareStatus,
  updateStaffTaskStatus,
} = require('../controllers/staffController');

const router = express.Router();

router.get('/dashboard', getStaffDashboard);
router.get('/schedule', getStaffSchedule);
router.get('/care-logs', getStaffCareLogs);
router.get('/tasks', getStaffTasks);
router.get('/tasks/:id', getStaffTaskById);
router.put('/tasks/:id/status', updateStaffTaskStatus);
router.get('/animals', getStaffAnimals);
router.get('/animals/:id/care', getAnimalCareDetail);
router.get('/animals/:id/care-logs', getAnimalCareLogs);
router.post('/animals/:id/care-logs', createAnimalCareLog);
router.put('/animals/:id/care-status', updateAnimalCareStatus);

module.exports = router;
