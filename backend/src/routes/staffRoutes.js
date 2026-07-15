const express = require('express');
const { getStaffDashboard, getStaffTasks } = require('../controllers/staffController');

const router = express.Router();

router.get('/dashboard', getStaffDashboard);
router.get('/tasks', getStaffTasks);

module.exports = router;
