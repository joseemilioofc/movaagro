
-- Create helper function to check if user is any kind of admin
CREATE OR REPLACE FUNCTION public.is_any_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'secondary_admin')
  )
$$;

-- PROFILES: secondary_admin can view all profiles (read-only)
CREATE POLICY "Secondary admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'secondary_admin'::app_role));

-- TRANSPORT REQUESTS: secondary_admin can view all requests (read-only)
CREATE POLICY "Secondary admins can view all requests"
ON public.transport_requests FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'secondary_admin'::app_role));

-- TRANSPORT PROPOSALS: secondary_admin can view all proposals (read-only)
CREATE POLICY "Secondary admins can view all proposals"
ON public.transport_proposals FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'secondary_admin'::app_role));

-- DIGITAL CONTRACTS: secondary_admin can view all contracts (read-only)
CREATE POLICY "Secondary admins can view all contracts"
ON public.digital_contracts FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'secondary_admin'::app_role));

-- RATINGS: secondary_admin can view all ratings (read-only)
CREATE POLICY "Secondary admins can view all ratings"
ON public.ratings FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'secondary_admin'::app_role));

-- CHAT MESSAGES: secondary_admin can view all messages (read-only)
CREATE POLICY "Secondary admins can view all messages"
ON public.chat_messages FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'secondary_admin'::app_role));

-- TRANSPORT LOCATIONS: secondary_admin can view all locations (read-only)
CREATE POLICY "Secondary admins can view all locations"
ON public.transport_locations FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'secondary_admin'::app_role));

-- USER ROLES: secondary_admin can view all roles (read-only)
CREATE POLICY "Secondary admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'secondary_admin'::app_role));
