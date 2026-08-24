ALTER TABLE public.profiles DISABLE TRIGGER enforce_profile_update_trg;
UPDATE public.profiles SET is_demo = true WHERE user_id = 'c141fb5f-b71b-430a-8c82-2ec9ad4a8dad';
ALTER TABLE public.profiles ENABLE TRIGGER enforce_profile_update_trg;