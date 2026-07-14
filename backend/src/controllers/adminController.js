const mongoose = require('mongoose');
const User = require('../models/User');
const ZooArea = require('../models/ZooArea');
const Animal = require('../models/Animal');
const AnimalHealth = require('../models/AnimalHealth');
const StaffTask = require('../models/StaffTask');
const Ticket = require('../models/Ticket');
const Booking = require('../models/Booking');
const ZooService = require('../models/ZooService');

const sanitizeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  phone: user.phone,
  assignedArea: user.assignedArea,
  status: user.status,
  lastActiveAt: user.lastActiveAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const buildUserFilters = ({ role, status, search }) => {
  const filters = {};

  if (role && role !== 'ALL') {
    filters.role = role;
  }

  if (status && status !== 'ALL') {
    filters.status = status;
  }

  if (search) {
    const regex = new RegExp(search.trim(), 'i');
    filters.$or = [
      { fullName: regex },
      { email: regex },
      { phone: regex },
      { assignedArea: regex },
    ];
  }

  return filters;
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const assignableTaskRoles = ['STAFF', 'VET'];
const validTaskTypes = ['CARE', 'CLEANING', 'MEDICAL_SUPPORT', 'MAINTENANCE'];
const validTaskPriorities = ['LOW', 'MEDIUM', 'HIGH'];
const validTaskStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
const validTicketTypes = ['ADULT', 'CHILD', 'STUDENT', 'VIP', 'GROUP'];
const validServiceCategories = ['FOOD', 'GUIDE', 'PHOTO', 'EVENT', 'RENTAL'];
const validBookingStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'USED'];
const validPaymentStatuses = ['UNPAID', 'PAID', 'REFUNDED'];

const isBlank = (value) => typeof value !== 'string' || value.trim() === '';
const isNonNegativeNumber = (value) => Number.isFinite(Number(value)) && Number(value) >= 0;
const isPositiveNumber = (value) => Number.isFinite(Number(value)) && Number(value) > 0;
const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isValidHttpUrl = (value) => {
  if (!value) return true;

  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch (error) {
    return false;
  }
};

const isFutureDate = (value) => {
  if (!value) return false;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) || date > new Date();
};

const findAssignableUser = async (id) => {
  if (!id || !isValidObjectId(id)) return null;
  return User.findOne({ _id: id, role: { $in: assignableTaskRoles } }).select('-password');
};

const validateAnimalHealthInput = (health = {}) => {
  if (health.weightKg !== undefined && health.weightKg !== '' && !isNonNegativeNumber(health.weightKg)) {
    return 'Animal weight must be a number greater than or equal to 0.';
  }

  if (health.temperatureC !== undefined && health.temperatureC !== '' && health.temperatureC !== null && !Number.isFinite(Number(health.temperatureC))) {
    return 'Animal temperature must be a valid number.';
  }

  if (health.lastCheckDate && isFutureDate(health.lastCheckDate)) {
    return 'Health check date cannot be in the future.';
  }

  return '';
};

const findDuplicateAnimalName = async ({ name, species, area, excludeId = null }) => {
  const filters = {
    name: new RegExp(`^${escapeRegExp(name.trim())}$`, 'i'),
    _id: { $ne: excludeId || undefined },
    $or: [
      { species: new RegExp(`^${escapeRegExp(species.trim())}$`, 'i') },
      { area },
    ],
  };

  if (!excludeId) delete filters._id;
  return Animal.findOne(filters);
};

const normalizeAreaStatus = (status) => {
  if (['Open', 'Maintenance', 'Closed'].includes(status)) return status;
  const value = String(status || '').toUpperCase();
  if (value === 'MAINTENANCE') return 'Maintenance';
  if (value === 'CLOSED') return 'Closed';
  return 'Open';
};

const normalizeAnimalGender = (gender) => {
  const value = String(gender || '').toUpperCase();
  if (value === 'MALE') return 'Male';
  if (value === 'FEMALE') return 'Female';
  return ['Male', 'Female', 'Unknown'].includes(gender) ? gender : 'Unknown';
};

const normalizeAnimalHealthStatus = (healthStatus, legacyStatus) => {
  if (['Healthy', 'Sick', 'Under Treatment', 'Quarantine', 'Recovered'].includes(healthStatus)) {
    return healthStatus;
  }

  const status = String(legacyStatus || healthStatus || '').toUpperCase();
  if (status === 'TREATMENT' || status === 'UNDER TREATMENT') return 'Under Treatment';
  if (status === 'OBSERVATION' || status === 'MONITORING') return 'Sick';
  if (status === 'TRANSFERRED') return 'Recovered';
  return 'Healthy';
};

