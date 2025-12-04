-- Create table for alert history
CREATE TABLE public.alert_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL,
  kpi_names TEXT[] NOT NULL,
  recipients TEXT[] NOT NULL,
  details JSONB,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.alert_history ENABLE ROW LEVEL SECURITY;

-- Only admins can view alert history
CREATE POLICY "Admins can view alert history"
  ON public.alert_history
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can insert alert history"
  ON public.alert_history
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_alert_history_sent_at ON public.alert_history(sent_at DESC);