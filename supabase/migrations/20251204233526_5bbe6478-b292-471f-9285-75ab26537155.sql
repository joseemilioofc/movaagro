-- Create digital contracts table
CREATE TABLE public.digital_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transport_request_id UUID NOT NULL REFERENCES public.transport_requests(id) ON DELETE CASCADE,
  proposal_id UUID NOT NULL REFERENCES public.transport_proposals(id) ON DELETE CASCADE,
  cooperative_id UUID NOT NULL,
  transporter_id UUID NOT NULL,
  contract_number TEXT NOT NULL UNIQUE,
  terms TEXT NOT NULL,
  price NUMERIC NOT NULL,
  pickup_date DATE NOT NULL,
  origin_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  cargo_type TEXT NOT NULL,
  weight_kg NUMERIC,
  cooperative_signature TEXT,
  cooperative_signed_at TIMESTAMP WITH TIME ZONE,
  transporter_signature TEXT,
  transporter_signed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.digital_contracts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage all contracts"
ON public.digital_contracts FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Cooperatives can view own contracts"
ON public.digital_contracts FOR SELECT
USING (auth.uid() = cooperative_id);

CREATE POLICY "Cooperatives can sign own contracts"
ON public.digital_contracts FOR UPDATE
USING (auth.uid() = cooperative_id);

CREATE POLICY "Transporters can view own contracts"
ON public.digital_contracts FOR SELECT
USING (auth.uid() = transporter_id);

CREATE POLICY "Transporters can sign own contracts"
ON public.digital_contracts FOR UPDATE
USING (auth.uid() = transporter_id);

-- Create indexes
CREATE INDEX idx_contracts_transport_request ON public.digital_contracts(transport_request_id);
CREATE INDEX idx_contracts_proposal ON public.digital_contracts(proposal_id);
CREATE INDEX idx_contracts_cooperative ON public.digital_contracts(cooperative_id);
CREATE INDEX idx_contracts_transporter ON public.digital_contracts(transporter_id);
CREATE INDEX idx_contracts_status ON public.digital_contracts(status);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.digital_contracts;