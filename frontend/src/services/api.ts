import axios from 'axios';

export const API_BASE_URL = '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('biodata_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized on admin endpoint, clear stale token
      const isAuthEndpoint = error.config?.url?.includes('/auth/login');
      if (!isAuthEndpoint) {
        localStorage.removeItem('biodata_token');
        localStorage.removeItem('biodata_user');
      }
    }
    return Promise.reject(error);
  }
);
