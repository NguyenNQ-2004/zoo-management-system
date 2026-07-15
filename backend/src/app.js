const express = require('express');
const cors = require('cors');

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
const authRoutes = require('./routes/authRoutes');
const areaRoutes = require('./routes/areaRoutes');
const animalRoutes = require('./routes/animalRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/services', serviceRoutes);

module.exports = app;
