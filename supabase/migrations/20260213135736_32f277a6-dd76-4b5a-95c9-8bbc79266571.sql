
-- Step 1: Add secondary_admin to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'secondary_admin';
