import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Download, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CollapsibleSidebar } from '@/components/CollapsibleSidebar';
import { ChatMessage } from '@/components/ChatMessage';
import { TypingIndicator } from '@/components/TypingIndicator';
import { SuggestionChips } from '@/components/SuggestionChips';
import { MobileHeader } from '@/components/MobileHeader';
import { Message } from '@/types/portfolio';
import { generateResponse } from '@/utils/chatResponses';
import { portfolioData } from '@/data/portfolioData';
import { toast } from 'sonner';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: '0',
      role: 'assistant',
      content: `🤖 *Hi! I'm ${portfolioData.name}'s AI Portfolio Assistant!*\n\nI'm here to help you explore:\n\n┌─ 🚀 **Projects** - 3 real applications\n│  • Personal Tracker, Finance Calculator\n│  • Product discovery platform\n└─ Click "Projects" in sidebar\n\n┌─ 🎓 **Education** - Academic journey\n│  • B.Tech Computer Science\n│  • Salesforce & AWS certifications from Aicte\n└─ Click "Experience" in sidebar\n\n┌─ 🛠️ **Skills** - Technical expertise\n│  • Full-stack development\n│  • Ask For Skills in chat \n└─ Click "Skills" in sidebar\n\n💡 *Try: "Tell me about your projects" or "Show me your experience"*`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (text?: string, projectId?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText && !projectId) return;

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

  const handleDownloadResume = () => {
    window.open('https://drive.google.com/file/d/1ts6WNTgkD4t6cEjkLE7dRmGEU8NvxCYf/view?usp=drive_link', '_blank');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <MobileHeader onNavigate={handleNavigate} />
      <CollapsibleSidebar onNavigate={handleNavigate} />

      <main className="flex-1 flex flex-col pt-14 md:pt-0">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="hidden md:flex border-b border-border px-6 py-4 items-center justify-between bg-sidebar"
        >
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent animate-pulse-glow" />
              {portfolioData.name}
            </h1>
            <p className="text-sm text-muted-foreground">{portfolioData.title}</p>
          </div>
          <Button
            onClick={handleDownloadResume}
            className="bg-accent hover:bg-accent/90"
          >
            <Download className="mr-2 h-4 w-4" />
            View Resume
          </Button>
        </motion.header>

        {/* Chat Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4"
        >
          <div className="max-w-5xl mx-auto">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-t border-border p-4 md:p-6 bg-sidebar"
        >
          <div className="max-w-5xl mx-auto space-y-4">
            {messages.length <= 1 && <SuggestionChips onSelect={handleSuggestionClick} />}
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearChat}
                title="Clear chat"
                className="hover:bg-secondary"
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
                className="bg-accent hover:bg-accent/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Built with React, Tailwind & Framer Motion | Click sidebar items for quick navigation
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
