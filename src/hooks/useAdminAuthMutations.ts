import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';

export const useUpdateAdminCredentials = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name?: string;
      email?: string;
      username?: string;
      currentPassword?: string;
      newPassword?: string;
    }) => adminService.updateCredentials(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
    },
  });
};

export const useAdminLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
