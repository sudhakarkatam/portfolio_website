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
      <div className="p-2">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center border border-blue-500/20">
            <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {portfolioData.name}
            </h2>
            <p className="text-lg text-muted-foreground font-medium mt-1">
              {portfolioData.title}
            </p>
          </div>
        </div>

        <div className="prose prose-lg prose-invert max-w-none mb-8">
          <p className="text-foreground/90 leading-relaxed text-lg">
            {portfolioData.bio}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div
            className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer group"
            onClick={() => window.open(`mailto:${portfolioData.contact.email}`, '_blank')}
          >
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 group-hover:scale-110 transition-transform">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Email</p>
              <p className="text-sm font-semibold text-foreground">{portfolioData.contact.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Location</p>
              <p className="text-sm font-semibold text-foreground">Andhra Pradesh, India</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => window.open('https://drive.google.com/file/d/1qNzycHvflNO2lLynBD3ao9udHO0bJIYJ/view?usp=sharing', '_blank')}
            className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Download className="w-4 h-4 mr-2" />
            View Resume
          </Button>
          <Button
            onClick={() => window.open(portfolioData.contact.github, '_blank')}
            variant="outline"
            className="flex-1 h-11 border-border/60 hover:bg-secondary/50"
          >
            View GitHub
          </Button>
          <Button
            onClick={() => window.open(portfolioData.contact.linkedin, '_blank')}
            className="flex-1 h-11 bg-[#0077b5] hover:bg-[#006396] text-white shadow-lg shadow-[#0077b5]/20"
          >
            Connect on LinkedIn
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
