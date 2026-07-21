const express = require('express');
const {
  getUserDashboard,
  getUserProfile,
  listUserAnimals,
  listUserServices,
  listUserTickets,
  listUserBookings,
} = require('../controllers/userController');

const router = express.Router();

router.get('/dashboard', getUserDashboard);
router.get('/profile', getUserProfile);
router.get('/animals', listUserAnimals);
router.get('/services', listUserServices);
router.get('/tickets', listUserTickets);
router.get('/bookings', listUserBookings);

module.exports = router;
