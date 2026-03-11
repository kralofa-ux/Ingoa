
-- Partner invite codes (6-digit, expire after 24h)
CREATE TABLE public.partner_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own codes"
  ON public.partner_codes FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own codes"
  ON public.partner_codes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own codes"
  ON public.partner_codes FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Anyone authenticated can read codes to join (needed for code lookup)
CREATE POLICY "Authenticated users can look up codes"
  ON public.partner_codes FOR SELECT TO authenticated
  USING (used = false AND expires_at > now());

-- Partner connections (links two users)
CREATE TABLE public.partner_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  is_free_reconnect boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  disconnected_at timestamptz,
  UNIQUE(user_a, user_b)
);

ALTER TABLE public.partner_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own connections"
  ON public.partner_connections FOR SELECT TO authenticated
  USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Users can insert connections"
  ON public.partner_connections FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Users can update their own connections"
  ON public.partner_connections FOR UPDATE TO authenticated
  USING (auth.uid() = user_a OR auth.uid() = user_b);
