const User = require('../models/User');
const ZooArea = require('../models/ZooArea');
const Animal = require('../models/Animal');
const ZooService = require('../models/ZooService');
const Ticket = require('../models/Ticket');
const Booking = require('../models/Booking');

const getUserFromRequest = async (req) => {
  const email = req.headers['x-user-email'] || req.query.email || 'user@zoo.com';
  return User.findOne({ email, role: 'USER' }).select('-password');
};

const sanitizeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  phone: user.phone || user.phoneNumber || '',
  assignedArea: user.assignedArea,
  status: user.status,
  lastActiveAt: user.lastActiveAt,
  createdAt: user.createdAt,
});

const sanitizeArea = (area) => ({
  _id: area._id,
  code: area.code,
  name: area.name,
  description: area.description,
  habitatType: area.habitatType,
  status: area.status,
  location: area.location,
  capacity: area.capacity,
});

const sanitizeAnimal = (animal) => ({
  _id: animal._id,
  code: animal.code,
  name: animal.name,
  species: animal.species,
  imageUrl: animal.imageUrl,
  scientificName: animal.scientificName,
  gender: animal.gender,
  age: animal.age,
  healthStatus: animal.healthStatus,
  behavior: animal.behavior,
  origin: animal.origin,
  diet: animal.diet,
  area: animal.area ? {
    _id: animal.area._id,
    name: animal.area.name,
    code: animal.area.code,
  } : null,
});

const sanitizeService = (service) => ({
  _id: service._id,
  code: service.code,
  name: service.name,
  category: service.category,
  description: service.description,
  price: service.price,
  durationMinutes: service.durationMinutes ?? service.duration ?? 0,
  isActive: service.isActive,
});

const sanitizeTicket = (ticket) => ({
  _id: ticket._id,
  code: ticket.code,
  name: ticket.name,
  ticketType: ticket.ticketType,
  price: ticket.price,
  description: ticket.description,
  isActive: ticket.isActive,
});

const sanitizeBooking = (booking) => ({
  _id: booking._id,
  bookingCode: booking.bookingCode,
  visitDate: booking.visitDate,
  totalAmount: booking.totalAmount,
  status: booking.status,
  paymentStatus: booking.paymentStatus,
  items: booking.items.map((item) => ({
    ticket: item.ticket ? sanitizeTicket(item.ticket) : null,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  })),
});

const loadUserCollections = async (userId) => {
  const [areas, animals, services, tickets, bookings] = await Promise.all([
    ZooArea.find({ status: { $ne: 'Closed' } }).sort({ name: 1 }),
    Animal.find({ status: 'Active' }).populate('area', 'name code').sort({ name: 1 }),
    ZooService.find({ isActive: true }).sort({ category: 1, name: 1 }),
    Ticket.find({ isActive: true }).sort({ ticketType: 1, price: 1 }),
    Booking.find({ user: userId }).populate('items.ticket').sort({ createdAt: -1 }),
  ]);

  return {
    areas: areas.map(sanitizeArea),
    animals: animals.map(sanitizeAnimal),
    services: services.map(sanitizeService),
    tickets: tickets.map(sanitizeTicket),
    bookings: bookings.map(sanitizeBooking),
  };
};

exports.getUserDashboard = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    const collections = await loadUserCollections(user._id);

    return res.json({
      user: sanitizeUser(user),
      summary: {
        openAreas: collections.areas.length,
        animals: collections.animals.length,
        services: collections.services.length,
        tickets: collections.tickets.length,
        bookings: collections.bookings.length,
      },
      ...collections,
    });
  } catch (error) {
    console.error('Get user dashboard failed:', error);
    return res.status(500).json({ message: error.message || 'Failed to load user dashboard' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(404).json({ message: 'User account not found' });
    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('Get user profile failed:', error);
    return res.status(500).json({ message: error.message || 'Failed to load profile' });
  }
};

exports.listUserAnimals = async (req, res) => {
  try {
    const animals = await Animal.find({ status: 'Active' }).populate('area', 'name code').sort({ name: 1 });
    return res.json({ animals: animals.map(sanitizeAnimal) });
  } catch (error) {
    console.error('Get user animals failed:', error);
    return res.status(500).json({ message: error.message || 'Failed to load animals' });
  }
};

exports.listUserServices = async (req, res) => {
  try {
    const services = await ZooService.find({ isActive: true }).sort({ category: 1, name: 1 });
    return res.json({ services: services.map(sanitizeService) });
  } catch (error) {
    console.error('Get user services failed:', error);
    return res.status(500).json({ message: error.message || 'Failed to load services' });
  }
};

exports.listUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ isActive: true }).sort({ ticketType: 1, price: 1 });
    return res.json({ tickets: tickets.map(sanitizeTicket) });
  } catch (error) {
    console.error('Get user tickets failed:', error);
    return res.status(500).json({ message: error.message || 'Failed to load tickets' });
  }
};

exports.listUserBookings = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(404).json({ message: 'User account not found' });

    const bookings = await Booking.find({ user: user._id }).populate('items.ticket').sort({ createdAt: -1 });
    return res.json({ bookings: bookings.map(sanitizeBooking) });
  } catch (error) {
    console.error('Get user bookings failed:', error);
    return res.status(500).json({ message: error.message || 'Failed to load bookings' });
  }
};
