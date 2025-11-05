import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, RefreshCw, Menu, Home, ArrowUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CollapsibleSidebar } from "@/components/CollapsibleSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { TypingIndicator } from "@/components/TypingIndicator";
import { SuggestionChips } from "@/components/SuggestionChips";
import { FloatingParticles } from "@/components/FloatingParticles";
import { GameGrid } from "@/components/games/GameGrid";
import { TicTacToe } from "@/components/games/TicTacToe";
import { MemoryMatch } from "@/components/games/MemoryMatch";
import { TypingSpeed } from "@/components/games/TypingSpeed";
import { CodeQuiz } from "@/components/games/CodeQuiz";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Message } from "@/types/portfolio";
import { generateResponse } from "@/utils/chatResponses";
import { generateGeminiResponse } from "@/utils/geminiService";
import { generateOpenRouterResponse } from "@/utils/openRouterService";
import { portfolioData } from "@/data/portfolioData";
import { toast } from "sonner";
import { ModelSelector, AVAILABLE_MODELS } from "@/components/ModelSelector";
import { ContactForm } from "@/components/ContactForm";
import { DiceRoll } from "@/components/chatGames/DiceRoll";
import { CoinToss } from "@/components/chatGames/CoinToss";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const [sidebarKey, setSidebarKey] = useState(0);
  const [selectedModel, setSelectedModel] = useState("normal");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    // Only add user message if there's actual text (not sidebar project clicks)
    if (messageText) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: messageText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
    }

    setInputValue("");
    setIsTyping(true);
    setStreamingMessageId(null);

    // AI Mode: Use Gemini API
    const isAIModeEnabled = selectedModel !== "normal";
    if (isAIModeEnabled && messageText) {
      try {
        // Build conversation history for context
        const conversationHistory = messages
          .filter((msg) => msg.role === "user" || msg.role === "assistant")
          .slice(-10) // Last 10 messages for context
          .map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content || "",
          }));

        const selectedModelOption = AVAILABLE_MODELS.find(
          (m) => m.id === selectedModel,
        );
        const modelName = selectedModelOption?.model || "";
        const apiVersion = selectedModelOption?.apiVersion || "";
        const provider = selectedModelOption?.provider || "gemini";

        // Call appropriate API based on provider
        let aiResponse: string;
        if (provider === "openrouter") {
          aiResponse = await generateOpenRouterResponse(
            messageText,
            conversationHistory,
            modelName,
          );
        } else {
          aiResponse = await generateGeminiResponse(
            messageText,
            conversationHistory,
            modelName,
            apiVersion,
          );
        }

        // Stream the AI response word by word
        const words = aiResponse.split(" ");
        let wordIndex = 0;
        const streamingId = "streaming-" + Date.now();

        // Create initial streaming message
        const streamingMessage: Message = {
          id: streamingId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, streamingMessage]);
        setIsTyping(false);
        setStreamingMessageId(streamingId);

        // Check if this is a "send message" query (different from "contact")
        const isSendMessageQuery =
          messageText.toLowerCase().includes("send message") ||
          messageText.toLowerCase().includes("send a message");

        // Check if this is a general contact query (email, contact, reach, connect)
        const isContactQuery =
          !isSendMessageQuery &&
          (messageText.toLowerCase().includes("contact") ||
            messageText.toLowerCase().includes("email") ||
            messageText.toLowerCase().includes("reach") ||
            messageText.toLowerCase().includes("connect"));

        // Check for chat games (dice roll and coin toss) - be more specific
        const lowerQuery = messageText.toLowerCase();
        const isDiceRollQuery =
          lowerQuery.includes("roll dice") ||
          lowerQuery.includes("roll a dice") ||
          (lowerQuery.includes("dice") &&
            (lowerQuery.includes("roll") || lowerQuery.includes("throw")));

        const isCoinTossQuery =
          lowerQuery.includes("toss coin") ||
          lowerQuery.includes("toss a coin") ||
          lowerQuery.includes("flip coin") ||
          lowerQuery.includes("flip a coin") ||
          (lowerQuery.includes("coin") &&
            (lowerQuery.includes("toss") || lowerQuery.includes("flip")));

        const streamInterval = setInterval(() => {
          if (wordIndex < words.length) {
            const currentText = words.slice(0, wordIndex + 1).join(" ");

            // Update streaming message in array
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === streamingId ? { ...msg, content: currentText } : msg,
              ),
            );
            wordIndex++;
          } else {
            clearInterval(streamInterval);
            setStreamingMessageId(null);

            // If it's a "send message" query, always show the ContactForm component
            if (isSendMessageQuery) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === streamingId
                    ? { ...msg, component: <ContactForm /> }
                    : msg,
                ),
              );
            }

            // If it's a dice roll query, show the DiceRoll component
            if (isDiceRollQuery && !isCoinTossQuery) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === streamingId
                    ? { ...msg, component: <DiceRoll /> }
                    : msg,
                ),
              );
            }

            // If it's a coin toss query, show the CoinToss component
            if (isCoinTossQuery && !isDiceRollQuery) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === streamingId
                    ? { ...msg, component: <CoinToss /> }
                    : msg,
                ),
              );
            }

            // For contact queries, AI will show the contact format in the response text
            // No component needed as AI provides the full contact information
            // For general contact queries, only show form if user asks for it in the response
            // (AI will suggest it in the text, so we don't auto-show it)
          }
        }, 30); // Slightly faster for AI responses
      } catch (error) {
        console.error("Error generating AI response:", error);
        setIsTyping(false);
        setStreamingMessageId(null);

        // Better error messages with suggestions
        let errorContent =
          "Sorry, I encountered an error while generating a response.\n\n**What you can do:**\n- Try again in a few moments\n- Switch to **Normal Mode** (using the model selector)\n- Try a different AI model";

        if (error instanceof Error) {
          if (
            error.message.includes("503") ||
            error.message.includes("overloaded")
          ) {
            errorContent =
              "The AI model is currently overloaded. Please try again in a few moments.\n\n**What you can do:**\n- Wait a moment and try again\n- Switch to **Normal Mode** (more reliable)\n- Try a different AI model from the dropdown";
          } else if (
            error.message.includes("401") ||
            error.message.includes("API key")
          ) {
            errorContent =
              "There's an issue with the API configuration. Please check your API key settings.\n\n**What you can do:**\n- Switch to **Normal Mode** (doesn't require API keys)\n- Check your API key configuration in environment variables";
          } else if (
            error.message.includes("429") ||
            error.message.includes("rate limit")
          ) {
            errorContent =
              "Rate limit exceeded. The free tier has usage limits.\n\n**What you can do:**\n- Wait a few seconds and try again\n- Switch to **Normal Mode** (no rate limits)\n- Try a different AI model from the dropdown";
          } else {
            errorContent = `Sorry, I encountered an error: ${error.message}\n\n**What you can do:**\n- Try again in a few moments\n- Switch to **Normal Mode** (more reliable)\n- Try a different AI model`;
          }
        }

        const errorMessage: Message = {
          id: "error-" + Date.now(),
          role: "assistant",
          content: errorContent,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);

        // Show appropriate toast based on error type
        if (
          error instanceof Error &&
          (error.message.includes("503") ||
            error.message.includes("overloaded"))
        ) {
          toast.error(
            "Model is overloaded. Please try again in a few moments.",
          );
        } else {
          toast.error("Failed to generate AI response. Please try again.");
        }
      }
      return;
    }

    // Normal Mode: Use existing response system
    // Simulate AI thinking delay (more realistic)
    const thinkingDelay = 500 + Math.random() * 500;

    setTimeout(() => {
      const response = generateResponse(messageText, projectId, handleNavigate);
      const responseText = response.text || "";

      // Skip streaming if there's no text response (sidebar project clicks)
      if (!responseText && projectId) {
        // Directly add the component without streaming
        const directMessage: Message = {
          id: "direct-" + Date.now(),
          role: "assistant",
          content: "",
          component: response.component,
          suggestions: response.suggestions,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, directMessage]);
        setIsTyping(false);
        setStreamingMessageId(null);
        return;
      }

      // Stream the response word by word
      const words = responseText.split(" ");
      let wordIndex = 0;
      const streamingId = "streaming-" + Date.now();

      // Create initial streaming message
      const streamingMessage: Message = {
        id: streamingId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, streamingMessage]);
      setIsTyping(false);
      setStreamingMessageId(streamingId);

      const streamInterval = setInterval(() => {
        if (wordIndex < words.length) {
          const currentText = words.slice(0, wordIndex + 1).join(" ");

          // Update streaming message in array
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingId ? { ...msg, content: currentText } : msg,
            ),
          );
          wordIndex++;
        } else {
          clearInterval(streamInterval);

          // Final message with component and suggestions - replace streaming message
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id === streamingId) {
                return {
                  ...msg,
                  content: responseText,
                  component: response.component,
                  suggestions: response.suggestions,
                };
              }
              return msg;
            }),
          );
          setStreamingMessageId(null);
        }
      }, 40); // Streaming speed (lower = faster)
    }, thinkingDelay);
  };

  const handleSuggestionClick = (query: string) => {
    handleSendMessage(query);
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
      projects: "Show me your projects",
      experience: "What is your work experience?",
      project: "", // Empty for sidebar project clicks - show mini details
      "project-grid": "Tell me more about this project", // Chat grid clicks - show full details
    };

    if (section === "project" && projectId) {
      // Sidebar click - mini details
      handleSendMessage(queries[section], projectId);
    } else if (section === "project-grid" && projectId) {
      // Chat grid click - full details
      handleSendMessage(queries[section], projectId);
    } else {
      handleSendMessage(queries[section]);
    }
  };

  const handleRefresh = () => {
    setMessages([]);
    setIsChatExpanded(false);
    setInputValue("");
    setCurrentView("home");
    setSelectedGame(null);
    setSidebarKey((prev) => prev + 1); // Force sidebar to remount and reset to collapsed
    toast.success("Chat refreshed");
  };

  const handleClearChat = () => {
    setMessages([]);
    setIsChatExpanded(false);
    setInputValue("");
    toast.success("Chat cleared successfully");
  };

  const handleOpenContactForm = () => {
    // Open contact form in chat instead of popup
    handleSendMessage("send message");
  };

  const handleGoHome = () => {
    setMessages([]);
    setIsChatExpanded(false);
    setInputValue("");
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

      <main className="flex-1 relative flex flex-col">
        {/* Chat Messages Area - Scrollable above input when expanded */}
        {isChatExpanded && (
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-3 md:px-5 lg:px-7 py-4 md:py-7 min-h-0"
          >
            <div className="max-w-5xl mx-auto w-full space-y-4 md:space-y-5 pb-8">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isStreaming={message.id === streamingMessageId}
                  streamingText={
                    message.id === streamingMessageId
                      ? message.content
                      : undefined
                  }
                  onSuggestionClick={handleSuggestionClick}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Games View */}
        {currentView === "games" && !isChatExpanded && (
          <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto">
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
          </div>
        )}

        {/* Welcome Content Area */}
        {currentView === "home" && !isChatExpanded && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center space-y-5 md:space-y-7 lg:space-y-9 w-full max-w-4xl px-4 md:px-6 lg:px-8"
            >
              {/* Keep Smiling Text */}
              <div className="space-y-3 md:space-y-5 lg:space-y-6 overflow-visible">
                <motion.h1
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent leading-tight lg:scale-[0.7] break-words overflow-visible"
                >
                  Keep Smiling{" "}
                  <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"></span>
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
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          handleSendMessage()
                        }
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
                      </div>

                      {/* Right side - Model Selector and Send Button - Bottom line of input area */}
                      <div className="absolute right-3 bottom-3 flex items-center gap-2 z-10">
                        <ModelSelector
                          selectedModel={selectedModel}
                          onModelChange={setSelectedModel}
                        />
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
          <div className="flex-shrink-0 p-3 md:p-5 lg:p-7 bg-sidebar/95 backdrop-blur-sm border-t border-border z-10">
            <div className="max-w-5xl mx-auto px-1">
              <div className="flex gap-3 md:gap-4">
                <div className="relative flex-1">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSendMessage()
                    }
                    placeholder="Ask about my skills, projects, or experience..."
                    className="flex-1 bg-input border-border focus:ring-accent text-sm md:text-base h-9 md:h-10 lg:h-11 min-h-[40px] touch-manipulation"
                  />
                </div>
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
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
                    onKeyPress={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSendMessage()
                    }
                    placeholder="Ask about my skills, projects, or experience..."
                    className="flex-1 bg-input border-0 focus:ring-0 text-base h-24 min-h-[96px] pr-24 pl-4 touch-manipulation placeholder:text-muted-foreground/60 rounded-xl text-left"
                    style={{
                      paddingTop: "0.5rem",
                      paddingBottom: "4rem",
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
    </div>
  );
};

export default Index;
