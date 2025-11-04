import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';

export const CoinToss = () => {
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const tossCoin = () => {
    setIsFlipping(true);
    setResult(null);
    
    // Simulate flipping animation
    setTimeout(() => {
      const coinResult = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(coinResult);
      setIsFlipping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-2">
        <Coins className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold">Toss a Coin</h3>
      </div>
      
      <div className="relative w-24 h-24 flex items-center justify-center">
        {isFlipping ? (
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 0.3, repeat: Infinity }}
            className="text-5xl"
          >
            🪙
          </motion.div>
        ) : result ? (
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            className="text-5xl"
          >
            {result === 'heads' ? '🪙' : '🪙'}
          </motion.div>
        ) : (
          <span className="text-5xl">🪙</span>
        )}
      </div>

      <Button
        onClick={tossCoin}
        disabled={isFlipping}
        className="bg-accent hover:bg-accent/90"
      >
        {isFlipping ? 'Flipping...' : 'Toss Coin'}
      </Button>

      {result && !isFlipping && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Result: <span className="font-bold text-accent capitalize text-lg">{result === 'heads' ? 'Heads' : 'Tails'}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {result === 'heads' ? '🪙 Heads!' : '🪙 Tails!'}
          </p>
        </div>
      )}
    </div>
  );
};

