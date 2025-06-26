import { User } from '../types';

const TOKEN_KEY = 'blood_request_token';
const USER_KEY = 'blood_request_user';

export const setAuthData = (token: string, user: User) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getAuthUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const hasRole = (requiredRole: string): boolean => {
  const user = getAuthUser();
  return user?.role === requiredRole;
};