-- Create support_cases table for tracking user interactions
CREATE TABLE public.support_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_chat_id BIGINT NOT NULL,
  telegram_user_id BIGINT NOT NULL,
  telegram_username TEXT,
  current_agent TEXT DEFAULT 'morpheus' CHECK (current_agent IN ('morpheus', 'trinity')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'escalated', 'resolved', 'closed')),
  vapi_call_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create case_messages table for message history
CREATE TABLE public.case_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES public.support_cases(id) ON DELETE CASCADE,
  telegram_message_id BIGINT,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'morpheus', 'trinity', 'system')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'command', 'callback')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_messages ENABLE ROW LEVEL SECURITY;

-- Service role policies for edge functions
CREATE POLICY "Service role full access on support_cases"
  ON public.support_cases FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on case_messages"
  ON public.case_messages FOR ALL
  USING (true)
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_support_cases_telegram_chat ON public.support_cases(telegram_chat_id);
CREATE INDEX idx_support_cases_status ON public.support_cases(status);
CREATE INDEX idx_case_messages_case_id ON public.case_messages(case_id);

-- Update trigger
CREATE TRIGGER update_support_cases_updated_at
  BEFORE UPDATE ON public.support_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();