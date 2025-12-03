import { motion } from 'framer-motion';
import { Sparkles, Brain } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const ThinkingIndicator = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-4 gap-3"
        >
            {/* AI Avatar with pulsing glow */}
            <div className="relative">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
                <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-accent/30 shadow-glow relative z-10">
                    <AvatarImage src="/profile_image.jpeg" alt="AI" className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-accent to-accent/60 text-primary-foreground">
                        <Sparkles className="h-4 w-4 md:h-5 md:w-5 animate-pulse" />
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-secondary/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm">
                <div className="relative flex items-center justify-center w-6 h-6">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-accent/30 border-t-accent rounded-full"
                    />
                    <Brain className="w-3 h-3 text-accent" />
                </div>
                <span className="text-sm font-medium bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent animate-pulse">
                    Thinking...
                </span>
            </div>
        </motion.div>
    );
};
