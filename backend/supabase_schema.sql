-- ==========================================
-- SUPABASE SCHEMA FOR CROP RECOMMENDATIONS
-- ==========================================

-- 1. Create the `crop_recommendations` table
CREATE TABLE IF NOT EXISTS public.crop_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    input_data JSONB NOT NULL,
    recommended_crop VARCHAR NOT NULL,
    confidence NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Optional: Enable Row Level Security (RLS)
-- By enabling this, users can only read/insert their own recommendations when hit via client keys.
-- However, our backend uses the Service Role key, which overrides RLS. 
-- It is still good practice to have RLS enabled.
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow authenticated users to insert their own records
CREATE POLICY "Users can insert their own recommendations"
ON public.crop_recommendations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to view only their own records
CREATE POLICY "Users can view their own recommendations"
ON public.crop_recommendations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
