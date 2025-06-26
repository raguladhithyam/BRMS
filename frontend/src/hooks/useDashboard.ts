import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';
import { QUERY_KEYS } from '../config/constants';

export const useDashboard = () => {
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_STATS],
    queryFn: dashboardApi.getStats,
  });

  const { data: bloodGroupStats, isLoading: isBloodGroupStatsLoading } = useQuery({
    queryKey: [QUERY_KEYS.BLOOD_GROUP_STATS],
    queryFn: dashboardApi.getBloodGroupStats,
  });

  return {
    stats,
    bloodGroupStats,
    isLoading: isStatsLoading || isBloodGroupStatsLoading,
  };
};