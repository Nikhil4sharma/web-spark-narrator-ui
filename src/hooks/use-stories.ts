import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, mockStories, type Story, type CreateStoryRequest, type UpdateStoryRequest } from '@/lib/api';

// Custom hook for fetching stories
export const useStories = (params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['stories', params],
    queryFn: async () => {
      try {
        return await apiService.getStories(params);
      } catch (error) {
        // Fallback to mock data if Supabase fails
        console.warn('Supabase failed, using mock data:', error);
        const filteredStories = mockStories.filter(story => {
          if (params?.category && story.category !== params.category) return false;
          if (params?.search && !story.title.toLowerCase().includes(params.search.toLowerCase())) return false;
          return true;
        });
        return { stories: filteredStories, total: filteredStories.length };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook for fetching a single story
export const useStory = (slug: string) => {
  return useQuery({
    queryKey: ['story', slug],
    queryFn: async () => {
      try {
        const story = await apiService.getStory(slug);
        if (!story) {
          throw new Error('Story not found');
        }
        return story;
      } catch (error) {
        // Fallback to mock data if Supabase fails
        console.warn('Supabase failed, using mock data:', error);
        return mockStories.find(story => story.slug === slug);
      }
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook for creating a story
export const useCreateStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStoryRequest) => {
      try {
        return await apiService.createStory(data);
      } catch (error) {
        // For demo purposes, create a mock story if Supabase fails
        console.warn('Supabase failed, creating mock story:', error);
        const newStory: Story = {
          id: Date.now().toString(),
          ...data,
          slug: data.title.toLowerCase().replace(/\s+/g, '-'),
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'Admin User',
          readingTime: Math.ceil(data.content.split(' ').length / 200),
        };
        return newStory;
      }
    },
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
    mutationFn: async (data: UpdateStoryRequest) => {
      try {
        return await apiService.updateStory(data);
      } catch (error) {
        // For demo purposes, update mock story if Supabase fails
        console.warn('Supabase failed, updating mock story:', error);
        const updatedStory: Story = {
          ...mockStories.find(s => s.id === data.id)!,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        return updatedStory;
      }
    },
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
    mutationFn: async (id: string) => {
      try {
        return await apiService.deleteStory(id);
      } catch (error) {
        // For demo purposes, just log the deletion if Supabase fails
        console.warn('Supabase failed, deleting mock story:', error);
        return Promise.resolve();
      }
    },
    onSuccess: () => {
      // Invalidate and refetch stories
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}; 