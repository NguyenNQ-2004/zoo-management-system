const Animal = require('../models/Animal');
const ZooArea = require('../models/ZooArea');

// GET /api/animals?search=&area=&status=
exports.getAllAnimals = async (req, res) => {
  try {
    const { search, area, status, healthStatus } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { species: { $regex: search, $options: 'i' } },
      ];
    }

    if (area) {
      filter.area = area;
    }

    if (status) {
      filter.status = status;
    }

    if (healthStatus) {
      filter.healthStatus = healthStatus;
    }

    const animals = await Animal.find(filter)
      .populate('area', 'name code status')
      .populate('caretaker', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(animals);
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
    res.json(animal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/animals
exports.createAnimal = async (req, res) => {
  try {
    const { code, name, species, gender, age, healthStatus, behavior, origin, area, status, notes } = req.body;

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
      gender,
      age,
      healthStatus,
      behavior,
      origin,
      area,
      status,
      notes,
    });

    const populatedAnimal = await Animal.findById(animal._id)
      .populate('area', 'name code status');

    res.status(201).json(populatedAnimal);
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

    const { code, name, species, gender, age, healthStatus, behavior, origin, area, status, notes } = req.body;

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
    animal.gender = gender || animal.gender;
    animal.age = age !== undefined ? age : animal.age;
    animal.healthStatus = healthStatus || animal.healthStatus;
    animal.behavior = behavior !== undefined ? behavior : animal.behavior;
    animal.origin = origin !== undefined ? origin : animal.origin;
    animal.area = area || animal.area;
    animal.status = status || animal.status;
    animal.notes = notes !== undefined ? notes : animal.notes;

    const updatedAnimal = await animal.save();
    const populatedAnimal = await Animal.findById(updatedAnimal._id)
      .populate('area', 'name code status');

    res.json(populatedAnimal);
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

    animal.area = area;
    const updatedAnimal = await animal.save();
    const populatedAnimal = await Animal.findById(updatedAnimal._id)
      .populate('area', 'name code status');

    res.json(populatedAnimal);
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

    animal.status = status;
    const updatedAnimal = await animal.save();
    res.json(updatedAnimal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
