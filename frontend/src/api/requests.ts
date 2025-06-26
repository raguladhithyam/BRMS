import api from '../utils/api';
import { BloodRequest, PaginatedResponse, ApiResponse } from '../types';

export const requestsApi = {
  // Public API - Create blood request
  create: async (requestData: {
    requestorName: string;
    email: string;
    phone: string;
    bloodGroup: string;
    units: number;
    dateTime: string;
    hospitalName: string;
    location: string;
    urgency: string;
    notes?: string;
  }): Promise<BloodRequest> => {
    const response = await api.post('/requests', requestData);
    return response.data.data;
  },

  // Admin APIs
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    bloodGroup?: string;
    urgency?: string;
  }): Promise<PaginatedResponse<BloodRequest>> => {
    const response = await api.get('/admin/requests', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<BloodRequest> => {
    const response = await api.get(`/admin/requests/${id}`);
    return response.data.data;
  },

  approve: async (id: string): Promise<BloodRequest> => {
    const response = await api.post(`/admin/requests/${id}/approve`);
    return response.data.data;
  },

  reject: async (id: string, reason?: string): Promise<BloodRequest> => {
    const response = await api.post(`/admin/requests/${id}/reject`, { reason });
    return response.data.data;
  },

  fulfill: async (id: string, donorId: string): Promise<BloodRequest> => {
    const response = await api.post(`/admin/requests/${id}/fulfill`, { donorId });
    return response.data.data;
  },

  // Student APIs
  getMatching: async (): Promise<BloodRequest[]> => {
    const response = await api.get('/requests/matching');
    return response.data.data;
  },

  optIn: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/requests/${id}/opt-in`);
    return response.data;
  },

  getOptIns: async (): Promise<any[]> => {
    const response = await api.get('/requests/opt-ins');
    return response.data.data;
  },
};