
-- 1. Audit logs: remove user insert ability (only service role / SECURITY DEFINER may write)
DROP POLICY IF EXISTS "Users can insert own audit logs" ON public.audit_logs;

-- 2 & 3. Storage payment-proofs: remove overly permissive policies
DROP POLICY IF EXISTS "Anyone can view payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Cooperatives can upload payment proofs" ON storage.objects;

-- 4. Transport requests: require approved transporter to accept
DROP POLICY IF EXISTS "Transporters can accept requests" ON public.transport_requests;
CREATE POLICY "Transporters can accept requests"
ON public.transport_requests
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'transporter'::app_role)
  AND status = 'pending'
  AND public.is_transporter_approved(auth.uid())
)
WITH CHECK (
  has_role(auth.uid(), 'transporter'::app_role)
  AND transporter_id = auth.uid()
  AND public.is_transporter_approved(auth.uid())
);

-- 5. alert_history: restrict permissive INSERT policy to service_role only
DROP POLICY IF EXISTS "Service role can insert alert history" ON public.alert_history;
CREATE POLICY "Service role can insert alert history"
ON public.alert_history
FOR INSERT
TO service_role
WITH CHECK (true);

-- 6. SECURITY DEFINER functions: revoke EXECUTE from anon/public (keep authenticated for RLS use)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_any_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_transporter_approved(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
