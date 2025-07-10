import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import { getAuthToken, clearAuthData } from './auth';
import toast from 'react-hot-toast';

// Debounce mechanism to prevent multiple error toasts
let lastErrorToast = '';
let errorToastTimeout: NodeJS.Timeout | null = null;

const showErrorToast = (message: string) => {
  // If it's the same error message and we recently showed it, don't show again
  if (lastErrorToast === message && errorToastTimeout) {
    return;
  }
  
  // Clear any existing timeout
  if (errorToastTimeout) {
    clearTimeout(errorToastTimeout);
  }
  
  // Show the toast
  toast.error(message);
  lastErrorToast = message;
  
  // Reset after 2 seconds
  errorToastTimeout = setTimeout(() => {
    lastErrorToast = '';
  }, 2000);
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased timeout to 30 seconds for donor assignment
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
      showErrorToast('Network error. Please check your connection.');
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
      showErrorToast('Session expired. Please login again.');
      return Promise.reject(error);
    }

    // Handle 403 forbidden
    if (error.response?.status === 403) {
      showErrorToast('Access denied. You do not have permission to perform this action.');
      return Promise.reject(error);
    }

    // Handle 404 not found
    if (error.response?.status === 404) {
      showErrorToast('Resource not found.');
      return Promise.reject(error);
    }

    // Handle 500 server errors
    if (error.response?.status >= 500) {
      showErrorToast('Server error. Please try again later.');
      return Promise.reject(error);
    }

    // For other errors, show the message from the server if available
    const message = error.response?.data?.message || 'An unexpected error occurred';
    if (!error.config?.skipErrorToast) {
      showErrorToast(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;