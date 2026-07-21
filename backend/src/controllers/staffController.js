const User = require('../models/User');
const StaffTask = require('../models/StaffTask');
const CareLog = require('../models/CareLog');
const Animal = require('../models/Animal');
const AnimalHealth = require('../models/AnimalHealth');
const ZooArea = require('../models/ZooArea');
const {
  careStatusToHealthStatus,
  healthStatusToCareStatus,
} = require('../utils/animalStatus');

const startOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const endOfDay = (date) => {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
};

const normalizeStatus = (status) => {
  const labels = {
    TODO: 'Pending',
    IN_PROGRESS: 'In Progress',
    DONE: 'Completed',
  };

  return labels[status] || status;
};

const normalizePriority = (priority) => {
  const labels = {
    LOW: 'Low',
    MEDIUM: 'Normal',
    HIGH: 'High',
  };

  return labels[priority] || priority;
};

const formatTime = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

const formatDateTime = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getStaffFromRequest = async (req) => {
  const staffEmail = req.headers['x-staff-email'] || req.query.email || 'staff@zoo.com';
  return User.findOne({ email: staffEmail, role: 'STAFF' }).select('_id email fullName role');
};

const mapTask = (task) => ({
  id: task._id,
  title: task.title,
  description: task.description,
  taskType: task.taskType,
  location: task.area?.location || task.area?.name || 'Unassigned',
  areaName: task.area?.name || '',
  animalName: task.animal?.name || '',
  animalSpecies: task.animal?.species || '',
  priority: normalizePriority(task.priority),
  rawPriority: task.priority,
  status: normalizeStatus(task.status),
  rawStatus: task.status,
  dueDate: task.dueDate,
  completedAt: task.completedAt,
  completed: task.status === 'DONE',
});

const mapAnimal = (animal, latestLog = null, latestHealth = null) => ({
  id: animal._id,
  code: animal.code,
  name: animal.name,
  species: animal.species,
  scientificName: animal.scientificName,
  gender: animal.gender,
  dateOfBirth: animal.dateOfBirth,
  origin: animal.origin,
  diet: animal.diet,
  status: healthStatusToCareStatus(animal.healthStatus),
  healthStatus: animal.healthStatus,
  operationalStatus: animal.status,
  area: animal.area?.name || '',
  areaLocation: animal.area?.location || '',
  notes: animal.notes,
  lastCareLog: latestLog ? {
    id: latestLog._id,
    careType: latestLog.careType,
    notes: latestLog.notes,
    loggedAt: latestLog.loggedAt,
    time: formatTime(latestLog.loggedAt),
  } : null,
  latestHealth: latestHealth ? {
    weightKg: latestHealth.weightKg,
    temperatureC: latestHealth.temperatureC,
    appetite: latestHealth.appetite,
    condition: latestHealth.condition,
    notes: latestHealth.notes,
    lastCheckDate: latestHealth.lastCheckDate,
  } : null,
});

const getAssignedAnimalIds = async (staffId) => {
  const [taskAnimalIds, areaIds] = await Promise.all([
    StaffTask.distinct('animal', { assignedTo: staffId, animal: { $ne: null } }),
    ZooArea.distinct('_id', { assignedStaff: staffId }),
  ]);

  return { taskAnimalIds, areaIds };
};

const buildAssignedAnimalQuery = async (staffId) => {
  const { taskAnimalIds, areaIds } = await getAssignedAnimalIds(staffId);

  return {
    $or: [
      { caretaker: staffId },
      { _id: { $in: taskAnimalIds } },
      { area: { $in: areaIds } },
    ],
  };
};

const getLatestLogMap = async (animalIds) => {
  const logs = await CareLog.find({ animal: { $in: animalIds } })
    .sort({ loggedAt: -1 })
    .populate('staff', 'email fullName');

  return logs.reduce((result, log) => {
    const id = String(log.animal);
    if (!result[id]) result[id] = log;
    return result;
  }, {});
};

const getLatestHealthMap = async (animalIds) => {
  const records = await AnimalHealth.find({ animal: { $in: animalIds } }).sort({ lastCheckDate: -1 });

  return records.reduce((result, record) => {
    const id = String(record.animal);
    if (!result[id]) result[id] = record;
    return result;
  }, {});
};

