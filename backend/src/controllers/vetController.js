const mongoose = require('mongoose');
const Animal = require('../models/Animal');
const AnimalHealth = require('../models/AnimalHealth');
const MedicalLog = require('../models/MedicalLog');
const Treatment = require('../models/Treatment');
const Notification = require('../models/Notification');

// Get dashboard stats (For Task 46)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalAnimals = await Animal.countDocuments();
    const healthyCount = await Animal.countDocuments({ status: 'HEALTHY' });
    const monitoringCount = await Animal.countDocuments({ status: 'OBSERVATION' });
    const treatmentCount = await Animal.countDocuments({ status: 'TREATMENT' });
    const criticalCount = await AnimalHealth.countDocuments({ condition: 'CRITICAL' });

    // Mock trend data or calculate from DB (simplified for now)
    const trends = [
      { name: 'Mon', healthy: Math.max(0, healthyCount - 5), treatment: Math.max(0, treatmentCount + 2) },
      { name: 'Tue', healthy: Math.max(0, healthyCount - 3), treatment: Math.max(0, treatmentCount + 1) },
      { name: 'Wed', healthy: Math.max(0, healthyCount - 1), treatment: Math.max(0, treatmentCount) },
      { name: 'Thu', healthy: Math.max(0, healthyCount + 2), treatment: Math.max(0, treatmentCount - 1) },
      { name: 'Fri', healthy: Math.max(0, healthyCount + 1), treatment: Math.max(0, treatmentCount) },
      { name: 'Sat', healthy: Math.max(0, healthyCount + 3), treatment: Math.max(0, treatmentCount - 2) },
      { name: 'Sun', healthy: Math.max(0, healthyCount), treatment: Math.max(0, treatmentCount) },
    ];

    // Generate 30 days of mock trend data
    const trends30Days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      // Create some realistic looking variations based on the real counts
      const hOffset = Math.floor(Math.sin(i * 0.5) * 8); 
      const tOffset = Math.floor(Math.cos(i * 0.5) * 4);
      trends30Days.push({
        name: dayName,
        healthy: Math.max(0, healthyCount + hOffset),
        treatment: Math.max(0, treatmentCount + tOffset)
      });
    }

    // Critical watchlist
    const criticalHealths = await AnimalHealth.find({ condition: 'CRITICAL' })
      .populate('animal')
      .limit(5)
      .lean();

    const watchlist = criticalHealths.map(h => ({
      id: h.animal?.code || 'N/A',
      name: h.animal?.name || 'Unknown',
      species: h.animal?.species || 'Unknown',
      status: 'CRITICAL',
      issue: h.notes || 'Critical Condition',
      lastCheck: new Date(h.lastCheckDate).toLocaleString()
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          total: totalAnimals,
          healthy: healthyCount,
          monitoring: monitoringCount,
          treatment: treatmentCount,
          critical: criticalCount
        },
        trends,
        trends30Days,
        watchlist
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all animals with their health status and last check (For Task 47)
exports.getAnimalHealthStatus = async (req, res) => {
  try {
    const { search, status, area } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { species: { $regex: search, $options: 'i' } }
      ];
    }

    const animals = await Animal.find(query).populate('area').lean();

    const enhancedAnimals = await Promise.all(animals.map(async (animal) => {
      const health = await AnimalHealth.findOne({ animal: animal._id }).lean();
      const resolvedStatus = health?.condition === 'CRITICAL'
        ? 'CRITICAL'
        : health?.condition === 'MONITORING'
          ? 'MONITORING'
          : animal.status;

      return {
        id: animal._id,
        code: animal.code,
        name: animal.name,
        species: animal.species,
        area: animal.area ? animal.area.name : 'Unknown',
        status: resolvedStatus,
        lastCheck: health ? new Date(health.lastCheckDate).toLocaleString() : new Date(animal.updatedAt).toLocaleString(),
        image: `https://ui-avatars.com/api/?name=${animal.name}&background=random`
      };
    }));

    const filteredAnimals = enhancedAnimals.filter((animal) => {
      const matchesStatus = !status || animal.status === status;
      const matchesArea = !area || animal.area.toLowerCase().includes(area.toLowerCase());
      return matchesStatus && matchesArea;
    });

    res.status(200).json({
      success: true,
      data: filteredAnimals
    });
  } catch (error) {
    console.error('Error fetching animal health status:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get health records archive (For Task 48)
exports.getHealthRecordsArchive = async (req, res) => {
  try {
    const { search, status, category, date, vetId, area } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { diagnosis: { $regex: search, $options: 'i' } },
        { symptoms: { $regex: search, $options: 'i' } },
        { treatmentPlan: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;

    let logs = await MedicalLog.find(query)
      .populate({ path: 'animal', populate: { path: 'area' } })
      .populate('vet')
      .sort({ visitDate: -1, createdAt: -1 })
      .lean();

    if (category) {
      const normalizedCategory = category.toLowerCase();
      logs = logs.filter((log) => {
        const haystack = `${log.diagnosis || ''} ${log.treatmentPlan || ''} ${log.symptoms || ''}`.toLowerCase();
        return haystack.includes(normalizedCategory);
      });
    }

    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      logs = logs.filter((log) => {
        const visitDate = new Date(log.visitDate || log.createdAt);
        return visitDate >= selectedDate && visitDate < nextDay;
      });
    }

    if (vetId) {
      logs = logs.filter((log) => {
        const vetName = log.vet?.fullName?.toLowerCase() || '';
        const vetMatch = log.vet?._id?.toString() === vetId || vetName.includes(vetId.toLowerCase());
        return vetMatch;
      });
    }

    if (area) {
      logs = logs.filter((log) => {
        const areaName = log.animal?.area?.name || '';
        return areaName.toLowerCase().includes(area.toLowerCase());
      });
    }

    const formattedLogs = logs.map((log) => ({
      id: log._id,
      animalId: log.animal?._id,
      ref: log.diagnosis ? log.diagnosis.substring(0, 10).toUpperCase() : `#REC-${Math.floor(Math.random() * 10000)}`,
      subject: `${log.animal?.name || 'Unknown'} (${log.animal?.code || 'N/A'})`,
      type: log.treatmentPlan || 'Checkup',
      outcome: log.status === 'CLOSED' ? 'NEGATIVE' : 'PENDING',
      date: new Date(log.visitDate || log.createdAt).toLocaleDateString(),
      vet: log.vet ? log.vet.fullName : 'Dr. Unknown',
      status: log.animal?.status || 'HEALTHY',
      area: log.animal?.area?.name || 'Unknown',
      image: `https://ui-avatars.com/api/?name=${log.animal?.name || 'Unknown'}&background=random`,
      procedure: log.diagnosis || 'Routine Procedure'
    }));

    const cards = formattedLogs.slice(0, 3).map((log) => ({
      id: log.subject.match(/\(([^)]+)\)/)?.[1] || log.ref,
      name: log.subject.split(' (')[0],
      procedure: log.procedure,
      date: log.date,
      vet: log.vet,
      status: log.status,
      image: log.image
    }));

    res.status(200).json({
      success: true,
      data: {
        cards,
        logs: formattedLogs
      }
    });
  } catch (error) {
    console.error('Error fetching health records:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET /animals/:id/health (Task 49)
exports.getAnimalHealthDetail = async (req, res) => {
  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      query._id = req.params.id;
    } else {
      query.code = req.params.id;
    }
    const animal = await Animal.findOne(query).populate('area').lean();
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });

    let health = await AnimalHealth.findOne({ animal: animal._id }).lean();
    if (!health) {
      health = { weightKg: 0, temperatureC: 0, appetite: 'NORMAL', condition: 'STABLE', notes: '' };
    }

    const logs = await MedicalLog.find({ animal: animal._id }).sort({ date: -1 }).lean();
    const treatments = await Treatment.find({ animal: animal._id }).sort({ startDate: -1 }).lean();

    res.status(200).json({
      success: true,
      data: {
        animal: {
          id: animal._id,
          code: animal.code,
          name: animal.name,
          species: animal.species,
          area: animal.area ? animal.area.name : 'Unknown',
          status: animal.status,
          image: `https://ui-avatars.com/api/?name=${animal.name}&background=random`
        },
        health,
        logs,
        treatments
      }
    });
  } catch (error) {
    console.error('Error in getAnimalHealthDetail:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// PUT /animals/:id/health-status (Task 50)
exports.updateAnimalHealthStatus = async (req, res) => {
  try {
    const { condition, weightKg, temperatureC, appetite, notes } = req.body;
    
    let query = {};
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      query._id = req.params.id;
    } else {
      query.code = req.params.id;
    }
    const animal = await Animal.findOne(query);
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });

    // Find or create AnimalHealth
    let health = await AnimalHealth.findOne({ animal: animal._id });
    if (!health) {
      health = new AnimalHealth({ animal: animal._id });
    }
    
    if (weightKg !== undefined) health.weightKg = weightKg;
    if (temperatureC !== undefined) health.temperatureC = temperatureC;
    if (appetite !== undefined) health.appetite = appetite;
    if (condition !== undefined) health.condition = condition;
    if (notes !== undefined) health.notes = notes;
    health.lastCheckDate = new Date();
    health.checkedBy = req.user ? req.user.id : null; 
    await health.save();

    let animalStatus = 'HEALTHY';
    if (condition === 'MONITORING') animalStatus = 'OBSERVATION';
    if (condition === 'CRITICAL') animalStatus = 'TREATMENT';
    await Animal.findByIdAndUpdate(animal._id, { status: animalStatus });

    res.status(200).json({ success: true, data: health, message: 'Health status updated' });
  } catch (error) {
    console.error('Error updating health status:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// POST /animals/:id/medical-logs (Task 51)
exports.createMedicalLog = async (req, res) => {
  try {
    const { diagnosis, symptoms, treatmentPlan, notes, type, status } = req.body;
    
    let query = {};
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      query._id = req.params.id;
    } else {
      query.code = req.params.id;
    }
    const animal = await Animal.findOne(query);
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });

    const newLog = new MedicalLog({
      animal: animal._id,
      vet: req.user ? req.user.id : null,
      diagnosis,
      symptoms,
      treatmentPlan,
      notes,
      type: type || 'CHECKUP',
      status: status || 'COMPLETED',
      date: new Date()
    });

    await newLog.save();
    res.status(201).json({ success: true, data: newLog, message: 'Medical log created' });
  } catch (error) {
    console.error('Error creating medical log:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// POST /animals/:id/treatments (Task 52)
exports.createTreatmentPlan = async (req, res) => {
  try {
    const { title, medication, dosage, schedule, startDate, endDate, medicalLogId } = req.body;
    
    let query = {};
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      query._id = req.params.id;
    } else {
      query.code = req.params.id;
    }
    const animal = await Animal.findOne(query);
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });

    const treatment = new Treatment({
      animal: animal._id,
      vet: req.user ? req.user.id : null,
      medicalLog: medicalLogId || null,
      title,
      medication,
      dosage,
      schedule,
      startDate: startDate || new Date(),
      endDate,
      status: 'PLANNED'
    });

    await treatment.save();
    res.status(201).json({ success: true, data: treatment, message: 'Treatment plan created' });
  } catch (error) {
    console.error('Error creating treatment plan:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// PUT /treatments/:id/status (Task 53)
exports.updateTreatmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) return res.status(404).json({ success: false, message: 'Treatment not found' });

    treatment.status = status;
    await treatment.save();

    res.status(200).json({ success: true, data: treatment, message: 'Treatment status updated' });
  } catch (error) {
    console.error('Error updating treatment status:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET /treatments (List Treatment Plans)
exports.getAllTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.find()
      .populate('animal')
      .populate('vet')
      .sort({ startDate: -1 })
      .lean();

    res.status(200).json({ success: true, data: treatments });
  } catch (error) {
    console.error('Error fetching treatments:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET /treatments/:id (Treatment Detail)
exports.getTreatmentDetail = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id)
      .populate('animal')
      .populate('vet')
      .lean();

    if (!treatment) return res.status(404).json({ success: false, message: 'Treatment not found' });

    res.status(200).json({ success: true, data: treatment });
  } catch (error) {
    console.error('Error fetching treatment detail:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET /animals/:id/medical-history (Task 60)
exports.getMedicalHistory = async (req, res) => {
  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      query._id = req.params.id;
    } else {
      query.code = req.params.id;
    }
    const animal = await Animal.findOne(query).populate('area').lean();
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });

    const logs = await MedicalLog.find({ animal: animal._id }).sort({ date: -1 }).lean();
    const treatments = await Treatment.find({ animal: animal._id }).sort({ startDate: -1 }).lean();
    const health = await AnimalHealth.findOne({ animal: animal._id }).lean();

    // Group logs or extract diagnoses
    // Diagnoses in design: Chronic and Resolved
    const diagnoses = logs.filter(l => l.diagnosis).map(l => ({
      title: l.diagnosis,
      type: l.severity === 'HIGH' ? 'CHRONIC' : 'RESOLVED',
      date: new Date(l.date).toLocaleDateString(),
      notes: l.notes || l.symptoms || ''
    }));

    res.status(200).json({
      success: true,
      data: {
        animal: {
          id: animal._id,
          code: animal.code,
          name: animal.name,
          species: animal.species,
          area: animal.area ? animal.area.name : 'Unknown',
          status: animal.status,
          image: `https://ui-avatars.com/api/?name=${animal.name}&background=random`
        },
        health: health || { weightKg: 0, temperatureC: 0, appetite: 'NORMAL', condition: 'STABLE', notes: '' },
        logs,
        treatments,
        diagnoses
      }
    });
  } catch (error) {
    console.error('Error fetching medical history:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// --- Notifications & Reports ---
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [{ targetRole: 'VET' }, { targetRole: 'ALL' }, { sender: req.user?._id }]
    }).sort({ createdAt: -1 }).populate('animal', 'name code').populate('sender', 'fullName role');

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createReport = async (req, res) => {
  try {
    const { title, message, priority, targetRole, animalId } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const report = new Notification({
      title,
      message,
      type: 'REPORT',
      priority: priority || 'NORMAL',
      targetRole: targetRole || 'ALL',
      animal: animalId || undefined,
      sender: req.user?._id
    });

    await report.save();
    
    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
