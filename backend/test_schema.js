require('dotenv').config();
const mongoose = require('mongoose');
const Animal = require('./src/models/Animal');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zoo-management');
  console.log("Enum values for status:", Animal.schema.path('status').enumValues);
  
  try {
    const animal = new Animal({
      code: 'TEST-123',
      name: 'Test',
      species: 'Test',
      area: new mongoose.Types.ObjectId(),
      status: 'OBSERVATION'
    });
    await animal.validate();
    console.log("Validation passed!");
  } catch (err) {
    console.error("Validation failed:", err.message);
  }
  process.exit(0);
}
test();
