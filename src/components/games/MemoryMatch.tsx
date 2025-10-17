import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCcw, Clock, Target } from 'lucide-react';

interface MemoryMatchProps {
  onBack: () => void;
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ['🎯', '🚀', '💡', '⭐', '🎨', '🔥', '💎', '🌟'];

export const MemoryMatch = ({ onBack }: MemoryMatchProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  const initializeGame = () => {
    const gameCards: Card[] = [];
    const shuffledEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    
    shuffledEmojis.forEach((emoji, index) => {
      gameCards.push({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      });
    });

    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setGameStarted(false);
    setGameWon(false);
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards.find(c => c.id === firstId);
        const secondCard = cards.find(c => c.id === secondId);

        if (firstCard?.emoji === secondCard?.emoji) {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true, isFlipped: false }
              : c
          ));

          const allMatched = cards.filter(c => c.id !== firstId && c.id !== secondId).every(c => c.isMatched);
          if (allMatched) {
            setGameWon(true);
          }
        } else {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
        }
        
        setFlippedCards([]);
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
          <Button variant="outline" onClick={initializeGame} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            New Game
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Memory Match</CardTitle>
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Time: {formatTime(time)}
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                Moves: {moves}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {gameWon ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-8"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-accent mb-2">Congratulations!</h3>
                <p className="text-muted-foreground">
                  You completed the game in {formatTime(time)} with {moves} moves!
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {cards.map((card) => (
                  <motion.div
                    key={card.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`aspect-square rounded-lg border-2 cursor-pointer flex items-center justify-center text-2xl transition-all duration-300 ${
                      card.isFlipped || card.isMatched
                        ? 'bg-accent/20 border-accent'
                        : 'bg-card border-border hover:border-accent/50'
                    }`}
                    onClick={() => handleCardClick(card.id)}
                  >
                    {card.isFlipped || card.isMatched ? card.emoji : '?'}
                  </motion.div>
                ))}
              </div>
            )}
            
            <div className="text-center text-sm text-muted-foreground mt-6">
              Click on cards to flip them and find matching pairs
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
