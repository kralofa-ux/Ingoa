
-- Table to track daily swipe counts
CREATE TABLE public.daily_swipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  swipe_date date NOT NULL DEFAULT CURRENT_DATE,
  swipe_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, swipe_date)
);

ALTER TABLE public.daily_swipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own swipes"
  ON public.daily_swipes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own swipes"
  ON public.daily_swipes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own swipes"
  ON public.daily_swipes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to atomically increment and return swipe count
CREATE OR REPLACE FUNCTION public.record_swipe()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count integer;
BEGIN
  INSERT INTO daily_swipes (user_id, swipe_date, swipe_count)
  VALUES (auth.uid(), CURRENT_DATE, 1)
  ON CONFLICT (user_id, swipe_date)
  DO UPDATE SET swipe_count = daily_swipes.swipe_count + 1
  RETURNING swipe_count INTO current_count;
  
  RETURN current_count;
END;
$$;
