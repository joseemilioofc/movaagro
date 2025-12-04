-- Create table for GPS tracking
CREATE TABLE public.transport_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transport_request_id UUID NOT NULL REFERENCES public.transport_requests(id) ON DELETE CASCADE,
  transporter_id UUID NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(5, 2),
  heading DECIMAL(5, 2),
  accuracy DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transport_locations ENABLE ROW LEVEL SECURITY;

-- Transporters can insert their own locations
CREATE POLICY "Transporters can insert own locations"
ON public.transport_locations
FOR INSERT
WITH CHECK (auth.uid() = transporter_id);

-- Transporters can view own locations
CREATE POLICY "Transporters can view own locations"
ON public.transport_locations
FOR SELECT
USING (auth.uid() = transporter_id);

-- Cooperatives can view locations for their requests
CREATE POLICY "Cooperatives can view locations for own requests"
ON public.transport_locations
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM transport_requests tr
  WHERE tr.id = transport_locations.transport_request_id
  AND tr.cooperative_id = auth.uid()
));

-- Admins can view all locations
CREATE POLICY "Admins can view all locations"
ON public.transport_locations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for locations
ALTER PUBLICATION supabase_realtime ADD TABLE public.transport_locations;

-- Create index for faster queries
CREATE INDEX idx_transport_locations_request ON public.transport_locations(transport_request_id);
CREATE INDEX idx_transport_locations_created ON public.transport_locations(created_at DESC);