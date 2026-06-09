
-- 1. transporter_details: company + document fields
ALTER TABLE public.transporter_details
  ADD COLUMN IF NOT EXISTS is_company boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS company_nuit text,
  ADD COLUMN IF NOT EXISTS company_address text,
  ADD COLUMN IF NOT EXISTS alvara_expiry date,
  ADD COLUMN IF NOT EXISTS commercial_registry_number text,
  ADD COLUMN IF NOT EXISTS commercial_registry_url text,
  ADD COLUMN IF NOT EXISTS legal_rep_name text,
  ADD COLUMN IF NOT EXISTS legal_rep_role text,
  ADD COLUMN IF NOT EXISTS legal_rep_doc_type text,
  ADD COLUMN IF NOT EXISTS legal_rep_doc_number text,
  ADD COLUMN IF NOT EXISTS legal_rep_doc_url text,
  ADD COLUMN IF NOT EXISTS tax_clearance_url text,
  ADD COLUMN IF NOT EXISTS tax_clearance_expiry date,
  ADD COLUMN IF NOT EXISTS civil_insurance_company text,
  ADD COLUMN IF NOT EXISTS civil_insurance_number text,
  ADD COLUMN IF NOT EXISTS civil_insurance_expiry date,
  ADD COLUMN IF NOT EXISTS civil_insurance_url text;

-- 2. fleet_vehicles
CREATE TABLE IF NOT EXISTS public.fleet_vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transporter_id uuid NOT NULL,
  plate text NOT NULL,
  vehicle_type text NOT NULL DEFAULT 'aberta',
  capacity_kg numeric NOT NULL DEFAULT 0,
  year int,
  brand text,
  model text,
  photo_url text,
  document_url text,
  status text NOT NULL DEFAULT 'active',
  livrete_number text,
  livrete_url text,
  ownership_doc_url text,
  transport_license_number text,
  transport_license_expiry date,
  transport_license_url text,
  inspection_date date,
  inspection_expiry date,
  inspection_url text,
  insurance_company text,
  insurance_number text,
  insurance_expiry date,
  insurance_url text,
  photo_front_url text,
  photo_side_url text,
  photo_rear_url text,
  photo_plate_url text,
  binding_declaration_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fleet_vehicles TO authenticated;
GRANT ALL ON public.fleet_vehicles TO service_role;

ALTER TABLE public.fleet_vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner manages own vehicles" ON public.fleet_vehicles
  FOR ALL TO authenticated
  USING (auth.uid() = transporter_id)
  WITH CHECK (auth.uid() = transporter_id);

CREATE POLICY "Admins manage all vehicles" ON public.fleet_vehicles
  FOR ALL TO authenticated
  USING (public.is_any_admin(auth.uid()))
  WITH CHECK (public.is_any_admin(auth.uid()));

CREATE TRIGGER fleet_vehicles_touch BEFORE UPDATE ON public.fleet_vehicles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. fleet_drivers
CREATE TABLE IF NOT EXISTS public.fleet_drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transporter_id uuid NOT NULL,
  name text NOT NULL,
  phone text,
  phone_alt text,
  email text,
  address text,
  license_number text,
  license_category text,
  license_expiry date,
  license_url text,
  id_doc_type text,
  id_doc_number text,
  id_doc_expiry date,
  id_doc_url text,
  employment_contract_url text,
  assigned_vehicle_id uuid REFERENCES public.fleet_vehicles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fleet_drivers TO authenticated;
GRANT ALL ON public.fleet_drivers TO service_role;

ALTER TABLE public.fleet_drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner manages own drivers" ON public.fleet_drivers
  FOR ALL TO authenticated
  USING (auth.uid() = transporter_id)
  WITH CHECK (auth.uid() = transporter_id);

CREATE POLICY "Admins manage all drivers" ON public.fleet_drivers
  FOR ALL TO authenticated
  USING (public.is_any_admin(auth.uid()))
  WITH CHECK (public.is_any_admin(auth.uid()));

CREATE TRIGGER fleet_drivers_touch BEFORE UPDATE ON public.fleet_drivers
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 4. transport_proposals: assignment
ALTER TABLE public.transport_proposals
  ADD COLUMN IF NOT EXISTS assigned_vehicle_id uuid REFERENCES public.fleet_vehicles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS assigned_driver_id uuid REFERENCES public.fleet_drivers(id) ON DELETE SET NULL;

-- 5. Storage policies for fleet-assets bucket (owner folder pattern)
CREATE POLICY "Fleet owner read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'fleet-assets' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_any_admin(auth.uid())));

CREATE POLICY "Fleet owner insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'fleet-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Fleet owner update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'fleet-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Fleet owner delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'fleet-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