const normalizeAnimalStatus = (status) => {
  if (['Active', 'Inactive', 'Transferred'].includes(status)) return status;
  const value = String(status || '').toUpperCase();
  if (value === 'TRANSFERRED') return 'Transferred';
  if (value === 'INACTIVE') return 'Inactive';
  return 'Active';
};

const normalizeAnimalDoc = (animal) => {
  if (!animal) return animal;
  animal.gender = normalizeAnimalGender(animal.gender);
  animal.healthStatus = normalizeAnimalHealthStatus(animal.healthStatus, animal.status);
  animal.status = normalizeAnimalStatus(animal.status);
  return animal;
};

const isPastDateTime = (value) => {
  const selectedDate = new Date(value);
  if (Number.isNaN(selectedDate.getTime())) return true;

  const currentMinute = new Date();
  currentMinute.setSeconds(0, 0);
  return selectedDate < currentMinute;
};

const sanitizeArea = (area) => ({
  _id: area._id,
  code: area.code,
  name: area.name,
  status: normalizeAreaStatus(area.status),
  location: area.location,
});

const sanitizeAnimal = (animal, health = null) => ({
  _id: animal._id,
  code: animal.code,
  name: animal.name,
  species: animal.species,
  imageUrl: animal.imageUrl,
  scientificName: animal.scientificName,
  gender: normalizeAnimalGender(animal.gender),
  dateOfBirth: animal.dateOfBirth,
  age: animal.age,
  healthStatus: normalizeAnimalHealthStatus(animal.healthStatus, animal.status),
  behavior: animal.behavior,
  origin: animal.origin,
  diet: animal.diet,
  status: normalizeAnimalStatus(animal.status),
  notes: animal.notes,
  area: animal.area
    ? {
        _id: animal.area._id,
        name: animal.area.name,
        code: animal.area.code,
      }
    : null,
  caretaker: animal.caretaker
    ? {
        _id: animal.caretaker._id,
        fullName: animal.caretaker.fullName,
        email: animal.caretaker.email,
        role: animal.caretaker.role,
      }
    : null,
  health: health
    ? {
        _id: health._id,
        weightKg: health.weightKg,
        temperatureC: health.temperatureC,
        appetite: health.appetite,
        condition: health.condition,
        lastCheckDate: health.lastCheckDate,
        notes: health.notes,
        checkedBy: health.checkedBy ? sanitizeUser(health.checkedBy) : null,
      }
    : null,
  createdAt: animal.createdAt,
  updatedAt: animal.updatedAt,
});

const sanitizeTask = (task) => ({
  _id: task._id,
  title: task.title,
  description: task.description,
  taskType: task.taskType,
  priority: task.priority,
  status: task.status,
  dueDate: task.dueDate,
  completedAt: task.completedAt,
  assignedTo: task.assignedTo ? sanitizeUser(task.assignedTo) : null,
  assignedBy: task.assignedBy ? sanitizeUser(task.assignedBy) : null,
  area: task.area ? sanitizeArea(task.area) : null,
  animal: task.animal ? sanitizeAnimal(task.animal) : null,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

const taskPopulate = [
  { path: 'assignedTo', select: '-password' },
  { path: 'assignedBy', select: '-password' },
  { path: 'area' },
  { path: 'animal', populate: { path: 'area' } },
];

const sanitizeTicket = (ticket) => ({
  _id: ticket._id,
  code: ticket.code,
  name: ticket.name,
  ticketType: ticket.ticketType,
  price: ticket.price,
  description: ticket.description,
  isActive: ticket.isActive,
  createdAt: ticket.createdAt,
  updatedAt: ticket.updatedAt,
});

const sanitizeService = (service) => ({
  _id: service._id,
  code: service.code,
  name: service.name,
  category: service.category,
  description: service.description,
  price: service.price,
  duration: service.duration ?? service.durationMinutes ?? 0,
  durationMinutes: service.duration ?? service.durationMinutes ?? 0,
  isActive: service.isActive,
  createdAt: service.createdAt,
  updatedAt: service.updatedAt,
});

const sanitizeBooking = (booking) => ({
  _id: booking._id,
  bookingCode: booking.bookingCode,
  user: booking.user ? sanitizeUser(booking.user) : null,
  visitDate: booking.visitDate,
  items: booking.items.map((item) => ({
    ticket: item.ticket ? sanitizeTicket(item.ticket) : null,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.quantity * item.unitPrice,
  })),
  totalAmount: booking.totalAmount,
  status: booking.status,
  paymentStatus: booking.paymentStatus,
  notes: booking.notes,
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
});

const listUsers = async (req, res) => {
  try {
    const filters = buildUserFilters(req.query);
    const users = await User.find(filters).sort({ createdAt: -1 }).select('-password');

    res.json({
      success: true,
      data: users.map(sanitizeUser),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load users.',
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user id.',
      });
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.json({
      success: true,
      data: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load user details.',
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role = 'USER',
      phone = '',
      assignedArea = 'Visitor',
      status = 'ACTIVE',
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'fullName, email and password are required.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists.',
      });
    }

    const user = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      phone: phone.trim(),
      assignedArea: assignedArea.trim() || 'Visitor',
      status,
      lastActiveAt: new Date(),
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create user.',
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      email,
      password,
      role,
      phone,
      assignedArea,
      status,
    } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user id.',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (email && email.toLowerCase().trim() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists.',
        });
      }
      user.email = email.toLowerCase().trim();
    }

    if (fullName) user.fullName = fullName.trim();
    if (role) user.role = role;
    if (typeof phone === 'string') user.phone = phone.trim();
    if (typeof assignedArea === 'string') user.assignedArea = assignedArea.trim() || 'Visitor';
    if (status) user.status = status;
    if (password) user.password = password;

    await user.save();

    return res.json({
      success: true,
      message: 'User updated successfully.',
      data: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update user.',
      error: error.message,
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user id.',
      });
    }

    if (!['ACTIVE', 'LOCKED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be ACTIVE or LOCKED.',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.status = status;
    await user.save();

    return res.json({
      success: true,
      message: `User ${status === 'LOCKED' ? 'locked' : 'unlocked'} successfully.`,
      data: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update user status.',
      error: error.message,
    });
  }
};

