import api from '../utils/api';
import { AuthResponse, User } from '../types';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'student';
    bloodGroup: string;
    rollNo: string;
    phone: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

updateProfile: async (userData: Partial<User>): Promise<User> => {
  const mappedData: any = {
    ...userData,
    bloodGroup: userData.bloodGroup,
    rollNo: userData.rollNo,
  };

  // Remove undefined fields
  if (!mappedData.rollNo) delete mappedData.rollNo;
  if (!mappedData.bloodGroup) delete mappedData.bloodGroup;

  console.log("Mapped payload:", mappedData);

  try {
    const response = await api.put('/auth/profile', mappedData);
    return response.data.data;
  } catch (err: any) {
    console.error("Profile update failed:", err.response?.data || err.message);
    throw err;
  }
},
};