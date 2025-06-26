import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../api/students';
import { QUERY_KEYS } from '../config/constants';
import toast from 'react-hot-toast';

export const useStudents = (params?: any) => {
  const queryClient = useQueryClient();

  const { data: students, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.STUDENTS, params],
    queryFn: () => studentsApi.getAll(params),
    enabled: true,
    retry: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const createMutation = useMutation({
    mutationFn: studentsApi.create,
    onSuccess: () => {
      toast.success('Student added successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create student';
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      studentsApi.update(id, data),
    onSuccess: () => {
      toast.success('Student updated successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update student';
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: studentsApi.delete,
    onSuccess: () => {
      toast.success('Student deleted successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete student';
      toast.error(message);
    },
  });

  const bulkUploadMutation = useMutation({
    mutationFn: studentsApi.bulkUpload,
    onSuccess: (data) => {
      toast.success(`${data.created} students uploaded successfully!`);
      if (data.errors.length > 0) {
        toast.error(`${data.errors.length} errors occurred during upload`);
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to upload students';
      toast.error(message);
    },
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: studentsApi.updateAvailability,
    onSuccess: (data) => {
      toast.success('Availability updated successfully!');
      queryClient.setQueryData([QUERY_KEYS.USER], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update availability';
      toast.error(message);
    },
  });

  return {
    students,
    isLoading,
    error,
    refetch,
    createStudent: createMutation.mutate,
    updateStudent: updateMutation.mutate,
    deleteStudent: deleteMutation.mutate,
    bulkUpload: bulkUploadMutation.mutate,
    updateAvailability: updateAvailabilityMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isBulkUploading: bulkUploadMutation.isPending,
    isUpdatingAvailability: updateAvailabilityMutation.isPending,
  };
};