const listStaff = async (req, res) => {
  try {
    const staffUsers = await User.find({
      role: { $in: ['STAFF', 'VET'] },
    })
      .sort({ role: 1, fullName: 1 })
      .select('-password');

    const staffIds = staffUsers.map((user) => user._id);
    const tasks = await StaffTask.find({ assignedTo: { $in: staffIds } });
    const animals = await Animal.find({ caretaker: { $in: staffIds } });

    const data = staffUsers.map((user) => {
      const userTasks = tasks.filter((task) => task.assignedTo.toString() === user._id.toString());
      const userAnimals = animals.filter((animal) => animal.caretaker.toString() === user._id.toString());

      return {
        ...sanitizeUser(user),
        taskStats: {
          total: userTasks.length,
          todo: userTasks.filter((task) => task.status === 'TODO').length,
          inProgress: userTasks.filter((task) => task.status === 'IN_PROGRESS').length,
          done: userTasks.filter((task) => task.status === 'DONE').length,
        },
        animalCount: userAnimals.length,
      };
    });

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load staff.',
      error: error.message,
    });
  }
};

const assignStaffArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { areaId } = req.body;

    if (!isValidObjectId(id) || !isValidObjectId(areaId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid staff id or area id.',
      });
    }

    const [staffUser, area] = await Promise.all([
      User.findById(id),
      ZooArea.findById(areaId),
    ]);

    if (!staffUser || !['STAFF', 'VET'].includes(staffUser.role)) {
      return res.status(404).json({
        success: false,
        message: 'Staff user not found.',
      });
    }

    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found.',
      });
    }

    await ZooArea.updateMany(
      { assignedStaff: staffUser._id },
      { $pull: { assignedStaff: staffUser._id } }
    );

    area.status = normalizeAreaStatus(area.status);
    area.assignedStaff.addToSet(staffUser._id);
    staffUser.assignedArea = area.name;

    await Promise.all([area.save(), staffUser.save()]);

    return res.json({
      success: true,
      message: 'Staff area updated successfully.',
      data: sanitizeUser(staffUser),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to assign staff area.',
      error: error.message,
    });
  }
};

const listAreas = async (req, res) => {
  try {
    const areas = await ZooArea.find().sort({ name: 1 });

    return res.json({
      success: true,
      data: areas.map(sanitizeArea),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load areas.',
      error: error.message,
    });
  }
};

const listAnimals = async (req, res) => {
  try {
    const animals = await Animal.find()
      .populate('area')
      .populate('caretaker', '-password')
      .sort({ name: 1 });
    const animalIds = animals.map((animal) => animal._id);
    const healthRecords = await AnimalHealth.find({ animal: { $in: animalIds } }).populate('checkedBy', '-password');
    const healthByAnimal = new Map(
      healthRecords.map((health) => [health.animal.toString(), health])
    );

    return res.json({
      success: true,
      data: animals.map((animal) => sanitizeAnimal(animal, healthByAnimal.get(animal._id.toString()))),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load animals.',
      error: error.message,
    });
  }
};

const getAnimalById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid animal id.',
      });
    }

    const animal = await Animal.findById(id)
      .populate('area')
      .populate('caretaker', '-password');

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal not found.',
      });
    }

    const health = await AnimalHealth.findOne({ animal: animal._id }).populate('checkedBy', '-password');

    return res.json({
      success: true,
      data: sanitizeAnimal(animal, health),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load animal details.',
      error: error.message,
    });
  }
};

