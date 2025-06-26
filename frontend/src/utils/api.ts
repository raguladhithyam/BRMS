import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import { getAuthToken, clearAuthData } from './auth';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't show error toast for 401 errors during initial auth check
    if (error.response?.status === 401 && error.config?.url?.includes('/auth/me')) {
      clearAuthData();
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401) {
      clearAuthData();
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else {
      // Only show error toast if it's not handled by the calling component
      const message = error.response?.data?.message || 'An error occurred';
      if (!error.config?.skipErrorToast) {
        toast.error(message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;