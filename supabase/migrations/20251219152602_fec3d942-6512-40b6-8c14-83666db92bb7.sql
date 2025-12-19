-- Create table for transporter availability
CREATE TABLE public.transporter_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transporter_id UUID NOT NULL,
  date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  max_capacity_kg NUMERIC DEFAULT 30000,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(transporter_id, date)
);

-- Enable RLS
ALTER TABLE public.transporter_availability ENABLE ROW LEVEL SECURITY;

-- Transporters can manage their own availability
CREATE POLICY "Transporters can view own availability"
ON public.transporter_availability
FOR SELECT
USING (auth.uid() = transporter_id);

CREATE POLICY "Transporters can insert own availability"
ON public.transporter_availability
FOR INSERT
WITH CHECK (auth.uid() = transporter_id AND has_role(auth.uid(), 'transporter'::app_role));

CREATE POLICY "Transporters can update own availability"
ON public.transporter_availability
FOR UPDATE
USING (auth.uid() = transporter_id);

CREATE POLICY "Transporters can delete own availability"
ON public.transporter_availability
FOR DELETE
USING (auth.uid() = transporter_id);

-- Anyone can view available transporters (for calendar display)
CREATE POLICY "Anyone can view available dates"
ON public.transporter_availability
FOR SELECT
USING (is_available = true);

-- Create table for price alerts
CREATE TABLE public.price_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  cargo_type TEXT NOT NULL,
  base_price NUMERIC NOT NULL,
  threshold_percentage NUMERIC NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Users can manage their own alerts
CREATE POLICY "Users can view own alerts"
ON public.price_alerts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts"
ON public.price_alerts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
ON public.price_alerts
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
ON public.price_alerts
FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_transporter_availability_date ON public.transporter_availability(date);
CREATE INDEX idx_transporter_availability_transporter ON public.transporter_availability(transporter_id);
CREATE INDEX idx_price_alerts_user ON public.price_alerts(user_id);
CREATE INDEX idx_price_alerts_route ON public.price_alerts(origin, destination);