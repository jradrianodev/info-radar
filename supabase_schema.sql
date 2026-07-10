-- ============================================================================
-- INFORADAR DATABASE SCHEMA (Supabase PostgreSQL)
-- ============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS public.roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert roles
INSERT INTO public.roles (id, name) VALUES 
(1, 'superadmin'),
(2, 'editor'),
(3, 'author')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. PROFILES TABLE (Extends Auth.Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role_id INT REFERENCES public.roles(id) DEFAULT 3,
    full_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    image_url TEXT,
    description TEXT,
    meta_title VARCHAR(150),
    meta_description VARCHAR(250),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 4. BRANDS TABLE
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    price NUMERIC(10, 2),
    description TEXT,
    image_url TEXT,
    affiliate_amazon TEXT,
    affiliate_mercadolivre TEXT,
    affiliate_kabum TEXT,
    affiliate_magalu TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 6. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- 7. PRODUCT SPECS TABLE
CREATE TABLE IF NOT EXISTS public.product_specs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    spec_name VARCHAR(100) NOT NULL,
    spec_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.product_specs ENABLE ROW LEVEL SECURITY;

-- 8. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    summary TEXT,
    content TEXT NOT NULL, -- Rich text/Markdown
    image_url TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    read_time INT DEFAULT 5, -- in minutes
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
    published_at TIMESTAMP WITH TIME ZONE,
    meta_title VARCHAR(150),
    meta_description VARCHAR(250),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 9. TAGS TABLE
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- 10. ARTICLE_TAGS RELATION
CREATE TABLE IF NOT EXISTS public.article_tags (
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;

-- 11. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
    rating NUMERIC(3, 1) CHECK (rating >= 0.0 AND rating <= 10.0),
    pros TEXT[],
    contras TEXT[],
    summary TEXT,
    conclusion TEXT,
    specs_table JSONB, -- Custom characteristics key-value table
    gallery TEXT[], -- Image URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 12. COMPARISONS TABLE
CREATE TABLE IF NOT EXISTS public.comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(250) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    product_a_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    product_b_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    pros_a TEXT[],
    contras_a TEXT[],
    pros_b TEXT[],
    contras_b TEXT[],
    verdict TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_product_comparison UNIQUE(product_a_id, product_b_id)
);

ALTER TABLE public.comparisons ENABLE ROW LEVEL SECURITY;

-- 13. COMPARISON ITEMS TABLE (Auto-generated specs table details)
CREATE TABLE IF NOT EXISTS public.comparison_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comparison_id UUID REFERENCES public.comparisons(id) ON DELETE CASCADE,
    spec_name VARCHAR(100) NOT NULL,
    value_a TEXT,
    value_b TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.comparison_items ENABLE ROW LEVEL SECURITY;

-- 14. MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    folder VARCHAR(100) DEFAULT 'general',
    size INT,
    type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- 15. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 16. NEWSLETTER TABLE
CREATE TABLE IF NOT EXISTS public.newsletter (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

-- 17. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100),
    target_id TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_slug ON public.comparisons(slug);


-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Helper functions for authorization
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS INT AS $$
    SELECT role_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Roles check helpers
-- 1: superadmin, 2: editor, 3: author

-- GENERAL PUBLIC READ POLICIES
CREATE POLICY "Allow public read-only access to categories" ON public.categories 
    FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to brands" ON public.brands 
    FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to published products" ON public.products 
    FOR SELECT USING (status = 'published' OR public.get_auth_role() IS NOT NULL);
CREATE POLICY "Allow public read-only access to product specs" ON public.product_specs 
    FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to product images" ON public.product_images 
    FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to published articles" ON public.articles 
    FOR SELECT USING (status = 'published' OR public.get_auth_role() IS NOT NULL);
CREATE POLICY "Allow public read-only access to tags" ON public.tags 
    FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to article_tags" ON public.article_tags 
    FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to reviews" ON public.reviews 
    FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to comparisons" ON public.comparisons 
    FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to comparison_items" ON public.comparison_items 
    FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to settings" ON public.settings 
    FOR SELECT USING (true);

-- ADMIN & AUTHOR EDIT POLICIES
CREATE POLICY "Allow authenticated edits on categories" ON public.categories 
    FOR ALL USING (public.get_auth_role() IN (1, 2));
CREATE POLICY "Allow authenticated edits on brands" ON public.brands 
    FOR ALL USING (public.get_auth_role() IN (1, 2));
CREATE POLICY "Allow authenticated edits on products" ON public.products 
    FOR ALL USING (public.get_auth_role() IN (1, 2));
CREATE POLICY "Allow authenticated edits on product specs" ON public.product_specs 
    FOR ALL USING (public.get_auth_role() IN (1, 2));
CREATE POLICY "Allow authenticated edits on product images" ON public.product_images 
    FOR ALL USING (public.get_auth_role() IN (1, 2));

CREATE POLICY "Allow authors & editors to create/edit articles" ON public.articles 
    FOR ALL USING (
        public.get_auth_role() IN (1, 2) OR 
        (public.get_auth_role() = 3 AND author_id = auth.uid())
    );

CREATE POLICY "Allow authenticated edits on tags" ON public.tags 
    FOR ALL USING (public.get_auth_role() IN (1, 2, 3));
CREATE POLICY "Allow authenticated edits on article_tags" ON public.article_tags 
    FOR ALL USING (public.get_auth_role() IN (1, 2, 3));

CREATE POLICY "Allow authenticated edits on reviews" ON public.reviews 
    FOR ALL USING (public.get_auth_role() IN (1, 2));
CREATE POLICY "Allow authenticated edits on comparisons" ON public.comparisons 
    FOR ALL USING (public.get_auth_role() IN (1, 2));
CREATE POLICY "Allow authenticated edits on comparison_items" ON public.comparison_items 
    FOR ALL USING (public.get_auth_role() IN (1, 2));

CREATE POLICY "Allow admin to write to settings" ON public.settings 
    FOR ALL USING (public.get_auth_role() = 1);
CREATE POLICY "Allow public inserts on newsletter" ON public.newsletter 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admins to view/manage newsletter list" ON public.newsletter 
    FOR ALL USING (public.get_auth_role() IN (1, 2));

-- Profiles policy
CREATE POLICY "Public read for profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Self edit for profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin manage profiles" ON public.profiles FOR ALL USING (public.get_auth_role() = 1);


-- ============================================================================
-- CONTENT STUDIO TABLES & POLICIES
-- ============================================================================

-- 18. PROMPTS TABLE
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    version VARCHAR(20) DEFAULT '1.0',
    temperature NUMERIC(3,2) DEFAULT 0.7,
    prompt TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- 19. CONTENT GENERATIONS TABLE
CREATE TABLE IF NOT EXISTS public.content_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    prompt_id UUID REFERENCES public.prompts(id) ON DELETE SET NULL,
    content_type VARCHAR(50) NOT NULL, -- e.g., 'review', 'faq', 'linkedin', etc.
    request TEXT,
    response TEXT NOT NULL,
    draft_id TEXT, -- References mock or live draft record ID
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    tokens_input INT DEFAULT 0,
    tokens_output INT DEFAULT 0,
    estimated_cost NUMERIC(10,5) DEFAULT 0.0,
    execution_time INT DEFAULT 0, -- in ms
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.content_generations ENABLE ROW LEVEL SECURITY;

-- 20. AI SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.ai_settings (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(50) DEFAULT 'gemini' NOT NULL,
    model VARCHAR(50) DEFAULT 'gemini-1.5-pro' NOT NULL,
    temperature NUMERIC(3,2) DEFAULT 0.7,
    max_tokens INT DEFAULT 2048,
    timeout INT DEFAULT 30000, -- in ms
    retry INT DEFAULT 3,
    api_key TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;

-- Insert default settings row
INSERT INTO public.ai_settings (id, provider, model, temperature, max_tokens, timeout, retry) 
VALUES (1, 'gemini', 'gemini-1.5-pro', 0.7, 2048, 30000, 3)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Content Studio
CREATE POLICY "Allow public read-only access to active prompts" ON public.prompts 
    FOR SELECT USING (active = true OR public.get_auth_role() IS NOT NULL);
CREATE POLICY "Allow admin to manage prompts" ON public.prompts 
    FOR ALL USING (public.get_auth_role() = 1);

CREATE POLICY "Allow public read-only access to published content_generations" ON public.content_generations 
    FOR SELECT USING (status = 'published' OR public.get_auth_role() IS NOT NULL);
CREATE POLICY "Allow admin/editor to manage content_generations" ON public.content_generations 
    FOR ALL USING (public.get_auth_role() IN (1, 2));

CREATE POLICY "Allow admin to manage ai_settings" ON public.ai_settings 
    FOR ALL USING (public.get_auth_role() = 1);
CREATE POLICY "Allow editors to read ai_settings" ON public.ai_settings 
    FOR SELECT USING (public.get_auth_role() IN (1, 2));

-- Indexes for Content Studio
CREATE INDEX IF NOT EXISTS idx_content_gen_product ON public.content_generations(product_id);
CREATE INDEX IF NOT EXISTS idx_prompts_active ON public.prompts(active);

