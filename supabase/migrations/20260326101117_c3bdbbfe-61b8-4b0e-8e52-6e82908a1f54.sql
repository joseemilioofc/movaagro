ALTER TABLE public.profiles 
ADD COLUMN identity_status text NOT NULL DEFAULT 'not_started',
ADD COLUMN didit_session_id text;