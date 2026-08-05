import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor to add JWT Auth Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle errors & server status globally
apiClient.interceptors.response.use(
  (response) => {
    // Notify application that server is online
    window.dispatchEvent(new CustomEvent('server-status-changed', { detail: { online: true } }));
    return response;
  },
  (error) => {
    // Detect Network Errors / Connection Refused / Server Down
    if (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      window.dispatchEvent(new CustomEvent('server-status-changed', { detail: { online: false } }));
    } else {
      window.dispatchEvent(new CustomEvent('server-status-changed', { detail: { online: true } }));
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
