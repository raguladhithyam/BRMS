import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications';
import { QUERY_KEYS } from '../config/constants';

export const useNotifications = (params?: any) => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, params],
    queryFn: () => notificationsApi.getAll(params),
  });

  const { data: unreadCount } = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, 'unread-count'],
    queryFn: notificationsApi.getUnreadCount,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
};