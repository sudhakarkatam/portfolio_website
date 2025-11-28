import { useState, useRef, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  RefreshCw,
  Menu,
  Home,
  ArrowUp,
  Eye,
  Mic,
  MicOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CollapsibleSidebar } from "@/components/CollapsibleSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ThinkingIndicator } from "@/components/ThinkingIndicator";
import { SuggestionChips } from "@/components/SuggestionChips";
import { FloatingParticles } from "@/components/FloatingParticles";
import { GameGrid } from "@/components/games/GameGrid";
import { TicTacToe } from "@/components/games/TicTacToe";
import { MemoryMatch } from "@/components/games/MemoryMatch";
import { TypingSpeed } from "@/components/games/TypingSpeed";
import { CodeQuiz } from "@/components/games/CodeQuiz";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Message } from "@/types/portfolio";
import { portfolioData } from "@/data/portfolioData";
import { toast } from "sonner";
import { ModelSelector, AVAILABLE_MODELS } from "@/components/ModelSelector";
import { ContactForm } from "@/components/ContactForm";
import { DiceRoll } from "@/components/chatGames/DiceRoll";
import { CoinToss } from "@/components/chatGames/CoinToss";
import { Guestbook } from "@/components/Guestbook";
import { generateResponse } from "@/utils/chatResponses";

