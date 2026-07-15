const express = require('express');
const cors = require('cors');

const app = express();

// Register Mongoose models before routes use populate() and refs
require('./models/User');
require('./models/ZooArea');
require('./models/Animal');
require('./models/AnimalHealth');
require('./models/MedicalLog');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Zoo Management API is running...');
});

const authRoutes = require('./routes/authRoutes');
const vetRoutes = require('./routes/vetRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/vet', vetRoutes);

module.exports = app;
