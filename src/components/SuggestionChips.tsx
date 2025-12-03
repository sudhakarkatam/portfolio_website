import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { User, Zap, Rocket, Briefcase } from 'lucide-react';

interface SuggestionChipsProps {
  onSelect: (query: string) => void;
}

export const SuggestionChips = ({ onSelect }: SuggestionChipsProps) => {
  const suggestions = [
    {
      id: 'about',
      label: 'About',
      icon: User,
      query: 'Tell me about yourself',
      iconClass: 'text-blue-500 bg-blue-500/10',
      borderClass: 'border-blue-500/20',
      hoverClass: 'hover:bg-blue-500/5'
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: Zap,
      query: 'What are your technical skills?',
      iconClass: 'text-purple-500 bg-purple-500/10',
      borderClass: 'border-purple-500/20',
      hoverClass: 'hover:bg-purple-500/5'
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: Rocket,
      query: 'Show me your projects',
      iconClass: 'text-emerald-500 bg-emerald-500/10',
      borderClass: 'border-emerald-500/20',
      hoverClass: 'hover:bg-emerald-500/5'
    },
    {
      id: 'experience',
      label: 'Experience',
      icon: Briefcase,
      query: 'What is your work experience?',
      iconClass: 'text-orange-500 bg-orange-500/10',
      borderClass: 'border-orange-500/20',
      hoverClass: 'hover:bg-orange-500/5'
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
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
            className={`rounded-full bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 text-sm h-9 md:h-10 px-4 md:px-5 touch-manipulation group border ${suggestion.borderClass} ${suggestion.hoverClass}`}
            onClick={() => onSelect(suggestion.query)}
          >
            <div className={`p-1.5 rounded-full mr-1.5 md:mr-2 ${suggestion.iconClass} group-hover:scale-110 transition-transform`}>
              <suggestion.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </div>
            <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{suggestion.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};
