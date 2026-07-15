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
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    scientificName: {
      type: String,
      default: '',
      trim: true,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'UNKNOWN'],
      default: 'UNKNOWN',
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    origin: {
      type: String,
      default: '',
      trim: true,
    },
    diet: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['HEALTHY', 'OBSERVATION', 'TREATMENT', 'TRANSFERRED'],
      default: 'HEALTHY',
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ZooArea',
      required: true,
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
