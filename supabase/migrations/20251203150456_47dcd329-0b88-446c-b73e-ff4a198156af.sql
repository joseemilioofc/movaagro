-- Create transport_proposals table
CREATE TABLE public.transport_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transport_request_id UUID NOT NULL REFERENCES public.transport_requests(id) ON DELETE CASCADE,
  transporter_id UUID NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  mova_account VARCHAR(100) DEFAULT '863343229 J*** P**** E*****',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'paid', 'confirmed')),
  payment_proof_url TEXT,
  payment_code TEXT,
  admin_confirmed_at TIMESTAMP WITH TIME ZONE,
  admin_confirmed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transport_proposals ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', true);

-- Storage policies
CREATE POLICY "Anyone can view payment proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-proofs');

CREATE POLICY "Cooperatives can upload payment proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs' AND auth.uid() IS NOT NULL);

-- RLS Policies for proposals
CREATE POLICY "Transporters can create proposals"
ON public.transport_proposals FOR INSERT
WITH CHECK (auth.uid() = transporter_id AND has_role(auth.uid(), 'transporter'));

CREATE POLICY "Transporters can view own proposals"
ON public.transport_proposals FOR SELECT
USING (auth.uid() = transporter_id);

CREATE POLICY "Cooperatives can view proposals for own requests"
ON public.transport_proposals FOR SELECT
USING (EXISTS (
  SELECT 1 FROM transport_requests tr
  WHERE tr.id = transport_proposals.transport_request_id
  AND tr.cooperative_id = auth.uid()
));

CREATE POLICY "Cooperatives can update proposals for payment"
ON public.transport_proposals FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM transport_requests tr
  WHERE tr.id = transport_proposals.transport_request_id
  AND tr.cooperative_id = auth.uid()
));

CREATE POLICY "Admins can view all proposals"
ON public.transport_proposals FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all proposals"
ON public.transport_proposals FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.transport_proposals;