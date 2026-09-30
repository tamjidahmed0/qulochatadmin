import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes cache validity
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry if 401 or 429
        if (error?.statusCode === 401 || error?.statusCode === 429) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});
