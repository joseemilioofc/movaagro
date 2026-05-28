
-- Replace transporter insert policy to require approval
DROP POLICY IF EXISTS "Transporters can create proposals" ON public.transport_proposals;
CREATE POLICY "Transporters can create proposals"
ON public.transport_proposals FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = transporter_id
  AND has_role(auth.uid(), 'transporter'::app_role)
  AND public.is_transporter_approved(auth.uid())
);

-- Replace cooperative select policy to require approved transporter
DROP POLICY IF EXISTS "Cooperatives can view proposals for own requests" ON public.transport_proposals;
CREATE POLICY "Cooperatives can view proposals for own requests"
ON public.transport_proposals FOR SELECT TO authenticated
USING (
  public.is_transporter_approved(transporter_id)
  AND EXISTS (
    SELECT 1 FROM public.transport_requests tr
    WHERE tr.id = transport_proposals.transport_request_id
      AND tr.cooperative_id = auth.uid()
  )
);
