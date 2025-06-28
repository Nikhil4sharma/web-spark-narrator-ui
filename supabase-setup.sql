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
-- - Insert sample data
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

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Travel', 'travel', 'Travel stories and adventures'),
('Food', 'food', 'Culinary experiences and recipes'),
('Technology', 'technology', 'Tech innovations and insights'),
('Health', 'health', 'Health and fitness stories')
ON CONFLICT (name) DO NOTHING;

-- Insert sample stories
INSERT INTO stories (title, slug, content, category, cover_image, views, status, author, tags, reading_time) VALUES
(
    'Amazing Travel Adventure',
    'amazing-travel-adventure',
    'This is an amazing travel story that takes you on a journey through beautiful landscapes and exciting adventures. Experience the thrill of exploration and discover hidden gems around the world.

## The Journey Begins

Our adventure started in the heart of the mountains, where every step revealed a new wonder. The crisp mountain air filled our lungs as we embarked on this incredible journey.

### What We Discovered

- **Hidden Waterfalls**: Crystal clear waters cascading down ancient rocks
- **Local Culture**: Rich traditions and warm hospitality
- **Breathtaking Views**: Panoramic vistas that took our breath away

*"Travel is the only thing you buy that makes you richer."* - This quote perfectly captures the essence of our journey.',
    'Travel',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
    1250,
    'published',
    'Nikhil',
    ARRAY['travel', 'adventure', 'exploration'],
    5
),
(
    'Delicious Food Journey',
    'delicious-food-journey',
    'A culinary adventure around the world that explores the most delicious cuisines and traditional recipes. From street food to fine dining, discover the flavors that make each culture unique.

## The Taste of Tradition

Every culture has its own unique way of preparing food, and we had the privilege of experiencing them all. From spicy curries to delicate pastries, each dish told a story.

### Culinary Highlights

- **Street Food**: Authentic flavors from local vendors
- **Fine Dining**: Elegant restaurants with innovative menus
- **Home Cooking**: Traditional family recipes passed down through generations

The journey through different cuisines was not just about food—it was about understanding cultures, traditions, and the love that goes into every dish.',
    'Food',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop',
    890,
    'draft',
    'Nikhil',
    ARRAY['food', 'culinary', 'recipes'],
    8
),
(
    'Tech Innovation Spotlight',
    'tech-innovation-spotlight',
    'Latest innovations in technology that are shaping our future. From artificial intelligence to sustainable energy solutions, explore the cutting-edge developments that will change the world.

## The Future is Now

Technology is advancing at an unprecedented pace, and we are witnessing breakthroughs that seemed impossible just a few years ago. These innovations are not just changing how we work—they are transforming how we live.

### Key Innovations

- **Artificial Intelligence**: Machine learning algorithms that understand and learn
- **Renewable Energy**: Sustainable solutions for a greener future
- **Virtual Reality**: Immersive experiences that blur the line between digital and physical

The potential of these technologies is limitless, and we are only scratching the surface of what is possible.',
    'Technology',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop',
    2100,
    'published',
    'Nikhil',
    ARRAY['technology', 'innovation', 'ai'],
    6
),
(
    'Fitness Transformation',
    'fitness-transformation',
    'My journey to better health and fitness. This is a personal story of transformation, challenges, and the lessons learned along the way to achieving a healthier lifestyle.

## The Beginning

It all started with a simple decision to change. The journey was not easy, but every step forward brought new strength and confidence.

### The Transformation Process

- **Setting Goals**: Clear, achievable objectives that kept me motivated
- **Building Habits**: Small changes that led to big results
- **Overcoming Challenges**: Learning to push through difficult moments

The transformation was not just physical—it was mental and emotional as well. The discipline and determination developed during this journey have positively impacted every area of my life.',
    'Health',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
    1500,
    'published',
    'Nikhil',
    ARRAY['fitness', 'health', 'transformation'],
    7
)
ON CONFLICT (slug) DO NOTHING;

-- Insert custom admin user
INSERT INTO users (email, name, role) VALUES
('nikhil@webstory.in', 'Nikhil', 'admin')
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role;

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