const upsertAnimalHealth = async (animalId, health = {}) => {
  const healthFields = {
    weightKg: Number(health.weightKg || 0),
    temperatureC: health.temperatureC === '' || health.temperatureC === null || health.temperatureC === undefined
      ? null
      : Number(health.temperatureC),
    appetite: health.appetite || 'NORMAL',
    condition: health.condition || 'STABLE',
    notes: health.notes || '',
    lastCheckDate: health.lastCheckDate || new Date(),
  };

  return AnimalHealth.findOneAndUpdate(
    { animal: animalId },
    { $set: healthFields, $setOnInsert: { animal: animalId } },
    { returnDocument: 'after', upsert: true }
  ).populate('checkedBy', '-password');
};

const createAnimal = async (req, res) => {
  try {
    const {
      code,
      name,
      species,
      imageUrl = '',
      scientificName = '',
      gender = 'Unknown',
      dateOfBirth,
      age,
      healthStatus,
      behavior = '',
      origin = '',
      diet = '',
      status = 'Active',
      area,
      caretaker,
      notes = '',
      health = {},
    } = req.body;

    if (isBlank(code) || isBlank(name) || isBlank(species) || !area) {
      return res.status(400).json({
        success: false,
        message: 'code, name, species and area are required.',
      });
    }

    if (!isValidObjectId(area)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid area id.',
      });
    }

    const areaExists = await ZooArea.exists({ _id: area });
    if (!areaExists) {
      return res.status(400).json({
        success: false,
        message: 'Selected area does not exist.',
      });
    }

    if (!isValidHttpUrl(imageUrl.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Image URL must be a valid http or https URL.',
      });
    }

    if (dateOfBirth && isFutureDate(dateOfBirth)) {
      return res.status(400).json({
        success: false,
        message: 'Date of birth cannot be in the future.',
      });
    }

    if (age !== '' && age !== undefined && age !== null && !isNonNegativeNumber(age)) {
      return res.status(400).json({
        success: false,
        message: 'Animal age must be a number greater than or equal to 0.',
      });
    }

    const healthError = validateAnimalHealthInput(health);
    if (healthError) {
      return res.status(400).json({
        success: false,
        message: healthError,
      });
    }

    const existingAnimal = await Animal.findOne({ code: code.toUpperCase().trim() });
    if (existingAnimal) {
      return res.status(409).json({
        success: false,
        message: 'Animal code already exists.',
      });
    }

    const duplicateAnimalName = await findDuplicateAnimalName({ name, species, area });
    if (duplicateAnimalName) {
      return res.status(409).json({
        success: false,
        message: 'Animal name already exists in the same species or area.',
      });
    }

    const caretakerUser = caretaker ? await findAssignableUser(caretaker) : null;
    if (caretaker && !caretakerUser) {
      return res.status(400).json({
        success: false,
        message: 'Caretaker must be an existing STAFF or VET user.',
      });
    }

    const animal = await Animal.create({
      code: code.toUpperCase().trim(),
      name: name.trim(),
      species: species.trim(),
      imageUrl: imageUrl.trim(),
      scientificName: scientificName.trim(),
      gender: normalizeAnimalGender(gender),
      dateOfBirth: dateOfBirth || null,
      age: age === '' || age === undefined || age === null ? null : Number(age),
      healthStatus: normalizeAnimalHealthStatus(healthStatus, status),
      behavior: behavior.trim(),
      origin: origin.trim(),
      diet: diet.trim(),
      status: normalizeAnimalStatus(status),
      area,
      caretaker: caretakerUser?._id || null,
      notes: notes.trim(),
    });

    const healthRecord = await upsertAnimalHealth(animal._id, health);
    const populatedAnimal = await Animal.findById(animal._id)
      .populate('area')
      .populate('caretaker', '-password');

    return res.status(201).json({
      success: true,
      message: 'Animal created successfully.',
      data: sanitizeAnimal(populatedAnimal, healthRecord),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create animal.',
      error: error.message,
    });
  }
};

