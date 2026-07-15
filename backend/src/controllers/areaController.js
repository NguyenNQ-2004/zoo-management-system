const ZooArea = require('../models/ZooArea');
const Animal = require('../models/Animal');

const normalizeAreaStatus = (status) => {
  if (['Open', 'Maintenance', 'Closed'].includes(status)) return status;
  const value = String(status || '').toUpperCase();
  if (value === 'MAINTENANCE') return 'Maintenance';
  if (value === 'CLOSED') return 'Closed';
  return 'Open';
};

const normalizeAreaDoc = (area) => {
  if (area) area.status = normalizeAreaStatus(area.status);
  return area;
};

const serializeArea = (area) => {
  const plainArea = typeof area.toObject === 'function' ? area.toObject() : area;
  return {
    ...plainArea,
    status: normalizeAreaStatus(plainArea.status),
  };
};

// GET /api/areas
exports.getAllAreas = async (req, res) => {
  try {
    const areas = await ZooArea.find()
      .populate('manager', 'fullName email')
      .populate('assignedStaff', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(areas.map(serializeArea));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /api/areas/:id
exports.getAreaById = async (req, res) => {
  try {
    const area = await ZooArea.findById(req.params.id)
      .populate('manager', 'fullName email')
      .populate('assignedStaff', 'fullName email');

    if (!area) {
      return res.status(404).json({ message: 'Area not found' });
    }
    res.json(serializeArea(area));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/areas
exports.createArea = async (req, res) => {
  try {
    const { code, name, description, habitatType, status, location, capacity } = req.body;

    const existingArea = await ZooArea.findOne({ code: code.toUpperCase() });
    if (existingArea) {
      return res.status(400).json({ message: `Area with code '${code}' already exists` });
    }

    const area = await ZooArea.create({
      code,
      name,
      description,
      habitatType,
      status: normalizeAreaStatus(status),
      location,
      capacity,
    });

    res.status(201).json(area);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /api/areas/:id
exports.updateArea = async (req, res) => {
  try {
    const area = await ZooArea.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ message: 'Area not found' });
    }

    const { code, name, description, habitatType, status, location, capacity } = req.body;

    // Check for duplicate code if it's being changed
    if (code && code.toUpperCase() !== area.code) {
      const existingArea = await ZooArea.findOne({ code: code.toUpperCase() });
      if (existingArea) {
        return res.status(400).json({ message: `Area with code '${code}' already exists` });
      }
    }

    area.code = code || area.code;
    area.name = name || area.name;
    area.description = description !== undefined ? description : area.description;
    area.habitatType = habitatType || area.habitatType;
    normalizeAreaDoc(area);
    area.status = status ? normalizeAreaStatus(status) : area.status;
    area.location = location !== undefined ? location : area.location;
    area.capacity = capacity !== undefined ? capacity : area.capacity;

    const updatedArea = await area.save();
    res.json(updatedArea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// DELETE /api/areas/:id
exports.deleteArea = async (req, res) => {
  try {
    const area = await ZooArea.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ message: 'Area not found' });
    }

    // Check if any animals are assigned to this area
    const animalsInArea = await Animal.countDocuments({ area: req.params.id });
    if (animalsInArea > 0) {
      return res.status(400).json({
        message: `Cannot delete area. ${animalsInArea} animal(s) are still assigned to this area.`,
      });
    }

    await ZooArea.findByIdAndDelete(req.params.id);
    res.json({ message: 'Area deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
