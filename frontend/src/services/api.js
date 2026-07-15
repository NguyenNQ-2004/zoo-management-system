const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = API_BASE_URL;

// Helper to get auth headers
const getAuthHeaders = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const headers = { 'Content-Type': 'application/json' };
  if (currentUser.token) {
    headers['Authorization'] = `Bearer ${currentUser.token}`;
  }
  return headers;
};

// Request helper for adminApi
const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...getAuthHeaders(),
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

// Helper for our API calls (keeps compatibility)
const apiCall = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
};

// Auth API
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

// Zoo Area API
export const areaApi = {
  getAll: () => apiCall(`${API_URL}/areas`),
  getById: (id) => apiCall(`${API_URL}/areas/${id}`),
  create: (data) => apiCall(`${API_URL}/areas`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`${API_URL}/areas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`${API_URL}/areas/${id}`, { method: 'DELETE' }),
};

// Animal API
export const animalApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.area) query.append('area', params.area);
    if (params.status) query.append('status', params.status);
    if (params.healthStatus) query.append('healthStatus', params.healthStatus);
    const queryStr = query.toString();
    return apiCall(`${API_URL}/animals${queryStr ? `?${queryStr}` : ''}`);
  },
  getById: (id) => apiCall(`${API_URL}/animals/${id}`),
  create: (data) => apiCall(`${API_URL}/animals`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`${API_URL}/animals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`${API_URL}/animals/${id}`, { method: 'DELETE' }),
  updateArea: (id, areaId) => apiCall(`${API_URL}/animals/${id}/area`, { method: 'PUT', body: JSON.stringify({ area: areaId }) }),
  updateStatus: (id, status) => apiCall(`${API_URL}/animals/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

// Zoo Service API
export const serviceApi = {
  getAll: () => apiCall(`${API_URL}/services`),
  create: (data) => apiCall(`${API_URL}/services`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`${API_URL}/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleStatus: (id) => apiCall(`${API_URL}/services/${id}/status`, { method: 'PUT' }),
  delete: (id) => apiCall(`${API_URL}/services/${id}`, { method: 'DELETE' }),
};

// Admin API
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
