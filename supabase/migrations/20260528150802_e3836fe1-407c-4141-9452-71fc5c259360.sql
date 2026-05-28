
-- Table for transporter business details requiring manual approval
CREATE TABLE public.transporter_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  alvara_number TEXT NOT NULL,
  alvara_document_url TEXT NOT NULL,
  truck_plate TEXT NOT NULL,
  capacity_tons NUMERIC NOT NULL CHECK (capacity_tons > 0),
  body_type TEXT NOT NULL CHECK (body_type IN ('aberta', 'fechada_bau', 'frigorifica', 'graneleiro')),
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.transporter_details TO authenticated;
GRANT ALL ON public.transporter_details TO service_role;

ALTER TABLE public.transporter_details ENABLE ROW LEVEL SECURITY;

-- Transporter sees own row
CREATE POLICY "Transporters view own details"
ON public.transporter_details FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Cooperatives/farmers can see only approved transporters' details
CREATE POLICY "Approved transporters visible to others"
ON public.transporter_details FOR SELECT TO authenticated
USING (approval_status = 'approved');

-- Admins view all
CREATE POLICY "Admins view all transporter details"
ON public.transporter_details FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'secondary_admin'::app_role));

-- Transporter inserts own
CREATE POLICY "Transporters insert own details"
ON public.transporter_details FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND has_role(auth.uid(), 'transporter'::app_role));

-- Transporter updates own (only while pending/rejected; resets to pending)
CREATE POLICY "Transporters update own details"
ON public.transporter_details FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND approval_status IN ('pending', 'rejected'));

-- Admin can update (approve/reject)
CREATE POLICY "Admins update transporter details"
ON public.transporter_details FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_transporter_details_updated
BEFORE UPDATE ON public.transporter_details
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Helper to check approval (for filtering elsewhere)
CREATE OR REPLACE FUNCTION public.is_transporter_approved(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.transporter_details
    WHERE user_id = _user_id AND approval_status = 'approved'
  )
$$;

-- Storage bucket for alvara documents (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('transporter-documents', 'transporter-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Transporters upload own alvara"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'transporter-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Transporters view own alvara"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'transporter-documents'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'secondary_admin'::app_role)
  )
);

CREATE POLICY "Transporters update own alvara"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'transporter-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
