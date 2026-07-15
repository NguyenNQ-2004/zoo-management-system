const express = require('express');
const {
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
} = require('../controllers/adminController');

const router = express.Router();

const adminController = require('../controllers/adminController');
router.get('/dashboard', adminController.getDashboardStats);

router.get('/users', listUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.patch('/users/:id/status', updateUserStatus);

router.get('/staff', listStaff);
router.patch('/staff/:id/area', assignStaffArea);

router.get('/areas', listAreas);
router.get('/animals', listAnimals);
router.get('/animals/:id', getAnimalById);
router.post('/animals', createAnimal);
router.put('/animals/:id', updateAnimal);
router.delete('/animals/:id', deleteAnimal);

router.get('/tasks', listTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

router.get('/tickets', listTickets);
router.post('/tickets', createTicket);
router.put('/tickets/:id', updateTicket);
router.delete('/tickets/:id', deleteTicket);

router.get('/services', listServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

router.get('/bookings', listBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

router.get('/reports', getReports);

module.exports = router;
