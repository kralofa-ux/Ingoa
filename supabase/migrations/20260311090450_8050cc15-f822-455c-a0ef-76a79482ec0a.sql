
-- Admin role enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: only admins can view roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to manage names
CREATE POLICY "Admins can insert names"
  ON public.names FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update names"
  ON public.names FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete names"
  ON public.names FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Analytics function: get swipe stats
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'total_users', (SELECT count(*) FROM profiles),
    'total_names', (SELECT count(*) FROM names WHERE status = 'active'),
    'total_likes', (SELECT count(*) FROM liked_names),
    'total_passes', (SELECT count(*) FROM passed_names),
    'couple_connections', (SELECT count(*) FROM partner_connections WHERE status = 'active'),
    'culture_stats', (
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT n.culture, count(ln.id) as like_count
        FROM names n
        LEFT JOIN liked_names ln ON ln.name_id = n.id
        WHERE n.status = 'active'
        GROUP BY n.culture
        ORDER BY like_count DESC
      ) t
    ),
    'top_names', (
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT n.name, n.culture, count(ln.id) as like_count
        FROM names n
        INNER JOIN liked_names ln ON ln.name_id = n.id
        WHERE n.status = 'active'
        GROUP BY n.id, n.name, n.culture
        ORDER BY like_count DESC
        LIMIT 20
      ) t
    )
  )
$$;
