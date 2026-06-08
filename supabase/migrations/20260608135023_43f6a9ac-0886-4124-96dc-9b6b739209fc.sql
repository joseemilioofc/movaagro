
-- Profiles: prevent self-approval of identity status
CREATE OR REPLACE FUNCTION public.enforce_profile_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_any_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  -- Non-admins cannot modify identity/KYC or didit fields
  IF NEW.identity_status IS DISTINCT FROM OLD.identity_status
     OR NEW.didit_session_id IS DISTINCT FROM OLD.didit_session_id
     OR NEW.identity_verified_at IS DISTINCT FROM OLD.identity_verified_at
     OR NEW.identity_expires_at IS DISTINCT FROM OLD.identity_expires_at THEN
    RAISE EXCEPTION 'Identity verification fields can only be modified by the verification system';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_profile_update_trg ON public.profiles;
CREATE TRIGGER enforce_profile_update_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.enforce_profile_update();

-- Transport proposals: cooperatives may only update payment fields
CREATE OR REPLACE FUNCTION public.enforce_proposal_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_coop boolean;
  is_transporter_owner boolean;
BEGIN
  IF public.is_any_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  is_transporter_owner := (auth.uid() = OLD.transporter_id);

  SELECT EXISTS (
    SELECT 1 FROM public.transport_requests tr
    WHERE tr.id = OLD.transport_request_id
      AND tr.cooperative_id = auth.uid()
  ) INTO is_coop;

  -- Cooperative: only payment_code and payment_proof_url may change
  IF is_coop AND NOT is_transporter_owner THEN
    IF NEW.price IS DISTINCT FROM OLD.price
       OR NEW.status IS DISTINCT FROM OLD.status
       OR NEW.admin_confirmed_by IS DISTINCT FROM OLD.admin_confirmed_by
       OR NEW.admin_confirmed_at IS DISTINCT FROM OLD.admin_confirmed_at
       OR NEW.mova_account IS DISTINCT FROM OLD.mova_account
       OR NEW.description IS DISTINCT FROM OLD.description
       OR NEW.estimated_days IS DISTINCT FROM OLD.estimated_days
       OR NEW.transport_request_id IS DISTINCT FROM OLD.transport_request_id
       OR NEW.transporter_id IS DISTINCT FROM OLD.transporter_id THEN
      RAISE EXCEPTION 'Cooperatives can only update payment_code and payment_proof_url on proposals';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_proposal_update_trg ON public.transport_proposals;
CREATE TRIGGER enforce_proposal_update_trg
BEFORE UPDATE ON public.transport_proposals
FOR EACH ROW EXECUTE FUNCTION public.enforce_proposal_update();
