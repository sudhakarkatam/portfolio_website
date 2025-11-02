import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-4 gap-3"
    >
      {/* AI Avatar */}
      <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-accent/30 shadow-glow animate-pulse-glow">
        <AvatarFallback className="bg-gradient-to-br from-accent to-accent/60 text-primary-foreground">
          <Sparkles className="h-4 w-4 md:h-5 md:w-5 animate-pulse" />
        </AvatarFallback>
      </Avatar>
      
      <div className="chat-bubble-assistant rounded-2xl px-4 py-3 shadow-md">
        <div className="flex gap-1.5 md:gap-2 items-center">
          <span className="text-xs text-muted-foreground mr-2">Thinking</span>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 md:w-3 md:h-3 bg-accent rounded-full"
              animate={{ 
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
