import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Game } from '@/types/portfolio';
import { Grid3X3, Brain, Keyboard, Code, Play } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onPlay: (gameId: string) => void;
}

const iconMap = {
  Grid3X3: Grid3X3,
  Brain: Brain,
  Keyboard: Keyboard,
  Code: Code,
};

export const GameCard = ({ game, onPlay }: GameCardProps) => {
  const IconComponent = iconMap[game.icon as keyof typeof iconMap] || Play;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card className="group relative overflow-hidden bg-white/5 backdrop-blur-md border-white/10 hover:border-accent/50 transition-all duration-500 h-full flex flex-col">
        {/* Gradient Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/10 group-hover:border-accent/30 transition-all duration-300 shadow-inner">
                <IconComponent className="h-6 w-6 text-accent group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-accent group-hover:to-accent/70 transition-all duration-300">
                  {game.title}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="text-xs mt-1.5 border-accent/20 text-accent/80 bg-accent/5"
                >
                  {game.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2 relative z-10 flex flex-col flex-1">
          <CardDescription className="text-sm text-muted-foreground/80 mb-6 leading-relaxed flex-1">
            {game.description}
          </CardDescription>
          <Button
            onClick={() => onPlay(game.id)}
            className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all duration-300 group-hover:translate-y-[-2px]"
          >
            <Play className="w-4 h-4 mr-2 fill-current" />
            Play Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
