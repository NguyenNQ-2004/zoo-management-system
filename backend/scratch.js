require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zoo_management_db')
  .then(async () => {
    try {
      const user = await User.create({
        email: 'test' + Date.now() + '@gmail.com',
        password: 'password123',
        fullName: 'Nguye',
        phoneNumber: '123'
      });
      console.log('Success:', user);
    } catch (err) {
      console.log('Error:', err);
    }
    process.exit(0);
  });
