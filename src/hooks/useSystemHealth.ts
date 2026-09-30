import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import type { SystemHealthData } from '../types/admin';

export const useSystemHealth = (autoPoll: boolean = true) => {
  return useQuery<SystemHealthData, Error>({
    queryKey: ['system-health'],
    queryFn: () => adminService.getSystemHealth(),
    refetchInterval: autoPoll ? 10000 : false,
    staleTime: 5000,
  });
};
