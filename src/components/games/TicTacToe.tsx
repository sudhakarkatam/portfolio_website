import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface TicTacToeProps {
  onBack: () => void;
}

type Player = 'X' | 'O' | null;
type Board = Player[];

export const TicTacToe = ({ onBack }: TicTacToeProps) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [gameOver, setGameOver] = useState(false);

  const checkWinner = (squares: Board): Player => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameOver(true);
    } else if (newBoard.every(square => square !== null)) {
      setGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setGameOver(false);
  };

  const renderSquare = (index: number) => (
    <Button
      key={index}
      variant="outline"
      className="w-20 h-20 text-2xl font-bold hover:bg-accent/10 border-border"
      onClick={() => handleClick(index)}
      disabled={board[index] !== null || gameOver}
    >
      {board[index]}
    </Button>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
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
          <Button variant="outline" onClick={resetGame} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Tic-Tac-Toe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              {winner ? (
                <p className="text-xl font-semibold text-accent">
                  🎉 Player {winner} wins!
                </p>
              ) : gameOver ? (
                <p className="text-xl font-semibold text-muted-foreground">
                  It's a draw! 🤝
                </p>
              ) : (
                <p className="text-lg text-foreground">
                  Current Player: <span className="font-bold text-accent">{currentPlayer}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 justify-center max-w-xs mx-auto">
              {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Click on any empty square to make your move
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
