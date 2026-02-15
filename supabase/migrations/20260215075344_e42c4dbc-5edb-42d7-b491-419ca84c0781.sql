-- Allow secondary admins to view audit logs
CREATE POLICY "Secondary admins can view audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'secondary_admin'::app_role));