const parseTaskStatus = (status) => {
  const normalized = String(status || '').trim().toUpperCase().replace(/[\s-]+/g, '_');
  const aliases = {
    PENDING: 'TODO',
    TODO: 'TODO',
    TO_DO: 'TODO',
    IN_PROGRESS: 'IN_PROGRESS',
    STARTED: 'IN_PROGRESS',
    DONE: 'DONE',
    COMPLETED: 'DONE',
  };

  return aliases[normalized] || null;
};

const parseTaskPriority = (priority) => {
  const normalized = String(priority || '').trim().toUpperCase();
  const aliases = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    NORMAL: 'MEDIUM',
    HIGH: 'HIGH',
  };

  return aliases[normalized] || null;
};

const parseAnimalStatus = (status) => careStatusToHealthStatus(status);

const mapCareLog = (log) => ({
  id: log._id,
  careType: log.careType,
  notes: log.notes,
  loggedAt: log.loggedAt,
  date: formatDate(log.loggedAt),
  time: formatTime(log.loggedAt),
  animalId: log.animal?._id || '',
  animalName: log.animal?.name || 'Unknown animal',
  animalSpecies: log.animal?.species || '',
  taskId: log.task?._id || '',
  taskTitle: log.task?.title || '',
  staffName: log.staff?.fullName || log.staff?.email || '',
});

exports.getStaffDashboard = async (req, res) => {
  try {
    const staff = await getStaffFromRequest(req);

    if (!staff) {
      return res.status(404).json({ message: 'Staff user not found' });
    }

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const [totalAssigned, pendingTasks, completedTodayTasks, completedCareLogs, tasks, animals, recentCareLogs] =
      await Promise.all([
        StaffTask.countDocuments({ assignedTo: staff._id }),
        StaffTask.countDocuments({ assignedTo: staff._id, status: { $in: ['TODO', 'IN_PROGRESS'] } }),
        StaffTask.countDocuments({
          assignedTo: staff._id,
          status: 'DONE',
          completedAt: { $gte: todayStart, $lte: todayEnd },
        }),
        CareLog.countDocuments({
          staff: staff._id,
          loggedAt: { $gte: todayStart, $lte: todayEnd },
        }),
        StaffTask.find({ assignedTo: staff._id })
          .sort({ dueDate: 1, createdAt: -1 })
          .limit(12)
          .populate('area', 'name location')
          .populate('animal', 'name species status healthStatus'),
        Animal.find(await buildAssignedAnimalQuery(staff._id))
          .sort({ name: 1 })
          .limit(12)
          .populate('area', 'name location'),
        CareLog.find({ staff: staff._id })
          .sort({ loggedAt: -1 })
          .limit(5)
          .populate('animal', 'name species')
          .populate('task', 'title'),
      ]);

    const completedToday = completedTodayTasks + completedCareLogs;
    const taskProgress = totalAssigned > 0
      ? Math.round(((totalAssigned - pendingTasks) / totalAssigned) * 100)
      : 0;

    res.json({
      staff: {
        id: staff._id,
        email: staff.email,
        name: staff.fullName || staff.email.split('@')[0],
      },
      summary: {
        assignedTasks: totalAssigned,
        pendingTasks,
        completedToday,
        taskProgress,
      },
      tasks: tasks.map(mapTask),
      animals: animals.map((animal) => ({
        id: animal._id,
        name: animal.name,
        species: animal.species,
        status: healthStatusToCareStatus(animal.healthStatus),
        healthStatus: animal.healthStatus,
        operationalStatus: animal.status,
        area: animal.area?.name || animal.area?.location || '',
      })),
      recentActivity: recentCareLogs.map((log) => ({
        id: log._id,
        text: `${log.careType} - ${log.animal?.name || 'Animal'}`,
        note: log.notes,
        time: formatTime(log.loggedAt),
        loggedAt: log.loggedAt,
        type: log.careType,
      })),
    });
  } catch (error) {
    console.error('Get staff dashboard failed:', error);
    res.status(500).json({ message: 'Failed to load staff dashboard' });
  }
};

