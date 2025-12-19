-- Create table for price calculation history
CREATE TABLE public.price_calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  cargo_type TEXT NOT NULL,
  weight_kg NUMERIC NOT NULL,
  distance_km INTEGER NOT NULL,
  price_min NUMERIC NOT NULL,
  price_max NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.price_calculations ENABLE ROW LEVEL SECURITY;

-- Users can only view their own calculations
CREATE POLICY "Users can view own calculations"
ON public.price_calculations
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own calculations
CREATE POLICY "Users can insert own calculations"
ON public.price_calculations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own calculations
CREATE POLICY "Users can delete own calculations"
ON public.price_calculations
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_price_calculations_user_id ON public.price_calculations(user_id);
CREATE INDEX idx_price_calculations_created_at ON public.price_calculations(created_at DESC);