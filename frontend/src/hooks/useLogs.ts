import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { logsApi, LogFilters } from '../api/logs';
import toast from 'react-hot-toast';

export const useLogs = (autoRefresh = false, refreshInterval = 30000) => {
  const [filters, setFilters] = useState<LogFilters>({
    page: 1,
    limit: 20,
  });

  const {
    data: logsData,
    isLoading: logsLoading,
    error: logsError,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ['logs', filters],
    queryFn: () => logsApi.getSystemLogs(filters),
    refetchInterval: autoRefresh ? refreshInterval : false,
    refetchIntervalInBackground: autoRefresh,
  });

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['logStats'],
    queryFn: () => logsApi.getLogStats(),
    refetchInterval: autoRefresh ? refreshInterval : false,
    refetchIntervalInBackground: autoRefresh,
  });

  const exportMutation = useMutation({
    mutationFn: (exportFilters: LogFilters & { format?: 'json' | 'csv' | 'xlsx' }) =>
      logsApi.exportLogs(exportFilters),
    onSuccess: (data, variables) => {
      if (variables.format === 'csv') {
        // Handle CSV download
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Logs exported successfully!');
      } else if (variables.format === 'xlsx') {
        // Handle XLSX download
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-logs-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Logs exported successfully!');
      } else {
        // Handle JSON download
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Logs exported successfully!');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to export logs';
      toast.error(message);
    },
  });

  const updateFilters = useCallback((newFilters: Partial<LogFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1, // Reset to page 1 when filters change
    }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 20,
    });
  }, []);

  const refresh = useCallback(() => {
    refetchLogs();
    refetchStats();
  }, [refetchLogs, refetchStats]);

  const exportLogs = useCallback((format: 'json' | 'csv' | 'xlsx' = 'json') => {
    exportMutation.mutate({ ...filters, format });
  }, [filters, exportMutation]);

  return {
    // Data
    logs: logsData?.data || [],
    stats: statsData,
    pagination: {
      total: logsData?.total || 0,
      page: logsData?.page || 1,
      limit: logsData?.limit || 20,
      totalPages: logsData?.totalPages || 0,
    },

    // Loading states
    isLoading: logsLoading || statsLoading,
    isExporting: exportMutation.isPending,

    // Errors
    error: logsError || statsError,

    // Filters
    filters,
    updateFilters,
    clearFilters,

    // Actions
    goToPage,
    refresh,
    exportLogs,
  };
}; 