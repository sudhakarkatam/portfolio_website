import { motion } from 'framer-motion';
import { GameCard } from './GameCard';
import { gamesData } from '@/data/gamesData';
import { Game } from '@/types/portfolio';

interface GameGridProps {
  onPlayGame: (gameId: string) => void;
}

export const GameGrid = ({ onPlayGame }: GameGridProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-foreground mb-4">Interactive Games</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Take a break and enjoy some fun games! Mix of entertainment and educational games to challenge your skills.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {gamesData.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GameCard game={game} onPlay={onPlayGame} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-12"
      >
        <p className="text-sm text-muted-foreground">
          More games coming soon! 🎮
        </p>
      </motion.div>
    </div>
  );
};
