
ALTER TABLE public.profiles DROP CONSTRAINT profiles_gender_preference_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_gender_preference_check 
  CHECK (gender_preference = ANY (ARRAY['male', 'female', 'all']));
