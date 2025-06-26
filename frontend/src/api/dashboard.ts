import api from '../utils/api';
import { DashboardStats, BloodGroupStats } from '../types';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data.data;
  },

  getBloodGroupStats: async (): Promise<BloodGroupStats[]> => {
    const response = await api.get('/admin/dashboard/blood-groups');
    return response.data.data;
  },
};