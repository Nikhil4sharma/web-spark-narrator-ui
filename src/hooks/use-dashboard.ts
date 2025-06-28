import { useQuery } from '@tanstack/react-query';
import { apiService, type DashboardStats } from '@/lib/api';

// Custom hook for fetching dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiService.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Custom hook for fetching recent stories
export const useRecentStories = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-stories'],
    queryFn: () => apiService.getRecentStories(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}; 