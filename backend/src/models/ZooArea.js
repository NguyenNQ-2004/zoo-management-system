const mongoose = require('mongoose');

const zooAreaSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    habitatType: {
      type: String,
      default: 'General',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Open', 'Maintenance', 'Closed'],
      default: 'Open',
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    capacity: {
      type: Number,
      default: 0,
      min: 0,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedStaff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ZooArea', zooAreaSchema);
