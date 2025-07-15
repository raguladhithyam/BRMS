import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '@/api/requests';
import { QUERY_KEYS } from '@/config/constants';
import toast from 'react-hot-toast';
import { BloodRequest } from '@/types';

export const useRequests = () => {
  const queryClient = useQueryClient();

  const createRequestMutation = useMutation({
    mutationFn: requestsApi.create,
    onSuccess: () => {
      toast.success('Blood request submitted successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BLOOD_REQUESTS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    },
  });

  return {
    createRequest: createRequestMutation.mutate,
    isCreating: createRequestMutation.isPending,
  };
};

export const useAdminRequests = (params?: any) => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.BLOOD_REQUESTS, 'admin', params],
    queryFn: () => requestsApi.getAll(params),
    enabled: true,
  });

  const approveMutation = useMutation({
    mutationFn: requestsApi.approve,
    onSuccess: () => {
      toast.success('Request approved successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BLOOD_REQUESTS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      requestsApi.reject(id, reason),
    onSuccess: () => {
      toast.success('Request rejected!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BLOOD_REQUESTS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    },
  });

  const fulfillMutation = useMutation({
    mutationFn: ({ id, donorId }: { id: string; donorId: string }) =>
      requestsApi.fulfill(id, donorId),
    onSuccess: () => {
      toast.success('Request fulfilled successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BLOOD_REQUESTS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to fulfill request');
    },
  });

  const updateAssignedDonorMutation = useMutation({
    mutationFn: ({ requestId, donorId }: { requestId: string; donorId: string }) =>
      requestsApi.updateAssignedDonor(requestId, donorId),
    onSuccess: () => {
      toast.success('Assigned donor updated successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BLOOD_REQUESTS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update assigned donor');
    },
  });

  const completeDonationMutation = useMutation({
    mutationFn: ({ requestId, geotagPhoto }: { requestId: string; geotagPhoto: File }) =>
      requestsApi.completeDonation(requestId, geotagPhoto),
    onSuccess: () => {
      toast.success('Donation completed successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BLOOD_REQUESTS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete donation');
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: (id: string) => requestsApi.delete(id),
    onSuccess: () => {
      toast.success('Request deleted successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BLOOD_REQUESTS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete request');
    },
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BloodRequest> }) =>
      requestsApi.update(id, data),
    onSuccess: () => {
      toast.success('Request updated successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BLOOD_REQUESTS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update request');
    },
  });

  return {
    requests,
    isLoading,
    error,
    approveRequest: approveMutation.mutate,
    rejectRequest: rejectMutation.mutate,
    fulfillRequest: fulfillMutation.mutate,
    updateAssignedDonor: updateAssignedDonorMutation.mutate,
    completeDonation: completeDonationMutation.mutate,
    deleteRequest: deleteRequestMutation.mutate,
    updateRequest: updateRequestMutation.mutate,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isFulfilling: fulfillMutation.isPending,
    isUpdatingDonor: updateAssignedDonorMutation.isPending,
    isCompletingDonation: completeDonationMutation.isPending,
    isDeleting: deleteRequestMutation.isPending,
  };
};

export const useStudentRequests = () => {
  const queryClient = useQueryClient();

  const { data: matchingRequests, isLoading: isLoadingMatching } = useQuery({
    queryKey: [QUERY_KEYS.MATCHING_REQUESTS],
    queryFn: requestsApi.getMatching,
    enabled: true,
  });

  const { data: optIns, isLoading: isLoadingOptIns } = useQuery({
    queryKey: [QUERY_KEYS.OPT_INS],
    queryFn: requestsApi.getOptIns,
    enabled: true,
  });

  const optInMutation = useMutation({
    mutationFn: requestsApi.optIn,
    onSuccess: () => {
      toast.success('Opted in successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MATCHING_REQUESTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OPT_INS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to opt in');
    },
  });

  return {
    matchingRequests,
    optIns,
    isLoading: isLoadingMatching || isLoadingOptIns,
    optIn: optInMutation.mutate,
    isOptingIn: optInMutation.isPending,
  };
};