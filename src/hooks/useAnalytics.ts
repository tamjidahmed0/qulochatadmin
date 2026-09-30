import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import type { AnalyticsOverview } from '../types/admin';

export const useAnalyticsOverview = (range: string = '30d') => {
  return useQuery<AnalyticsOverview, Error>({
    queryKey: ['analytics', range],
    queryFn: () => adminService.getAnalyticsOverview(range),
    staleTime: 1000 * 60, // 1 minute
  });
};
