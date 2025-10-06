const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  
  // Client endpoints
  CLIENTS: `${API_BASE_URL}/clients`,
  CLIENT_BY_ID: (id) => `${API_BASE_URL}/clients/${id}`,
  
  // Customer endpoints  
  CUSTOMERS: `${API_BASE_URL}/customers`,
  CUSTOMER_BY_ID: (id) => `${API_BASE_URL}/customers/${id}`,
  
  // Sales endpoints
  SALES: `${API_BASE_URL}/sales`,
  SALES_BY_ID: (id) => `${API_BASE_URL}/sales/${id}`,
  
  // Reports endpoints
  REPORTS: `${API_BASE_URL}/reports`,
  DASHBOARD_STATS: `${API_BASE_URL}/reports/dashboard`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
  INIT_DB: `${API_BASE_URL}/init-db`,
};

export default API_BASE_URL;