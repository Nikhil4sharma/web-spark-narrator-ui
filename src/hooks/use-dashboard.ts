import { useQuery } from '@tanstack/react-query';
import { apiService, mockDashboardStats, mockStories, type DashboardStats } from '@/lib/api';

// Custom hook for fetching dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      try {
        return await apiService.getDashboardStats();
      } catch (error) {
        // Fallback to mock data if Supabase fails
        console.warn('Supabase failed, using mock dashboard stats:', error);
        return mockDashboardStats;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Custom hook for fetching recent stories
export const useRecentStories = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-stories'],
    queryFn: async () => {
      try {
        return await apiService.getRecentStories();
      } catch (error) {
        // Fallback to mock data if Supabase fails
        console.warn('Supabase failed, using mock recent stories:', error);
        return mockStories.slice(0, 5); // Return first 5 stories as recent
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}; 