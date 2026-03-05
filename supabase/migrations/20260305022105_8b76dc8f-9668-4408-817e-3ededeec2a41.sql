
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  selected_cultures TEXT[] DEFAULT '{}',
  gender_preference TEXT DEFAULT 'both' CHECK (gender_preference IN ('boy', 'girl', 'both')),
  last_name TEXT DEFAULT '',
  middle_name TEXT DEFAULT '',
  mode TEXT DEFAULT 'solo' CHECK (mode IN ('solo', 'couple')),
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'lifetime')),
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Liked names table
CREATE TABLE public.liked_names (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name_id)
);

ALTER TABLE public.liked_names ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own liked names" ON public.liked_names FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own liked names" ON public.liked_names FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own liked names" ON public.liked_names FOR DELETE USING (auth.uid() = user_id);

-- Passed names table
CREATE TABLE public.passed_names (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name_id)
);

ALTER TABLE public.passed_names ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own passed names" ON public.passed_names FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own passed names" ON public.passed_names FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own passed names" ON public.passed_names FOR DELETE USING (auth.uid() = user_id);
