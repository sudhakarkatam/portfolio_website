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
      {suggestions.map((suggestion, index) => {
        // Check if suggestion is a markdown link: [Label](url)
        const linkMatch = suggestion.match(/\[(.*?)\]\((.*?)\)/);
        const label = linkMatch ? linkMatch[1] : suggestion;
        const url = linkMatch ? linkMatch[2] : null;

        const colors = [
          { icon: 'text-blue-500 bg-blue-500/10', border: 'border-blue-500/20', hover: 'hover:bg-blue-500/5' },
          { icon: 'text-purple-500 bg-purple-500/10', border: 'border-purple-500/20', hover: 'hover:bg-purple-500/5' },
          { icon: 'text-emerald-500 bg-emerald-500/10', border: 'border-emerald-500/20', hover: 'hover:bg-emerald-500/5' },
          { icon: 'text-orange-500 bg-orange-500/10', border: 'border-orange-500/20', hover: 'hover:bg-orange-500/5' },
          { icon: 'text-pink-500 bg-pink-500/10', border: 'border-pink-500/20', hover: 'hover:bg-pink-500/5' },
          { icon: 'text-cyan-500 bg-cyan-500/10', border: 'border-cyan-500/20', hover: 'hover:bg-cyan-500/5' },
        ];
        const style = colors[index % colors.length];

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.05 }}
          >
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 text-xs md:text-sm h-8 md:h-9 px-3 md:px-4 touch-manipulation group border ${style.border} ${style.hover}`}
              onClick={() => {
                if (url) {
                  window.open(url, '_blank', 'noopener,noreferrer');
                } else {
                  onSelect(suggestion);
                }
              }}
            >
              <div className={`p-1 rounded-full mr-1.5 ${style.icon} group-hover:scale-110 transition-transform`}>
                <Sparkles className="h-3 w-3" />
              </div>
              <span className="text-foreground/80 group-hover:text-foreground transition-colors">{label}</span>
            </Button>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

