import { motion } from 'framer-motion';
import { User, Mail, MapPin, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { portfolioData } from '@/data/portfolioData';

export const AboutSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{portfolioData.name}</h2>
            <p className="text-muted-foreground">{portfolioData.title}</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-foreground leading-relaxed mb-4">
            {portfolioData.bio}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div
            className="flex items-center gap-3 p-3 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors"
            onClick={() => window.open(`mailto:${portfolioData.contact.email}`, '_blank')}
          >
            <Mail className="h-5 w-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium hover:text-accent transition-colors">{portfolioData.contact.email}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={() => window.open('https://drive.google.com/file/d/1ts6WNTgkD4t6cEjkLE7dRmGEU8NvxCYf/view?usp=drive_link', '_blank')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            View Resume
          </Button>
          <div className="flex gap-3">
            <Button
              onClick={() => window.open(portfolioData.contact.github, '_blank')}
              variant="outline"
              className="flex-1"
            >
              View GitHub
            </Button>
            <Button
              onClick={() => window.open(portfolioData.contact.linkedin, '_blank')}
              className="flex-1 bg-accent hover:bg-accent/90"
            >
              Connect on LinkedIn
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
