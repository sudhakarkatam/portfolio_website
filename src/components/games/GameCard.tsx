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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                <IconComponent className="h-6 w-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {game.title}
                </CardTitle>
                <Badge 
                  variant={game.category === 'educational' ? 'default' : 'secondary'}
                  className="text-xs mt-1"
                >
                  {game.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {game.description}
          </CardDescription>
          <Button 
            onClick={() => onPlay(game.id)}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Play className="w-4 h-4 mr-2" />
            Play Game
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
