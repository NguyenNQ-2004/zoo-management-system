const API_URL = 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const headers = { 'Content-Type': 'application/json' };
  if (currentUser.token) {
    headers['Authorization'] = `Bearer ${currentUser.token}`;
  }
  return headers;
};

// Helper for API calls
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
  login: async (email, password) => {
    return apiCall(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  register: async (userData) => {
    return apiCall(`${API_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
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
