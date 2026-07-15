require('dotenv').config();
const User = require('./src/models/User');
const ZooArea = require('./src/models/ZooArea');
const Animal = require('./src/models/Animal');
const AnimalHealth = require('./src/models/AnimalHealth');
const Booking = require('./src/models/Booking');
const CareLog = require('./src/models/CareLog');
const MedicalLog = require('./src/models/MedicalLog');
const StaffTask = require('./src/models/StaffTask');
const Ticket = require('./src/models/Ticket');
const Treatment = require('./src/models/Treatment');
const ZooService = require('./src/models/ZooService');
const connectDB = require('./src/config/db');

const demoUsers = [
  { email: 'user@zoo.com', password: '123456', role: 'USER' },
  { email: 'staff@zoo.com', password: '123456', role: 'STAFF' },
  { email: 'staff2@zoo.com', password: '123456', role: 'STAFF' },
  { email: 'vet@zoo.com', password: '123456', role: 'VET' },
  { email: 'admin@zoo.com', password: '123456', role: 'ADMIN' },
];

async function seedDatabase() {
  try {
    await connectDB();

    await Promise.all([
      Treatment.deleteMany({}),
      MedicalLog.deleteMany({}),
      AnimalHealth.deleteMany({}),
      CareLog.deleteMany({}),
      StaffTask.deleteMany({}),
      Booking.deleteMany({}),
      Animal.deleteMany({}),
      ZooArea.deleteMany({}),
      ZooService.deleteMany({}),
      Ticket.deleteMany({}),
      User.deleteMany({}),
    ]);

    console.log('Seed reset complete.');

    const createdUsers = {};
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers[userData.email] = user;
    }

    const areas = await ZooArea.insertMany([
      {
        code: 'SAVANNAH',
        name: 'Savannah Zone',
        description: 'Large mammals and open habitat exhibits.',
        habitatType: 'SAVANNAH',
        location: 'North Gate',
        capacity: 180,
        manager: createdUsers['admin@zoo.com']._id,
        assignedStaff: [createdUsers['staff@zoo.com']._id],
      },
      {
        code: 'REPTILE',
        name: 'Reptile House',
        description: 'Indoor reptile and amphibian area.',
        habitatType: 'INDOOR',
        location: 'Central Dome',
        capacity: 60,
        manager: createdUsers['admin@zoo.com']._id,
        assignedStaff: [createdUsers['staff2@zoo.com']._id],
      },
      {
        code: 'AQUATIC',
        name: 'Aquatic World',
        description: 'Penguins and other aquatic species.',
        habitatType: 'AQUATIC',
        location: 'East Wing',
        capacity: 120,
        manager: createdUsers['admin@zoo.com']._id,
        assignedStaff: [createdUsers['staff@zoo.com']._id, createdUsers['staff2@zoo.com']._id],
      },
    ]);

    const areaByCode = Object.fromEntries(areas.map((area) => [area.code, area]));

    const animals = await Animal.insertMany([
      {
        code: 'ANI-LION-001',
        name: 'Leo',
        species: 'Lion',
        scientificName: 'Panthera leo',
        gender: 'MALE',
        dateOfBirth: new Date('2018-04-15'),
        origin: 'South Africa',
        diet: 'Beef and chicken',
        status: 'HEALTHY',
        area: areaByCode.SAVANNAH._id,
        caretaker: createdUsers['staff@zoo.com']._id,
        notes: 'Main attraction in the savannah area.',
      },
      {
        code: 'ANI-PENGUIN-001',
        name: 'Luna',
        species: 'Penguin',
        scientificName: 'Spheniscus humboldti',
        gender: 'FEMALE',
        dateOfBirth: new Date('2020-09-03'),
        origin: 'Peru',
        diet: 'Fish',
        status: 'OBSERVATION',
        area: areaByCode.AQUATIC._id,
        caretaker: createdUsers['staff2@zoo.com']._id,
        notes: 'Recently reduced appetite, under observation.',
      },
      {
        code: 'ANI-PYTHON-001',
        name: 'Kaa',
        species: 'Python',
        scientificName: 'Python bivittatus',
        gender: 'UNKNOWN',
        dateOfBirth: new Date('2017-06-22'),
        origin: 'Thailand',
        diet: 'Rodents',
        status: 'HEALTHY',
        area: areaByCode.REPTILE._id,
        caretaker: createdUsers['staff2@zoo.com']._id,
        notes: 'Requires weekly habitat humidity checks.',
      },
    ]);

    const animalByCode = Object.fromEntries(animals.map((animal) => [animal.code, animal]));

    const tasks = await StaffTask.insertMany([
      {
        title: 'Morning feeding for Leo',
        description: 'Prepare protein diet and verify feeding amount.',
        taskType: 'CARE',
        priority: 'HIGH',
        assignedTo: createdUsers['staff@zoo.com']._id,
        assignedBy: createdUsers['admin@zoo.com']._id,
        area: areaByCode.SAVANNAH._id,
        animal: animalByCode['ANI-LION-001']._id,
        dueDate: new Date('2026-07-16T08:00:00'),
        status: 'IN_PROGRESS',
      },
      {
        title: 'Clean reptile enclosure',
        description: 'Deep clean the python habitat and replace substrate.',
        taskType: 'CLEANING',
        priority: 'MEDIUM',
        assignedTo: createdUsers['staff2@zoo.com']._id,
        assignedBy: createdUsers['admin@zoo.com']._id,
        area: areaByCode.REPTILE._id,
        animal: animalByCode['ANI-PYTHON-001']._id,
        dueDate: new Date('2026-07-16T10:30:00'),
        status: 'TODO',
      },
      {
        title: 'Support vet check for Luna',
        description: 'Assist during follow-up health check.',
        taskType: 'MEDICAL_SUPPORT',
        priority: 'HIGH',
        assignedTo: createdUsers['staff2@zoo.com']._id,
        assignedBy: createdUsers['admin@zoo.com']._id,
        area: areaByCode.AQUATIC._id,
        animal: animalByCode['ANI-PENGUIN-001']._id,
        dueDate: new Date('2026-07-16T14:00:00'),
        status: 'TODO',
      },
    ]);

    await CareLog.insertMany([
      {
        animal: animalByCode['ANI-LION-001']._id,
        staff: createdUsers['staff@zoo.com']._id,
        task: tasks[0]._id,
        careType: 'FEEDING',
        notes: 'Consumed full meal and remained active.',
        loggedAt: new Date('2026-07-15T08:15:00'),
      },
      {
        animal: animalByCode['ANI-PYTHON-001']._id,
        staff: createdUsers['staff2@zoo.com']._id,
        careType: 'OBSERVATION',
        notes: 'Humidity stable, no unusual behavior.',
        loggedAt: new Date('2026-07-15T11:00:00'),
      },
    ]);

    await AnimalHealth.insertMany([
      {
        animal: animalByCode['ANI-LION-001']._id,
        weightKg: 190,
        temperatureC: 38.3,
        appetite: 'GOOD',
        condition: 'STABLE',
        checkedBy: createdUsers['vet@zoo.com']._id,
        lastCheckDate: new Date('2026-07-14T09:00:00'),
        notes: 'Strong appetite and normal movement.',
      },
      {
        animal: animalByCode['ANI-PENGUIN-001']._id,
        weightKg: 24,
        temperatureC: 39.1,
        appetite: 'LOW',
        condition: 'MONITORING',
        checkedBy: createdUsers['vet@zoo.com']._id,
        lastCheckDate: new Date('2026-07-15T13:30:00'),
        notes: 'Mild appetite drop; scheduled follow-up.',
      },
      {
        animal: animalByCode['ANI-PYTHON-001']._id,
        weightKg: 55,
        temperatureC: 29.8,
        appetite: 'NORMAL',
        condition: 'STABLE',
        checkedBy: createdUsers['vet@zoo.com']._id,
        lastCheckDate: new Date('2026-07-13T15:30:00'),
        notes: 'Healthy and adapting well to enclosure.',
      },
    ]);

    const medicalLogs = await MedicalLog.insertMany([
      {
        animal: animalByCode['ANI-PENGUIN-001']._id,
        vet: createdUsers['vet@zoo.com']._id,
        symptoms: 'Reduced appetite and lower activity level.',
        diagnosis: 'Seasonal stress response',
        treatmentPlan: 'Hydration support and 3-day monitoring.',
        medications: ['Vitamin supplement'],
        visitDate: new Date('2026-07-15T14:30:00'),
        nextCheckDate: new Date('2026-07-18T10:00:00'),
        status: 'FOLLOW_UP',
      },
    ]);

    await Treatment.insertMany([
      {
        medicalLog: medicalLogs[0]._id,
        animal: animalByCode['ANI-PENGUIN-001']._id,
        vet: createdUsers['vet@zoo.com']._id,
        title: 'Hydration and vitamin support',
        medication: 'Vitamin supplement',
        dosage: '5 ml daily',
        schedule: 'After morning feeding',
        startDate: new Date('2026-07-15'),
        endDate: new Date('2026-07-18'),
        status: 'ONGOING',
      },
    ]);

    const tickets = await Ticket.insertMany([
      {
        code: 'ADULT-1D',
        name: 'Adult Day Pass',
        ticketType: 'ADULT',
        price: 120000,
        description: 'Standard admission for one adult.',
      },
      {
        code: 'CHILD-1D',
        name: 'Child Day Pass',
        ticketType: 'CHILD',
        price: 80000,
        description: 'Standard admission for one child.',
      },
      {
        code: 'VIP-1D',
        name: 'VIP Experience',
        ticketType: 'VIP',
        price: 300000,
        description: 'Priority entry and guided experience.',
      },
    ]);

    const ticketByCode = Object.fromEntries(tickets.map((ticket) => [ticket.code, ticket]));

    await Booking.insertMany([
      {
        bookingCode: 'BOOK-1001',
        user: createdUsers['user@zoo.com']._id,
        visitDate: new Date('2026-07-20'),
        items: [
          {
            ticket: ticketByCode['ADULT-1D']._id,
            quantity: 2,
            unitPrice: 120000,
          },
          {
            ticket: ticketByCode['CHILD-1D']._id,
            quantity: 1,
            unitPrice: 80000,
          },
        ],
        totalAmount: 320000,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        notes: 'Family visit booking.',
      },
      {
        bookingCode: 'BOOK-1002',
        user: createdUsers['user@zoo.com']._id,
        visitDate: new Date('2026-07-27'),
        items: [
          {
            ticket: ticketByCode['VIP-1D']._id,
            quantity: 1,
            unitPrice: 300000,
          },
        ],
        totalAmount: 300000,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        notes: 'Pending confirmation for VIP slot.',
      },
    ]);

    await ZooService.insertMany([
      {
        code: 'GUIDE-001',
        name: 'Guided Safari Tour',
        category: 'GUIDE',
        description: '45-minute guided tour through key exhibits.',
        price: 150000,
        durationMinutes: 45,
      },
      {
        code: 'PHOTO-001',
        name: 'Animal Photo Session',
        category: 'PHOTO',
        description: 'Professional souvenir photo package.',
        price: 90000,
        durationMinutes: 20,
      },
      {
        code: 'FOOD-001',
        name: 'Family Meal Combo',
        category: 'FOOD',
        description: 'Meal package redeemable at the central food court.',
        price: 180000,
        durationMinutes: 0,
      },
    ]);

    console.log('Demo database created successfully.');
    console.table(
      demoUsers.map((user) => ({
        Email: user.email,
        Role: user.role,
        Password: '123456',
      }))
    );

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();
