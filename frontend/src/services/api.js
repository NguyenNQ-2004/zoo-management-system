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

export const api = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    return response.json();
  },
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  },
  getStaffDashboard: async () => {
    const response = await fetch(`${API_URL}/staff/dashboard`, {
      headers: getStaffHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to load staff dashboard');
    }
    return response.json();
  },
  getStaffTasks: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);

    const url = `${API_URL}/staff/tasks${query.toString() ? `?${query.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: getStaffHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to load staff tasks');
    }
    return response.json();
  }
};
