-- =======================================================
-- DATABASE SCHEMA FOR PORTFOLIO SYSTEM
-- =======================================================

-- Enable pgvector extension for similarity search/RAG
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g., 'Frontend', 'Backend', 'Database', 'Tools'
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id VARCHAR(255) PRIMARY KEY, -- String identifier (timestamp or custom ID)
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    link TEXT,
    github TEXT,
    demo_url TEXT,
    technologies TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    results JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Experience Table
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    period VARCHAR(100) NOT NULL,
    description TEXT,
    technologies TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Personal Traits Table
CREATE TABLE IF NOT EXISTS public.personal_traits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL, -- 'strength', 'weakness', 'hobby'
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Contact Info Table
CREATE TABLE IF NOT EXISTS public.contact_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) UNIQUE NOT NULL, -- 'email', 'github', 'linkedin', 'twitter', 'resume'
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Certifications Table
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    date VARCHAR(100) NOT NULL,
    url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Guestbook Table
CREATE TABLE IF NOT EXISTS public.guestbook (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    color VARCHAR(50),
    rotation NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. App Settings Table
CREATE TABLE IF NOT EXISTS public.app_settings (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Model Contexts Table
CREATE TABLE IF NOT EXISTS public.model_contexts (
    provider VARCHAR(50) PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Chat Logs Table
CREATE TABLE IF NOT EXISTS public.chat_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_message TEXT,
    ai_response TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Custom Images Table
CREATE TABLE IF NOT EXISTS public.custom_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Documents Table (For RAG embeddings)
CREATE TABLE IF NOT EXISTS public.documents (
    id BIGSERIAL PRIMARY KEY,
    content TEXT,
    metadata JSONB,
    embedding vector(768)
);

-- Enable Row Level Security (RLS) on all tables for security
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_traits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Setup Access Policies
DROP POLICY IF EXISTS "Public Read Skills" ON public.skills;
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Admin All Skills" ON public.skills;
CREATE POLICY "Admin All Skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Admin All Projects" ON public.projects;
CREATE POLICY "Admin All Projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Experience" ON public.experience;
CREATE POLICY "Public Read Experience" ON public.experience FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Admin All Experience" ON public.experience;
CREATE POLICY "Admin All Experience" ON public.experience FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Personal Traits" ON public.personal_traits;
CREATE POLICY "Public Read Personal Traits" ON public.personal_traits FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Admin All Personal Traits" ON public.personal_traits;
CREATE POLICY "Admin All Personal Traits" ON public.personal_traits FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Contact Info" ON public.contact_info;
CREATE POLICY "Public Read Contact Info" ON public.contact_info FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Admin All Contact Info" ON public.contact_info;
CREATE POLICY "Admin All Contact Info" ON public.contact_info FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Certifications" ON public.certifications;
CREATE POLICY "Public Read Certifications" ON public.certifications FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Admin All Certifications" ON public.certifications;
CREATE POLICY "Admin All Certifications" ON public.certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon Insert Contact Messages" ON public.contact_messages;
CREATE POLICY "Anon Insert Contact Messages" ON public.contact_messages FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "Admin All Contact Messages" ON public.contact_messages;
CREATE POLICY "Admin All Contact Messages" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Guestbook" ON public.guestbook;
CREATE POLICY "Public Read Guestbook" ON public.guestbook FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Anon Insert Guestbook" ON public.guestbook;
CREATE POLICY "Anon Insert Guestbook" ON public.guestbook FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "Admin All Guestbook" ON public.guestbook;
CREATE POLICY "Admin All Guestbook" ON public.guestbook FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read App Settings" ON public.app_settings;
CREATE POLICY "Public Read App Settings" ON public.app_settings FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Admin All App Settings" ON public.app_settings;
CREATE POLICY "Admin All App Settings" ON public.app_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Model Contexts" ON public.model_contexts;
CREATE POLICY "Public Read Model Contexts" ON public.model_contexts FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Admin All Model Contexts" ON public.model_contexts;
CREATE POLICY "Admin All Model Contexts" ON public.model_contexts FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon Insert Chat Logs" ON public.chat_logs;
CREATE POLICY "Anon Insert Chat Logs" ON public.chat_logs FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "Admin All Chat Logs" ON public.chat_logs;
CREATE POLICY "Admin All Chat Logs" ON public.chat_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Custom Images" ON public.custom_images;
CREATE POLICY "Public Read Custom Images" ON public.custom_images FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Admin All Custom Images" ON public.custom_images;
CREATE POLICY "Admin All Custom Images" ON public.custom_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin All Documents" ON public.documents;
CREATE POLICY "Admin All Documents" ON public.documents FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 14. Similarity Search Function for RAG (match_documents) - SECURITY DEFINER to bypass RLS for searches
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 15. Create Storage Bucket for Portfolio Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- 16. Setup Storage Policies for Public Reading, Inserting, and Deleting
DROP POLICY IF EXISTS "Public Select" ON storage.objects;
CREATE POLICY "Public Select" ON storage.objects FOR SELECT TO public USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE TO public USING (bucket_id = 'portfolio-images');