exports.getStaffTasks = async (req, res) => {
  try {
    const staff = await getStaffFromRequest(req);

    if (!staff) {
      return res.status(404).json({ message: 'Staff user not found' });
    }

    const baseQuery = { assignedTo: staff._id };
    const query = { ...baseQuery };

    if (req.query.status) {
      const parsedStatus = parseTaskStatus(req.query.status);
      if (parsedStatus) query.status = parsedStatus;
    }

    if (req.query.priority) {
      const parsedPriority = parseTaskPriority(req.query.priority);
      if (parsedPriority) query.priority = parsedPriority;
    }

    if (req.query.due) {
      const dueFilter = String(req.query.due).trim().toUpperCase();
      const now = new Date();
      const todayStart = startOfDay(now);
      const todayEnd = endOfDay(now);

      if (dueFilter === 'TODAY') {
        query.dueDate = { $gte: todayStart, $lte: todayEnd };
      }

      if (dueFilter === 'OVERDUE') {
        query.dueDate = { $lt: todayStart };
        query.status = query.status || { $ne: 'DONE' };
      }

      if (dueFilter === 'UPCOMING') {
        query.dueDate = { $gt: todayEnd };
      }
    }

    if (req.query.search) {
      const searchRegex = new RegExp(escapeRegExp(req.query.search), 'i');
      const [animalIds, areaIds] = await Promise.all([
        Animal.distinct('_id', {
          $or: [
            { name: searchRegex },
            { code: searchRegex },
            { species: searchRegex },
            { scientificName: searchRegex },
          ],
        }),
        ZooArea.distinct('_id', {
          $or: [
            { name: searchRegex },
            { location: searchRegex },
            { habitatType: searchRegex },
          ],
        }),
      ]);
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { taskType: searchRegex },
        { animal: { $in: animalIds } },
        { area: { $in: areaIds } },
      ];
    }

    const tasks = await StaffTask.find(query)
      .sort({ dueDate: 1, createdAt: -1 })
      .populate('area', 'name location')
      .populate('animal', 'name species status healthStatus');

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    const [statusCountsResult, totalAssigned, overdue, dueToday] = await Promise.all([
      StaffTask.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      StaffTask.countDocuments(baseQuery),
      StaffTask.countDocuments({
        ...baseQuery,
        status: { $ne: 'DONE' },
        dueDate: { $lt: todayStart },
      }),
      StaffTask.countDocuments({
        ...baseQuery,
        dueDate: { $gte: todayStart, $lte: todayEnd },
      }),
    ]);

    const statusCounts = statusCountsResult.reduce((result, item) => {
      result[item._id] = item.count;
      return result;
    }, {});

    res.json({
      staff: {
        id: staff._id,
        email: staff.email,
        name: staff.fullName || staff.email.split('@')[0],
      },
      summary: {
        total: totalAssigned,
        filtered: tasks.length,
        todo: statusCounts.TODO || 0,
        inProgress: statusCounts.IN_PROGRESS || 0,
        done: statusCounts.DONE || 0,
        overdue,
        dueToday,
      },
      tasks: tasks.map(mapTask),
    });
  } catch (error) {
    console.error('Get staff tasks failed:', error);
    res.status(500).json({ message: 'Failed to load staff tasks' });
  }
};

exports.getStaffSchedule = async (req, res) => {
  try {
    const staff = await getStaffFromRequest(req);

    if (!staff) {
      return res.status(404).json({ message: 'Staff user not found' });
    }

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const tasks = await StaffTask.find({ assignedTo: staff._id })
      .sort({ dueDate: 1, createdAt: -1 })
      .populate('area', 'name location')
      .populate('animal', 'name species status healthStatus');

    const grouped = tasks.reduce((result, task) => {
      const dueTime = new Date(task.dueDate).getTime();
      let bucket = 'upcoming';

      if (task.status === 'DONE') {
        bucket = 'completed';
      } else if (dueTime < todayStart.getTime()) {
        bucket = 'overdue';
      } else if (dueTime <= todayEnd.getTime()) {
        bucket = 'today';
      }

      result[bucket].push(mapTask(task));
      return result;
    }, {
      overdue: [],
      today: [],
      upcoming: [],
      completed: [],
    });

    res.json({
      schedule: grouped,
      summary: {
        overdue: grouped.overdue.length,
        today: grouped.today.length,
        upcoming: grouped.upcoming.length,
        completed: grouped.completed.length,
        total: tasks.length,
      },
    });
  } catch (error) {
    console.error('Get staff schedule failed:', error);
    res.status(500).json({ message: error.message || 'Failed to load staff schedule' });
  }
};

