const Animal = require('../models/Animal');
const ZooArea = require('../models/ZooArea');

const normalizeGender = (gender) => {
  const value = String(gender || '').toUpperCase();
  if (value === 'MALE') return 'Male';
  if (value === 'FEMALE') return 'Female';
  return ['Male', 'Female', 'Unknown'].includes(gender) ? gender : 'Unknown';
};

const normalizeHealthStatus = (healthStatus, legacyStatus) => {
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
  animal.gender = normalizeGender(animal.gender);
  animal.healthStatus = normalizeHealthStatus(animal.healthStatus, animal.status);
  animal.status = normalizeAnimalStatus(animal.status);
  return animal;
};

const serializeAnimal = (animal) => {
  const plainAnimal = typeof animal.toObject === 'function' ? animal.toObject() : animal;
  return {
    ...plainAnimal,
    gender: normalizeGender(plainAnimal.gender),
    healthStatus: normalizeHealthStatus(plainAnimal.healthStatus, plainAnimal.status),
    status: normalizeAnimalStatus(plainAnimal.status),
  };
};

// GET /api/animals?search=&area=&status=
exports.getAllAnimals = async (req, res) => {
  try {
    const { search, area, status, healthStatus } = req.query;
    const filter = {};
    const andConditions = [];

    if (search) {
      andConditions.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { species: { $regex: search, $options: 'i' } },
        ],
      });
    }

    if (area) {
      filter.area = area;
    }

    if (status) {
      const normalizedStatus = normalizeAnimalStatus(status);
      filter.status = normalizedStatus === 'Active'
        ? { $in: ['Active', 'HEALTHY', 'OBSERVATION', 'TREATMENT'] }
        : normalizedStatus;
    }

    if (healthStatus) {
      const normalizedHealthStatus = normalizeHealthStatus(healthStatus);
      andConditions.push({
        $or: [
          { healthStatus: normalizedHealthStatus },
          ...(normalizedHealthStatus === 'Healthy' ? [{ status: 'HEALTHY' }] : []),
          ...(normalizedHealthStatus === 'Under Treatment' ? [{ status: 'TREATMENT' }] : []),
          ...(normalizedHealthStatus === 'Sick' ? [{ status: 'OBSERVATION' }] : []),
        ],
      });
    }

    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }

    const animals = await Animal.find(filter)
      .populate('area', 'name code status')
      .populate('caretaker', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(animals.map(serializeAnimal));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /api/animals/:id
exports.getAnimalById = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id)
      .populate('area', 'name code status')
      .populate('caretaker', 'fullName email');

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }
    res.json(serializeAnimal(animal));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/animals
exports.createAnimal = async (req, res) => {
  try {
    const { code, name, species, gender, age, healthStatus, behavior, origin, area, status, notes, imageUrl = '' } = req.body;

    const existingAnimal = await Animal.findOne({ code: code.toUpperCase() });
    if (existingAnimal) {
      return res.status(400).json({ message: `Animal with code '${code}' already exists` });
    }

    // Validate area exists
    const areaExists = await ZooArea.findById(area);
    if (!areaExists) {
      return res.status(400).json({ message: 'Specified area does not exist' });
    }

    const animal = await Animal.create({
      code,
      name,
      species,
      gender: normalizeGender(gender),
      age,
      healthStatus: normalizeHealthStatus(healthStatus, status),
      behavior,
      origin,
      area,
      status: normalizeAnimalStatus(status),
      notes,
      imageUrl,
    });

    const populatedAnimal = await Animal.findById(animal._id)
      .populate('area', 'name code status');

    res.status(201).json(serializeAnimal(populatedAnimal));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /api/animals/:id
exports.updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    const { code, name, species, gender, age, healthStatus, behavior, origin, area, status, notes, imageUrl } = req.body;

    normalizeAnimalDoc(animal);

    // Check for duplicate code if it's being changed
    if (code && code.toUpperCase() !== animal.code) {
      const existingAnimal = await Animal.findOne({ code: code.toUpperCase() });
      if (existingAnimal) {
        return res.status(400).json({ message: `Animal with code '${code}' already exists` });
      }
    }

    // Validate area if changed
    if (area && area !== animal.area.toString()) {
      const areaExists = await ZooArea.findById(area);
      if (!areaExists) {
        return res.status(400).json({ message: 'Specified area does not exist' });
      }
    }

    animal.code = code || animal.code;
    animal.name = name || animal.name;
    animal.species = species || animal.species;
    animal.gender = gender ? normalizeGender(gender) : animal.gender;
    animal.age = age !== undefined ? age : animal.age;
    animal.healthStatus = healthStatus ? normalizeHealthStatus(healthStatus, status) : animal.healthStatus;
    animal.behavior = behavior !== undefined ? behavior : animal.behavior;
    animal.origin = origin !== undefined ? origin : animal.origin;
    animal.area = area || animal.area;
    animal.status = status ? normalizeAnimalStatus(status) : animal.status;
    animal.notes = notes !== undefined ? notes : animal.notes;
    animal.imageUrl = imageUrl !== undefined ? imageUrl : animal.imageUrl;

    const updatedAnimal = await animal.save();
    const populatedAnimal = await Animal.findById(updatedAnimal._id)
      .populate('area', 'name code status');

    res.json(serializeAnimal(populatedAnimal));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// DELETE /api/animals/:id
exports.deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    await Animal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /api/animals/:id/area
exports.updateAnimalArea = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    const { area } = req.body;
    if (!area) {
      return res.status(400).json({ message: 'Area ID is required' });
    }

    const areaExists = await ZooArea.findById(area);
    if (!areaExists) {
      return res.status(400).json({ message: 'Specified area does not exist' });
    }

    normalizeAnimalDoc(animal);
    animal.area = area;
    const updatedAnimal = await animal.save();
    const populatedAnimal = await Animal.findById(updatedAnimal._id)
      .populate('area', 'name code status');

    res.json(serializeAnimal(populatedAnimal));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /api/animals/:id/status
exports.updateAnimalStatus = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    normalizeAnimalDoc(animal);
    animal.status = normalizeAnimalStatus(status);
    const updatedAnimal = await animal.save();
    res.json(serializeAnimal(updatedAnimal));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
