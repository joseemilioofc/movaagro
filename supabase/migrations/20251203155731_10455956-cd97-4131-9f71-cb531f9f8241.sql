-- Drop the existing policy
DROP POLICY IF EXISTS "Transporters can accept requests" ON public.transport_requests;

-- Create new policy with proper WITH CHECK clause
CREATE POLICY "Transporters can accept requests" 
ON public.transport_requests 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'transporter'::app_role) 
  AND status = 'pending'::text
)
WITH CHECK (
  has_role(auth.uid(), 'transporter'::app_role) 
  AND transporter_id = auth.uid()
);