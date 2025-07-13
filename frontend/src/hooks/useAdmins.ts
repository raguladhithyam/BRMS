import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminsApi } from '@/api/admins';
import { QUERY_KEYS } from '@/config/constants';
import toast from 'react-hot-toast';

export const useAdmins = () => {
  const queryClient = useQueryClient();

  const { data: admins, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.ADMINS],
    queryFn: adminsApi.getAll,
    enabled: true,
  });

  const createMutation = useMutation({
    mutationFn: adminsApi.create,
    onSuccess: () => {
      toast.success('Admin created successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminsApi.update(id, data),
    onSuccess: () => {
      toast.success('Admin updated successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update admin');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminsApi.delete,
    onSuccess: () => {
      toast.success('Admin deleted successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete admin');
    },
  });

  return {
    admins,
    isLoading,
    error,
    createAdmin: createMutation.mutate,
    updateAdmin: updateMutation.mutate,
    deleteAdmin: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}; 