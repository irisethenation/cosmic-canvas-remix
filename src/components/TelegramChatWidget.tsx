import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const TELEGRAM_BOT_USERNAME = "morpheusiRise_bot";

const TelegramChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStartChat = () => {
    window.open(`https://t.me/${TELEGRAM_BOT_USERNAME}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Widget */}
      {isOpen && (
        <div className="mb-4 w-80 rounded-2xl bg-card border border-amber-500/30 shadow-2xl shadow-amber-500/20 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Morpheus</h3>
                <p className="text-xs text-white/80">AI Support Agent</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
              <p className="mb-2">
                👋 Welcome to <strong>iRise Academy</strong>!
              </p>
              <p>
                I'm <strong>Morpheus</strong>, your AI guide. Connect with me on Telegram for:
              </p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Instant support & guidance</li>
                <li>• Course questions</li>
                <li>• Program information</li>
                <li>• Direct assistance</li>
              </ul>
            </div>

            <Button
              onClick={handleStartChat}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white gap-2"
            >
              <Send className="w-4 h-4" />
              Chat with Morpheus
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Opens in Telegram
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full 
          bg-gradient-to-r from-amber-500 to-orange-500 
          hover:from-amber-600 hover:to-orange-600
          shadow-lg shadow-amber-500/30 
          flex items-center justify-center 
          transition-all duration-300 
          hover:scale-110
          ${isOpen ? "rotate-0" : "animate-pulse"}
        `}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
};

export default TelegramChatWidget;
