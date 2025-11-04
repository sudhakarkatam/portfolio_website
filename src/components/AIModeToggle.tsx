import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bot, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLastUsedModel } from '@/utils/geminiService';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AIModeToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

export const AIModeToggle = ({ isEnabled, onToggle, className }: AIModeToggleProps) => {
  const [modelInfo, setModelInfo] = useState<{ model: string; apiVersion: string } | null>(null);

  useEffect(() => {
    if (isEnabled) {
      // Check for model info periodically when AI mode is enabled
      const checkModel = () => {
        const info = getLastUsedModel();
        if (info) {
          setModelInfo(info);
        }
      };
      
      checkModel();
      const interval = setInterval(checkModel, 1000);
      return () => clearInterval(interval);
    } else {
      setModelInfo(null);
    }
  }, [isEnabled]);

  const modelDisplay = modelInfo 
    ? `${modelInfo.model} (${modelInfo.apiVersion})`
    : 'AI Mode';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-2", className)}>
            <Label 
              htmlFor="ai-mode-toggle" 
              className="flex items-center gap-2 cursor-pointer text-sm md:text-base"
            >
              {isEnabled ? (
                <Bot className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              ) : (
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              )}
              <span className={cn(
                "font-medium transition-colors",
                isEnabled ? "text-accent" : "text-muted-foreground"
              )}>
                {isEnabled ? modelDisplay : 'Normal Mode'}
              </span>
            </Label>
            <Switch
              id="ai-mode-toggle"
              checked={isEnabled}
              onCheckedChange={onToggle}
              className="data-[state=checked]:bg-accent"
            />
          </div>
        </TooltipTrigger>
        {isEnabled && modelInfo && (
          <TooltipContent>
            <p className="text-xs">Using: {modelInfo.model}</p>
            <p className="text-xs text-muted-foreground">API: {modelInfo.apiVersion}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

