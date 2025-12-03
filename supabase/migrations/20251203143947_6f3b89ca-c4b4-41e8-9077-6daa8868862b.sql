-- Create chat_messages table for conversations between transporters and cooperatives
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transport_request_id UUID NOT NULL REFERENCES public.transport_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Cooperatives can view messages for their own requests
CREATE POLICY "Cooperatives can view messages for own requests"
ON public.chat_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.transport_requests tr
    WHERE tr.id = transport_request_id
    AND tr.cooperative_id = auth.uid()
  )
);

-- Cooperatives can send messages for their own requests
CREATE POLICY "Cooperatives can send messages for own requests"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.transport_requests tr
    WHERE tr.id = transport_request_id
    AND tr.cooperative_id = auth.uid()
  )
);

-- Transporters can view messages for accepted requests
CREATE POLICY "Transporters can view messages for accepted requests"
ON public.chat_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.transport_requests tr
    WHERE tr.id = transport_request_id
    AND tr.transporter_id = auth.uid()
  )
);

-- Transporters can send messages for accepted requests
CREATE POLICY "Transporters can send messages for accepted requests"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.transport_requests tr
    WHERE tr.id = transport_request_id
    AND tr.transporter_id = auth.uid()
  )
);

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
ON public.chat_messages
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can send messages to any chat
CREATE POLICY "Admins can send messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Enable realtime for chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;