const http = require('http');

const data = JSON.stringify({
  status: 'OBSERVATION',
  notes: 'Testing'
});

const options = {
  hostname: 'localhost',
  port: 5005,
  path: '/api/staff/animals/6786c57fdf31766ccb23f5b7/care-status', // Assuming a valid animal ID is needed, but we just want to see if it hits the enum validation. Wait, if it's an invalid ID it will return 404. Let's just find an animal first.
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'x-staff-email': 'staff1@zoo.com',
    'Content-Length': data.length
  }
};

require('dotenv').config();
require('mongoose').connect(process.env.MONGODB_URI).then(async (mongoose) => {
  const Animal = require('./src/models/Animal');
  const animal = await Animal.findOne();
  if (!animal) {
    console.log('No animals found');
    process.exit(0);
  }
  
  options.path = `/api/staff/animals/${animal._id}/care-status`;
  
  const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', chunk => responseData += chunk);
    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      console.log('Response:', responseData);
      process.exit(0);
    });
  });
  
  req.on('error', error => {
    console.error('Error:', error);
    process.exit(1);
  });
  
  req.write(data);
  req.end();
});
