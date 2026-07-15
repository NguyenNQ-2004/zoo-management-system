const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const areaRoutes = require('./routes/areaRoutes');
const animalRoutes = require('./routes/animalRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Zoo Management API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/services', serviceRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

const staffRoutes = require('./routes/staffRoutes');
app.use('/api/staff', staffRoutes);

module.exports = app;
