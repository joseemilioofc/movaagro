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

  RETURN NEW;
END;
$function$;