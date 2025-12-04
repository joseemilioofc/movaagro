-- Enable realtime for transport_requests table
ALTER PUBLICATION supabase_realtime ADD TABLE public.transport_requests;

-- Enable realtime for profiles table
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;