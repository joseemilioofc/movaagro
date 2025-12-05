-- Create ratings table for mutual evaluation
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transport_request_id UUID NOT NULL REFERENCES public.transport_requests(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  reviewed_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(transport_request_id, reviewer_id, reviewed_id)
);

-- Enable RLS
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view ratings they gave or received"
ON public.ratings FOR SELECT
USING (auth.uid() = reviewer_id OR auth.uid() = reviewed_id);

CREATE POLICY "Users can create ratings for completed transports"
ON public.ratings FOR INSERT
WITH CHECK (
  auth.uid() = reviewer_id AND
  EXISTS (
    SELECT 1 FROM transport_requests tr
    WHERE tr.id = transport_request_id
    AND tr.status = 'completed'
    AND (tr.cooperative_id = auth.uid() OR tr.transporter_id = auth.uid())
  )
);

CREATE POLICY "Admins can view all ratings"
ON public.ratings FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.ratings;