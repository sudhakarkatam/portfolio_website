import { motion } from 'framer-motion';
import { Message } from '@/types/portfolio';
import { Copy, Check, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FollowUpSuggestions } from './FollowUpSuggestions';

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
  isStreaming?: boolean;
  streamingText?: string;
  onSuggestionClick?: (query: string) => void;
}

export const ChatMessage = ({ message, isLast, isStreaming, streamingText, onSuggestionClick }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const isUser = message.role === 'user';

  // Streaming effect for assistant messages
  useEffect(() => {
    // When streaming, use streamingText directly
    if (isStreaming) {
      if (streamingText) {
        setDisplayText(streamingText);
      } else {
        setDisplayText(message.content || '');
      }
      return;
    }
    
    // For non-streaming messages, display content immediately
    // (Animation happens at the Index level during streaming)
    setDisplayText(message.content || '');
  }, [message.content, isUser, isStreaming, streamingText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine what content to display
  const contentToDisplay = isStreaming 
    ? (streamingText || message.content || '')
    : (displayText || message.content || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 group gap-3`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-accent/30 shadow-glow">
          <AvatarFallback className="bg-gradient-to-br from-accent to-accent/60 text-primary-foreground">
            <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col ${isUser ? 'max-w-[80%] md:max-w-[70%]' : 'w-full max-w-4xl'}`}>
        {contentToDisplay && (
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? 'chat-bubble-user'
                : 'chat-bubble-assistant'
            } shadow-md relative`}
          >
            <div className="text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
              {contentToDisplay.split('\n').map((line, index, array) => {
                const isLastLine = index === array.length - 1;
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
                    {isStreaming && isLastLine && (
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-current ml-1"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            
            {!isUser && !isStreaming && (
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
        
        {message.component && !isStreaming && (
          <div className="mt-4">
            {message.component}
          </div>
        )}
        
        {/* Follow-up suggestions */}
        {!isUser && !isStreaming && message.suggestions && message.suggestions.length > 0 && onSuggestionClick && (
          <FollowUpSuggestions 
            suggestions={message.suggestions} 
            onSelect={onSuggestionClick}
          />
        )}
        
        <span className="text-xs md:text-sm text-muted-foreground mt-3 mb-2 px-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
};
