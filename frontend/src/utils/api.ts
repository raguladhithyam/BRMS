import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import { getAuthToken, clearAuthData } from './auth';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
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
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Don't show error toast for 401 errors during initial auth check
    if (error.response?.status === 401 && error.config?.url?.includes('/auth/me')) {
      clearAuthData();
      return Promise.reject(error);
    }
    
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      clearAuthData();
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
      return Promise.reject(error);
    }

    // Handle 403 forbidden
    if (error.response?.status === 403) {
      toast.error('Access denied. You do not have permission to perform this action.');
      return Promise.reject(error);
    }

    // Handle 404 not found
    if (error.response?.status === 404) {
      toast.error('Resource not found.');
      return Promise.reject(error);
    }

    // Handle 500 server errors
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
      return Promise.reject(error);
    }

    // For other errors, show the message from the server if available
    const message = error.response?.data?.message || 'An unexpected error occurred';
    if (!error.config?.skipErrorToast) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;