import api from '../utils/api';
import { User, PaginatedResponse } from '../types';

export const studentsApi = {
  // Student-specific endpoints (for students to manage their own data)
  updateAvailability: async (availability: boolean): Promise<User> => {
    const response = await api.put('/students/availability', { availability });
    return response.data.data;
  },

  // Admin-only endpoints (only for admin users)
  getAll: async (params?: {
    page?: number;
    limit?: number;
    bloodGroup?: string;
    availability?: string;
    search?: string;
  }): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/admin/students', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/admin/students/${id}`);
    return response.data.data;
  },

  create: async (studentData: {
    name: string;
    email: string;
    bloodGroup: string;
    rollNo: string;
    phone: string;
    availability: boolean;
  }): Promise<User> => {
    const response = await api.post('/admin/students', studentData);
    return response.data.data;
  },

  update: async (id: string, studentData: Partial<User>): Promise<User> => {
    const response = await api.put(`/admin/students/${id}`, studentData);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/students/${id}`);
  },

  bulkUpload: async (file: File): Promise<{ created: number; errors: any[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/admin/students/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};