const updateAnimal = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid animal id.',
      });
    }

    const animal = await Animal.findById(id);

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal not found.',
      });
    }

    const {
      code,
      name,
      species,
      imageUrl,
      scientificName,
      gender,
      dateOfBirth,
      age,
      healthStatus,
      behavior,
      origin,
      diet,
      status,
      area,
      caretaker,
      notes,
      health,
    } = req.body;

    normalizeAnimalDoc(animal);

    if (Object.prototype.hasOwnProperty.call(req.body, 'code') && isBlank(code)) {
      return res.status(400).json({
        success: false,
        message: 'Animal code is required.',
      });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'name') && isBlank(name)) {
      return res.status(400).json({
        success: false,
        message: 'Animal name is required.',
      });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'species') && isBlank(species)) {
      return res.status(400).json({
        success: false,
        message: 'Animal species is required.',
      });
    }

    if (typeof imageUrl === 'string' && !isValidHttpUrl(imageUrl.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Image URL must be a valid http or https URL.',
      });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'dateOfBirth') && dateOfBirth && isFutureDate(dateOfBirth)) {
      return res.status(400).json({
        success: false,
        message: 'Date of birth cannot be in the future.',
      });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'age') && age !== '' && age !== null && !isNonNegativeNumber(age)) {
      return res.status(400).json({
        success: false,
        message: 'Animal age must be a number greater than or equal to 0.',
      });
    }

    if (area) {
      if (!isValidObjectId(area)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid area id.',
        });
      }

      const areaExists = await ZooArea.exists({ _id: area });
      if (!areaExists) {
        return res.status(400).json({
          success: false,
          message: 'Selected area does not exist.',
        });
      }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'caretaker') && caretaker) {
      const caretakerUser = await findAssignableUser(caretaker);
      if (!caretakerUser) {
        return res.status(400).json({
          success: false,
          message: 'Caretaker must be an existing STAFF or VET user.',
        });
      }
    }

    if (health) {
      const healthError = validateAnimalHealthInput(health);
      if (healthError) {
        return res.status(400).json({
          success: false,
          message: healthError,
        });
      }
    }

    if (code && code.toUpperCase().trim() !== animal.code) {
      const existingAnimal = await Animal.findOne({ code: code.toUpperCase().trim() });
      if (existingAnimal) {
        return res.status(409).json({
          success: false,
          message: 'Animal code already exists.',
        });
      }
      animal.code = code.toUpperCase().trim();
    }

    const nextName = name ? name.trim() : animal.name;
    const nextSpecies = species ? species.trim() : animal.species;
    const nextArea = area || animal.area;
    const duplicateAnimalName = await findDuplicateAnimalName({
      name: nextName,
      species: nextSpecies,
      area: nextArea,
      excludeId: animal._id,
    });
    if (duplicateAnimalName) {
      return res.status(409).json({
        success: false,
        message: 'Animal name already exists in the same species or area.',
      });
    }

    if (name) animal.name = name.trim();
    if (species) animal.species = species.trim();
    if (typeof imageUrl === 'string') animal.imageUrl = imageUrl.trim();
    if (typeof scientificName === 'string') animal.scientificName = scientificName.trim();
    if (gender) animal.gender = normalizeAnimalGender(gender);
    if (Object.prototype.hasOwnProperty.call(req.body, 'dateOfBirth')) animal.dateOfBirth = dateOfBirth || null;
    if (Object.prototype.hasOwnProperty.call(req.body, 'age')) animal.age = age === '' || age === null ? null : Number(age);
    if (healthStatus) animal.healthStatus = normalizeAnimalHealthStatus(healthStatus, status);
    if (typeof behavior === 'string') animal.behavior = behavior.trim();
    if (typeof origin === 'string') animal.origin = origin.trim();
    if (typeof diet === 'string') animal.diet = diet.trim();
    if (status) animal.status = normalizeAnimalStatus(status);
    if (area) animal.area = area;
    if (Object.prototype.hasOwnProperty.call(req.body, 'caretaker')) {
      animal.caretaker = caretaker || null;
    }
    if (typeof notes === 'string') animal.notes = notes.trim();

    await animal.save();

    const healthRecord = health ? await upsertAnimalHealth(animal._id, health) : await AnimalHealth.findOne({ animal: animal._id }).populate('checkedBy', '-password');
    const populatedAnimal = await Animal.findById(animal._id)
      .populate('area')
      .populate('caretaker', '-password');

    return res.json({
      success: true,
      message: 'Animal updated successfully.',
      data: sanitizeAnimal(populatedAnimal, healthRecord),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update animal.',
      error: error.message,
    });
  }
};

const deleteAnimal = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid animal id.',
      });
    }

    const animal = await Animal.findById(id);

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal not found.',
      });
    }

    await Promise.all([
      AnimalHealth.deleteOne({ animal: animal._id }),
      StaffTask.updateMany({ animal: animal._id }, { $set: { animal: null } }),
      animal.deleteOne(),
    ]);

    return res.json({
      success: true,
      message: 'Animal deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete animal.',
      error: error.message,
    });
  }
};

