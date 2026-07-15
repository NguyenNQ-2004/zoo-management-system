const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const api = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  getVetDashboardStats: async () => {
    const response = await fetch(`${API_URL}/vet/dashboard`);
    return handleResponse(response);
  },

  getVetAnimalHealthStatus: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/vet/animals/health-status${query ? `?${query}` : ''}`);
    return handleResponse(response);
  },

  getVetHealthRecords: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/vet/health-records${query ? `?${query}` : ''}`);
    return handleResponse(response);
  }
};
