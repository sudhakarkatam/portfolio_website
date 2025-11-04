import { Game } from '@/types/portfolio';

export const gamesData: Game[] = [
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    description: 'Classic 3x3 grid game. Play against the computer on easy difficulty!',
    category: 'entertainment',
    icon: 'Grid3X3'
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Test your memory skills by matching pairs of cards. How fast can you complete it?',
    category: 'entertainment',
    icon: 'Brain'
  },
  {
    id: 'typing-speed',
    title: 'Typing Speed Test',
    description: 'Improve your typing skills with this interactive speed test. Perfect for developers!',
    category: 'educational',
    icon: 'Keyboard'
  },
  {
    id: 'code-quiz',
    title: 'Code Quiz',
    description: 'Test your programming knowledge with questions about various technologies and concepts.',
    category: 'educational',
    icon: 'Code'
  }
];
