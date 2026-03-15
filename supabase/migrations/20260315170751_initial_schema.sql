-- ==============================================================================
-- CropWise Supabase Schema & Row Level Security (RLS) Policies
-- ==============================================================================

-- 1. Create Profiles Table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  farm_size_acres NUMERIC,
  location_region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view their own profile."
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Allow insert on signup (typically via Supabase trigger, but manual entry permitted for authenticated users)
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );


-- 2. Create Crop Recommendations Table
CREATE TABLE public.crop_recommendations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  input_data JSONB NOT NULL, -- stores N, P, K, temp, hum, ph, rainfall
  recommended_crop TEXT NOT NULL,
  confidence NUMERIC(4,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Crop Recommendations
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own recommendations
CREATE POLICY "Users can view their own recommendations."
  ON public.crop_recommendations FOR SELECT
  USING ( auth.uid() = user_id );

-- Allow users to insert their own recommendations
CREATE POLICY "Users can insert their own recommendations."
  ON public.crop_recommendations FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- Allow users to delete their own recommendations (optional)
CREATE POLICY "Users can delete their own recommendations."
  ON public.crop_recommendations FOR DELETE
  USING ( auth.uid() = user_id );


-- 3. Create Market Watchlists Table
CREATE TABLE public.watchlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL, -- e.g., 'WHEAT', 'CORN'
  added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, symbol)
);

-- Enable RLS for Watchlists
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own watchlists
CREATE POLICY "Users can view their own watchlists."
  ON public.watchlists FOR SELECT
  USING ( auth.uid() = user_id );

-- Allow users to manage (insert/delete) their watchlists
CREATE POLICY "Users can insert to their own watchlists."
  ON public.watchlists FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete from their own watchlists."
  ON public.watchlists FOR DELETE
  USING ( auth.uid() = user_id );

-- ==============================================================================
-- TRIGGERS (Optional but recommended)
-- ==============================================================================

-- Trigger to automatically handle updated_at in profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
