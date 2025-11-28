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
          <Button variant="ghost" onClick={onBack} className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
          <Button variant="outline" onClick={initializeGame} className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/30">
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>

        <Card className="bg-black/80 border-cyan-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(34,211,238,0.1)]">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              HOLOGRAPHIC MEMORY
            </CardTitle>
            <div className="flex justify-center gap-8 text-sm font-mono mt-4">
              <div className="flex items-center gap-2 text-cyan-400 bg-cyan-950/30 px-4 py-2 rounded-full border border-cyan-500/30">
                <Clock className="w-4 h-4" />
                <span>TIME: {formatTime(time)}</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400 bg-purple-950/30 px-4 py-2 rounded-full border border-purple-500/30">
                <Target className="w-4 h-4" />
                <span>MOVES: {moves}</span>
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
                <div className="text-8xl mb-6 animate-bounce">🎉</div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
                  MISSION ACCOMPLISHED!
                </h3>
                <p className="text-cyan-200/80 font-mono text-lg">
                  Completed in {formatTime(time)} with {moves} moves
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto perspective-1000">
                {cards.map((card) => (
                  <motion.div
                    key={card.id}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                    transition={{ duration: 0.4 }}
                    className="aspect-square relative cursor-pointer"
                    style={{ transformStyle: 'preserve-3d' }}
                    onClick={() => handleCardClick(card.id)}
                  >
                    {/* Front (Hidden initially) */}
                    <div
                      className={`absolute inset-0 rounded-xl flex items-center justify-center text-4xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500/50 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.3)]`}
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      {card.emoji}
                    </div>

                    {/* Back (Visible initially) */}
                    <div
                      className={`absolute inset-0 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 flex items-center justify-center hover:border-cyan-500/50 transition-colors`}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="text-center text-xs text-cyan-500/50 mt-8 font-mono uppercase tracking-widest">
              Initiate Neural Link • Match Patterns
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
