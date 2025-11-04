import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCcw, Users, Bot } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TicTacToeProps {
  onBack: () => void;
}

type Player = 'X' | 'O' | null;
type Board = Player[];
type GameMode = 'friend' | 'computer';

export const TicTacToe = ({ onBack }: TicTacToeProps) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [winner, setWinner] = useState<Player>(null);
  const [gameOver, setGameOver] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>(() => 
    Math.random() < 0.5 ? 'X' : 'O' // Random first player
  );
  const [gameMode, setGameMode] = useState<GameMode>('friend'); // Default to friend mode
  const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O'>('X'); // Track which symbol the player is
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const computerMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isComputerThinkingRef = useRef(false);

  const checkWinner = useCallback((squares: Board): Player => {
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
  }, []);

  // Computer move logic (Improved AI - always tries to win, block, or make strategic moves)
  const getComputerMove = useCallback((currentBoard: Board, computerSymbol: 'X' | 'O', playerSymbol: 'X' | 'O'): number => {
    const emptySquares = currentBoard
      .map((square, index) => (square === null ? index : null))
      .filter((index): index is number => index !== null);

    if (emptySquares.length === 0) return -1;

    // 1. Always try to win if possible
    for (const index of emptySquares) {
      const testBoard = [...currentBoard];
      testBoard[index] = computerSymbol;
      if (checkWinner(testBoard) === computerSymbol) {
        return index;
      }
    }

    // 2. Always block player from winning
    for (const index of emptySquares) {
      const testBoard = [...currentBoard];
      testBoard[index] = playerSymbol;
      if (checkWinner(testBoard) === playerSymbol) {
        return index;
      }
    }

    // 3. Strategic moves: Take center if available (best position)
    if (currentBoard[4] === null) {
      return 4;
    }

    // 4. Take a corner if available (good positions)
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => currentBoard[index] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // 5. Take an edge if available
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter(index => currentBoard[index] === null);
    if (availableEdges.length > 0) {
      return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }

    // 6. Fallback to random (shouldn't reach here)
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  }, [checkWinner]);

  const makeMove = (index: number, player: 'X' | 'O') => {
    if (board[index] || gameOver) return false;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameOver(true);
      return true;
    } else if (newBoard.every(square => square !== null)) {
      setGameOver(true);
      return true;
    }
    return false;
  };

  const handleClick = (index: number) => {
    if (board[index] || gameOver || isComputerThinking) return;
    
    // In friend mode, check if it's the right player's turn
    if (gameMode === 'friend') {
      if (board[index] !== null) return;
      const moveMade = makeMove(index, currentPlayer);
      if (!moveMade) {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
      return;
    }
    
    // In computer mode, only allow player to move on their turn
    if (gameMode === 'computer' && currentPlayer !== playerSymbol) return;
    if (board[index] !== null) return;
    
    const moveMade = makeMove(index, playerSymbol);
    if (!moveMade) {
      // Switch to computer's turn (opposite symbol)
      setCurrentPlayer(playerSymbol === 'X' ? 'O' : 'X');
    }
  };

  // Computer's turn - automatically plays after player in computer mode
  useEffect(() => {
    // Clear any existing timeout first
    if (computerMoveTimeoutRef.current) {
      clearTimeout(computerMoveTimeoutRef.current);
      computerMoveTimeoutRef.current = null;
    }

    // Only trigger computer move in computer mode when it's computer's turn
    const computerSymbol = playerSymbol === 'X' ? 'O' : 'X';
    if (gameMode === 'computer' && currentPlayer === computerSymbol && !gameOver && !isComputerThinkingRef.current) {
      isComputerThinkingRef.current = true;
      setIsComputerThinking(true);
      
      // Add a small delay to make it feel more natural
      computerMoveTimeoutRef.current = setTimeout(() => {
        // Read current board state using functional update
        setBoard((currentBoard) => {
          const computerMove = getComputerMove(currentBoard, computerSymbol, playerSymbol);
          if (computerMove >= 0) {
            const newBoard = [...currentBoard];
            newBoard[computerMove] = computerSymbol;
            
            const gameWinner = checkWinner(newBoard);
            if (gameWinner) {
              setWinner(gameWinner);
              setGameOver(true);
            } else if (newBoard.every(square => square !== null)) {
              setGameOver(true);
            } else {
              setCurrentPlayer(playerSymbol); // Switch back to player's turn
            }
            
            isComputerThinkingRef.current = false;
            setIsComputerThinking(false);
            return newBoard;
          } else {
            setCurrentPlayer(playerSymbol);
            isComputerThinkingRef.current = false;
            setIsComputerThinking(false);
            return currentBoard;
          }
        });
      }, 500); // 500ms delay for computer "thinking"
    } else if (currentPlayer !== computerSymbol || gameMode !== 'computer') {
      // Reset thinking state if not computer's turn
      if (isComputerThinkingRef.current) {
        isComputerThinkingRef.current = false;
        setIsComputerThinking(false);
      }
    }

    // Cleanup function
    return () => {
      if (computerMoveTimeoutRef.current) {
        clearTimeout(computerMoveTimeoutRef.current);
        computerMoveTimeoutRef.current = null;
      }
    };
  }, [gameMode, currentPlayer, gameOver, getComputerMove, checkWinner, playerSymbol]);

  const resetGame = () => {
    if (computerMoveTimeoutRef.current) {
      clearTimeout(computerMoveTimeoutRef.current);
      computerMoveTimeoutRef.current = null;
    }
    isComputerThinkingRef.current = false;
    setBoard(Array(9).fill(null));
    setWinner(null);
    setGameOver(false);
    
    // Set initial player based on mode
    if (gameMode === 'computer') {
      // In computer mode, player is X, computer is O
      // Random chance: 50% player goes first, 50% computer goes first
      const playerGoesFirst = Math.random() < 0.5;
      setPlayerSymbol('X');
      setCurrentPlayer(playerGoesFirst ? 'X' : 'O');
    } else {
      // In friend mode, random first player
      const randomFirstPlayer = Math.random() < 0.5 ? 'X' : 'O';
      setPlayerSymbol(randomFirstPlayer);
      setCurrentPlayer(randomFirstPlayer);
    }
    setIsComputerThinking(false);
  };

  const handleModeChange = (checked: boolean) => {
    const newMode: GameMode = checked ? 'computer' : 'friend';
    setGameMode(newMode);
    
    // Reset game when switching modes
    if (computerMoveTimeoutRef.current) {
      clearTimeout(computerMoveTimeoutRef.current);
      computerMoveTimeoutRef.current = null;
    }
    isComputerThinkingRef.current = false;
    setBoard(Array(9).fill(null));
    setWinner(null);
    setGameOver(false);
    
    // Set initial player based on mode
    if (newMode === 'computer') {
      // In computer mode, player is X, computer is O
      // Random chance: 50% player goes first, 50% computer goes first
      const playerGoesFirst = Math.random() < 0.5;
      setPlayerSymbol('X');
      setCurrentPlayer(playerGoesFirst ? 'X' : 'O');
    } else {
      // In friend mode, random first player
      const randomFirstPlayer = Math.random() < 0.5 ? 'X' : 'O';
      setPlayerSymbol(randomFirstPlayer);
      setCurrentPlayer(randomFirstPlayer);
    }
    setIsComputerThinking(false);
  };

  const renderSquare = (index: number) => {
    const computerSymbol = playerSymbol === 'X' ? 'O' : 'X';
    const isDisabled = board[index] !== null || gameOver || isComputerThinking || 
                       (gameMode === 'computer' && currentPlayer !== playerSymbol);
    return (
      <Button
        key={index}
        variant="outline"
        className="w-20 h-20 text-2xl font-bold hover:bg-accent/10 border-border"
        onClick={() => handleClick(index)}
        disabled={isDisabled}
      >
        {board[index]}
      </Button>
    );
  };

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
            {/* Game Mode Toggle */}
            <div className="flex items-center justify-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="game-mode" className="text-sm font-medium">
                  Friend
                </Label>
              </div>
              <Switch
                id="game-mode"
                checked={gameMode === 'computer'}
                onCheckedChange={handleModeChange}
              />
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="game-mode" className="text-sm font-medium">
                  Computer
                </Label>
              </div>
            </div>

            <div className="text-center">
              {winner ? (
                <p className="text-xl font-semibold text-accent">
                  {gameMode === 'computer' 
                    ? (winner === playerSymbol ? '🎉 You win!' : '🤖 Computer wins!')
                    : `🎉 Player ${winner} wins!`}
                </p>
              ) : gameOver ? (
                <p className="text-xl font-semibold text-muted-foreground">
                  It's a draw! 🤝
                </p>
              ) : isComputerThinking ? (
                <p className="text-lg text-foreground">
                  🤖 Computer is thinking...
                </p>
              ) : (
                <p className="text-lg text-foreground">
                  {gameMode === 'computer' 
                    ? <>Your turn! <span className="font-bold text-accent">(You are {playerSymbol})</span></>
                    : <>Player <span className="font-bold text-accent">{currentPlayer}</span>'s turn</>}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 justify-center max-w-xs mx-auto">
              {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {isComputerThinking 
                ? 'Computer is making its move...' 
                : gameMode === 'computer'
                ? `Click on any empty square to make your move (You are ${playerSymbol}, Computer is ${playerSymbol === 'X' ? 'O' : 'X'})`
                : 'Click on any empty square to make your move (Take turns between X and O)'}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
