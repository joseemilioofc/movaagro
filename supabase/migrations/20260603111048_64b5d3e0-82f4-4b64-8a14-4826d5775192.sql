
-- 1) Storage: allow users to delete their own payment proofs
CREATE POLICY "Users can delete own payment proofs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'payment-proofs'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own payment proofs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'payment-proofs'
  AND (auth.uid())::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'payment-proofs'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- 2) transport_locations: require transporter role + approval on INSERT
DROP POLICY IF EXISTS "Transporters can insert own locations" ON public.transport_locations;

CREATE POLICY "Transporters can insert own locations"
ON public.transport_locations
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = transporter_id
  AND public.has_role(auth.uid(), 'transporter'::app_role)
  AND public.is_transporter_approved(auth.uid())
);

-- 3) digital_contracts: prevent parties from tampering with sensitive fields
-- Use a trigger that locks down immutable columns and the other party's signature
CREATE OR REPLACE FUNCTION public.enforce_digital_contract_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admins can update anything
  IF public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  -- Immutable contract terms for both parties
  IF NEW.price IS DISTINCT FROM OLD.price
     OR NEW.terms IS DISTINCT FROM OLD.terms
     OR NEW.pickup_date IS DISTINCT FROM OLD.pickup_date
     OR NEW.origin_address IS DISTINCT FROM OLD.origin_address
     OR NEW.destination_address IS DISTINCT FROM OLD.destination_address
     OR NEW.cargo_type IS DISTINCT FROM OLD.cargo_type
     OR NEW.weight_kg IS DISTINCT FROM OLD.weight_kg
     OR NEW.contract_number IS DISTINCT FROM OLD.contract_number
     OR NEW.transport_request_id IS DISTINCT FROM OLD.transport_request_id
     OR NEW.proposal_id IS DISTINCT FROM OLD.proposal_id
     OR NEW.cooperative_id IS DISTINCT FROM OLD.cooperative_id
     OR NEW.transporter_id IS DISTINCT FROM OLD.transporter_id THEN
    RAISE EXCEPTION 'Contract terms cannot be modified by parties';
  END IF;

  -- Cooperative can only modify their own signature fields
  IF auth.uid() = OLD.cooperative_id THEN
    IF NEW.transporter_signature IS DISTINCT FROM OLD.transporter_signature
       OR NEW.transporter_signed_at IS DISTINCT FROM OLD.transporter_signed_at THEN
      RAISE EXCEPTION 'Cooperative cannot modify transporter signature';
    END IF;
  END IF;

  -- Transporter can only modify their own signature fields
  IF auth.uid() = OLD.transporter_id THEN
    IF NEW.cooperative_signature IS DISTINCT FROM OLD.cooperative_signature
       OR NEW.cooperative_signed_at IS DISTINCT FROM OLD.cooperative_signed_at THEN
      RAISE EXCEPTION 'Transporter cannot modify cooperative signature';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_digital_contract_update_trigger ON public.digital_contracts;
CREATE TRIGGER enforce_digital_contract_update_trigger
BEFORE UPDATE ON public.digital_contracts
FOR EACH ROW
EXECUTE FUNCTION public.enforce_digital_contract_update();
