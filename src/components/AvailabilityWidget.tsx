import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '@/data/portfolioData';

interface AvailabilityWidgetProps {
  isVisible?: boolean;
  isMobile?: boolean;
}

export const AvailabilityWidget = ({ isVisible = true, isMobile = false }: AvailabilityWidgetProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${day} ${month} ${year} • ${hours}:${minutes}:${seconds}`;
  };

  const availability = portfolioData.availability;

  if (!availability || !isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed z-30 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg max-w-xs ${
        isMobile 
          ? 'top-3 right-16 block md:hidden' 
          : 'top-3 right-24 hidden md:block'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-3 h-3 rounded-full ${availability.available ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
        <span className="text-sm font-medium text-foreground">
          {availability.statusText}
        </span>
      </div>
      <div className="text-xs text-muted-foreground">
        {formatDateTime(currentTime)}
      </div>
    </motion.div>
  );
};
