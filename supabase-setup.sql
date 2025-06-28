-- =====================================================
-- WebStory Hub - Supabase Database Setup Script
-- =====================================================
-- 
-- Instructions:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire script
-- 4. Click "Run" to execute
--
-- This script will:
-- - Create all necessary tables (categories, stories, users)
-- - Set up triggers for automatic timestamp updates
-- - Configure Row Level Security (RLS) policies
-- - Create admin user with custom credentials
--
-- Admin Login:
-- Email: nikhil@webstory.in
-- Password: Nikhil@1305
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    story_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    cover_image TEXT,
    views INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    author VARCHAR(255) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    reading_time INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (for admin authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at (with IF NOT EXISTS)
DO $$
BEGIN
    -- Drop existing triggers if they exist
    DROP TRIGGER IF EXISTS update_stories_updated_at ON stories;
    DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    
    -- Create new triggers
    CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (with DROP IF EXISTS)
DROP POLICY IF EXISTS "Public read access for stories" ON stories;
DROP POLICY IF EXISTS "Public read access for categories" ON categories;
DROP POLICY IF EXISTS "Admin full access for stories" ON stories;
DROP POLICY IF EXISTS "Admin full access for categories" ON categories;
DROP POLICY IF EXISTS "Admin full access for users" ON users;

CREATE POLICY "Public read access for stories" ON stories
    FOR SELECT USING (true);

CREATE POLICY "Public read access for categories" ON categories
    FOR SELECT USING (true);

-- Create policies for authenticated users (admin access)
CREATE POLICY "Admin full access for stories" ON stories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access for categories" ON categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access for users" ON users
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- NEXT STEPS AFTER RUNNING THIS SCRIPT:
-- =====================================================
-- 
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" 
-- 3. Enter Email: nikhil@webstory.in
-- 4. Enter Password: Nikhil@1305
-- 5. Click "Create User"
-- 6. Then run the admin-setup.sql script to update user role
-- ===================================================== 