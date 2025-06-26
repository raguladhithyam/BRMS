import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { setAuthData, clearAuthData, getAuthUser } from '../utils/auth';
import { QUERY_KEYS } from '../config/constants';
import { socketService } from '../services/socket';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: authApi.me,
    initialData: getAuthUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      setAuthData(data.token, data.user);
      queryClient.setQueryData([QUERY_KEYS.USER], data.user);
      socketService.connect();
      toast.success('Logged in successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuthData(data.token, data.user);
      queryClient.setQueryData([QUERY_KEYS.USER], data.user);
      socketService.connect();
      toast.success('Account created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuthData();
      queryClient.clear();
      socketService.disconnect();
      toast.success('Logged out successfully!');
    },
    onError: () => {
      // Even if logout fails on server, clear local data
      clearAuthData();
      queryClient.clear();
      socketService.disconnect();
      toast.success('Logged out successfully!');
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.USER], data);
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
    },
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isUpdateLoading: updateProfileMutation.isPending,
  };
};