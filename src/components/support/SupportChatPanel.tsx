import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSupportChat } from '@/hooks/useSupportChat';
import { MessageBubble } from './MessageBubble';
import { FileUploadButton } from './FileUploadButton';
import { AttachmentPreview } from './AttachmentPreview';

export const SupportChatPanel = () => {
  const { activeCase, messages, loading, sending, sendMessage } = useSupportChat();
  const [input, setInput] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && pendingFiles.length === 0) || sending) return;

    const success = await sendMessage(input, pendingFiles);
    if (success) {
      setInput('');
      setPendingFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    setPendingFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <Card className="lava-glass">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        </CardContent>
      </Card>
    );
  }

  if (!activeCase) {
    return (
      <Card className="lava-glass">
        <CardContent className="flex flex-col items-center justify-center h-64 text-center p-6">
          <MessageCircle className="h-12 w-12 text-amber-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Support Case</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You don't have any active support conversations. Start a new conversation via Telegram to get help.
          </p>
          <Button
            variant="outline"
            className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
            onClick={() => window.open('https://t.me/morpheusiRise_bot', '_blank')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat with Morpheus
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lava-glass flex flex-col h-[600px]">
      <CardHeader className="border-b border-amber-500/20 py-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Active Support Case
        </CardTitle>
        {activeCase.summary && (
          <p className="text-sm text-muted-foreground mt-1">{activeCase.summary}</p>
        )}
      </CardHeader>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              No messages yet. Send a message to start the conversation.
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                content={message.content}
                sender={message.sender}
                timestamp={message.created_at}
                attachments={message.attachments}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t border-amber-500/20">
        <AttachmentPreview files={pendingFiles} onRemove={handleRemoveFile} />
        
        <div className="flex items-end gap-2 p-4">
          <FileUploadButton
            onFilesSelected={handleFilesSelected}
            disabled={sending}
          />
          
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[44px] max-h-32 resize-none bg-muted/50"
            disabled={sending}
          />
          
          <Button
            type="submit"
            size="icon"
            disabled={(!input.trim() && pendingFiles.length === 0) || sending}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
