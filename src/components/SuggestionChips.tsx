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
    <div className="flex flex-wrap gap-2 justify-center">
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
            className="bg-sidebar/50 hover:bg-sidebar-accent border-border/50 backdrop-blur-sm transition-all duration-300 text-xs"
            onClick={() => onSelect(suggestion.query)}
          >
            <suggestion.icon className="mr-2 h-3 w-3" />
            {suggestion.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};
