import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, RotateCcw, Menu, Home } from 'lucide-react';
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
    setMessages([]);
    setIsChatExpanded(false);
    setInputValue('');
    toast.success('Chat cleared successfully');
  };

  const handleGoHome = () => {
    setMessages([]);
    setIsChatExpanded(false);
    setInputValue('');
    setIsMobileSidebarOpen(false);
  };


  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <CollapsibleSidebar onNavigate={handleNavigate} onGoHome={handleGoHome} isMobile={false} />
      </div>

      {/* Theme Toggle - Top Right Corner */}
      <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-2 left-2 md:hidden z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="bg-sidebar/80 backdrop-blur-sm hover:bg-sidebar-accent h-8 w-8 touch-manipulation"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={`
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed z-50 transition-transform duration-300 h-full w-72 bg-sidebar border-r border-border shadow-xl
      `}>
        <CollapsibleSidebar onNavigate={handleNavigate} onMobileClose={() => setIsMobileSidebarOpen(false)} onGoHome={handleGoHome} isMobile={true} />
      </div>

      <main className="flex-1 relative">
        {/* Chat Messages Area - Scrollable above input when expanded */}
        {isChatExpanded && (
          <div
            ref={chatContainerRef}
            className="absolute top-0 left-0 right-0 bottom-20 overflow-y-auto px-3 md:px-4 lg:px-6 py-4 md:py-6"
          >
            <div className="max-w-5xl mx-auto w-full space-y-3 md:space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Welcome Content Area */}
        {!isChatExpanded && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center p-3 md:p-6 overflow-y-auto">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center space-y-4 md:space-y-6 lg:space-y-8 w-full max-w-2xl px-2"
            >
              {/* Keep Smiling Text */}
              <div className="space-y-2 md:space-y-3 lg:space-y-4">
                <motion.h1
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent leading-tight"
                >
                  Keep Smiling <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"></span>
                </motion.h1>
                <motion.p
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.4 }}
                   className="text-sm md:text-base lg:text-lg text-muted-foreground px-2"
                 >
                   We are what we repeatedly do
                 </motion.p>
              </div>

              {/* Suggestion Chips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-1 md:gap-2 justify-center px-1"
              >
                <SuggestionChips onSelect={handleSuggestionClick} />
              </motion.div>

              {/* Input Box - Positioned right below suggestions (Desktop Only) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="hidden md:flex justify-center pt-2"
              >
                <div className="w-full max-w-xl mx-auto px-1">
                  <div className="flex gap-1 md:gap-2 p-2 bg-sidebar/50 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClearChat}
                      title="Clear chat"
                      className="hover:bg-secondary shrink-0 h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 touch-manipulation"
                    >
                      <RotateCcw className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder="Ask about my skills, projects, or experience..."
                      className="flex-1 bg-input border-0 focus:ring-0 text-sm md:text-base h-8 md:h-9 lg:h-10 min-h-[44px] touch-manipulation"
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-accent hover:bg-accent/90 shrink-0 h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 touch-manipulation"
                    >
                      <Send className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* Bottom Input Area - Visible when chat is expanded */}
        {isChatExpanded && (
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 lg:p-6 bg-sidebar/95 backdrop-blur-sm border-t border-border z-10">
            <div className="max-w-5xl mx-auto px-1">
              <div className="flex gap-1 md:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearChat}
                  title="Clear chat"
                  className="hover:bg-secondary shrink-0 h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 touch-manipulation"
                >
                  <RotateCcw className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask about my skills, projects, or experience..."
                  className="flex-1 bg-input border-border focus:ring-accent text-sm md:text-base h-8 md:h-9 lg:h-10 min-h-[44px] touch-manipulation"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-accent hover:bg-accent/90 shrink-0 h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 touch-manipulation"
                >
                  <Send className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Input - Only for mobile when chat is collapsed */}
        {!isChatExpanded && (
          <div className="block md:hidden absolute bottom-0 left-0 right-0 p-3 md:p-4 lg:p-6 bg-sidebar/95 backdrop-blur-sm border-t border-border z-10">
            <div className="max-w-5xl mx-auto px-1">
              <div className="flex gap-1 md:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearChat}
                  title="Clear chat"
                  className="hover:bg-secondary shrink-0 h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 touch-manipulation"
                >
                  <RotateCcw className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask about my skills, projects, or experience..."
                  className="flex-1 bg-input border-border focus:ring-accent text-sm md:text-base h-8 md:h-9 lg:h-10 min-h-[44px] touch-manipulation"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-accent hover:bg-accent/90 shrink-0 h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 touch-manipulation"
                >
                  <Send className="h-3 w-3 md:h-4 md:w-4" />
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
