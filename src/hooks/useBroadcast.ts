import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import type { BroadcastItem } from '../types/admin';

export const useBroadcastHistory = () => {
  return useQuery<BroadcastItem[], Error>({
    queryKey: ['broadcast-history'],
    queryFn: () => adminService.getBroadcastHistory(),
  });
};

export const useBroadcastChatAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title?: string;
      message: string;
      bannerUrl?: string;
      fileUrl?: string;
    }) => adminService.broadcastChatAnnouncement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcast-history'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

export const useBroadcastPushNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      body: string;
      actionUrl?: string;
      data?: Record<string, any>;
    }) => adminService.broadcastPushNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcast-history'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};
