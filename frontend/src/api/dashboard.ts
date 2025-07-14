import api from '../utils/api';
import { DashboardStats, BloodGroupStats, DonationStatistics } from '../types';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data.data;
  },

  getBloodGroupStats: async (): Promise<BloodGroupStats[]> => {
    const response = await api.get('/admin/dashboard/blood-groups');
    return response.data.data;
  },

  getDonationStatistics: async (): Promise<DonationStatistics> => {
    const response = await api.get('/admin/dashboard/donation-stats');
    return response.data.data;
  },
};