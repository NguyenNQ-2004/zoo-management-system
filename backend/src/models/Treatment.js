const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema(
  {
    medicalLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicalLog',
      default: null,
    },
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    medication: {
      type: String,
      default: '',
      trim: true,
    },
    dosage: {
      type: String,
      default: '',
      trim: true,
    },
    schedule: {
      type: String,
      default: '',
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['PLANNED', 'ONGOING', 'COMPLETED'],
      default: 'PLANNED',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Treatment', treatmentSchema);