const Index = () => {
  const [selectedModel, setSelectedModel] = useState("normal");

  const apiEndpoint = useMemo(() => {
    const model = AVAILABLE_MODELS.find((m) => m.id === selectedModel);
    return model?.provider === "openrouter" ? "/api/openrouter" : "/api/gemini";
  }, [selectedModel]);

  const {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    append,
    setInput,
  } = useChat({
    api: apiEndpoint,
    body: {
      model:
        AVAILABLE_MODELS.find((m) => m.id === selectedModel)?.model ||
        "gemini-2.5-flash",
    },
    onError: (error) => {
      console.error("❌ Chat Error:", error);
      // Handle different error response formats
      let errorMessage = "Failed to generate response";

      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast.error(errorMessage, {
        duration: 8000, // Show for 8 seconds for rate limit messages
      });

      // Append error message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `⚠️ **Error**: ${errorMessage}\n\n👉 *Suggestion*: Please try selecting a different model from the dropdown menu above.`,
        },
      ]);
    },
  });

  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [sidebarKey, setSidebarKey] = useState(0);
  const [localComponents, setLocalComponents] = useState<
    Record<string, React.ReactNode>
  >({});
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const toggleListening = () => {
    if (isListening) {
      window.speechSynthesis.cancel(); // Stop speaking if active
      setIsListening(false);
      // Stop & Send Logic: If we have input, send it immediately
      if (input.trim()) {
        handleSendMessage();
      }
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening until user stops
    recognition.interimResults = true; // Show results while speaking
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening... Click mic again to send.");
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join("");

      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      toast.error("Voice input failed. Please try again.");
    };

    recognition.onend = () => {
      // Do not auto-stop state here to allow manual control,
      // unless it stopped due to error or external factor.
      // But for "Stop & Send", we want the button to control the flow.
      // If recognition stops naturally (silence), we might want to keep isListening true
      // until user clicks stop, OR we can just let it be.
      // For simplicity and "Stop & Send" reliability, let's sync state.
      if (isListening) {
        // If it stopped but we didn't click stop (e.g. silence timeout),
        // we should probably just let the user click send or mic again.
        // But to be safe, let's update state.
        setIsListening(false);
      }
    };

    // Store recognition instance to stop it later if needed (optional, but good for cleanup)
    // For now, we rely on the fact that calling start() again throws if active,
    // but we handle isListening check above.
    // To truly stop *this* instance, we might need a ref.
    // But standard browser behavior usually allows new start after stop.

    recognition.start();

    // Hack: Store recognition in a ref if we wanted to call .stop() explicitly
    // instead of just relying on isListening toggle.
    // But for this simple implementation, relying on the toggle to trigger handleSendMessage
    // and letting the browser cleanup the old session is usually fine.
    // However, to be cleaner:
    (window as any).currentRecognition = recognition;
  };

  // Enrich messages with components and suggestions based on content
  const messages = useMemo(() => {
    return aiMessages.map((msg) => {
      const lowerContent = msg.content.toLowerCase();
      // Check local components first, then fall back to content-based detection
      let component: React.ReactNode | undefined = localComponents[msg.id];
      let suggestions: string[] | undefined;

      // Contact Form Detection
      const isContactFormQuery =
        lowerContent.includes("contact form") ||
        lowerContent.includes("message form") ||
        lowerContent.includes("send message") ||
        lowerContent.includes("send you a message") ||
        (lowerContent.includes("form") && lowerContent.includes("contact"));

      if (isContactFormQuery && msg.role === "assistant") {
        component = <ContactForm />;
      }

      // Game Components Detection
      const isDiceRoll =
        lowerContent.includes("roll") && lowerContent.includes("dice");
      const isCoinToss =
        (lowerContent.includes("toss") || lowerContent.includes("flip")) &&
        lowerContent.includes("coin");

      if (isDiceRoll && msg.role === "assistant") component = <DiceRoll />;
      if (isCoinToss && msg.role === "assistant") component = <CoinToss />;

      // Map to our Message type
      return {
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: msg.createdAt || new Date(),
        component,
        suggestions,
        toolInvocations: msg.toolInvocations,
      } as Message;
    });
  }, [aiMessages, localComponents]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text?: string, projectId?: string) => {
    const messageText = text || input.trim();
    if (!messageText && !projectId) return;

    // Stop listening if active
    if (isListening) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition && (window as any).currentRecognition) {
        try {
          (window as any).currentRecognition.stop();
        } catch (e) {
          // Ignore error if already stopped
        }
      }
      setIsListening(false);
    }

    // Expand chat on first user interaction
    if (messages.length <= 1) {
      setIsChatExpanded(true);
    }

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: messageText,
      createdAt: new Date(),
    };

    // If Normal Mode, handle locally
    if (selectedModel === "normal") {
      setInput(""); // Clear input immediately

      // Add user message to state
      setMessages((prev) => [...prev, userMsg]);

      // Simulate small delay for natural feel
      setTimeout(() => {
        const response = generateResponse(
          messageText,
          projectId,
          handleNavigate,
        );
        const assistantMsgId = (Date.now() + 1).toString();

        // Store component if present
        if (response.component) {
          setLocalComponents((prev) => ({
            ...prev,
            [assistantMsgId]: response.component,
          }));
        }

        const assistantMsg = {
          id: assistantMsgId,
          role: "assistant" as const,
          content: response.text || "",
          createdAt: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      }, 500);
      return;
    }

    // If text is provided (e.g. from chips), use append
    const currentModel =
      AVAILABLE_MODELS.find((m) => m.id === selectedModel)?.model ||
      "gemini-2.5-flash";

    if (text) {
      setInput(""); // Clear input when sending via button
      await append(
        {
          role: "user",
          content: text,
        },
        {
          body: { model: currentModel },
        },
      );
    } else {
      await append(
        {
          role: "user",
          content: input,
        },
        {
          body: { model: currentModel },
        },
      );
      setInput(""); // Clear input after append
    }
  };

  const handleSuggestionClick = (query: string) => {
    handleSendMessage(query);
  };

  const handleLinkClick = (href: string) => {
    // Remove the '#' prefix
    const section = href.replace(/^#/, "");
    handleNavigate(section);
  };

  const handleNavigate = (section: string, projectId?: string) => {
    if (section === "games") {
      setCurrentView("games");
      setSelectedGame(null); // Reset to grid view
      setIsChatExpanded(false);
      return;
    }

    if (section === "home") {
      setCurrentView("home");
      setSelectedGame(null);
      setIsChatExpanded(false);
      return;
    }

    // For all other sections (about, skills, projects, experience), switch to home view and start chat
    setCurrentView("home");
    setSelectedGame(null);
    setIsChatExpanded(true); // Expand chat to show the response

    const queries: Record<string, string> = {
      about: "Tell me about yourself",
      skills: "What are your technical skills?",
      projects: "View All Projects",
      experience: "What is your work experience?",
      project: "", // Empty for sidebar project clicks - show mini details
      "project-grid": "Tell me more about this project", // Chat grid clicks - show full details
    };

    if (section === "project" && projectId) {
      // Sidebar click - specific project query
      const project = portfolioData.projects.find((p) => p.id === projectId);
      if (project) {
        handleSendMessage(`Tell me about the project "${project.title}"`);
      }
    } else if (section === "project-grid" && projectId) {
      // Chat grid click - full details
      const project = portfolioData.projects.find((p) => p.id === projectId);
      if (project) {
        handleSendMessage(`Tell me more about "${project.title}"`);
      }
    } else {
      // If the section is a known key, use the mapped query
      // Otherwise, treat the section itself as the query (replace hyphens with spaces)
      const query = queries[section] || section.replace(/-/g, " ");
      handleSendMessage(query);
    }
  };

  const handleRefresh = () => {
    setMessages([]);
    setIsChatExpanded(false);
    setInput("");
    setCurrentView("home");
    setSelectedGame(null);
    setSidebarKey((prev) => prev + 1); // Force sidebar to remount and reset to collapsed
    toast.success("Chat refreshed");
  };

  const handleClearChat = () => {
    setMessages([]);
    setIsChatExpanded(false);
    setInput("");
    toast.success("Chat cleared successfully");
  };

  const handleOpenContactForm = () => {
    // Open contact form in chat instead of popup
    handleSendMessage("send message");
  };

  const handleGoHome = () => {
    setMessages([]);
    setIsChatExpanded(false);
    setInput("");
    setIsMobileSidebarOpen(false);
    setCurrentView("home");
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
      <div className="hidden md:block" key={sidebarKey}>
        <CollapsibleSidebar
          onNavigate={handleNavigate}
          onGoHome={handleGoHome}
          isMobile={false}
        />
      </div>

      {/* Theme Toggle and Portfolio Button - Top Right Corner - Only on home page when chat is not expanded */}
      {currentView === "home" && !isChatExpanded && (
        <div className="fixed top-3 right-3 md:top-5 md:right-5 z-50 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open("/portfolio", "_self")}
            className="w-10 h-10"
            title="View Portfolio"
          >
            <Eye className="h-4 w-4" />
          </Button>
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
      <div
        className={`
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        fixed z-[60] transition-transform duration-300 h-full w-80 sm:w-96 bg-sidebar border-r border-border shadow-xl
      `}
        key={`mobile-${sidebarKey}`}
      >
        <CollapsibleSidebar
          onNavigate={handleNavigate}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
          onGoHome={handleGoHome}
          isMobile={true}
        />
      </div>

      <main className="flex-1 relative flex flex-col overflow-hidden">
        <AnimatePresence mode="popLayout">
          {/* Chat Messages Area - Scrollable above input when expanded */}
          {isChatExpanded && (
            <motion.div
              key="chat-expanded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 flex flex-col min-h-0"
            >
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto px-3 md:px-5 lg:px-7 py-4 md:py-7 min-h-0 scroll-smooth"
              >
                <div className="max-w-5xl mx-auto w-full space-y-4 md:space-y-5 pb-8">
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isStreaming={
                        isLoading &&
                        index === messages.length - 1 &&
                        message.role === "assistant"
                      }
                      onSuggestionClick={handleSuggestionClick}
                      onLinkClick={handleLinkClick}
                    />
                  ))}
                  {isLoading && <ThinkingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Games View */}
          {currentView === "games" && !isChatExpanded && (
            <motion.div
              key="games-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto"
            >
              {selectedGame ? (
                <>
                  {selectedGame === "tic-tac-toe" && (
                    <TicTacToe onBack={handleBackToGames} />
                  )}
                  {selectedGame === "memory-match" && (
                    <MemoryMatch onBack={handleBackToGames} />
                  )}
                  {selectedGame === "typing-speed" && (
                    <TypingSpeed onBack={handleBackToGames} />
                  )}
                  {selectedGame === "code-quiz" && (
                    <CodeQuiz onBack={handleBackToGames} />
                  )}
                </>
              ) : (
                <GameGrid onPlayGame={handlePlayGame} />
              )}
            </motion.div>
          )}

          {/* Welcome Content Area */}
          {currentView === "home" && !isChatExpanded && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4 md:p-6 overflow-y-auto"
            >
              <div className="text-center space-y-5 md:space-y-7 lg:space-y-9 w-full max-w-4xl px-4 md:px-6 lg:px-8 pb-32 md:pb-0">
                {/* Keep Smiling Text */}
                <div className="space-y-3 md:space-y-5 lg:space-y-6 overflow-visible">
                  <motion.h1
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent leading-tight lg:scale-[0.7] break-words overflow-visible"
                  >
                    Keep Smiling{" "}
                    <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"></span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-lg md:text-xl lg:text-2xl text-muted-foreground px-2"
                  >
                    We are what we repeatedly do
                  </motion.p>
                </div>

                {/* Input Box - Claude-style layout (Desktop Only) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="hidden md:flex justify-center pt-3"
                >
                  <div className="w-full max-w-3xl mx-auto px-2">
                    {/* Main Input Box Container - Icons inside input area */}
                    <div className="relative bg-sidebar/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg transition-all hover:shadow-xl hover:border-accent/20">
                      {/* Input Field with absolute positioned icons */}
                      <div className="relative flex items-start">
                        <Input
                          value={input}
                          onChange={handleInputChange}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder="Ask about my skills, projects, or experience..."
                          className="flex-1 bg-input border-0 focus:ring-0 text-base md:text-lg h-20 md:h-24 lg:h-28 min-h-[80px] pr-28 pl-4 touch-manipulation placeholder:text-muted-foreground/60 rounded-xl text-left"
                          style={{
                            paddingTop: "0.5rem",
                            paddingBottom: "3rem",
                            lineHeight: "1.2",
                          }}
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleListening}
                            title={
                              isListening ? "Stop listening" : "Voice input"
                            }
                            className={`h-8 w-8 md:h-9 md:w-9 hover:bg-secondary/80 rounded-lg ${isListening ? "text-red-500 animate-pulse" : ""}`}
                          >
                            {isListening ? (
                              <MicOff className="h-4 w-4 md:h-4 md:w-4" />
                            ) : (
                              <Mic className="h-4 w-4 md:h-4 md:w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Right side - Model Selector and Send Button - Bottom line of input area */}
                        <div className="absolute right-3 bottom-3 flex items-center gap-2 z-10">
                          <ModelSelector
                            selectedModel={selectedModel}
                            onModelChange={setSelectedModel}
                          />
                          <Button
                            onClick={() => handleSendMessage()}
                            disabled={!input.trim() || isLoading}
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
                  className="flex md:hidden flex-wrap gap-3 md:gap-4 justify-center px-1 pb-4"
                >
                  <SuggestionChips onSelect={handleSuggestionClick} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Input Area - Visible when chat is expanded */}
        {isChatExpanded && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-shrink-0 p-3 md:p-5 lg:p-7 bg-sidebar/95 backdrop-blur-sm border-t border-border z-10"
          >
            <div className="max-w-5xl mx-auto px-1">
              <div className="flex gap-3 md:gap-4">
                <div className="relative flex-1">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSendMessage()
                    }
                    placeholder="Ask about my skills, projects, or experience..."
                    className="flex-1 bg-input border-border focus:ring-accent text-sm md:text-base h-9 md:h-10 lg:h-11 min-h-[40px] touch-manipulation"
                    autoFocus
                  />
                </div>
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="bg-accent hover:bg-accent/90 shrink-0 h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 touch-manipulation"
                >
                  <ArrowUp className="h-4 w-4 md:h-4 md:w-4" />
                </Button>
              </div>
              {/* Model Selector - Below input box, right aligned */}
              <div className="flex justify-end mt-2">
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                />
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleListening}
                  title={isListening ? "Stop listening" : "Voice input"}
                  className={`h-7 w-7 md:h-8 md:w-8 hover:bg-secondary/80 ${isListening ? "text-red-500 animate-pulse" : ""}`}
                >
                  {isListening ? (
                    <MicOff className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  ) : (
                    <Mic className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
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
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask about my skills, projects, or experience..."
                    className="flex-1 bg-input border-0 focus:ring-0 text-base h-24 min-h-[96px] pr-24 pl-4 touch-manipulation placeholder:text-muted-foreground/60 rounded-xl text-left"
                    style={{
                      paddingTop: "0.5rem",
                      paddingBottom: "3rem",
                      lineHeight: "1.2",
                    }}
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleListening}
                      title={isListening ? "Stop listening" : "Voice input"}
                      className={`h-8 w-8 hover:bg-secondary/80 rounded-lg touch-manipulation ${isListening ? "text-red-500 animate-pulse" : ""}`}
                    >
                      {isListening ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Right side - Send Button - Bottom line of input area */}
                  <div className="absolute right-3 bottom-2.5 z-10 touch-manipulation">
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!input.trim() || isLoading}
                      className="bg-accent hover:bg-accent/90 shrink-0 h-8 w-8 rounded-lg touch-manipulation"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {/* Model Selector - Below input box, right aligned */}
                <div className="flex justify-end mt-2">
                  <ModelSelector
                    selectedModel={selectedModel}
                    onModelChange={setSelectedModel}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      {/* Guestbook Feature - Only visible on home page when chat is not expanded */}
      {currentView === "home" && !isChatExpanded && <Guestbook />}
    </div>
  );
};

export default Index;
