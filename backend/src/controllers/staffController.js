const User = require('../models/User');
const StaffTask = require('../models/StaffTask');
const CareLog = require('../models/CareLog');
const Animal = require('../models/Animal');
require('../models/ZooArea');

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
          .limit(5)
          .populate('area', 'name location')
          .populate('animal', 'name species status'),
        Animal.find({ caretaker: staff._id })
          .sort({ name: 1 })
          .limit(4)
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
        status: animal.status,
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

    const query = { assignedTo: staff._id };

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { taskType: searchRegex },
      ];
    }

    const tasks = await StaffTask.find(query)
      .sort({ dueDate: 1, createdAt: -1 })
      .populate('area', 'name location')
      .populate('animal', 'name species status');

    const counts = await StaffTask.aggregate([
      { $match: { assignedTo: staff._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statusCounts = counts.reduce((result, item) => {
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
        total: tasks.length,
        todo: statusCounts.TODO || 0,
        inProgress: statusCounts.IN_PROGRESS || 0,
        done: statusCounts.DONE || 0,
      },
      tasks: tasks.map(mapTask),
    });
  } catch (error) {
    console.error('Get staff tasks failed:', error);
    res.status(500).json({ message: 'Failed to load staff tasks' });
  }
};
