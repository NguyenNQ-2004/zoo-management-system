const mongoose = require('mongoose');

const medicalLogSchema = new mongoose.Schema(
  {
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Animal',
      required: true,
    },
    vet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    symptoms: {
      type: String,
      default: '',
      trim: true,
    },
    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },
    treatmentPlan: {
      type: String,
      default: '',
      trim: true,
    },
    medications: [
      {
        type: String,
        trim: true,
      },
    ],
    type: {
      type: String,
      default: 'CHECKUP',
    },
    notes: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    nextCheckDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['OPEN', 'FOLLOW_UP', 'CLOSED', 'COMPLETED'],
      default: 'CLOSED',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MedicalLog', medicalLogSchema);
