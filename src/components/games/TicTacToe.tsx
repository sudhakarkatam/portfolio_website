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

    // Determine color based on symbol
    const symbolColor = board[index] === 'X' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-fuchsia-500 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]';

    return (
      <motion.button
        key={index}
        whileHover={{ scale: isDisabled ? 1 : 1.05, backgroundColor: isDisabled ? 'transparent' : 'rgba(34, 211, 238, 0.1)' }}
        whileTap={{ scale: isDisabled ? 1 : 0.95 }}
        className={`w-24 h-24 text-4xl font-bold border-2 border-cyan-900/50 rounded-xl flex items-center justify-center transition-all duration-300 ${isDisabled ? 'cursor-default' : 'cursor-pointer hover:border-cyan-500/50'}`}
        onClick={() => handleClick(index)}
        disabled={isDisabled}
      >
        {board[index] && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={symbolColor}
          >
            {board[index]}
          </motion.span>
        )}
      </motion.button>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        {/* Neon Glow Background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-2xl blur opacity-20 animate-pulse" />

        <Card className="relative bg-black/90 border-cyan-500/30 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-cyan-500/10 pb-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={onBack} className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                NEON TIC-TAC-TOE
              </CardTitle>
              <Button variant="outline" onClick={resetGame} className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/30">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 pt-8">
            {/* Game Mode Toggle */}
            <div className="flex justify-center">
              <div className="flex items-center gap-4 p-2 bg-black/50 border border-cyan-500/20 rounded-full">
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${gameMode === 'friend' ? 'bg-cyan-500/20 text-cyan-400' : 'text-muted-foreground'}`}>
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Friend</span>
                </div>
                <Switch
                  checked={gameMode === 'computer'}
                  onCheckedChange={handleModeChange}
                  className="data-[state=checked]:bg-fuchsia-500 data-[state=unchecked]:bg-cyan-500"
                />
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${gameMode === 'computer' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'text-muted-foreground'}`}>
                  <Bot className="h-4 w-4" />
                  <span className="text-sm font-medium">AI Bot</span>
                </div>
              </div>
            </div>

            {/* Status Display */}
            <div className="text-center min-h-[3rem] flex items-center justify-center">
              {winner ? (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-lg"
                >
                  {gameMode === 'computer'
                    ? (winner === playerSymbol ? '🎉 VICTORY! 🎉' : '🤖 SYSTEM WINS 🤖')
                    : `🎉 PLAYER ${winner} WINS! 🎉`}
                </motion.div>
              ) : gameOver ? (
                <p className="text-xl font-semibold text-muted-foreground">
                  GAME DRAW 🤝
                </p>
              ) : isComputerThinking ? (
                <div className="flex items-center gap-2 text-fuchsia-400">
                  <Bot className="w-5 h-5 animate-bounce" />
                  <span className="font-mono">COMPUTING MOVE...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-lg">
                  <span className="text-muted-foreground">TURN:</span>
                  <span className={`font-bold text-2xl ${currentPlayer === 'X' ? 'text-cyan-400' : 'text-fuchsia-500'}`}>
                    {currentPlayer}
                  </span>
                  {gameMode === 'computer' && currentPlayer === playerSymbol && (
                    <span className="text-xs ml-2 px-2 py-0.5 rounded border border-cyan-500/30 text-cyan-400 bg-cyan-950/30">YOU</span>
                  )}
                </div>
              )}
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-3 gap-3 justify-center max-w-xs mx-auto p-4 bg-black/50 rounded-2xl border border-cyan-900/30 shadow-inner">
              {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
            </div>

            <div className="text-center text-xs text-muted-foreground/60 font-mono">
              {isComputerThinking
                ? 'ANALYZING PROBABILITIES...'
                : 'SELECT A SECTOR TO INITIATE SEQUENCE'}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
