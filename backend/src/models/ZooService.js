const mongoose = require('mongoose');

const zooServiceSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: ['FOOD', 'GUIDE', 'PHOTO', 'EVENT', 'RENTAL'],
      default: 'EVENT',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    durationMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ZooService', zooServiceSchema);
