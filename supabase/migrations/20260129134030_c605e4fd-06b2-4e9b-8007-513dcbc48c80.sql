-- Allow students to view ONLY their active/in-progress support cases (not historical data)
CREATE POLICY "Users can view their own active support cases"
  ON public.support_cases FOR SELECT
  USING (auth.uid() = user_id AND status = 'active');

-- Allow students to view messages ONLY in their active/in-progress cases
CREATE POLICY "Users can view messages in their active cases"
  ON public.case_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.support_cases
      WHERE support_cases.id = case_messages.case_id
      AND support_cases.user_id = auth.uid()
      AND support_cases.status = 'active'
    )
  );