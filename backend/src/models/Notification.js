const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['REPORT', 'SYSTEM', 'ALERT'],
    default: 'SYSTEM'
  },
  priority: {
    type: String,
    enum: ['LOW', 'NORMAL', 'URGENT', 'CRITICAL'],
    default: 'NORMAL'
  },
  read: {
    type: Boolean,
    default: false
  },
  targetRole: {
    type: String,
    enum: ['VET', 'STAFF', 'ADMIN', 'ALL'],
    default: 'ALL'
  },
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: false
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
