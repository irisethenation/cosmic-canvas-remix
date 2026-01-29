import { X, FileText, FileImage, FileSpreadsheet, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttachmentPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
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

export const AttachmentPreview = ({ files, onRemove }: AttachmentPreviewProps) => {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2 border-t border-border/50">
      {files.map((file, index) => {
        const Icon = getFileIcon(file.type);
        const isImage = file.type.startsWith('image/');

        return (
          <div
            key={index}
            className="relative group flex items-center gap-2 bg-muted/50 rounded-lg p-2 pr-8"
          >
            {isImage ? (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-10 h-10 object-cover rounded"
              />
            ) : (
              <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium truncate max-w-[120px]">
                {file.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
    </div>
  );
};
