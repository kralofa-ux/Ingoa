
-- Function to get matched name IDs between two connected partners
CREATE OR REPLACE FUNCTION public.get_partner_matches(requesting_user uuid)
RETURNS TABLE(name_id text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ln1.name_id
  FROM liked_names ln1
  INNER JOIN liked_names ln2 ON ln1.name_id = ln2.name_id
  INNER JOIN partner_connections pc ON pc.status = 'active'
    AND (
      (pc.user_a = ln1.user_id AND pc.user_b = ln2.user_id)
      OR (pc.user_a = ln2.user_id AND pc.user_b = ln1.user_id)
    )
  WHERE ln1.user_id = requesting_user
    AND ln2.user_id != requesting_user
$$;
