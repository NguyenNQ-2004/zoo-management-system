const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed.');
  }

  return payload;
};

export const api = {
  login: async (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: async (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};

export const adminApi = {
  getUsers: async () => request('/admin/users'),
  getUserById: async (id) => request(`/admin/users/${id}`),
  createUser: async (body) =>
    request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateUser: async (id, body) =>
    request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  updateUserStatus: async (id, status) =>
    request(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  getStaff: async () => request('/admin/staff'),
  assignStaffArea: async (id, areaId) =>
    request(`/admin/staff/${id}/area`, {
      method: 'PATCH',
      body: JSON.stringify({ areaId }),
    }),
  getAreas: async () => request('/admin/areas'),
  getAnimals: async () => request('/admin/animals'),
  getAnimalById: async (id) => request(`/admin/animals/${id}`),
  createAnimal: async (body) =>
    request('/admin/animals', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateAnimal: async (id, body) =>
    request(`/admin/animals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteAnimal: async (id) =>
    request(`/admin/animals/${id}`, {
      method: 'DELETE',
    }),
  getTasks: async () => request('/admin/tasks'),
  createTask: async (body) =>
    request('/admin/tasks', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateTask: async (id, body) =>
    request(`/admin/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteTask: async (id) =>
    request(`/admin/tasks/${id}`, {
      method: 'DELETE',
    }),
  getTickets: async () => request('/admin/tickets'),
  createTicket: async (body) =>
    request('/admin/tickets', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateTicket: async (id, body) =>
    request(`/admin/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteTicket: async (id) =>
    request(`/admin/tickets/${id}`, {
      method: 'DELETE',
    }),
  getServices: async () => request('/admin/services'),
  createService: async (body) =>
    request('/admin/services', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateService: async (id, body) =>
    request(`/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteService: async (id) =>
    request(`/admin/services/${id}`, {
      method: 'DELETE',
    }),
  getBookings: async () => request('/admin/bookings'),
  updateBookingStatus: async (id, body) =>
    request(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  getReports: async () => request('/admin/reports'),
};
