const ZooService = require('../models/ZooService');

// GET /api/services
exports.getAllServices = async (req, res) => {
  try {
    const services = await ZooService.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/services
exports.createService = async (req, res) => {
  try {
    const { code, name, category, description, price, duration, isActive } = req.body;

    const existingService = await ZooService.findOne({ code: code.toUpperCase() });
    if (existingService) {
      return res.status(400).json({ message: `Service with code '${code}' already exists` });
    }

    const service = await ZooService.create({
      code,
      name,
      category,
      description,
      price,
      duration,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json(service);
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

    const { code, name, category, description, price, duration, isActive } = req.body;

    // Check for duplicate code if it's being changed
    if (code && code.toUpperCase() !== service.code) {
      const existingService = await ZooService.findOne({ code: code.toUpperCase() });
      if (existingService) {
        return res.status(400).json({ message: `Service with code '${code}' already exists` });
      }
    }

    service.code = code || service.code;
    service.name = name || service.name;
    service.category = category !== undefined ? category : service.category;
    service.description = description !== undefined ? description : service.description;
    service.price = price !== undefined ? price : service.price;
    service.duration = duration !== undefined ? duration : service.duration;
    service.isActive = isActive !== undefined ? isActive : service.isActive;

    const updatedService = await service.save();
    res.json(updatedService);
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
    res.json(updatedService);
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
