import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, type Story, type CreateStoryRequest, type UpdateStoryRequest } from '@/lib/api';

// Custom hook for fetching stories
export const useStories = (params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['stories', params],
    queryFn: () => apiService.getStories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook for fetching a single story
export const useStory = (slug: string) => {
  return useQuery({
    queryKey: ['story', slug],
    queryFn: () => apiService.getStory(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook for fetching a single story by id
export const useStoryById = (id: string) => {
  return useQuery({
    queryKey: ['storyById', id],
    queryFn: () => apiService.getStoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Custom hook for creating a story
export const useCreateStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStoryRequest) => apiService.createStory(data),
    onSuccess: () => {
      // Invalidate and refetch stories
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

// Custom hook for updating a story
export const useUpdateStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStoryRequest) => apiService.updateStory(data),
    onSuccess: (data) => {
      // Invalidate and refetch stories
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['story', data.slug] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

// Custom hook for deleting a story
export const useDeleteStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteStory(id),
    onSuccess: () => {
      // Invalidate and refetch stories
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}; 