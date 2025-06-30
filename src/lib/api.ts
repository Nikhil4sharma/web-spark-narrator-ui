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
  publisherName?: string;
  publisherLogoAlt?: string;
  posterAlt?: string;
  publishDate?: string;
  updateDate?: string;
  canonicalUrl?: string;
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
  publisherName?: string;
  publisherLogoAlt?: string;
  posterAlt?: string;
  publishDate?: string;
  updateDate?: string;
  canonicalUrl?: string;
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
      publisherName: row.publisher_name,
      publisherLogoAlt: row.publisher_logo_alt,
      posterAlt: row.poster_alt,
      publishDate: row.publish_date,
      updateDate: row.update_date,
      canonicalUrl: row.canonical_url,
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
        title: data.title || 'Untitled Story',
        slug: data.slug || ((data.title || 'Untitled Story').toLowerCase().replace(/\s+/g, '-')),
        content: data.content,
        category: data.category,
        cover_image: data.coverImage,
        status: data.status,
        author: 'Admin User',
        tags: data.tags,
        reading_time: Math.ceil(data.content.split(' ').length / 200),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        publisher_name: data.publisherName,
        publisher_logo_alt: data.publisherLogoAlt,
        poster_alt: data.posterAlt,
        publish_date: data.publishDate,
        update_date: data.updateDate,
        canonical_url: data.canonicalUrl,
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
      if (data.publisherName) updateData.publisher_name = data.publisherName;
      if (data.publisherLogoAlt) updateData.publisher_logo_alt = data.publisherLogoAlt;
      if (data.posterAlt) updateData.poster_alt = data.posterAlt;
      if (data.publishDate) updateData.publish_date = data.publishDate;
      if (data.updateDate) updateData.update_date = data.updateDate;
      if (data.canonicalUrl) updateData.canonical_url = data.canonicalUrl;

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

  async getStoryById(id: string): Promise<Story | null> {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data ? this.mapStoryRow(data) : null;
    } catch (error) {
      console.error('Error fetching story by id:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService(); 