-- Add RLS policy allowing users to view their own calls
-- This protects phone numbers and recordings by ensuring users can only access their own records

CREATE POLICY "Users can view their own calls" 
ON public.calls 
FOR SELECT 
USING (auth.uid() = user_id);