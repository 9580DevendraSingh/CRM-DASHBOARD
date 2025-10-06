// src/services/apiService.js
const API_BASE_URL = 'http://localhost:5000/api';

// Auth related functions
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
    });
    return response.json();
  }
};

// Clients related functions
export const clientsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/clients`);
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`);
    return response.json();
  },

  create: async (clientData) => {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });
    return response.json();
  },

  update: async (id, clientData) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
};

// Health check function
export const healthAPI = {
  check: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  checkAuth: async () => {
    const response = await fetch(`${API_BASE_URL}/health/auth`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }
};

// Reports related functions
export const reportsAPI = {
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/reports/dashboard`);
    return response.json();
  },

  getSales: async (period) => {
    const response = await fetch(`${API_BASE_URL}/reports/sales?period=${period}`);
    return response.json();
  },

  getClientReports: async () => {
    const response = await fetch(`${API_BASE_URL}/reports/clients`);
    return response.json();
  }
};

// Default export (agar koi file default import use kar raha hai)
const apiService = {
  authAPI,
  clientsAPI,
  healthAPI,
  reportsAPI
};

export default apiService;