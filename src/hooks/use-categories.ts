import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, mockCategories, type Category } from '@/lib/api';

// Custom hook for fetching categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        return await apiService.getCategories();
      } catch (error) {
        // Fallback to mock data if Supabase fails
        console.warn('Supabase failed, using mock categories:', error);
        return mockCategories;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Custom hook for creating a category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Category, 'id' | 'storyCount' | 'createdAt'>) => {
      try {
        return await apiService.createCategory(data);
      } catch (error) {
        // For demo purposes, create a mock category if Supabase fails
        console.warn('Supabase failed, creating mock category:', error);
        const newCategory: Category = {
          id: Date.now().toString(),
          ...data,
          storyCount: 0,
          createdAt: new Date().toISOString(),
        };
        return newCategory;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Custom hook for updating a category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Category> }) => {
      try {
        return await apiService.updateCategory(id, data);
      } catch (error) {
        // For demo purposes, update mock category if Supabase fails
        console.warn('Supabase failed, updating mock category:', error);
        const updatedCategory: Category = {
          ...mockCategories.find(c => c.id === id)!,
          ...data,
        };
        return updatedCategory;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Custom hook for deleting a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await apiService.deleteCategory(id);
      } catch (error) {
        // For demo purposes, just log the deletion if Supabase fails
        console.warn('Supabase failed, deleting mock category:', error);
        return Promise.resolve();
      }
    },
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}; 