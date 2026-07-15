const mongoose = require('mongoose');

const animalHealthSchema = new mongoose.Schema(
  {
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Animal',
      required: true,
      unique: true,
    },
    weightKg: {
      type: Number,
      default: 0,
      min: 0,
    },
    temperatureC: {
      type: Number,
      default: null,
    },
    appetite: {
      type: String,
      enum: ['GOOD', 'NORMAL', 'LOW'],
      default: 'NORMAL',
    },
    condition: {
      type: String,
      enum: ['STABLE', 'MONITORING', 'CRITICAL'],
      default: 'STABLE',
    },
    checkedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    lastCheckDate: {
      type: Date,
      default: Date.now,
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

module.exports = mongoose.model('AnimalHealth', animalHealthSchema);
