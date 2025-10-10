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
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={suggestion.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            className="bg-card hover:bg-sidebar-accent border-border transition-all duration-300"
            onClick={() => onSelect(suggestion.query)}
          >
            <suggestion.icon className="mr-2 h-4 w-4" />
            {suggestion.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};
