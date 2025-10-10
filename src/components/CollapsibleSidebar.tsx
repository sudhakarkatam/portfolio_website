import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Code, Briefcase, Mail, Github, Linkedin, Twitter,
  ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen
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
  ];

  const toggleProjects = () => setExpandedProjects(!expandedProjects);

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: isMobile ? '100%' : isCollapsed ? '80px' : '320px',
      }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col relative bg-sidebar border-r border-border 
        h-screen md:h-full min-h-screen ${!isMobile ? 'hidden md:flex' : 'flex'}`}
    >
      {/* Collapse Toggle (Desktop Only) */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-4 z-10 bg-sidebar border border-border rounded-full shadow-lg"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      )}

      {/* Sidebar Content */}
      <div className="flex flex-col flex-1 overflow-y-auto p-6">
        {/* Profile Section */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center mb-8"
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
                className="text-xl font-bold text-center hover:text-accent transition-colors cursor-pointer w-full"
              >
                {portfolioData.name}
              </motion.button>
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
            className="flex justify-center mb-6 w-12 h-12 rounded-full bg-gradient-primary items-center shadow-glow hover:bg-gradient-primary/90 transition-all mx-auto"
          >
            <User className="w-6 h-6 text-white" />
          </motion.button>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <div key={item.id}>
              <Button
                variant="ghost"
                className={`w-full ${
                  isCollapsed && !isMobile ? 'justify-center px-2' : 'justify-start'
                } hover:bg-sidebar-accent transition-all duration-300`}
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
                  className={`h-5 w-5 ${!isCollapsed || isMobile ? 'mr-3' : ''}`}
                />
                {(!isCollapsed || isMobile) && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.hasSubmenu &&
                      (expandedProjects ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
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
                    className="ml-4 mt-2 space-y-1 border-l-2 border-accent/30 pl-3"
                  >
                    {portfolioData.projects.map((project) => (
                      <Button
                        key={project.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs hover:bg-sidebar-accent hover:text-accent transition-all"
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
          className="border-t border-border p-4 mt-auto"
        >
          <div className="bg-gradient-primary/10 rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Connect with me</p>
                <p className="text-xs text-muted-foreground">
                  Let's build something amazing
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {portfolioData.contact.github && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-sidebar-accent hover:text-accent transition-all flex-1"
                  onClick={() => window.open(portfolioData.contact.github, '_blank')}
                >
                  <Github className="h-4 w-4" />
                </Button>
              )}
              {portfolioData.contact.linkedin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-sidebar-accent hover:text-accent transition-all flex-1"
                  onClick={() => window.open(portfolioData.contact.linkedin, '_blank')}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              )}
              {portfolioData.contact.twitter && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-sidebar-accent hover:text-accent transition-all flex-1"
                  onClick={() => window.open(portfolioData.contact.twitter, '_blank')}
                >
                  <Twitter className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-sidebar-accent hover:text-accent transition-all flex-1"
                onClick={() =>
                  window.open(`mailto:${portfolioData.contact.email}`, '_blank')
                }
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
};
