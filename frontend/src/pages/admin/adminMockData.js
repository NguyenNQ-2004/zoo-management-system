export const adminUsers = [
  {
    id: 'USR-001',
    fullName: 'Nguyen Admin',
    email: 'admin@zoo.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    assignedArea: 'System',
    phone: '0901 223 456',
    lastActive: '5 minutes ago',
    createdAt: '2026-07-10',
  },
  {
    id: 'USR-002',
    fullName: 'Tran Minh Staff',
    email: 'staff@zoo.com',
    role: 'STAFF',
    status: 'ACTIVE',
    assignedArea: 'Savannah Zone',
    phone: '0902 111 888',
    lastActive: '18 minutes ago',
    createdAt: '2026-07-11',
  },
  {
    id: 'USR-003',
    fullName: 'Le Hoang Staff',
    email: 'staff2@zoo.com',
    role: 'STAFF',
    status: 'ACTIVE',
    assignedArea: 'Reptile House',
    phone: '0903 333 777',
    lastActive: '1 hour ago',
    createdAt: '2026-07-11',
  },
  {
    id: 'USR-004',
    fullName: 'Pham Vet',
    email: 'vet@zoo.com',
    role: 'VET',
    status: 'ACTIVE',
    assignedArea: 'Aquatic World',
    phone: '0904 555 666',
    lastActive: '35 minutes ago',
    createdAt: '2026-07-11',
  },
  {
    id: 'USR-005',
    fullName: 'Vo Customer',
    email: 'user@zoo.com',
    role: 'USER',
    status: 'ACTIVE',
    assignedArea: 'Visitor',
    phone: '0905 999 222',
    lastActive: '2 hours ago',
    createdAt: '2026-07-12',
  },
  {
    id: 'USR-006',
    fullName: 'Demo Guest',
    email: 'guest.pending@zoo.com',
    role: 'USER',
    status: 'LOCKED',
    assignedArea: 'Visitor',
    phone: '0906 444 111',
    lastActive: 'Yesterday',
    createdAt: '2026-07-13',
  },
];

export const adminAreas = [
  { code: 'SAVANNAH', name: 'Savannah Zone', assignedStaff: 1, animals: 1, status: 'OPEN' },
  { code: 'REPTILE', name: 'Reptile House', assignedStaff: 1, animals: 1, status: 'OPEN' },
  { code: 'AQUATIC', name: 'Aquatic World', assignedStaff: 2, animals: 1, status: 'OPEN' },
];

export const adminAnimals = [
  { code: 'ANI-LION-001', name: 'Leo', status: 'HEALTHY', area: 'Savannah Zone' },
  { code: 'ANI-PENGUIN-001', name: 'Luna', status: 'OBSERVATION', area: 'Aquatic World' },
  { code: 'ANI-PYTHON-001', name: 'Kaa', status: 'HEALTHY', area: 'Reptile House' },
];

export const adminTasks = [
  {
    id: 'TASK-001',
    title: 'Morning feeding for Leo',
    assignedTo: 'Tran Minh Staff',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueLabel: 'Today, 08:00',
  },
  {
    id: 'TASK-002',
    title: 'Clean reptile enclosure',
    assignedTo: 'Le Hoang Staff',
    status: 'TODO',
    priority: 'MEDIUM',
    dueLabel: 'Today, 10:30',
  },
  {
    id: 'TASK-003',
    title: 'Support vet check for Luna',
    assignedTo: 'Le Hoang Staff',
    status: 'OVERDUE',
    priority: 'HIGH',
    dueLabel: 'Overdue by 1 day',
  },
];

export const adminBookings = [
  {
    code: 'BOOK-1001',
    visitor: 'Vo Customer',
    totalAmount: '320,000 VND',
    status: 'CONFIRMED',
    visitDate: '2026-07-20',
  },
  {
    code: 'BOOK-1002',
    visitor: 'Vo Customer',
    totalAmount: '300,000 VND',
    status: 'PENDING',
    visitDate: '2026-07-27',
  },
];

export const adminAlerts = [
  {
    title: '1 overdue task requires admin action',
    description: 'Support vet check for Luna has not been completed on time.',
    tone: 'danger',
  },
  {
    title: '1 animal is under observation',
    description: 'Luna the penguin is still in follow-up health monitoring.',
    tone: 'warning',
  },
  {
    title: '1 booking is waiting for confirmation',
    description: 'VIP Experience booking BOOK-1002 is still pending payment.',
    tone: 'info',
  },
];

export const adminActivity = [
  {
    title: 'New staff assignment created',
    detail: 'Le Hoang Staff was assigned to Aquatic World medical support.',
    time: '12 minutes ago',
  },
  {
    title: 'Booking BOOK-1001 confirmed',
    detail: 'Visitor booking for 3 tickets was confirmed by the system.',
    time: '1 hour ago',
  },
  {
    title: 'Animal health updated',
    detail: 'Luna was marked as monitoring after vet re-check.',
    time: 'Today, 13:30',
  },
];
