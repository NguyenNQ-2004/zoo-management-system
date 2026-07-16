const Booking = require('../models/Booking');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

const isPastVisitDate = (value) => {
  const visitDate = new Date(value);
  if (Number.isNaN(visitDate.getTime())) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  visitDate.setHours(0, 0, 0, 0);
  return visitDate < today;
};

exports.createBooking = async (req, res) => {
  try {
    const { ticketType, date, adults, children, total, userEmail } = req.body;
    const adultCount = Number(adults || 0);
    const childCount = Number(children || 0);
    const quantity = adultCount + childCount;
    const totalAmount = Number(String(total || '').replace('$', '')) || 0;

    if (!date || isPastVisitDate(date)) {
      return res.status(400).json({ success: false, message: 'Visit date cannot be in the past.' });
    }

    if (!Number.isInteger(adultCount) || !Number.isInteger(childCount) || adultCount < 0 || childCount < 0 || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Ticket quantity must be at least 1 and cannot be negative.' });
    }

    if (totalAmount < 0) {
      return res.status(400).json({ success: false, message: 'Booking total cannot be negative.' });
    }

    let user = await User.findOne({ email: userEmail });
    if (!user) user = await User.findOne({ role: 'USER' });
    if (!user) user = await User.findOne();

    const ticketName = ticketType === 'general' ? 'General Admission' : 'VIP Safari Tour';
    let ticket = await Ticket.findOne({ name: ticketName });
    if (!ticket) {
      ticket = await Ticket.create({
        code: `TK-${Math.floor(Math.random() * 9000) + 1000}`,
        name: ticketName,
        ticketType: 'ADULT',
        price: ticketName === 'VIP Safari Tour' ? 150 : 50,
      });
    }

    const booking = await Booking.create({
      bookingCode: `BKG-${Math.floor(Math.random() * 90000) + 10000}`,
      user: user._id,
      visitDate: new Date(date),
      items: [
        { ticket: ticket._id, quantity, unitPrice: ticket.price },
      ],
      totalAmount,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('Create booking failed:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
