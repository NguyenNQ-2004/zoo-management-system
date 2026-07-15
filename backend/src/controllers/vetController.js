const Animal = require('../models/Animal');
const AnimalHealth = require('../models/AnimalHealth');
const MedicalLog = require('../models/MedicalLog');

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
      { name: 'Mon', healthy: healthyCount - 5, treatment: treatmentCount + 2 },
      { name: 'Tue', healthy: healthyCount - 3, treatment: treatmentCount + 1 },
      { name: 'Wed', healthy: healthyCount - 1, treatment: treatmentCount },
      { name: 'Thu', healthy: healthyCount + 2, treatment: treatmentCount - 1 },
      { name: 'Fri', healthy: healthyCount + 1, treatment: treatmentCount },
      { name: 'Sat', healthy: healthyCount + 3, treatment: treatmentCount - 2 },
      { name: 'Sun', healthy: healthyCount, treatment: treatmentCount },
    ];

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
        id: animal.code,
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
      ref: log.diagnosis ? log.diagnosis.substring(0, 10).toUpperCase() : `#REC-${Math.floor(Math.random() * 10000)}`,
      subject: `${log.animal?.name || 'Unknown'} (${log.animal?.code || 'N/A'})`,
      type: log.treatmentPlan || 'Checkup',
      outcome: log.status === 'CLOSED' ? 'NEGATIVE' : 'PENDING',
      date: new Date(log.visitDate || log.createdAt).toLocaleDateString(),
      vet: log.vet ? log.vet.fullName : 'Dr. Unknown',
      status: log.animal?.status || 'HEALTHY',
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
