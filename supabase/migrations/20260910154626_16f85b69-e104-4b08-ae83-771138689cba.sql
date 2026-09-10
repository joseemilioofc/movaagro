-- Tabela de listagens de produtos
CREATE TABLE public.product_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  product_type text NOT NULL,
  quantity_kg numeric NOT NULL,
  min_order_kg numeric NOT NULL DEFAULT 100,
  price_per_kg numeric NOT NULL,
  province text,
  district text,
  location text,
  quality_grade text,
  harvest_date date,
  photos text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_listings TO authenticated;
GRANT ALL ON public.product_listings TO service_role;

ALTER TABLE public.product_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can manage their own listings"
  ON public.product_listings
  FOR ALL
  TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Active listings are visible to buyers and transporters"
  ON public.product_listings
  FOR SELECT
  TO authenticated
  USING (status = 'active');

-- Tabela de encomendas
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES public.product_listings(id) ON DELETE RESTRICT,
  quantity_kg numeric NOT NULL,
  price_per_kg numeric NOT NULL,
  total_product_amount numeric NOT NULL,
  delivery_address text NOT NULL,
  pickup_address text NOT NULL,
  status text NOT NULL DEFAULT 'pending_payment',
  transport_request_id uuid REFERENCES public.transport_requests(id) ON DELETE SET NULL,
  mova_commission_rate numeric NOT NULL DEFAULT 0.05,
  mova_commission_amount numeric NOT NULL DEFAULT 0,
  mova_transport_commission_rate numeric NOT NULL DEFAULT 0.20,
  mova_transport_commission_amount numeric NOT NULL DEFAULT 0,
  shipping_amount numeric NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_provider_reference text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view and create their own orders"
  ON public.orders
  FOR ALL
  TO authenticated
  USING (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Sellers can view orders for their listings"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (seller_id = auth.uid());

CREATE POLICY "Transporters can view orders linked to their transport requests"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.transport_requests tr
    WHERE tr.id = orders.transport_request_id AND tr.transporter_id = auth.uid()
  ));

-- Tabela de pagamentos de encomendas
CREATE TABLE public.order_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  provider_reference text,
  proof_url text,
  confirmed_by uuid REFERENCES auth.users(id),
  confirmed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.order_payments TO authenticated;
GRANT ALL ON public.order_payments TO service_role;

ALTER TABLE public.order_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view payments for their orders"
  ON public.order_payments
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_payments.order_id
      AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())
  ));

CREATE POLICY "Buyers can create payments for their orders"
  ON public.order_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_payments.order_id AND o.buyer_id = auth.uid()
  ));

-- Tabela de carteiras/saldos dos vendedores
CREATE TABLE public.seller_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  available_balance numeric NOT NULL DEFAULT 0,
  pending_balance numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'MZN',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (seller_id)
);

GRANT SELECT, INSERT, UPDATE ON public.seller_wallets TO authenticated;
GRANT ALL ON public.seller_wallets TO service_role;

ALTER TABLE public.seller_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can view their own wallet"
  ON public.seller_wallets
  FOR SELECT
  TO authenticated
  USING (seller_id = auth.uid());

-- Adicionar order_id aos pedidos de transporte
ALTER TABLE public.transport_requests
ADD COLUMN IF NOT EXISTS order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL;

-- Trigger para actualizar updated_at nas novas tabelas
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER product_listings_touch
  BEFORE UPDATE ON public.product_listings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER orders_touch
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER order_payments_touch
  BEFORE UPDATE ON public.order_payments
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER seller_wallets_touch
  BEFORE UPDATE ON public.seller_wallets
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Função para criar wallet automaticamente quando um vendedor é registado
CREATE OR REPLACE FUNCTION public.handle_new_seller_wallet()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.seller_wallets (seller_id)
  VALUES (NEW.user_id)
  ON CONFLICT (seller_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER create_seller_wallet_on_role
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  WHEN (NEW.role = 'wholesale_seller')
  EXECUTE FUNCTION public.handle_new_seller_wallet();