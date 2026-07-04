-- =======================================================
-- RELATIONAL DATABASE SCHEMA FOR CALENDAR BOARD (CLEAN REBUILD)
-- =======================================================

-- Drop old tables if they exist to prevent schema collisions
DROP TABLE IF EXISTS public.tracker_days CASCADE;
DROP TABLE IF EXISTS public.tracker_categories CASCADE;

-- 1. Tracker Categories Table
CREATE TABLE IF NOT EXISTS public.tracker_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'p1', 'p2', 'd1', 'd2', 'o1', 'o2', or custom ID
    name VARCHAR(100) NOT NULL,
    principal NUMERIC NOT NULL DEFAULT 100,
    rate NUMERIC NOT NULL DEFAULT 25,
    position INT NOT NULL DEFAULT 0, -- Preserves custom drag-and-drop ordering
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Individual Day Milestone Items Table
CREATE TABLE IF NOT EXISTS public.tracker_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_uuid UUID REFERENCES public.tracker_categories(id) ON DELETE CASCADE NOT NULL,
    day_index INT NOT NULL CHECK (day_index >= 1 AND day_index <= 30),
    checked BOOLEAN NOT NULL DEFAULT false,
    emoji VARCHAR(10) NOT NULL DEFAULT '✅',
    note TEXT DEFAULT '',
    price NUMERIC,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(category_uuid, day_index)
);

-- Disable Row Level Security (RLS) to support public read/write without login requirements
ALTER TABLE public.tracker_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_days DISABLE ROW LEVEL SECURITY;

-- SEED DATA: Pre-populate default tracking categories with explicit sorting positions
INSERT INTO public.tracker_categories (category_id, name, principal, rate, position) VALUES
('p1', 'p1', 100, 25, 0),
('p2', 'p2', 100, 25, 1),
('d1', 'd1', 100, 25, 2),
('d2', 'd2', 100, 25, 3),
('o1', 'Optional 1', 100, 25, 4),
('o2', 'Optional 2', 100, 25, 5)
ON CONFLICT (category_id) DO NOTHING;
