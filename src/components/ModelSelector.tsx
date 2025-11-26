import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Sparkles } from 'lucide-react';
import { getLastUsedModel } from '@/utils/geminiService';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ModelOption {
  id: string;
  name: string;
  description?: string;
  model: string;
  apiVersion: string;
  provider: 'gemini' | 'openrouter';
}

const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'normal',
    name: 'Normal Mode',
    description: 'Rule-based responses',
    model: '',
    apiVersion: '',
    provider: 'gemini',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Free tier with usage limits',
    model: 'gemini-2.5-flash',
    apiVersion: 'v1beta',
    provider: 'gemini',
  },
  {
    id: 'tng-deepseek-chimera',
    name: 'TNG: DeepSeek R1T2 Chimera',
    description: 'Free tier with usage limits',
    model: 'tngtech/deepseek-r1t2-chimera:free',
    apiVersion: '',
    provider: 'openrouter',
  },
  {
    id: 'xai-grok-fast',
    name: 'xAI: Grok 4.1 Fast',
    description: 'Free tier (Limited time)',
    model: 'x-ai/grok-beta',
    apiVersion: '',
    provider: 'openrouter',
  },
  // Add more models here later
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  className?: string;
}

export const ModelSelector = ({ selectedModel, onModelChange, className }: ModelSelectorProps) => {
  const [modelInfo, setModelInfo] = useState<{ model: string; apiVersion: string } | null>(null);

  useEffect(() => {
    if (selectedModel !== 'normal') {
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
  }, [selectedModel]);

  const selectedOption = AVAILABLE_MODELS.find(m => m.id === selectedModel) || AVAILABLE_MODELS[0];
  const isAIMode = selectedModel !== 'normal';

  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger
        className={cn(
          "h-8 w-auto min-w-[140px] border-border/50 bg-background/50 hover:bg-background/80 text-xs md:text-sm",
          isAIMode && "border-accent/30 bg-accent/10",
          className
        )}
      >
        <div className="flex items-center gap-2">
          {isAIMode ? (
            <Bot className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
          ) : (
            <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
          )}
          <SelectValue>
            <span className={cn(
              "font-medium",
              isAIMode ? "text-accent" : "text-muted-foreground"
            )}>
              {selectedOption.name}
            </span>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="normal">
          <div className="flex flex-col">
            <span className="font-medium">Normal Mode</span>
            <span className="text-xs text-muted-foreground">Rule-based responses</span>
          </div>
        </SelectItem>
        {AVAILABLE_MODELS.filter(m => m.id !== 'normal').map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex flex-col">
              <span className="font-medium">{model.name}</span>
              {model.description && (
                <span className="text-xs text-muted-foreground">{model.description}</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { AVAILABLE_MODELS };

