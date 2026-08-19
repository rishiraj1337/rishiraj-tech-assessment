import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem('jwt');
      sessionStorage.removeItem('authed');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;