exports.getStaffCareLogs = async (req, res) => {
  try {
    const staff = await getStaffFromRequest(req);

    if (!staff) {
      return res.status(404).json({ message: 'Staff user not found' });
    }

    const query = { staff: staff._id };

    if (req.query.careType) {
      const careType = String(req.query.careType).trim().toUpperCase();
      if (['FEEDING', 'CLEANING', 'OBSERVATION', 'ENRICHMENT'].includes(careType)) {
        query.careType = careType;
      }
    }

    if (req.query.date) {
      const date = new Date(req.query.date);
      if (!Number.isNaN(date.getTime())) {
        query.loggedAt = { $gte: startOfDay(date), $lte: endOfDay(date) };
      }
    }

    if (req.query.search) {
      const searchRegex = new RegExp(escapeRegExp(req.query.search), 'i');
      const animalIds = await Animal.distinct('_id', {
        $or: [
          { name: searchRegex },
          { code: searchRegex },
          { species: searchRegex },
          { scientificName: searchRegex },
        ],
      });

      const taskIds = await StaffTask.distinct('_id', {
        assignedTo: staff._id,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { taskType: searchRegex },
        ],
      });

      query.$or = [
        { notes: searchRegex },
        { animal: { $in: animalIds } },
        { task: { $in: taskIds } },
      ];
    }

    const logs = await CareLog.find(query)
      .sort({ loggedAt: -1 })
      .limit(80)
      .populate('staff', 'email fullName')
      .populate('animal', 'name species')
      .populate('task', 'title status');

    const counts = await CareLog.aggregate([
      { $match: { staff: staff._id } },
      { $group: { _id: '$careType', count: { $sum: 1 } } },
    ]);

    const careTypeCounts = counts.reduce((result, item) => {
      result[item._id] = item.count;
      return result;
    }, {});

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    res.json({
      logs: logs.map(mapCareLog),
      summary: {
        total: await CareLog.countDocuments({ staff: staff._id }),
        filtered: logs.length,
        today: await CareLog.countDocuments({ staff: staff._id, loggedAt: { $gte: todayStart, $lte: todayEnd } }),
        feeding: careTypeCounts.FEEDING || 0,
        cleaning: careTypeCounts.CLEANING || 0,
        observation: careTypeCounts.OBSERVATION || 0,
        enrichment: careTypeCounts.ENRICHMENT || 0,
      },
    });
  } catch (error) {
    console.error('Get staff care logs failed:', error);
    res.status(500).json({ message: error.message || 'Failed to load staff care logs' });
  }
};

exports.getStaffTaskById = async (req, res) => {
  try {
    const staff = await getStaffFromRequest(req);

    if (!staff) {
      return res.status(404).json({ message: 'Staff user not found' });
    }

    const task = await StaffTask.findOne({ _id: req.params.id, assignedTo: staff._id })
      .populate('area', 'name location habitatType')
      .populate('animal', 'name code species scientificName status healthStatus')
      .populate('assignedBy', 'email fullName role');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const relatedLogs = await CareLog.find({ task: task._id })
      .sort({ loggedAt: -1 })
      .populate('staff', 'email fullName')
      .populate('animal', 'name species');

    res.json({
      task: {
        ...mapTask(task),
        assignedBy: task.assignedBy ? {
          id: task.assignedBy._id,
          email: task.assignedBy.email,
          name: task.assignedBy.fullName || task.assignedBy.email,
        } : null,
        animal: task.animal ? {
          id: task.animal._id,
          code: task.animal.code,
          name: task.animal.name,
          species: task.animal.species,
          scientificName: task.animal.scientificName,
          status: healthStatusToCareStatus(task.animal.healthStatus),
          healthStatus: task.animal.healthStatus,
          operationalStatus: task.animal.status,
        } : null,
        area: task.area ? {
          id: task.area._id,
          name: task.area.name,
          location: task.area.location,
          habitatType: task.area.habitatType,
        } : null,
      },
      logs: relatedLogs.map((log) => ({
        id: log._id,
        careType: log.careType,
        notes: log.notes,
        loggedAt: log.loggedAt,
        time: formatDateTime(log.loggedAt),
        staffName: log.staff?.fullName || log.staff?.email || '',
        animalName: log.animal?.name || '',
      })),
    });
  } catch (error) {
    console.error('Get staff task detail failed:', error);
    res.status(500).json({ message: 'Failed to load task detail' });
  }
};

