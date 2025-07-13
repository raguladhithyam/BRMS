import api from '@/utils/api';
import { User } from '@/types';

export const adminsApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/admin/admins');
    return response.data.data;
  },

  create: async (adminData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<User> => {
    const response = await api.post('/admin/admins', adminData);
    return response.data.data;
  },

  update: async (id: string, adminData: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  }): Promise<User> => {
    const response = await api.put(`/admin/admins/${id}`, adminData);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete(`/admin/admins/${id}`);
    return response.data;
  },
}; 