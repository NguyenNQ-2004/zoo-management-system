const express = require('express');
const { createBooking } = require('../controllers/userController');

const router = express.Router();

router.post('/bookings', createBooking);

module.exports = router;
