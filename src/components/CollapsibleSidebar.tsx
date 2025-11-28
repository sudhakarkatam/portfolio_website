import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Code, Briefcase, Mail, Github, Linkedin, Twitter,
  ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen, Gamepad2, FolderKanban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { portfolioData } from '@/data/portfolioData';

interface CollapsibleSidebarProps {
  onNavigate: (section: string, projectId?: string) => void;
  onMobileClose?: () => void;
  onGoHome?: () => void;
  isMobile?: boolean;
}

export const CollapsibleSidebar = ({
  onNavigate,
  onMobileClose,
  onGoHome,
  isMobile = false,
}: CollapsibleSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
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

  const navItems = [
    { id: 'about', label: 'About', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: FolderKanban, hasSubmenu: true },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'games', label: 'Games', icon: Gamepad2, desktopOnly: true },
  ];

  const toggleProjects = () => setExpandedProjects(!expandedProjects);

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: isMobile ? '100%' : isCollapsed ? '104px' : '384px',
      }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col relative bg-sidebar border-r border-border
        h-screen md:h-full min-h-screen ${!isMobile ? 'hidden md:flex' : 'flex'} ${isMobile ? 'pb-6' : ''}`}
    >
      {/* Collapse Toggle (Desktop Only) */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-5 top-5 z-10 bg-sidebar border border-border rounded-full shadow-lg h-10 w-10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      )}

      {/* Sidebar Content */}
      <div className={`flex flex-col flex-1 min-h-0 overflow-y-auto ${isMobile ? 'p-4 sm:p-5' : 'p-7'}`} style={{ scrollBehavior: 'smooth' }}>
        {/* Profile Section */}
        <AnimatePresence mode="wait">
          {(!isCollapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`flex flex-col items-center ${isMobile ? 'mb-6' : 'mb-9'}`}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (onGoHome) {
                    onGoHome();
                  } else {
                    onNavigate('about');
                  }
                  if (isMobile && onMobileClose) onMobileClose();
                }}
                className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-center hover:text-accent transition-colors cursor-pointer w-full`}
              >
                {portfolioData.name}
              </motion.button>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground text-center mt-2`}>
                Software Engineer and Tech Explorer
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Profile Icon (Collapsed Desktop Only) */}
        {isCollapsed && !isMobile && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (onGoHome) {
                onGoHome();
              } else {
                onNavigate('about');
              }
            }}
            className="flex justify-center mb-7 mx-auto"
          >
            <Avatar className="w-12 h-12 border-2 border-primary shadow-glow hover:border-primary/90 transition-all">
              <AvatarImage src="/profile_image.jpeg" alt={portfolioData.name} />
              <AvatarFallback className="bg-gradient-primary">
                <User className="w-7 h-7 text-white" />
              </AvatarFallback>
            </Avatar>
          </motion.button>
        )}

        {/* Navigation */}
        <nav className={`${isMobile ? 'space-y-2' : 'space-y-4'} flex-1`}>
          {navItems.map((item) => (
            <div key={item.id} className={item.desktopOnly ? 'hidden md:block' : ''}>
              <Button
                variant="ghost"
                className={`w-full ${isCollapsed && !isMobile ? 'justify-center px-2' : 'justify-start'
                  } hover:bg-sidebar-accent transition-all duration-300 ${isMobile ? 'text-sm min-h-[48px] touch-manipulation' : 'text-base'}`}
                onClick={() => {
                  if (item.hasSubmenu) {
                    toggleProjects();
                  } else {
                    onNavigate(item.id);
                    if (isMobile && onMobileClose) onMobileClose();
                  }
                }}
              >
                <item.icon
                  className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} ${!isCollapsed || isMobile ? 'mr-3' : ''}`}
                />
                {(!isCollapsed || isMobile) && (
                  <>
                    <span className={`flex-1 text-left ${isMobile ? 'text-sm' : 'text-base'}`}>{item.label}</span>
                    {item.hasSubmenu &&
                      (expandedProjects ? (
                        <ChevronDown className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                      ) : (
                        <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                      ))}
                  </>
                )}
              </Button>

              {/* Projects Submenu */}
              {item.hasSubmenu &&
                expandedProjects &&
                (!isCollapsed || isMobile) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-5 mt-2 space-y-1.5 border-l-2 border-accent/30 pl-4"
                  >
                    {portfolioData.projects.map((project) => {
                      const getCategoryEmoji = (category?: string) => {
                        if (!category) return '💻';
                        switch (category) {
                          case 'Productivity': return '📱';
                          case 'FinTech': return '💰';
                          case 'E-Commerce': return '🛒';
                          case 'Job Portal': return '💼';
                          case 'sharing': return '📤';
                          default: return '💻';
                        }
                      };

                      return (
                        <Button
                          key={project.id}
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start ${isMobile ? 'text-xs min-h-[44px] touch-manipulation' : 'text-sm'} hover:bg-sidebar-accent hover:text-accent transition-all`}
                          onClick={() => {
                            onNavigate('project', project.id);
                            if (isMobile && onMobileClose) onMobileClose();
                          }}
                        >
                          {project.title} {getCategoryEmoji(project.category)}
                        </Button>
                      );
                    })}
                  </motion.div>
                )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Profile Card */}
      {(!isCollapsed || isMobile) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`border-t border-border ${isMobile ? 'p-4 sm:p-5' : 'p-6'} relative z-10`}
        >
          {/* Connect with me */}
          <div className={`bg-gradient-primary/10 rounded-lg ${isMobile ? 'p-3 sm:p-4' : 'p-5'} border border-border/50 md:relative md:bottom-auto bottom-0`}>
            {/* Availability Status - No box */}
            {portfolioData.availability && (
              <div className={`flex items-center gap-2 ${isMobile ? 'mb-2 pb-2' : 'mb-3 pb-3'} border-b border-border/30`}>
                <div className={`${isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5'} rounded-full ${portfolioData.availability.available ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-medium text-foreground`}>
                  {portfolioData.availability.statusText}
                </span>
                {!isMobile && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatDateTime(currentTime)}
                  </span>
                )}
                {isMobile && (
                  <span className="text-[9px] text-muted-foreground ml-auto">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            )}
            <div className={`flex items-center ${isMobile ? 'gap-2 mb-2' : 'gap-3 mb-3'}`}>
              <Avatar className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} border-2 border-primary shadow-glow`}>
                <AvatarImage src="/profile_image.jpeg" alt={portfolioData.name} />
                <AvatarFallback className="bg-gradient-primary">
                  <User className={`${isMobile ? 'w-5 h-5' : 'w-7 h-7'} text-white`} />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>Connect with me</p>
                {!isMobile && (
                  <p className="text-sm text-muted-foreground">
                    Let's build something amazing
                  </p>
                )}
              </div>
            </div>
            <div className={`flex ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
              {portfolioData.contact.github && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`hover:bg-sidebar-accent hover:text-accent transition-all flex-1 ${isMobile ? 'h-8 min-w-[44px] touch-manipulation' : 'h-9'}`}
                  onClick={() => window.open(portfolioData.contact.github, '_blank')}
                >
                  <Github className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </Button>
              )}
              {portfolioData.contact.linkedin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`hover:bg-sidebar-accent hover:text-accent transition-all flex-1 ${isMobile ? 'h-8 min-w-[44px] touch-manipulation' : 'h-9'}`}
                  onClick={() => window.open(portfolioData.contact.linkedin, '_blank')}
                >
                  <Linkedin className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </Button>
              )}
              {portfolioData.contact.twitter && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`hover:bg-sidebar-accent hover:text-accent transition-all flex-1 ${isMobile ? 'h-8 min-w-[44px] touch-manipulation' : 'h-9'}`}
                  onClick={() => window.open(portfolioData.contact.twitter, '_blank')}
                >
                  <Twitter className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className={`hover:bg-sidebar-accent hover:text-accent transition-all flex-1 ${isMobile ? 'h-8 min-w-[44px] touch-manipulation' : 'h-9'}`}
                onClick={() =>
                  window.open(`mailto:${portfolioData.contact.email}`, '_blank')
                }
              >
                <Mail className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
};
