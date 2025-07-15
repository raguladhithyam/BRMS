import api from '../utils/api';
import { PaginatedResponse } from '../types';

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';
  user: string;
  role: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogStats {
  totalLogs: number;
  errorLogs: number;
  warnLogs: number;
  infoLogs: number;
  debugLogs: number;
}

export interface LogFilters {
  page?: number;
  limit?: number;
  user?: string;
  level?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export const logsApi = {
  getSystemLogs: async (filters?: LogFilters): Promise<PaginatedResponse<SystemLog>> => {
    const response = await api.get('/logs', { params: filters });
    return response.data.data;
  },

  getLogStats: async (): Promise<LogStats> => {
    const response = await api.get('/logs/stats');
    return response.data.data;
  },

  exportLogs: async (filters?: LogFilters & { format?: 'json' | 'csv' | 'xlsx' }): Promise<Blob | any> => {
    const response = await api.get('/logs/export', { 
      params: filters,
      responseType: (filters?.format === 'csv' || filters?.format === 'xlsx') ? 'blob' : 'json'
    });
    
    if (filters?.format === 'csv' || filters?.format === 'xlsx') {
      return response.data;
    }
    
    return response.data.data;
  },
}; 