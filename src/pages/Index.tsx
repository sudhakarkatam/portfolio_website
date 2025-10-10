import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CollapsibleSidebar } from '@/components/CollapsibleSidebar';
import { ChatMessage } from '@/components/ChatMessage';
import { TypingIndicator } from '@/components/TypingIndicator';
import { SuggestionChips } from '@/components/SuggestionChips';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Message } from '@/types/portfolio';
import { generateResponse } from '@/utils/chatResponses';
import { portfolioData } from '@/data/portfolioData';
import { toast } from 'sonner';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

 useEffect(() => {
   // No welcome message needed - start with empty chat
   setMessages([]);
 }, []);

  const handleSendMessage = async (text?: string, projectId?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText && !projectId) return;

    // Expand chat on first user interaction
    if (messages.length <= 1) {
      setIsChatExpanded(true);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(messageText, projectId);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || '',
        component: response.component,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleSuggestionClick = (query: string) => {
    handleSendMessage(query);
  };

  const handleNavigate = (section: string, projectId?: string) => {
    const queries: Record<string, string> = {
      about: 'Tell me about yourself',
      skills: 'What are your technical skills?',
      projects: 'Show me your projects',
      experience: 'What is your work experience?',
      project: projectId ? `Tell me about ${portfolioData.projects.find(p => p.id === projectId)?.title}` : 'Show me your projects',
    };
    
    if (section === 'project' && projectId) {
      handleSendMessage(queries[section], projectId);
    } else {
      handleSendMessage(queries[section]);
    }
  };

  const handleClearChat = () => {
    const welcomeMessage: Message = {
      id: '0',
      role: 'assistant',
      content: `Chat cleared! Hi again! I'm ${portfolioData.name}'s portfolio assistant. What would you like to know?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    toast.success('Chat cleared successfully');
  };


  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <CollapsibleSidebar onNavigate={handleNavigate} />

      {/* Theme Toggle - Top Right Corner */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <main className="flex-1 relative">
        {/* Chat Messages Area - Scrollable above input when expanded */}
        {isChatExpanded && (
          <div
            ref={chatContainerRef}
            className="absolute top-0 left-0 right-0 bottom-24 overflow-y-auto px-4 md:px-6 py-6"
          >
            <div className="max-w-5xl mx-auto w-full">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Centered Input Area - Initial State */}
        {!isChatExpanded && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center space-y-8 w-full max-w-2xl"
            >
              {/* Keep Smiling Text */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent"
                >
                  Keep Smiling <span className="text-4xl md:text-6xl"></span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-muted-foreground"
                >
                  We are what we repeatedly do
                </motion.p>
              </div>

              {/* Suggestion Chips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-2 justify-center"
              >
                <SuggestionChips onSelect={handleSuggestionClick} />
              </motion.div>

              {/* Centered Input Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="w-full max-w-xl mx-auto"
              >
                <div className="flex gap-2 bg-sidebar/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearChat}
                    title="Clear chat"
                    className="hover:bg-secondary shrink-0"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Ask about my skills, projects, or experience..."
                    className="flex-1 bg-input border-border focus:ring-accent"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-accent hover:bg-accent/90 shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* Bottom Input Area - After Expansion */}
        {isChatExpanded && (
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-sidebar/95 backdrop-blur-sm border-t border-border z-10">
            <div className="max-w-5xl mx-auto">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearChat}
                  title="Clear chat"
                  className="hover:bg-secondary shrink-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask about my skills, projects, or experience..."
                  className="flex-1 bg-input border-border focus:ring-accent"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-accent hover:bg-accent/90 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
