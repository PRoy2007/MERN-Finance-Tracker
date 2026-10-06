import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


//grabs token from localStorage and attaches it to the Authorization header for API requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;