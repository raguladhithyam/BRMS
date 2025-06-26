import api from '../utils/api';
import { Notification, PaginatedResponse } from '../types';

export const notificationsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<PaginatedResponse<Notification>> => {
    const response = await api.get('/notifications', { params });
    return response.data.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/notifications/unread-count');
    return response.data.data;
  },
};