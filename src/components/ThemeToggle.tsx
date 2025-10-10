import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Set dark as default
    document.documentElement.classList.add('dark');
    setIsDark(true);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-sidebar-accent transition-all duration-300 h-8 w-8 md:h-10 md:w-10 touch-manipulation"
    >
      {isDark ? (
        <Sun className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
      ) : (
        <Moon className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
      )}
    </Button>
  );
};