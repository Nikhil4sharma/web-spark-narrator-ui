import { supabase } from './supabase'
import type { Database } from './supabase'

// API Types
export interface Story {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  coverImage: string;
  views: number;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  readingTime: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  storyCount: number;
  createdAt: string;
}

export interface DashboardStats {
  totalStories: number;
  totalViews: number;
  publishedStories: number;
  draftStories: number;
  totalCategories: number;
  monthlyViews: number;
}

export interface CreateStoryRequest {
  title: string;
  content: string;
  category: string;
  coverImage: string;
  tags: string[];
  status: 'draft' | 'published';
}

export interface UpdateStoryRequest extends Partial<CreateStoryRequest> {
  id: string;
}

// API Service Class
class ApiService {
  // Helper function to convert database row to Story interface
  private mapStoryRow(row: Database['public']['Tables']['stories']['Row']): Story {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      category: row.category,
      coverImage: row.cover_image,
      views: row.views,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      author: row.author,
      tags: row.tags || [],
      readingTime: row.reading_time,
    };
  }

  // Helper function to convert database row to Category interface
  private mapCategoryRow(row: Database['public']['Tables']['categories']['Row']): Category {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      storyCount: row.story_count,
      createdAt: row.created_at,
    };
  }

  // Stories API
  async getStories(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ stories: Story[]; total: number }> {
    try {
      let query = supabase
        .from('stories')
        .select('*', { count: 'exact' });

      if (params?.category) {
        query = query.eq('category', params.category);
      }

      if (params?.search) {
        query = query.or(`title.ilike.%${params.search}%,content.ilike.%${params.search}%`);
      }

      if (params?.page && params?.limit) {
        const from = (params.page - 1) * params.limit;
        const to = from + params.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return {
        stories: data?.map(row => this.mapStoryRow(row)) || [],
        total: count || 0,
      };
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  }

  async getStory(slug: string): Promise<Story | null> {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      return data ? this.mapStoryRow(data) : null;
    } catch (error) {
      console.error('Error fetching story:', error);
      throw error;
    }
  }

  async createStory(data: CreateStoryRequest): Promise<Story> {
    try {
      const storyData = {
        title: data.title,
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
        content: data.content,
        category: data.category,
        cover_image: data.coverImage,
        status: data.status,
        author: 'Admin User',
        tags: data.tags,
        reading_time: Math.ceil(data.content.split(' ').length / 200),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: result, error } = await supabase
        .from('stories')
        .insert(storyData)
        .select()
        .single();

      if (error) throw error;

      return this.mapStoryRow(result);
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  }

  async updateStory(data: UpdateStoryRequest): Promise<Story> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.title) updateData.title = data.title;
      if (data.content) updateData.content = data.content;
      if (data.category) updateData.category = data.category;
      if (data.coverImage) updateData.cover_image = data.coverImage;
      if (data.status) updateData.status = data.status;
      if (data.tags) updateData.tags = data.tags;
      if (data.content) updateData.reading_time = Math.ceil(data.content.split(' ').length / 200);

      const { data: result, error } = await supabase
        .from('stories')
        .update(updateData)
        .eq('id', data.id)
        .select()
        .single();

      if (error) throw error;

      return this.mapStoryRow(result);
    } catch (error) {
      console.error('Error updating story:', error);
      throw error;
    }
  }

  async deleteStory(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  }

  // Categories API
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      return data?.map(row => this.mapCategoryRow(row)) || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async createCategory(data: Omit<Category, 'id' | 'storyCount' | 'createdAt'>): Promise<Category> {
    try {
      const categoryData = {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description,
        story_count: 0,
        created_at: new Date().toISOString(),
      };

      const { data: result, error } = await supabase
        .from('categories')
        .insert(categoryData)
        .select()
        .single();

      if (error) throw error;

      return this.mapCategoryRow(result);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    try {
      const updateData: any = {};

      if (data.name) updateData.name = data.name;
      if (data.slug) updateData.slug = data.slug;
      if (data.description) updateData.description = data.description;

      const { data: result, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return this.mapCategoryRow(result);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Dashboard API
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get total stories
      const { count: totalStories } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true });

      // Get published stories
      const { count: publishedStories } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      // Get draft stories
      const { count: draftStories } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      // Get total categories
      const { count: totalCategories } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

      // Get total views
      const { data: viewsData } = await supabase
        .from('stories')
        .select('views');

      const totalViews = viewsData?.reduce((sum, story) => sum + (story.views || 0), 0) || 0;

      // Get monthly views (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: monthlyViewsData } = await supabase
        .from('stories')
        .select('views')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const monthlyViews = monthlyViewsData?.reduce((sum, story) => sum + (story.views || 0), 0) || 0;

      return {
        totalStories: totalStories || 0,
        totalViews,
        publishedStories: publishedStories || 0,
        draftStories: draftStories || 0,
        totalCategories: totalCategories || 0,
        monthlyViews,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getRecentStories(): Promise<Story[]> {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      return data?.map(row => this.mapStoryRow(row)) || [];
    } catch (error) {
      console.error('Error fetching recent stories:', error);
      throw error;
    }
  }

  // Admin Authentication
  async login(credentials: { email: string; password: string }): Promise<{ token: string; user: any }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      return {
        token: data.session?.access_token || '',
        user: data.user,
      };
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Mock data for development (when API is not available)
export const mockStories: Story[] = [
  {
    id: "1",
    title: "Amazing Travel Adventure",
    slug: "amazing-travel-adventure",
    content: "This is an amazing travel story...",
    category: "Travel",
    coverImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop",
    views: 1250,
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    author: "John Doe",
    tags: ["travel", "adventure", "exploration"],
    readingTime: 5
  },
  {
    id: "2",
    title: "Delicious Food Journey",
    slug: "delicious-food-journey",
    content: "A culinary adventure around the world...",
    category: "Food",
    coverImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop",
    views: 890,
    status: "draft",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14",
    author: "Jane Smith",
    tags: ["food", "culinary", "recipes"],
    readingTime: 8
  },
  {
    id: "3",
    title: "Tech Innovation Spotlight",
    slug: "tech-innovation-spotlight",
    content: "Latest innovations in technology...",
    category: "Technology",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop",
    views: 2100,
    status: "published",
    createdAt: "2024-01-13",
    updatedAt: "2024-01-13",
    author: "Tech Guru",
    tags: ["technology", "innovation", "ai"],
    readingTime: 6
  },
  {
    id: "4",
    title: "Fitness Transformation",
    slug: "fitness-transformation",
    content: "My journey to better health...",
    category: "Health",
    coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    views: 1500,
    status: "published",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
    author: "Fitness Coach",
    tags: ["fitness", "health", "transformation"],
    readingTime: 7
  }
];

export const mockCategories: Category[] = [
  { id: "1", name: "Travel", slug: "travel", description: "Travel stories and adventures", storyCount: 8, createdAt: "2024-01-01" },
  { id: "2", name: "Food", slug: "food", description: "Culinary experiences and recipes", storyCount: 6, createdAt: "2024-01-01" },
  { id: "3", name: "Technology", slug: "technology", description: "Tech innovations and insights", storyCount: 5, createdAt: "2024-01-01" },
  { id: "4", name: "Health", slug: "health", description: "Health and fitness stories", storyCount: 5, createdAt: "2024-01-01" }
];

export const mockDashboardStats: DashboardStats = {
  totalStories: 24,
  totalViews: 15420,
  publishedStories: 18,
  draftStories: 6,
  totalCategories: 4,
  monthlyViews: 5200
}; 