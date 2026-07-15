const Booking = require('../models/Booking');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

exports.createBooking = async (req, res) => {
  try {
    const { ticketType, date, adults, children, total, userEmail } = req.body;

    let user = await User.findOne({ email: userEmail });
    if (!user) user = await User.findOne({ role: 'USER' });
    if (!user) user = await User.findOne(); // Fallback

    let ticketName = ticketType === 'general' ? 'General Admission' : 'VIP Safari Tour';
    let ticket = await Ticket.findOne({ name: ticketName });
    if (!ticket) {
      ticket = await Ticket.create({
        code: `TK-${Math.floor(Math.random()*9000)+1000}`,
        name: ticketName,
        ticketType: 'ADULT',
        price: ticketName === 'VIP Safari Tour' ? 150 : 50
      });
    }

    const booking = await Booking.create({
      bookingCode: `BKG-${Math.floor(Math.random() * 90000) + 10000}`,
      user: user._id,
      visitDate: new Date(date),
      items: [
        { ticket: ticket._id, quantity: Number(adults) + Number(children), unitPrice: ticket.price }
      ],
      totalAmount: parseFloat(total.replace('$', '')) || 0,
      status: 'CONFIRMED',
      paymentStatus: 'PAID'
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('Create booking failed:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
