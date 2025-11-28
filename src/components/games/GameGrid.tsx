import { motion } from 'framer-motion';
import { GameCard } from './GameCard';
import { gamesData } from '@/data/gamesData';
import { Sparkles, Gamepad2 } from 'lucide-react';

interface GameGridProps {
  onPlayGame: (gameId: string) => void;
}

export const GameGrid = ({ onPlayGame }: GameGridProps) => {
  return (
    <div className="w-full min-h-full relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

      <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pt-12 md:pt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 mb-4">
            <Gamepad2 className="w-4 h-4" />
            <span className="text-sm font-medium">Arcade Zone</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/40 bg-clip-text text-transparent">
              Interactive Games
            </span>
          </h1>

          <p className="text-base md:text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed font-light px-4">
            Challenge your mind with our collection of developer-focused mini-games.
            <br className="hidden md:block" />
            Test your memory, speed, and coding knowledge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8 perspective-1000">
          {gamesData.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 100
              }}
              className="h-full"
            >
              <GameCard game={game} onPlay={onPlayGame} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 md:mt-20 pb-10"
        >
          <div className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground/60 uppercase tracking-widest font-medium px-6 py-3 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-border/50">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>More challenges coming soon</span>
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
