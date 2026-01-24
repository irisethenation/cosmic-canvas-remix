import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Calendar } from 'lucide-react';

interface CalendlyEmbedProps {
  url: string;
  prefillEmail?: string;
  prefillName?: string;
  productName: string;
  onClose: () => void;
}

const CalendlyEmbed = ({ url, prefillEmail, prefillName, productName, onClose }: CalendlyEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Build the Calendly URL with prefill parameters
  const buildCalendlyUrl = () => {
    const calendlyUrl = new URL(url);
    if (prefillEmail) {
      calendlyUrl.searchParams.set('email', prefillEmail);
    }
    if (prefillName) {
      calendlyUrl.searchParams.set('name', prefillName);
    }
    // Add hide_gdpr_banner for cleaner embed
    calendlyUrl.searchParams.set('hide_gdpr_banner', '1');
    return calendlyUrl.toString();
  };

  return (
    <Card className="lava-glass border-amber-500/30 w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-amber-400" />
          <CardTitle className="text-foreground">Book: {productName}</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={containerRef}
          className="calendly-inline-widget rounded-b-lg overflow-hidden"
          data-url={buildCalendlyUrl()}
          style={{ minWidth: '320px', height: '700px' }}
        />
      </CardContent>
    </Card>
  );
};

export default CalendlyEmbed;
