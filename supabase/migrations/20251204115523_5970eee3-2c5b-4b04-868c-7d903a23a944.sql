-- Create table for configurable KPI goals
CREATE TABLE public.kpi_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  target_value NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT '',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.kpi_goals ENABLE ROW LEVEL SECURITY;

-- Policies - Only admins can manage goals
CREATE POLICY "Admins can view all goals"
  ON public.kpi_goals
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert goals"
  ON public.kpi_goals
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update goals"
  ON public.kpi_goals
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete goals"
  ON public.kpi_goals
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default goals
INSERT INTO public.kpi_goals (name, target_value, unit, description) VALUES
  ('new_users', 50, 'usuários', 'Meta de novos usuários por mês'),
  ('monthly_requests', 100, 'pedidos', 'Meta de pedidos por mês'),
  ('conversion_rate', 80, '%', 'Taxa de conversão de pedidos'),
  ('monthly_revenue', 500000, 'MZN', 'Receita mensal em MZN');

-- Create table for KPI alert settings
CREATE TABLE public.kpi_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_name TEXT NOT NULL UNIQUE,
  email_alert BOOLEAN NOT NULL DEFAULT true,
  threshold_percentage NUMERIC NOT NULL DEFAULT 50,
  last_alert_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.kpi_alerts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can view all alerts"
  ON public.kpi_alerts
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage alerts"
  ON public.kpi_alerts
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default alert settings
INSERT INTO public.kpi_alerts (kpi_name, email_alert, threshold_percentage) VALUES
  ('new_users', true, 50),
  ('monthly_requests', true, 50),
  ('conversion_rate', true, 50),
  ('monthly_revenue', true, 50);