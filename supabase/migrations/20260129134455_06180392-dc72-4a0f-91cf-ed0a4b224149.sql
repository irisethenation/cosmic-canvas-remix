-- Create storage bucket for support attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'support-attachments',
  'support-attachments',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain', 'text/csv']
);

-- RLS policies for support-attachments bucket

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload support attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'support-attachments' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view their own attachments
CREATE POLICY "Users can view their own support attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'support-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins to view all support attachments
CREATE POLICY "Admins can view all support attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'support-attachments'
  AND is_admin(auth.uid())
);

-- Allow admins to manage all support attachments
CREATE POLICY "Admins can manage all support attachments"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'support-attachments'
  AND is_admin(auth.uid())
)
WITH CHECK (
  bucket_id = 'support-attachments'
  AND is_admin(auth.uid())
);

-- Allow users to delete their own attachments
CREATE POLICY "Users can delete their own support attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'support-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Add attachments column to case_messages table
ALTER TABLE public.case_messages
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;