const listTasks = async (req, res) => {
  try {
    const { status, assignedTo } = req.query;
    const filters = {};

    if (status && status !== 'ALL') {
      filters.status = status;
    }

    if (assignedTo && assignedTo !== 'ALL') {
      if (!isValidObjectId(assignedTo)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid assignedTo id.',
        });
      }
      filters.assignedTo = assignedTo;
    }

    const tasks = await StaffTask.find(filters)
      .populate(taskPopulate)
      .sort({ dueDate: 1, createdAt: -1 });

    return res.json({
      success: true,
      data: tasks.map(sanitizeTask),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load tasks.',
      error: error.message,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const {
      title,
      description = '',
      taskType = 'CARE',
      priority = 'MEDIUM',
      assignedTo,
      assignedBy,
      area,
      animal,
      dueDate,
      status = 'TODO',
    } = req.body;

    if (!title || !assignedTo || !assignedBy || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'title, assignedTo, assignedBy and dueDate are required.',
      });
    }

    if (isPastDateTime(dueDate)) {
      return res.status(400).json({
        success: false,
        message: 'Due date cannot be in the past. Please choose the current time or a future time.',
      });
    }

    if (!isValidObjectId(assignedTo) || !isValidObjectId(assignedBy)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid assignedTo or assignedBy id.',
      });
    }

    if (!validTaskTypes.includes(taskType) || !validTaskPriorities.includes(priority) || !validTaskStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task type, priority or status.',
      });
    }

    const assignee = await findAssignableUser(assignedTo);
    if (!assignee) {
      return res.status(400).json({
        success: false,
        message: 'Task assignee must be an existing STAFF or VET user.',
      });
    }

    const task = await StaffTask.create({
      title: title.trim(),
      description: description.trim(),
      taskType,
      priority,
      assignedTo: assignee._id,
      assignedBy,
      area: area && isValidObjectId(area) ? area : null,
      animal: animal && isValidObjectId(animal) ? animal : null,
      dueDate,
      status,
      completedAt: status === 'DONE' ? new Date() : null,
    });

    const populatedTask = await StaffTask.findById(task._id).populate(taskPopulate);

    return res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: sanitizeTask(populatedTask),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create task.',
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task id.',
      });
    }

    const task = await StaffTask.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const allowedFields = [
      'title',
      'description',
      'taskType',
      'priority',
      'assignedTo',
      'assignedBy',
      'area',
      'animal',
      'dueDate',
      'status',
    ];

    if (Object.prototype.hasOwnProperty.call(req.body, 'title') && isBlank(req.body.title)) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required.',
      });
    }

    if (req.body.taskType && !validTaskTypes.includes(req.body.taskType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task type.',
      });
    }

    if (req.body.priority && !validTaskPriorities.includes(req.body.priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task priority.',
      });
    }

    if (req.body.status && !validTaskStatuses.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task status.',
      });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'assignedTo')) {
      const assignee = await findAssignableUser(req.body.assignedTo);
      if (!assignee) {
        return res.status(400).json({
          success: false,
          message: 'Task assignee must be an existing STAFF or VET user.',
        });
      }
      req.body.assignedTo = assignee._id;
    }

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        task[field] = req.body[field] || (['area', 'animal'].includes(field) ? null : req.body[field]);
      }
    });

    if (task.status === 'DONE' && !task.completedAt) {
      task.completedAt = new Date();
    }

    if (task.status !== 'DONE') {
      task.completedAt = null;
    }

    await task.save();

    const populatedTask = await StaffTask.findById(task._id).populate(taskPopulate);

    return res.json({
      success: true,
      message: 'Task updated successfully.',
      data: sanitizeTask(populatedTask),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update task.',
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task id.',
      });
    }

    const task = await StaffTask.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    return res.json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete task.',
      error: error.message,
    });
  }
};

const listTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ ticketType: 1, price: 1 });

    return res.json({
      success: true,
      data: tickets.map(sanitizeTicket),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load tickets.',
      error: error.message,
    });
  }
};

