import { motion } from 'framer-motion';
import { Message } from '@/types/portfolio';
import { Copy, Check, Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FollowUpSuggestions } from './FollowUpSuggestions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
  isStreaming?: boolean;
  streamingText?: string;
  onSuggestionClick?: (query: string) => void;
  onLinkClick?: (href: string) => void;
}

export const ChatMessage = ({ message, isLast, isStreaming, streamingText, onSuggestionClick, onLinkClick }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
            className={`rounded-2xl px-4 py-3 ${isUser
              ? 'chat-bubble-user'
              : 'chat-bubble-assistant'
              } shadow-md relative`}
          >
            <div className="text-sm md:text-base break-words leading-relaxed space-y-2 markdown-container">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ ...props }) => <h2 className="text-xl md:text-2xl font-bold text-accent mt-4 mb-2" {...props} />,
                  h2: ({ ...props }) => <h3 className="text-lg md:text-xl font-bold text-accent mt-4 mb-2" {...props} />,
                  h3: ({ ...props }) => <h4 className="text-base md:text-lg font-semibold text-foreground mt-3 mb-1" {...props} />,
                  strong: ({ ...props }) => <span className="font-bold text-accent" {...props} />,
                  em: ({ ...props }) => <em className="italic text-muted-foreground" {...props} />,
                  ul: ({ ...props }) => <ul className="space-y-1 my-2" {...props} />,
                  ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-1 my-2" {...props} />,
                  li: ({ children, ...props }) => (
                    <li className="flex items-start gap-2 ml-2">
                      <span className="text-accent mt-1.5 text-[0.6rem]">•</span>
                      <span className="flex-1">{children}</span>
                    </li>
                  ),
                  a: ({ href, children, ...props }) => {
                    const isMailto = href?.startsWith('mailto:');
                    const isInternal = href?.startsWith('#');

                    return (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mx-1 h-7 text-xs md:text-sm inline-flex items-center cursor-pointer align-middle"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (href) {
                            if (isInternal && onLinkClick) {
                              onLinkClick(href);
                            } else if (isMailto) {
                              window.location.href = href;
                            } else {
                              window.open(href, '_blank', 'noopener,noreferrer');
                            }
                          }
                        }}
                        type="button"
                      >
                        {children}
                      </Button>
                    );
                  },
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match && !String(children).includes('\n');
                    return isInline ? (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-accent" {...props}>
                        {children}
                      </code>
                    ) : (
                      <div className="relative my-4 rounded-lg overflow-hidden bg-muted/50 border border-border">
                        <pre className="p-4 overflow-x-auto text-sm font-mono">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    );
                  },
                  blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 border-accent/50 pl-4 py-2 my-4 text-muted-foreground bg-accent/5 rounded-r-lg shadow-sm" {...props} />
                  ),
                  img: ({ src, alt, ...props }) => (
                    <span
                      className="relative my-2 mx-1 rounded-lg overflow-hidden shadow-sm border border-border bg-muted/30 inline-block w-[45%] align-top cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(src || "")}
                    >
                      <img
                        src={src}
                        alt={alt}
                        className="w-full h-32 object-cover"
                        loading="lazy"
                        {...props}
                      />
                      {alt && <span className="block text-[10px] text-center text-muted-foreground py-1 bg-muted/50 italic truncate px-2">{alt}</span>}
                    </span>
                  ),
                }}
              >
                {contentToDisplay}
              </ReactMarkdown>
            </div>

            {/* Lightbox */}
            {selectedImage && (
              <div
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-200"
                onClick={() => setSelectedImage(null)}
              >
                <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
                  <img
                    src={selectedImage}
                    alt="Full view"
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                  />
                  <button
                    className="absolute top-[-40px] right-0 text-white hover:text-gray-300"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="h-8 w-8" />
                  </button>
                </div>
              </div>
            )}

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
