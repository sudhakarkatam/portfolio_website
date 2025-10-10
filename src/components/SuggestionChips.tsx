import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { User, Code, Briefcase, Award } from 'lucide-react';

interface SuggestionChipsProps {
  onSelect: (query: string) => void;
}

export const SuggestionChips = ({ onSelect }: SuggestionChipsProps) => {
  const suggestions = [
    { id: 'about', label: 'About', icon: User, query: 'Tell me about yourself' },
    { id: 'skills', label: 'Skills', icon: Code, query: 'What are your technical skills?' },
    { id: 'projects', label: 'Projects', icon: Briefcase, query: 'Show me your projects' },
    { id: 'experience', label: 'Experience', icon: Award, query: 'What is your work experience?' },
  ];

  return (
    <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={suggestion.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="bg-sidebar/50 hover:bg-sidebar-accent border-border/50 backdrop-blur-sm transition-all duration-300 text-xs h-7 md:h-8 px-2 md:px-3 touch-manipulation"
            onClick={() => onSelect(suggestion.query)}
          >
            <suggestion.icon className="mr-1 md:mr-2 h-3 w-3" />
            <span className="text-xs">{suggestion.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};
