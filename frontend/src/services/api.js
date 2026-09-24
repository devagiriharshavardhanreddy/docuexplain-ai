import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token to outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('docuexplain_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercept 401 Unauthorized responses to clear token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear token
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/' && currentPath !== '/register') {
        localStorage.removeItem('docuexplain_token');
        localStorage.removeItem('docuexplain_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
