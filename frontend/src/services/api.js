
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = API_BASE_URL;

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  } catch (error) {
    return null;
  }
};

const getAuthHeaders = () => {
  const currentUser = getCurrentUser() || {};
  const headers = { 'Content-Type': 'application/json' };

  if (currentUser.token) {
    headers.Authorization = `Bearer ${currentUser.token}`;
  }

  return headers;
};

const getStaffHeaders = () => {
  const currentUser = getCurrentUser() || {};

  return {
    ...getAuthHeaders(),
    ...(currentUser.email ? { 'x-staff-email': currentUser.email } : {})
  };
};

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await response.json().catch(() => ({}))
    : await response.text();

  if (!response.ok) {
    const message = typeof body === 'string'
      ? body
      : body.message;

    if (typeof message === 'string' && message.trim().startsWith('<!DOCTYPE html>')) {
      throw new Error('API route was not found on the backend. Please check that the backend server is running on the same port as the frontend proxy.');
    }

    if (message && message.toLowerCase().includes('proxy error')) {
      throw new Error('Backend server is not running. Please start the backend and try again.');
    }

    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (typeof body === 'string') {
    throw new Error('Backend returned a non-JSON response. Please check the API server.');
  }

  return body;
};

const request = async (path, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {})
      }
    });

    return parseResponse(response);
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to backend API. Please make sure the backend server is running.');
    }

    throw error;
  }
};

const apiCall = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  });

  return parseResponse(response);
};

export const api = {
  login: async (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),

  register: async (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  getVetDashboardStats: async () => request('/vet/dashboard'),

  getVetAnimalHealthStatus: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/vet/animals/health-status${query ? `?${query}` : ''}`);
  },

  getVetHealthRecords: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/vet/health-records${query ? `?${query}` : ''}`);
  },

  getStaffDashboard: async () => request('/staff/dashboard', {
    headers: getStaffHeaders()
  }),

  getStaffTasks: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);

    return request(`/staff/tasks${query.toString() ? `?${query.toString()}` : ''}`, {
      headers: getStaffHeaders()
    });
  },

  getStaffTask: async (id) => request(`/staff/tasks/${id}`, {
    headers: getStaffHeaders()
  }),

  updateStaffTaskStatus: async (id, status) => request(`/staff/tasks/${id}/status`, {
    method: 'PUT',
    headers: getStaffHeaders(),
    body: JSON.stringify({ status })
  }),

  getStaffAnimals: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);

    return request(`/staff/animals${query.toString() ? `?${query.toString()}` : ''}`, {
      headers: getStaffHeaders()
    });
  },

  getAnimalCare: async (id) => request(`/staff/animals/${id}/care`, {
    headers: getStaffHeaders()
  }),

  getAnimalCareLogs: async (id) => request(`/staff/animals/${id}/care-logs`, {
    headers: getStaffHeaders()
  }),

  createAnimalCareLog: async (id, careLog) => request(`/staff/animals/${id}/care-logs`, {
    method: 'POST',
    headers: getStaffHeaders(),
    body: JSON.stringify(careLog)
  }),

  updateAnimalCareStatus: async (id, status, notes = '') => request(`/staff/animals/${id}/care-status`, {
    method: 'PUT',
    headers: getStaffHeaders(),
    body: JSON.stringify({ status, notes })
  })
};

export const areaApi = {
  getAll: () => apiCall(`${API_URL}/areas`),
  getById: (id) => apiCall(`${API_URL}/areas/${id}`),
  create: (data) => apiCall(`${API_URL}/areas`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`${API_URL}/areas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`${API_URL}/areas/${id}`, { method: 'DELETE' }),
};

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

export const serviceApi = {
  getAll: () => apiCall(`${API_URL}/services`),
  create: (data) => apiCall(`${API_URL}/services`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`${API_URL}/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleStatus: (id) => apiCall(`${API_URL}/services/${id}/status`, { method: 'PUT' }),
  delete: (id) => apiCall(`${API_URL}/services/${id}`, { method: 'DELETE' }),
};

export const adminApi = {
  getUsers: async () => request('/admin/users'),
  getUserById: async (id) => request(`/admin/users/${id}`),
  createUser: async (body) => request('/admin/users', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  updateUser: async (id, body) => request(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  }),
  updateUserStatus: async (id, status) => request(`/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  getStaff: async () => request('/admin/staff'),
  assignStaffArea: async (id, areaId) => request(`/admin/staff/${id}/area`, {
    method: 'PATCH',
    body: JSON.stringify({ areaId }),
  }),
  getAreas: async () => request('/admin/areas'),
  getAnimals: async () => request('/admin/animals'),
  getAnimalById: async (id) => request(`/admin/animals/${id}`),
  createAnimal: async (body) => request('/admin/animals', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  updateAnimal: async (id, body) => request(`/admin/animals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  }),
  deleteAnimal: async (id) => request(`/admin/animals/${id}`, {
    method: 'DELETE',
  }),
  getTasks: async () => request('/admin/tasks'),
  createTask: async (body) => request('/admin/tasks', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  updateTask: async (id, body) => request(`/admin/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  }),
  deleteTask: async (id) => request(`/admin/tasks/${id}`, {
    method: 'DELETE',
  }),
  getTickets: async () => request('/admin/tickets'),
  createTicket: async (body) => request('/admin/tickets', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  updateTicket: async (id, body) => request(`/admin/tickets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  }),
  deleteTicket: async (id) => request(`/admin/tickets/${id}`, {
    method: 'DELETE',
  }),
  getServices: async () => request('/admin/services'),
  createService: async (body) => request('/admin/services', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  updateService: async (id, body) => request(`/admin/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  }),
  deleteService: async (id) => request(`/admin/services/${id}`, {
    method: 'DELETE',
  }),
  getBookings: async () => request('/admin/bookings'),
  updateBookingStatus: async (id, body) => request(`/admin/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  }),
  getReports: async () => request('/admin/reports'),
};
