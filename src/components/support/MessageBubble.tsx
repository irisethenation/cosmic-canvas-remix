import { FileText, FileImage, FileSpreadsheet, File, Download, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Attachment } from '@/hooks/useSupportChat';

interface MessageBubbleProps {
  content: string;
  sender: string;
  timestamp: string;
  attachments: Attachment[];
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return FileImage;
  if (type.includes('pdf')) return FileText;
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) return FileSpreadsheet;
  return File;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const MessageBubble = ({ content, sender, timestamp, attachments }: MessageBubbleProps) => {
  const isUser = sender === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2 space-y-2',
          isUser
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
            : 'bg-muted text-foreground'
        )}
      >
        {/* Message content */}
        {content && content !== '[Attachment]' && (
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((attachment, index) => {
              const isImage = attachment.type.startsWith('image/');
              const Icon = getFileIcon(attachment.type);

              return (
                <div key={index} className="space-y-1">
                  {isImage ? (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="max-w-full max-h-48 rounded-lg object-contain cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </a>
                  ) : (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-lg transition-colors',
                        isUser
                          ? 'bg-white/20 hover:bg-white/30'
                          : 'bg-background hover:bg-background/80'
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{attachment.name}</p>
                        <p className={cn('text-xs', isUser ? 'text-white/70' : 'text-muted-foreground')}>
                          {formatFileSize(attachment.size)}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Timestamp */}
        <p
          className={cn(
            'text-xs',
            isUser ? 'text-white/70' : 'text-muted-foreground'
          )}
        >
          {format(new Date(timestamp), 'h:mm a')}
        </p>
      </div>
    </div>
  );
};
