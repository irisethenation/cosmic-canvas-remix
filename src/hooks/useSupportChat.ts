import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Attachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  created_at: string;
  attachments: Attachment[];
}

export interface SupportCase {
  id: string;
  status: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export const useSupportChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeCase, setActiveCase] = useState<SupportCase | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Fetch user's active support case
  const fetchActiveCase = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('support_cases')
        .select('id, status, summary, created_at, updated_at')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setActiveCase(data);
    } catch (error) {
      console.error('Error fetching support case:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch messages for the active case
  const fetchMessages = useCallback(async () => {
    if (!activeCase) return;

    try {
      const { data, error } = await supabase
        .from('case_messages')
        .select('id, content, sender, created_at, attachments')
        .eq('case_id', activeCase.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setMessages(
        (data || []).map((msg) => ({
          ...msg,
          attachments: Array.isArray(msg.attachments) ? (msg.attachments as unknown as Attachment[]) : [],
        }))
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [activeCase]);

  // Upload file to storage
  const uploadFile = async (file: File): Promise<Attachment | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('support-attachments')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast({
        title: 'Upload failed',
        description: uploadError.message,
        variant: 'destructive',
      });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('support-attachments')
      .getPublicUrl(fileName);

    // For private buckets, we need to create a signed URL
    const { data: signedUrlData } = await supabase.storage
      .from('support-attachments')
      .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days

    return {
      name: file.name,
      url: signedUrlData?.signedUrl || publicUrl,
      type: file.type,
      size: file.size,
    };
  };

  // Send a message with optional attachments
  const sendMessage = async (content: string, files: File[] = []) => {
    if (!user || !activeCase) {
      toast({
        title: 'No active support case',
        description: 'Please start a new support conversation.',
        variant: 'destructive',
      });
      return false;
    }

    if (!content.trim() && files.length === 0) return false;

    setSending(true);
    try {
      // Upload files first
      const attachments: Attachment[] = [];
      for (const file of files) {
        const attachment = await uploadFile(file);
        if (attachment) {
          attachments.push(attachment);
        }
      }

      // Insert message - cast attachments to JSON-compatible format
      const attachmentsJson = attachments.map(a => ({
        name: a.name,
        url: a.url,
        type: a.type,
        size: a.size,
      }));
      
      const { error } = await supabase
        .from('case_messages')
        .insert([{
          case_id: activeCase.id,
          content: content.trim() || (attachments.length > 0 ? '[Attachment]' : ''),
          sender: 'user',
          attachments: attachmentsJson,
        }]);

      if (error) throw error;

      // Refresh messages
      await fetchMessages();
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Failed to send message',
        description: 'Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSending(false);
    }
  };

  // Set up realtime subscription for messages
  useEffect(() => {
    if (!activeCase) return;

    const channel = supabase
      .channel(`case-messages-${activeCase.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'case_messages',
          filter: `case_id=eq.${activeCase.id}`,
        },
        (payload) => {
          const newMessage = payload.new as {
            id: string;
            content: string;
            sender: string;
            created_at: string;
            attachments: unknown;
          };
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, { 
              ...newMessage, 
              attachments: Array.isArray(newMessage.attachments) 
                ? (newMessage.attachments as unknown as Attachment[]) 
                : [] 
            }];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeCase]);

  useEffect(() => {
    fetchActiveCase();
  }, [fetchActiveCase]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    activeCase,
    messages,
    loading,
    sending,
    sendMessage,
    refreshMessages: fetchMessages,
  };
};
