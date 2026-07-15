const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Zoo Management API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;
