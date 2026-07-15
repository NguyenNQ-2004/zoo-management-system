const mongoose = require('mongoose');

const careLogSchema = new mongoose.Schema(
  {
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Animal',
      required: true,
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StaffTask',
      default: null,
    },
    careType: {
      type: String,
      enum: ['FEEDING', 'CLEANING', 'OBSERVATION', 'ENRICHMENT'],
      required: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    loggedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CareLog', careLogSchema);
