-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'cooperative', 'transporter');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create transport_requests table
CREATE TABLE public.transport_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    origin_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    cargo_type TEXT NOT NULL,
    weight_kg DECIMAL,
    pickup_date DATE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
    transporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    external_form_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.transport_requests ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'name', 'Usuário'), NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, (NEW.raw_user_meta_data ->> 'role')::app_role);
  
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view own role"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for transport_requests
CREATE POLICY "Cooperatives can create requests"
ON public.transport_requests FOR INSERT
WITH CHECK (auth.uid() = cooperative_id AND public.has_role(auth.uid(), 'cooperative'));

CREATE POLICY "Cooperatives can view own requests"
ON public.transport_requests FOR SELECT
USING (auth.uid() = cooperative_id);

CREATE POLICY "Cooperatives can update own requests"
ON public.transport_requests FOR UPDATE
USING (auth.uid() = cooperative_id AND status = 'pending');

CREATE POLICY "Transporters can view pending requests"
ON public.transport_requests FOR SELECT
USING (public.has_role(auth.uid(), 'transporter') AND status = 'pending');

CREATE POLICY "Transporters can view accepted requests"
ON public.transport_requests FOR SELECT
USING (public.has_role(auth.uid(), 'transporter') AND transporter_id = auth.uid());

CREATE POLICY "Transporters can accept requests"
ON public.transport_requests FOR UPDATE
USING (public.has_role(auth.uid(), 'transporter') AND status = 'pending');

CREATE POLICY "Admins can manage all requests"
ON public.transport_requests FOR ALL
USING (public.has_role(auth.uid(), 'admin'));