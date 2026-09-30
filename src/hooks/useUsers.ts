import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import type { UserItem } from '../types/admin';

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  plan?: string;
  status?: string;
}

export const useUsersList = (params: UsersQueryParams) => {
  return useQuery<{
    users: UserItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }, Error>({
    queryKey: ['users', params],
    queryFn: () => adminService.getUsers(params),
  });
};

export const useUserDetails = (id: string | null) => {
  return useQuery<any, Error>({
    queryKey: ['user-details', id],
    queryFn: () => adminService.getUserById(id!),
    enabled: Boolean(id),
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminService.toggleUserStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-details', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

export const useUpdateUserPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: string }) =>
      adminService.updateUserPlan(id, plan),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-details', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};
