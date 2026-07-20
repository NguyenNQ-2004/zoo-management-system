const mongoose = require('mongoose');

const bookingItemSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const bookingStatusHistorySchema = new mongoose.Schema(
  {
    fromStatus: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'USED', null],
      default: null,
    },
    toStatus: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'USED'],
      required: true,
    },
    fromPaymentStatus: {
      type: String,
      enum: ['UNPAID', 'PAID', 'REFUNDED', null],
      default: null,
    },
    toPaymentStatus: {
      type: String,
      enum: ['UNPAID', 'PAID', 'REFUNDED'],
      required: true,
    },
    action: {
      type: String,
      enum: ['STATUS_UPDATE', 'CONFIRM_PAYMENT', 'CANCEL_REFUND', 'MARK_USED'],
      default: 'STATUS_UPDATE',
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    visitDate: {
      type: Date,
      required: true,
    },
    items: {
      type: [bookingItemSchema],
      default: [],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'USED'],
      default: 'CONFIRMED',
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PAID', 'REFUNDED'],
      default: 'PAID',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    statusHistory: {
      type: [bookingStatusHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
