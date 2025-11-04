import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dices } from 'lucide-react';

export const DiceRoll = () => {
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    setIsRolling(true);
    setResult(null);
    
    // Simulate rolling animation
    setTimeout(() => {
      const diceResult = Math.floor(Math.random() * 6) + 1;
      setResult(diceResult);
      setIsRolling(false);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-2">
        <Dices className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold">Roll a Dice</h3>
      </div>
      
      <div className="relative w-24 h-24 flex items-center justify-center bg-secondary rounded-lg border-2 border-border">
        {isRolling ? (
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-4xl"
          >
            🎲
          </motion.div>
        ) : result ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold text-accent"
          >
            {result}
          </motion.div>
        ) : (
          <span className="text-4xl">🎲</span>
        )}
      </div>

      <Button
        onClick={rollDice}
        disabled={isRolling}
        className="bg-accent hover:bg-accent/90"
      >
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </Button>

      {result && !isRolling && (
        <p className="text-sm text-muted-foreground">
          You rolled: <span className="font-bold text-accent">{result}</span>
        </p>
      )}
    </div>
  );
};

