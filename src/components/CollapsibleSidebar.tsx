import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Code, Briefcase, Mail, Github, Linkedin, Twitter,
  ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen, Gamepad2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState(true);

  const navItems = [
    { id: 'about', label: 'About', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: Briefcase, hasSubmenu: true },
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
        h-screen md:h-full min-h-screen ${!isMobile ? 'hidden md:flex' : 'flex'} ${isMobile ? 'pb-24' : ''}`}
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
      <div className="flex flex-col flex-1 overflow-y-auto p-8">
        {/* Profile Section */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center mb-10"
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
                className="text-2xl font-bold text-center hover:text-accent transition-colors cursor-pointer w-full"
              >
                {portfolioData.name}
              </motion.button>
              <p className="text-sm text-muted-foreground text-center mt-2">
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
            className="flex justify-center mb-7 w-14 h-14 rounded-full bg-gradient-primary items-center shadow-glow hover:bg-gradient-primary/90 transition-all mx-auto"
          >
            <User className="w-7 h-7 text-white" />
          </motion.button>
        )}

        {/* Navigation */}
        <nav className="space-y-4 flex-1">
          {navItems.map((item) => (
            <div key={item.id} className={item.desktopOnly ? 'hidden md:block' : ''}>
              <Button
                variant="ghost"
                className={`w-full ${
                  isCollapsed && !isMobile ? 'justify-center px-2' : 'justify-start'
                } hover:bg-sidebar-accent transition-all duration-300 text-base`}
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
                  className={`h-6 w-6 ${!isCollapsed || isMobile ? 'mr-3' : ''}`}
                />
                {(!isCollapsed || isMobile) && (
                  <>
                    <span className="flex-1 text-left text-base">{item.label}</span>
                    {item.hasSubmenu &&
                      (expandedProjects ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
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
                    {portfolioData.projects.map((project) => (
                      <Button
                        key={project.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-sm hover:bg-sidebar-accent hover:text-accent transition-all"
                        onClick={() => {
                          onNavigate('project', project.id);
                          if (isMobile && onMobileClose) onMobileClose();
                        }}
                      >
                        {project.title}
                      </Button>
                    ))}
                  </motion.div>
                )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Profile Card */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-border p-6 relative z-10"
        >
          <div className="bg-gradient-primary/10 rounded-lg p-5 border border-border/50 md:relative md:bottom-auto bottom-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-base font-medium">Connect with me</p>
                <p className="text-sm text-muted-foreground">
                  Let's build something amazing
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {portfolioData.contact.github && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-sidebar-accent hover:text-accent transition-all flex-1 h-10"
                  onClick={() => window.open(portfolioData.contact.github, '_blank')}
                >
                  <Github className="h-5 w-5" />
                </Button>
              )}
              {portfolioData.contact.linkedin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-sidebar-accent hover:text-accent transition-all flex-1 h-10"
                  onClick={() => window.open(portfolioData.contact.linkedin, '_blank')}
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
              )}
              {portfolioData.contact.twitter && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-sidebar-accent hover:text-accent transition-all flex-1 h-10"
                  onClick={() => window.open(portfolioData.contact.twitter, '_blank')}
                >
                  <Twitter className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-sidebar-accent hover:text-accent transition-all flex-1 h-10"
                onClick={() =>
                  window.open(`mailto:${portfolioData.contact.email}`, '_blank')
                }
              >
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
};
