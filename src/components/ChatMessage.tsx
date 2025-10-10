import { motion } from 'framer-motion';
import { Message } from '@/types/portfolio';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

export const ChatMessage = ({ message, isLast }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}
    >
      <div className={`flex flex-col ${isUser ? 'max-w-[80%] md:max-w-[70%]' : 'w-full max-w-4xl'}`}>
        {message.content && (
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? 'chat-bubble-user'
                : 'chat-bubble-assistant'
            } shadow-md relative`}
          >
            <div className="text-sm md:text-base whitespace-pre-wrap break-words">
              {message.content.split('\n').map((line, index) => {
                // Handle project boxes with borders
                if (line.startsWith('┌─') || line.startsWith('│') || line.startsWith('└─')) {
                  return (
                    <div key={index} className={`font-mono ${line.includes('**') ? 'text-accent' : ''}`}>
                      {line.split('**').map((part, i) =>
                        i % 2 === 1 ? <span key={i} className="font-bold text-accent">{part}</span> : part
                      )}
                    </div>
                  );
                }
                // Handle regular lines
                return (
                  <div key={index}>
                    {line.split('**').map((part, i) =>
                      i % 2 === 1 ? <span key={i} className="font-bold text-accent">{part}</span> : part
                    )}
                  </div>
                );
              })}
            </div>
            
            {!isUser && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        )}
        
        {message.component && (
          <div className="mt-4">
            {message.component}
          </div>
        )}
        
        <span className="text-xs text-muted-foreground mt-1 px-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
};