const createTicket = async (req, res) => {
  try {
    const { code, name, ticketType, price, description = '', isActive = true } = req.body;

    if (isBlank(code) || isBlank(name) || !ticketType || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'code, name, ticketType and price are required.',
      });
    }

    if (!validTicketTypes.includes(ticketType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket type.',
      });
    }

    if (!isNonNegativeNumber(price)) {
      return res.status(400).json({
        success: false,
        message: 'Ticket price must be a number greater than or equal to 0.',
      });
    }

    const existingTicket = await Ticket.findOne({ code: code.toUpperCase().trim() });
    if (existingTicket) {
      return res.status(409).json({
        success: false,
        message: 'Ticket code already exists.',
      });
    }

    const ticket = await Ticket.create({
      code: code.toUpperCase().trim(),
      name: name.trim(),
      ticketType,
      price: Number(price),
      description: description.trim(),
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: 'Ticket created successfully.',
      data: sanitizeTicket(ticket),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create ticket.',
      error: error.message,
    });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket id.',
      });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found.',
      });
    }

    const { code, name, ticketType, price, description, isActive } = req.body;

    if (Object.prototype.hasOwnProperty.call(req.body, 'code') && isBlank(code)) {
      return res.status(400).json({
        success: false,
        message: 'Ticket code is required.',
      });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'name') && isBlank(name)) {
      return res.status(400).json({
        success: false,
        message: 'Ticket name is required.',
      });
    }

    if (ticketType && !validTicketTypes.includes(ticketType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket type.',
      });
    }

    if (price !== undefined && !isNonNegativeNumber(price)) {
      return res.status(400).json({
        success: false,
        message: 'Ticket price must be a number greater than or equal to 0.',
      });
    }

    if (code && code.toUpperCase().trim() !== ticket.code) {
      const existingTicket = await Ticket.findOne({ code: code.toUpperCase().trim() });
      if (existingTicket) {
        return res.status(409).json({
          success: false,
          message: 'Ticket code already exists.',
        });
      }
      ticket.code = code.toUpperCase().trim();
    }

    if (name) ticket.name = name.trim();
    if (ticketType) ticket.ticketType = ticketType;
    if (price !== undefined) ticket.price = Number(price);
    if (typeof description === 'string') ticket.description = description.trim();
    if (typeof isActive === 'boolean') ticket.isActive = isActive;

    await ticket.save();

    return res.json({
      success: true,
      message: 'Ticket updated successfully.',
      data: sanitizeTicket(ticket),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update ticket.',
      error: error.message,
    });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket id.',
      });
    }

    const bookingUsingTicket = await Booking.findOne({ 'items.ticket': id });
    if (bookingUsingTicket) {
      return res.status(409).json({
        success: false,
        message: 'This ticket is used in bookings. Disable it instead of deleting.',
      });
    }

    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found.',
      });
    }

    return res.json({
      success: true,
      message: 'Ticket deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete ticket.',
      error: error.message,
    });
  }
};

const listServices = async (req, res) => {
  try {
    const services = await ZooService.find().sort({ category: 1, name: 1 });

    return res.json({
      success: true,
      data: services.map(sanitizeService),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load services.',
      error: error.message,
    });
  }
};

const createService = async (req, res) => {
  try {
    const {
      code,
      name,
      category = 'EVENT',
      description = '',
      price = 0,
      duration,
      durationMinutes = 0,
      isActive = true,
    } = req.body;

    if (isBlank(code) || isBlank(name)) {
      return res.status(400).json({
        success: false,
        message: 'code and name are required.',
      });
    }

    if (!validServiceCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service category.',
      });
    }

    if (!isNonNegativeNumber(price)) {
      return res.status(400).json({
        success: false,
        message: 'Service price must be a number greater than or equal to 0.',
      });
    }

    const serviceDuration = Number(duration ?? durationMinutes ?? 0);
    if (!isPositiveNumber(serviceDuration)) {
      return res.status(400).json({
        success: false,
        message: 'Service duration must be greater than 0 minutes.',
      });
    }

    const existingService = await ZooService.findOne({ code: code.toUpperCase().trim() });
    if (existingService) {
      return res.status(409).json({
        success: false,
        message: 'Service code already exists.',
      });
    }

    const existingServiceName = await ZooService.findOne({ name: new RegExp(`^${escapeRegExp(name.trim())}$`, 'i') });
    if (existingServiceName) {
      return res.status(409).json({
        success: false,
        message: 'Service name already exists.',
      });
    }

    const service = await ZooService.create({
      code: code.toUpperCase().trim(),
      name: name.trim(),
      category,
      description: description.trim(),
      price: Number(price),
      duration: serviceDuration,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: sanitizeService(service),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create service.',
      error: error.message,
    });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service id.',
      });
    }

    const service = await ZooService.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    const { code, name, category, description, price, duration, durationMinutes, isActive } = req.body;

    if (Object.prototype.hasOwnProperty.call(req.body, 'code') && isBlank(code)) {
      return res.status(400).json({
        success: false,
        message: 'Service code is required.',
      });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'name') && isBlank(name)) {
      return res.status(400).json({
        success: false,
        message: 'Service name is required.',
      });
    }

    if (category && !validServiceCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service category.',
      });
    }

    if (price !== undefined && !isNonNegativeNumber(price)) {
      return res.status(400).json({
        success: false,
        message: 'Service price must be a number greater than or equal to 0.',
      });
    }

    if (duration !== undefined || durationMinutes !== undefined) {
      const serviceDuration = Number(duration ?? durationMinutes ?? 0);
      if (!isPositiveNumber(serviceDuration)) {
        return res.status(400).json({
          success: false,
          message: 'Service duration must be greater than 0 minutes.',
        });
      }
    }

    if (code && code.toUpperCase().trim() !== service.code) {
      const existingService = await ZooService.findOne({ code: code.toUpperCase().trim() });
      if (existingService) {
        return res.status(409).json({
          success: false,
          message: 'Service code already exists.',
        });
      }
      service.code = code.toUpperCase().trim();
    }

    if (name && name.trim().toLowerCase() !== service.name.toLowerCase()) {
      const existingServiceName = await ZooService.findOne({
        _id: { $ne: service._id },
        name: new RegExp(`^${escapeRegExp(name.trim())}$`, 'i'),
      });
      if (existingServiceName) {
        return res.status(409).json({
          success: false,
          message: 'Service name already exists.',
        });
      }
    }

    if (name) service.name = name.trim();
    if (category) service.category = category;
    if (typeof description === 'string') service.description = description.trim();
    if (price !== undefined) service.price = Number(price);
    if (duration !== undefined || durationMinutes !== undefined) {
      service.duration = Number(duration ?? durationMinutes ?? 0);
    }
    if (typeof isActive === 'boolean') service.isActive = isActive;

    await service.save();

    return res.json({
      success: true,
      message: 'Service updated successfully.',
      data: sanitizeService(service),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update service.',
      error: error.message,
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service id.',
      });
    }

    const service = await ZooService.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    return res.json({
      success: true,
      message: 'Service deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete service.',
      error: error.message,
    });
  }
};

const listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', '-password')
      .populate('items.ticket')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: bookings.map(sanitizeBooking),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load bookings.',
      error: error.message,
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking id.',
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    if (status && !validBookingStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status.',
      });
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status.',
      });
    }

    if (booking.status === 'CANCELLED' && status === 'USED') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled bookings cannot be marked as used directly.',
      });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    const populatedBooking = await Booking.findById(id)
      .populate('user', '-password')
      .populate('items.ticket');

    return res.json({
      success: true,
      message: 'Booking updated successfully.',
      data: sanitizeBooking(populatedBooking),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update booking.',
      error: error.message,
    });
  }
};

const getReports = async (req, res) => {
  try {
    const [
      users,
      staffCount,
      areasCount,
      animals,
      tasks,
      tickets,
      services,
      bookings,
    ] = await Promise.all([
      User.find().select('-password'),
      User.countDocuments({ role: { $in: ['STAFF', 'VET'] } }),
      ZooArea.countDocuments(),
      Animal.find(),
      StaffTask.find(),
      Ticket.find(),
      ZooService.find(),
      Booking.find().populate('items.ticket'),
    ]);

    const paidBookings = bookings.filter((booking) => booking.paymentStatus === 'PAID');
    const revenue = paidBookings.reduce((total, booking) => total + booking.totalAmount, 0);
    const pendingBookings = bookings.filter((booking) => booking.status === 'PENDING').length;
    const monitoringAnimals = animals.filter((animal) => {
      const healthStatus = normalizeAnimalHealthStatus(animal.healthStatus, animal.status);
      return ['Sick', 'Under Treatment', 'Quarantine'].includes(healthStatus);
    }).length;
    const openTasks = tasks.filter((task) => task.status !== 'DONE').length;

    const bookingStatus = ['PENDING', 'CONFIRMED', 'CANCELLED', 'USED'].map((status) => ({
      status,
      count: bookings.filter((booking) => booking.status === status).length,
    }));

    const taskStatus = ['TODO', 'IN_PROGRESS', 'DONE'].map((status) => ({
      status,
      count: tasks.filter((task) => task.status === status).length,
    }));

    const animalStatus = ['Healthy', 'Sick', 'Under Treatment', 'Quarantine', 'Recovered'].map((status) => ({
      status,
      count: animals.filter((animal) => normalizeAnimalHealthStatus(animal.healthStatus, animal.status) === status).length,
    }));

    const ticketSalesMap = new Map();
    bookings.forEach((booking) => {
      booking.items.forEach((item) => {
        const key = item.ticket?._id?.toString() || 'unknown';
        const current = ticketSalesMap.get(key) || {
          name: item.ticket?.name || 'Unknown ticket',
          quantity: 0,
          revenue: 0,
        };
        current.quantity += item.quantity;
        current.revenue += item.quantity * item.unitPrice;
        ticketSalesMap.set(key, current);
      });
    });

    return res.json({
      success: true,
      data: {
        summary: {
          users: users.length,
          staff: staffCount,
          areas: areasCount,
          animals: animals.length,
          tickets: tickets.length,
          services: services.length,
          bookings: bookings.length,
          pendingBookings,
          revenue,
          openTasks,
          monitoringAnimals,
        },
        bookingStatus,
        taskStatus,
        animalStatus,
        topTickets: Array.from(ticketSalesMap.values()).sort((a, b) => b.revenue - a.revenue),
        recentBookings: bookings
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 5)
          .map(sanitizeBooking),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load reports.',
      error: error.message,
    });
  }
};

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
  listStaff,
  assignStaffArea,
  listAreas,
  listAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  listTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  listServices,
  createService,
  updateService,
  deleteService,
  listBookings,
  updateBookingStatus,
  getReports,
};
