import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { portfolioData } from '@/data/portfolioData';
import { useState } from 'react';

interface MobileHeaderProps {
  onNavigate: (section: string, projectId?: string) => void;
}

export const MobileHeader = ({ onNavigate }: MobileHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
  ];

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">{portfolioData.name}</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden fixed top-14 left-0 right-0 z-40 bg-sidebar border-b border-border p-4"
        >
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </motion.div>
      )}
    </>
  );
};
