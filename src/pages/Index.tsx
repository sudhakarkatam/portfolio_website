import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, RefreshCw, Menu, Home, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CollapsibleSidebar } from '@/components/CollapsibleSidebar';
import { ChatMessage } from '@/components/ChatMessage';
import { TypingIndicator } from '@/components/TypingIndicator';
import { SuggestionChips } from '@/components/SuggestionChips';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GameGrid } from '@/components/games/GameGrid';
import { TicTacToe } from '@/components/games/TicTacToe';
import { MemoryMatch } from '@/components/games/MemoryMatch';
import { TypingSpeed } from '@/components/games/TypingSpeed';
import { CodeQuiz } from '@/components/games/CodeQuiz';
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
  const [currentView, setCurrentView] = useState('home');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
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
      const response = generateResponse(messageText, projectId, handleNavigate);
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
    if (section === 'games') {
      setCurrentView('games');
      setSelectedGame(null); // Reset to grid view
      setIsChatExpanded(false);
      return;
    }
    
    if (section === 'home') {
      setCurrentView('home');
      setSelectedGame(null);
      setIsChatExpanded(false);
      return;
    }

    // For all other sections (about, skills, projects, experience), switch to home view and start chat
    setCurrentView('home');
    setSelectedGame(null);
    setIsChatExpanded(true); // Expand chat to show the response

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

  const handleRefresh = () => {
    setMessages([]);
    setInputValue('');
    toast.success('Chat refreshed');
  };

  const handleClearChat = () => {
    setMessages([]);
    setIsChatExpanded(false);
    setInputValue('');
    toast.success('Chat cleared successfully');
  };

  const handleOpenContactForm = () => {
    // Open contact form in chat instead of popup
    handleSendMessage('send message');
  };

  const handleGoHome = () => {
    setMessages([]);
    setIsChatExpanded(false);
    setInputValue('');
    setIsMobileSidebarOpen(false);
    setCurrentView('home');
    setSelectedGame(null);
  };

  const handlePlayGame = (gameId: string) => {
    setSelectedGame(gameId);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
  };


  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Animated Background Effects */}
      <FloatingParticles />

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <CollapsibleSidebar onNavigate={handleNavigate} onGoHome={handleGoHome} isMobile={false} />
      </div>

      {/* Theme Toggle - Top Right Corner - Only on home page when chat is not expanded */}
      {currentView === 'home' && !isChatExpanded && (
        <div className="fixed top-3 right-3 md:top-5 md:right-5 z-50">
          <ThemeToggle />
        </div>
      )}


      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-3 left-3 md:hidden z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="bg-sidebar/80 backdrop-blur-sm hover:bg-sidebar-accent h-9 w-9 touch-manipulation"
        >
          <Menu className="h-5 w-5" />
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
        fixed z-[60] transition-transform duration-300 h-full w-80 sm:w-96 bg-sidebar border-r border-border shadow-xl
      `}>
        <CollapsibleSidebar onNavigate={handleNavigate} onMobileClose={() => setIsMobileSidebarOpen(false)} onGoHome={handleGoHome} isMobile={true} />
      </div>

      <main className="flex-1 relative">
        {/* Chat Messages Area - Scrollable above input when expanded */}
        {isChatExpanded && (
          <div
            ref={chatContainerRef}
            className="absolute top-0 left-0 right-0 bottom-20 overflow-y-auto px-3 md:px-5 lg:px-7 py-4 md:py-7"
          >
            <div className="max-w-5xl mx-auto w-full space-y-4 md:space-y-5">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Games View */}
        {currentView === 'games' && !isChatExpanded && (
          <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto">
            {selectedGame ? (
              <>
                {selectedGame === 'tic-tac-toe' && <TicTacToe onBack={handleBackToGames} />}
                {selectedGame === 'memory-match' && <MemoryMatch onBack={handleBackToGames} />}
                {selectedGame === 'typing-speed' && <TypingSpeed onBack={handleBackToGames} />}
                {selectedGame === 'code-quiz' && <CodeQuiz onBack={handleBackToGames} />}
              </>
            ) : (
              <GameGrid onPlayGame={handlePlayGame} />
            )}
          </div>
        )}

        {/* Welcome Content Area */}
        {currentView === 'home' && !isChatExpanded && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center space-y-5 md:space-y-7 lg:space-y-9 w-full max-w-4xl px-3"
            >
              {/* Keep Smiling Text */}
              <div className="space-y-3 md:space-y-5 lg:space-y-6">
                <motion.h1
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent leading-tight lg:scale-[0.7]"
                >
                  Keep Smiling <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"></span>
                </motion.h1>
                <motion.p
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.4 }}
                   className="text-base md:text-xl lg:text-2xl text-muted-foreground px-2"
                 >
                   We are what we repeatedly do
                 </motion.p>
              </div>

              {/* Input Box - Claude-style layout (Desktop Only) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="hidden md:flex justify-center pt-3"
              >
                <div className="w-full max-w-3xl mx-auto px-2">
                  {/* Main Input Box Container - Icons inside input area */}
                  <div className="relative bg-sidebar/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg">
                    {/* Input Field with absolute positioned icons */}
                    <div className="relative flex items-start">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder="Ask about my skills, projects, or experience..."
                        className="flex-1 bg-input border-0 focus:ring-0 text-base md:text-lg h-20 md:h-24 lg:h-28 min-h-[80px] pr-28 pl-4 touch-manipulation placeholder:text-muted-foreground/60 rounded-xl text-left"
                        style={{ paddingTop: '0.5rem', paddingBottom: '3rem', lineHeight: '1.2' }}
                      />
                      
                      {/* Left side icons - Bottom line of input area */}
                      <div className="absolute left-3 bottom-3 flex gap-1.5 md:gap-2 z-10">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleRefresh}
                          title="Refresh chat"
                          className="h-8 w-8 md:h-9 md:w-9 hover:bg-secondary/80 rounded-lg"
                        >
                          <RefreshCw className="h-4 w-4 md:h-4 md:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleOpenContactForm}
                          title="Send a message"
                          className="h-8 w-8 md:h-9 md:w-9 hover:bg-secondary/80 rounded-lg"
                        >
                          <Send className="h-4 w-4 md:h-4 md:w-4" />
                        </Button>
                      </div>
                      
                      {/* Right side - Send Button - Bottom line of input area */}
                      <div className="absolute right-3 bottom-3 z-10">
                        <Button
                          onClick={() => handleSendMessage()}
                          disabled={!inputValue.trim() || isTyping}
                          className="bg-accent hover:bg-accent/90 shrink-0 h-8 w-8 md:h-9 md:w-9 rounded-lg touch-manipulation"
                        >
                          <ArrowUp className="h-4 w-4 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Suggestion Chips - Directly below Input Box */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap gap-2 md:gap-3 justify-center mt-4 px-1"
                  >
                    <SuggestionChips onSelect={handleSuggestionClick} />
                  </motion.div>
                </div>
              </motion.div>

              {/* Suggestion Chips - For Mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex md:hidden flex-wrap gap-3 md:gap-4 justify-center px-1"
              >
                <SuggestionChips onSelect={handleSuggestionClick} />
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* Bottom Input Area - Visible when chat is expanded */}
        {isChatExpanded && (
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 lg:p-7 bg-sidebar/95 backdrop-blur-sm border-t border-border z-10">
            <div className="max-w-5xl mx-auto px-1">
              <div className="flex gap-3 md:gap-4">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask about my skills, projects, or experience..."
                  className="flex-1 bg-input border-border focus:ring-accent text-sm md:text-base h-9 md:h-10 lg:h-11 min-h-[40px] touch-manipulation"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-accent hover:bg-accent/90 shrink-0 h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 touch-manipulation"
                >
                  <ArrowUp className="h-4 w-4 md:h-4 md:w-4" />
                </Button>
              </div>
              {/* Refresh and Send Message buttons below input - icon only */}
              <div className="flex gap-2 mt-2 justify-start px-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefresh}
                  title="Refresh chat"
                  className="h-7 w-7 md:h-8 md:w-8 hover:bg-secondary/80"
                >
                  <RefreshCw className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleOpenContactForm}
                  title="Send a message"
                  className="h-7 w-7 md:h-8 md:w-8 hover:bg-secondary/80"
                >
                  <Send className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Input - Claude-style layout */}
        {!isChatExpanded && (
          <div className="block md:hidden fixed bottom-0 left-0 right-0 p-3 bg-sidebar/95 backdrop-blur-sm border-t border-border z-40 safe-area-pb">
            <div className="max-w-5xl mx-auto px-2">
              {/* Main Input Box Container - Icons inside input area */}
              <div className="relative bg-sidebar/95 backdrop-blur-sm border border-border rounded-xl shadow-lg">
                  {/* Input Field with absolute positioned icons */}
                  <div className="relative flex items-start">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder="Ask about my skills, projects, or experience..."
                      className="flex-1 bg-input border-0 focus:ring-0 text-base h-24 min-h-[96px] pr-24 pl-4 touch-manipulation placeholder:text-muted-foreground/60 rounded-xl text-left"
                      style={{ paddingTop: '0.5rem', paddingBottom: '4rem', lineHeight: '1.2' }}
                    />
                  
                  {/* Left side icons - Bottom line of input area */}
                  <div className="absolute left-3 bottom-2.5 flex gap-1.5 z-10 touch-manipulation">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRefresh}
                      title="Refresh chat"
                      className="h-8 w-8 hover:bg-secondary/80 rounded-lg touch-manipulation"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleOpenContactForm}
                      title="Send a message"
                      className="h-8 w-8 hover:bg-secondary/80 rounded-lg touch-manipulation"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Right side - Send Button - Bottom line of input area */}
                  <div className="absolute right-3 bottom-2.5 z-10 touch-manipulation">
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-accent hover:bg-accent/90 shrink-0 h-8 w-8 rounded-lg touch-manipulation"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
