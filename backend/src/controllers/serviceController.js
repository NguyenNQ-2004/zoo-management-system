const ZooService = require('../models/ZooService');

const isBlank = (value) => typeof value !== 'string' || value.trim() === '';
const isNonNegativeNumber = (value) => Number.isFinite(Number(value)) && Number(value) >= 0;
const isPositiveNumber = (value) => Number.isFinite(Number(value)) && Number(value) > 0;
const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const serializeService = (service) => {
  const plainService = typeof service.toObject === 'function' ? service.toObject() : service;
  const duration = plainService.duration ?? plainService.durationMinutes ?? 0;
  return {
    ...plainService,
    duration,
    durationMinutes: duration,
  };
};

// GET /api/services
exports.getAllServices = async (req, res) => {
  try {
    const services = await ZooService.find().sort({ createdAt: -1 });
    res.json(services.map(serializeService));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/services
exports.createService = async (req, res) => {
  try {
    const { code, name, category, description, price, duration, durationMinutes, isActive } = req.body;
    const servicePrice = Number(price ?? 0);
    const serviceDuration = Number(duration ?? durationMinutes ?? 0);

    if (isBlank(code) || isBlank(name)) {
      return res.status(400).json({ message: 'code and name are required.' });
    }

    if (!isNonNegativeNumber(servicePrice)) {
      return res.status(400).json({ message: 'Service price must be a number greater than or equal to 0.' });
    }

    if (!isPositiveNumber(serviceDuration)) {
      return res.status(400).json({ message: 'Service duration must be greater than 0 minutes.' });
    }

    const existingService = await ZooService.findOne({ code: code.toUpperCase().trim() });
    if (existingService) {
      return res.status(400).json({ message: `Service with code '${code}' already exists` });
    }

    const existingServiceName = await ZooService.findOne({ name: new RegExp(`^${escapeRegExp(name.trim())}$`, 'i') });
    if (existingServiceName) {
      return res.status(409).json({ message: 'Service name already exists.' });
    }

    const service = await ZooService.create({
      code: code.toUpperCase().trim(),
      name: name.trim(),
      category,
      description,
      price: servicePrice,
      duration: serviceDuration,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json(serializeService(service));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /api/services/:id
exports.updateService = async (req, res) => {
  try {
    const service = await ZooService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const { code, name, category, description, price, duration, durationMinutes, isActive } = req.body;

    if (Object.prototype.hasOwnProperty.call(req.body, 'code') && isBlank(code)) {
      return res.status(400).json({ message: 'Service code is required.' });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'name') && isBlank(name)) {
      return res.status(400).json({ message: 'Service name is required.' });
    }

    if (price !== undefined && !isNonNegativeNumber(price)) {
      return res.status(400).json({ message: 'Service price must be a number greater than or equal to 0.' });
    }

    if (duration !== undefined || durationMinutes !== undefined) {
      const serviceDuration = Number(duration ?? durationMinutes ?? 0);
      if (!isPositiveNumber(serviceDuration)) {
        return res.status(400).json({ message: 'Service duration must be greater than 0 minutes.' });
      }
    }

    // Check for duplicate code if it's being changed
    if (code && code.toUpperCase().trim() !== service.code) {
      const existingService = await ZooService.findOne({ code: code.toUpperCase().trim() });
      if (existingService) {
        return res.status(400).json({ message: `Service with code '${code}' already exists` });
      }
    }

    if (name && name.trim().toLowerCase() !== service.name.toLowerCase()) {
      const existingServiceName = await ZooService.findOne({
        _id: { $ne: service._id },
        name: new RegExp(`^${escapeRegExp(name.trim())}$`, 'i'),
      });
      if (existingServiceName) {
        return res.status(409).json({ message: 'Service name already exists.' });
      }
    }

    service.code = code ? code.toUpperCase().trim() : service.code;
    service.name = name ? name.trim() : service.name;
    service.category = category !== undefined ? category : service.category;
    service.description = description !== undefined ? description : service.description;
    service.price = price !== undefined ? price : service.price;
    service.duration = duration !== undefined || durationMinutes !== undefined
      ? Number(duration ?? durationMinutes ?? 0)
      : service.duration;
    service.isActive = isActive !== undefined ? isActive : service.isActive;

    const updatedService = await service.save();
    res.json(serializeService(updatedService));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /api/services/:id/status
exports.toggleServiceStatus = async (req, res) => {
  try {
    const service = await ZooService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.isActive = !service.isActive;
    const updatedService = await service.save();
    res.json(serializeService(updatedService));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// DELETE /api/services/:id
exports.deleteService = async (req, res) => {
  try {
    const service = await ZooService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await ZooService.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
