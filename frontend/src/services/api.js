const API_URL = process.env.REACT_APP_API_URL || '/api';

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  } catch (error) {
    return null;
  }
};

const getStaffHeaders = () => {
  const currentUser = getCurrentUser();

  return {
    'Content-Type': 'application/json',
    ...(currentUser?.email ? { 'x-staff-email': currentUser.email } : {})
  };
};

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof body === 'string'
      ? body
      : body.message;

    if (message && message.toLowerCase().includes('proxy error')) {
      throw new Error('Backend server is not running on port 5001. Please start the backend and try again.');
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
    const response = await fetch(`${API_URL}${path}`, options);
    return parseResponse(response);
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to backend API. Please make sure the backend server is running.');
    }

    throw error;
  }
};

export const api = {
  login: async (email, password) => request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }),

  register: async (userData) => request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  }),

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
