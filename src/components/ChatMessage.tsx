import { motion } from 'framer-motion';
import { Message } from '@/types/portfolio';
import { Copy, Check, Sparkles } from 'lucide-react';
import { useState, useEffect, ReactNode } from 'react';
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
            <div className="text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed space-y-2">
              {contentToDisplay.split('\n').map((line, index, array) => {
                const isLastLine = index === array.length - 1;
                
                // Helper function to render text with bold and italic formatting
                const renderTextWithFormatting = (text: string, key: string) => {
                  // First handle bold (**text**), then handle italic (*text*)
                  const parts = text.split('**').map((part, i) => {
                    if (i % 2 === 1) {
                      // Bold text - also check for italics within
                      return (
                        <span key={`bold-${i}`} className="font-bold text-accent">
                          {part.split(/(\*[^*]+\*)/).map((subPart, j) => {
                            if (subPart.startsWith('*') && subPart.endsWith('*')) {
                              return (
                                <em key={`italic-${j}`} className="not-italic font-bold text-accent">
                                  {subPart.slice(1, -1)}
                                </em>
                              );
                            }
                            return subPart;
                          })}
                        </span>
                      );
                    } else {
                      // Regular text - check for italics
                      return (
                        <span key={`regular-${i}`}>
                          {part.split(/(\*[^*]+\*)/).map((subPart, j) => {
                            if (subPart.startsWith('*') && subPart.endsWith('*')) {
                              return (
                                <em key={`italic-${j}`} className="italic text-muted-foreground">
                                  {subPart.slice(1, -1)}
                                </em>
                              );
                            }
                            return subPart;
                          })}
                        </span>
                      );
                    }
                  });
                  return <span key={key}>{parts}</span>;
                };
                
                // Handle markdown links [text](url) and raw URLs - convert to buttons
                const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                const rawUrlRegex = /(https?:\/\/[^\s\)]+)/g;
                const hasMarkdownLink = markdownLinkRegex.test(line);
                const hasRawUrl = rawUrlRegex.test(line);
                
                if (hasMarkdownLink || hasRawUrl) {
                  const parts: ReactNode[] = [];
                  let lastIndex = 0;
                  
                  // First, handle markdown links
                  if (hasMarkdownLink) {
                    markdownLinkRegex.lastIndex = 0;
                    let match;
                    
                    while ((match = markdownLinkRegex.exec(line)) !== null) {
                      // Add text before the link
                      if (match.index > lastIndex) {
                        const beforeText = line.substring(lastIndex, match.index);
                        if (beforeText.trim()) {
                          parts.push(renderTextWithFormatting(beforeText, `text-${lastIndex}`));
                        }
                      }
                      
                      // Add button for the markdown link
                      const url = match[2];
                      const isMailto = url.startsWith('mailto:');
                      parts.push(
                        <Button
                          key={`link-${match.index}`}
                          variant="outline"
                          size="sm"
                          className="mx-1 h-7 text-xs md:text-sm inline-flex items-center cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isMailto) {
                              window.location.href = url;
                            } else {
                              window.open(url, '_blank', 'noopener,noreferrer');
                            }
                          }}
                          type="button"
                        >
                          {match[1]}
                        </Button>
                      );
                      
                      lastIndex = match.index + match[0].length;
                    }
                  }
                  
                  // Then handle raw URLs (only if not already processed as markdown)
                  if (hasRawUrl && !hasMarkdownLink) {
                    rawUrlRegex.lastIndex = 0;
                    let match;
                    
                    while ((match = rawUrlRegex.exec(line)) !== null) {
                      // Add text before the URL
                      if (match.index > lastIndex) {
                        const beforeText = line.substring(lastIndex, match.index);
                        if (beforeText.trim()) {
                          parts.push(renderTextWithFormatting(beforeText, `text-${lastIndex}`));
                        }
                      }
                      
                      // Extract a friendly name from URL or use shortened version
                      const url = match[1];
                      let buttonText = url;
                      try {
                        const urlObj = new URL(url);
                        const hostname = urlObj.hostname.replace('www.', '');
                        buttonText = hostname.split('.')[0] || 'Visit Link';
                        // Capitalize first letter
                        buttonText = buttonText.charAt(0).toUpperCase() + buttonText.slice(1);
                      } catch {
                        // If URL parsing fails, use shortened version
                        buttonText = url.length > 30 ? url.substring(0, 30) + '...' : url;
                      }
                      
                      // Add button for the raw URL
                      parts.push(
                        <Button
                          key={`url-${match.index}`}
                          variant="outline"
                          size="sm"
                          className="mx-1 h-7 text-xs md:text-sm inline-flex items-center cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }}
                          type="button"
                        >
                          {buttonText}
                        </Button>
                      );
                      
                      lastIndex = match.index + match[0].length;
                    }
                  }
                  
                  // Add remaining text after last link
                  if (lastIndex < line.length) {
                    const afterText = line.substring(lastIndex);
                    if (afterText.trim()) {
                      parts.push(renderTextWithFormatting(afterText, `text-${lastIndex}`));
                    }
                  }
                  
                  return (
                    <div key={index} className="flex flex-wrap items-center gap-1">
                      {parts}
                      {isStreaming && isLastLine && (
                        <motion.span
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="inline-block w-2 h-4 bg-current ml-1"
                        />
                      )}
                    </div>
                  );
                }
                
                // Handle headings (## or ###)
                if (line.startsWith('## ')) {
                  return (
                    <h3 key={index} className="text-lg md:text-xl font-bold text-accent mt-4 mb-2">
                      {line.replace('## ', '')}
                    </h3>
                  );
                }
                if (line.startsWith('### ')) {
                  return (
                    <h4 key={index} className="text-base md:text-lg font-semibold text-foreground mt-3 mb-1">
                      {line.replace('### ', '')}
                    </h4>
                  );
                }
                
                // Handle bullet points
                if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                  const bulletText = line.replace(/^[-*]\s+/, '');
                  return (
                    <div key={index} className="flex items-start gap-2 ml-2">
                      <span className="text-accent mt-1">•</span>
                      <span className="flex-1">
                        {bulletText.split('**').map((part, i) => {
                          if (i % 2 === 1) {
                            // Bold text
                            return (
                              <span key={i} className="font-bold text-accent">
                                {part.split(/(\*[^*]+\*)/).map((subPart, j) => {
                                  if (subPart.startsWith('*') && subPart.endsWith('*')) {
                                    return (
                                      <em key={`italic-${j}`} className="not-italic font-bold text-accent">
                                        {subPart.slice(1, -1)}
                                      </em>
                                    );
                                  }
                                  return subPart;
                                })}
                              </span>
                            );
                          } else {
                            // Regular text - handle italics
                            return (
                              <span key={i}>
                                {part.split(/(\*[^*]+\*)/).map((subPart, j) => {
                                  if (subPart.startsWith('*') && subPart.endsWith('*')) {
                                    return (
                                      <em key={`italic-${j}`} className="italic text-muted-foreground">
                                        {subPart.slice(1, -1)}
                                      </em>
                                    );
                                  }
                                  return subPart;
                                })}
                              </span>
                            );
                          }
                        })}
                      </span>
                    </div>
                  );
                }
                
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
                
                // Handle empty lines for spacing
                if (line.trim() === '') {
                  return <div key={index} className="h-2" />;
                }
                
                // Handle regular lines
                return (
                  <div key={index}>
                    {line.split('**').map((part, i) => {
                      if (i % 2 === 1) {
                        // Bold text
                        return (
                          <span key={i} className="font-bold text-accent">
                            {part.split(/(\*[^*]+\*)/).map((subPart, j) => {
                              if (subPart.startsWith('*') && subPart.endsWith('*')) {
                                return (
                                  <em key={`italic-${j}`} className="not-italic font-bold text-accent">
                                    {subPart.slice(1, -1)}
                                  </em>
                                );
                              }
                              return subPart;
                            })}
                          </span>
                        );
                      } else {
                        // Regular text - handle italics
                        return (
                          <span key={i}>
                            {part.split(/(\*[^*]+\*)/).map((subPart, j) => {
                              if (subPart.startsWith('*') && subPart.endsWith('*')) {
                                return (
                                  <em key={`italic-${j}`} className="italic text-muted-foreground">
                                    {subPart.slice(1, -1)}
                                  </em>
                                );
                              }
                              return subPart;
                            })}
                          </span>
                        );
                      }
                    })}
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
