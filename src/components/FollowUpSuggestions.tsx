import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface FollowUpSuggestionsProps {
  suggestions: string[];
  onSelect: (query: string) => void;
}

export const FollowUpSuggestions = ({ suggestions, onSelect }: FollowUpSuggestionsProps) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-4 flex flex-wrap gap-2"
    >
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + index * 0.05 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="bg-accent/10 hover:bg-accent/20 border-accent/30 text-accent hover:text-accent text-xs md:text-sm h-7 md:h-8 px-2 md:px-3 backdrop-blur-sm transition-all duration-300 touch-manipulation"
            onClick={() => onSelect(suggestion)}
          >
            <Sparkles className="mr-1 h-3 w-3" />
            {suggestion}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

