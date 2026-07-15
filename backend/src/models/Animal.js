const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    species: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unknown'],
      default: 'Unknown',
    },
    age: {
      type: Number,
      default: null,
      min: 0,
    },
    healthStatus: {
      type: String,
      enum: ['Healthy', 'Sick', 'Under Treatment', 'Quarantine', 'Recovered'],
      default: 'Healthy',
    },
    behavior: {
      type: String,
      default: '',
      trim: true,
    },
    origin: {
      type: String,
      default: '',
      trim: true,
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ZooArea',
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Transferred', 'HEALTHY', 'OBSERVATION', 'TREATMENT'],
      default: 'Active',
    },
    caretaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Animal', animalSchema);
