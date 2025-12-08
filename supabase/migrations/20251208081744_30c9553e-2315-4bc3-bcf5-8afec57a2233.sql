-- Make payment-proofs bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'payment-proofs';

-- Create RLS policy for payment-proofs bucket
-- Allow authenticated users to upload their own payment proofs
CREATE POLICY "Users can upload their own payment proofs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'payment-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own payment proofs
CREATE POLICY "Users can view their own payment proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow admins to view all payment proofs
CREATE POLICY "Admins can view all payment proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-proofs' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete payment proofs
CREATE POLICY "Admins can delete payment proofs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'payment-proofs' 
  AND public.has_role(auth.uid(), 'admin')
);