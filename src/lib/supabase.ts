import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rxkqyubxsiiqefmsvouw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4a3F5dWJ4c2lpcWVmbXN2b3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMTIzNDQsImV4cCI6MjA2NjY4ODM0NH0.5OuS5_oQaoDEByYcX_kMgJ6RjYEiotVQhn7IrPg5YlA'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Database {
  public: {
    Tables: {
      stories: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          category: string
          cover_image: string
          views: number
          status: 'draft' | 'published'
          created_at: string
          updated_at: string
          author: string
          tags: string[]
          reading_time: number
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          category: string
          cover_image: string
          views?: number
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
          author: string
          tags?: string[]
          reading_time?: number
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          category?: string
          cover_image?: string
          views?: number
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
          author?: string
          tags?: string[]
          reading_time?: number
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          story_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          story_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          story_count?: number
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'admin' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'user'
          created_at?: string
        }
      }
    }
  }
} 