
CREATE TABLE public.names (
  id text PRIMARY KEY,
  name text NOT NULL,
  culture text NOT NULL,
  gender text NOT NULL,
  meaning text,
  commonality_score integer NOT NULL DEFAULT 2,
  source_type text,
  source_reference text,
  verified_by text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.names ENABLE ROW LEVEL SECURITY;

-- Public read access for active names (no auth required)
CREATE POLICY "Anyone can read active names"
ON public.names
FOR SELECT
TO anon, authenticated
USING (status = 'active');