exports.updateStaffTaskStatus = async (req, res) => {
  try {
    const staff = await getStaffFromRequest(req);

    if (!staff) {
      return res.status(404).json({ message: 'Staff user not found' });
    }

    const status = parseTaskStatus(req.body.status);
    if (!status) {
      return res.status(400).json({ message: 'Invalid task status' });
    }

    const task = await StaffTask.findOne({ _id: req.params.id, assignedTo: staff._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    task.completedAt = status === 'DONE' ? new Date() : null;
    await task.save();

    const populatedTask = await StaffTask.findById(task._id)
      .populate('area', 'name location')
      .populate('animal', 'name species status healthStatus');

    res.json({ task: mapTask(populatedTask) });
  } catch (error) {
    console.error('Update staff task status failed:', error);
    res.status(500).json({ message: 'Failed to update task status' });
  }
};

exports.getStaffAnimals = async (req, res) => {
  try {
    const staff = await getStaffFromRequest(req);

    if (!staff) {
      return res.status(404).json({ message: 'Staff user not found' });
    }

    const query = await buildAssignedAnimalQuery(staff._id);

    if (req.query.status) {
      const parsedStatus = parseAnimalStatus(req.query.status);
      if (parsedStatus) query.healthStatus = parsedStatus;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(escapeRegExp(req.query.search), 'i');
      query.$and = [{
        $or: [
          { name: searchRegex },
          { code: searchRegex },
          { species: searchRegex },
          { scientificName: searchRegex },
        ],
      }];
    }

    const animals = await Animal.find(query).sort({ name: 1 }).populate('area', 'name location habitatType');
    const animalIds = animals.map((animal) => animal._id);
    const [latestLogMap, latestHealthMap, relatedTasks] = await Promise.all([
      getLatestLogMap(animalIds),
      getLatestHealthMap(animalIds),
      StaffTask.find({ assignedTo: staff._id, animal: { $in: animalIds } }).select('animal status'),
    ]);

    const taskCountByAnimal = relatedTasks.reduce((result, task) => {
      const id = String(task.animal);
      result[id] = (result[id] || 0) + 1;
      return result;
    }, {});

    res.json({
      animals: animals.map((animal) => ({
        ...mapAnimal(animal, latestLogMap[String(animal._id)], latestHealthMap[String(animal._id)]),
        taskCount: taskCountByAnimal[String(animal._id)] || 0,
      })),
      summary: {
        total: animals.length,
        healthy: animals.filter((animal) => healthStatusToCareStatus(animal.healthStatus) === 'HEALTHY').length,
        observation: animals.filter((animal) => healthStatusToCareStatus(animal.healthStatus) === 'OBSERVATION').length,
        treatment: animals.filter((animal) => healthStatusToCareStatus(animal.healthStatus) === 'TREATMENT').length,
      },
    });
  } catch (error) {
    console.error('Get staff animals failed:', error);
    res.status(500).json({ message: 'Failed to load assigned animals' });
  }
};

exports.getAnimalCareDetail = async (req, res) => {
  try {
    const staff = await getStaffFromRequest(req);

    if (!staff) {
      return res.status(404).json({ message: 'Staff user not found' });
    }

    const query = await buildAssignedAnimalQuery(staff._id);
    const animal = await Animal.findOne({ _id: req.params.id, ...query }).populate('area', 'name location habitatType');

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    const [logs, todayLogs, health, tasks] = await Promise.all([
      CareLog.find({ animal: animal._id }).sort({ loggedAt: -1 }).populate('staff', 'email fullName').populate('task', 'title status'),
      CareLog.find({ animal: animal._id, loggedAt: { $gte: todayStart, $lte: todayEnd } }).sort({ loggedAt: -1 }),
      AnimalHealth.findOne({ animal: animal._id }).sort({ lastCheckDate: -1 }).populate('checkedBy', 'email fullName'),
      StaffTask.find({ assignedTo: staff._id, animal: animal._id }).sort({ dueDate: 1 }).populate('area', 'name location'),
    ]);

    const completedTypes = new Set(todayLogs.map((log) => log.careType));
    const checklist = ['FEEDING', 'CLEANING', 'OBSERVATION', 'ENRICHMENT'].map((type) => {
      const log = todayLogs.find((item) => item.careType === type);
      return {
        type,
        title: type.replace('_', ' '),
        status: completedTypes.has(type) ? 'completed' : 'pending',
        notes: log?.notes || '',
        loggedAt: log?.loggedAt || null,
        time: log ? formatTime(log.loggedAt) : '',
      };
    });

    res.json({
      animal: mapAnimal(animal, logs[0], health),
      health: health ? {
        weightKg: health.weightKg,
        temperatureC: health.temperatureC,
        appetite: health.appetite,
        condition: health.condition,
        notes: health.notes,
        checkedBy: health.checkedBy?.fullName || health.checkedBy?.email || '',
        lastCheckDate: health.lastCheckDate,
      } : null,
      checklist,
      tasks: tasks.map(mapTask),
      logs: logs.map((log) => ({
        id: log._id,
        careType: log.careType,
        notes: log.notes,
        loggedAt: log.loggedAt,
        time: formatDateTime(log.loggedAt),
        staffName: log.staff?.fullName || log.staff?.email || '',
        taskTitle: log.task?.title || '',
      })),
    });
  } catch (error) {
    console.error('Get animal care detail failed:', error);
    res.status(500).json({ message: 'Failed to load animal care detail' });
  }
};

exports.getAnimalCareLogs = async (req, res) => {
  try {
    const staff = await getStaffFromRequest(req);

    if (!staff) {
      return res.status(404).json({ message: 'Staff user not found' });
    }

    const query = await buildAssignedAnimalQuery(staff._id);
    const animal = await Animal.findOne({ _id: req.params.id, ...query });

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    const logs = await CareLog.find({ animal: animal._id })
      .sort({ loggedAt: -1 })
      .populate('staff', 'email fullName')
      .populate('task', 'title');

    res.json({
      animal: {
        id: animal._id,
        name: animal.name,
        species: animal.species,
      },
      logs: logs.map((log) => ({
        id: log._id,
        careType: log.careType,
        notes: log.notes,
        loggedAt: log.loggedAt,
        time: formatDateTime(log.loggedAt),
        staffName: log.staff?.fullName || log.staff?.email || '',
        taskTitle: log.task?.title || '',
      })),
    });
  } catch (error) {
    console.error('Get animal care logs failed:', error);
    res.status(500).json({ message: 'Failed to load care logs' });
  }
};

exports.createAnimalCareLog = async (req, res) => {
  try {
    const staff = await getStaffFromRequest(req);

    if (!staff) {
      return res.status(404).json({ message: 'Staff user not found' });
    }

    const query = await buildAssignedAnimalQuery(staff._id);
    const animal = await Animal.findOne({ _id: req.params.id, ...query });

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    const careType = String(req.body.careType || '').trim().toUpperCase();
    if (!['FEEDING', 'CLEANING', 'OBSERVATION', 'ENRICHMENT'].includes(careType)) {
      return res.status(400).json({ message: 'Invalid care type' });
    }

    let task = null;
    if (req.body.taskId) {
      task = await StaffTask.findOne({ _id: req.body.taskId, assignedTo: staff._id, animal: animal._id });
      if (!task) return res.status(400).json({ message: 'Invalid task for this animal' });
    }

    const log = await CareLog.create({
      animal: animal._id,
      staff: staff._id,
      task: task?._id || null,
      careType,
      notes: req.body.notes || '',
      loggedAt: req.body.loggedAt ? new Date(req.body.loggedAt) : new Date(),
    });

    const populatedLog = await CareLog.findById(log._id)
      .populate('staff', 'email fullName')
      .populate('animal', 'name species')
      .populate('task', 'title');

    res.status(201).json({
      log: {
        id: populatedLog._id,
        careType: populatedLog.careType,
        notes: populatedLog.notes,
        loggedAt: populatedLog.loggedAt,
        time: formatDateTime(populatedLog.loggedAt),
        staffName: populatedLog.staff?.fullName || populatedLog.staff?.email || '',
        animalName: populatedLog.animal?.name || '',
        taskTitle: populatedLog.task?.title || '',
      },
    });
  } catch (error) {
    console.error('Create animal care log failed:', error);
    res.status(500).json({ message: 'Failed to create care log' });
  }
};

exports.updateAnimalCareStatus = async (req, res) => {
  try {
    const staff = await getStaffFromRequest(req);

    if (!staff) {
      return res.status(404).json({ message: 'Staff user not found' });
    }

    const status = parseAnimalStatus(req.body.status);
    if (!status) {
      return res.status(400).json({ message: 'Invalid animal care status' });
    }

    const query = await buildAssignedAnimalQuery(staff._id);
    const animal = await Animal.findOne({ _id: req.params.id, ...query }).populate('area', 'name location');

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    animal.healthStatus = status;
    await animal.save();

    const log = await CareLog.create({
      animal: animal._id,
      staff: staff._id,
      careType: 'OBSERVATION',
      notes: req.body.notes || `Care status updated to ${healthStatusToCareStatus(status)}.`,
      loggedAt: new Date(),
    });

    res.json({
      animal: mapAnimal(animal, log),
    });
  } catch (error) {
    console.error('Update animal care status failed:', error);
    res.status(500).json({ message: error.message || 'Failed to update animal care status' });
  }
};
