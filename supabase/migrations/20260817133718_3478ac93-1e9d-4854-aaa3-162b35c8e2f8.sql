ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.enforce_profile_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF public.is_any_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF NEW.identity_status IS DISTINCT FROM OLD.identity_status
     OR NEW.didit_session_id IS DISTINCT FROM OLD.didit_session_id THEN
    RAISE EXCEPTION 'Identity verification fields can only be modified by the verification system';
  END IF;

  IF NEW.is_demo IS DISTINCT FROM OLD.is_demo THEN
    RAISE EXCEPTION 'Demo flag can only be modified by administrators';
  END IF;

  RETURN NEW;
END;
$function$;

DROP POLICY IF EXISTS "Users can add cooperative or transporter role to self" ON public.user_roles;
CREATE POLICY "Users can add cooperative or transporter role to self"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role IN ('cooperative'::app_role, 'transporter'::app_role)
);

GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;