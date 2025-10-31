import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Github, Play, Calendar, Users, Award, Zap, TrendingUp, X, ArrowLeft } from 'lucide-react';
import { ProjectDetail } from '@/types/portfolio';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectDetailPanelProps {
  project: ProjectDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (section: string, projectId?: string) => void;
}

export const ProjectDetailPanel = ({ project, isOpen, onClose, onNavigate }: ProjectDetailPanelProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const projectRef = useRef(project);
  
  // Update ref when project changes
  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  // Handle next image navigation
  const handleNextImage = useCallback(() => {
    if (projectRef.current?.images && projectRef.current.images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % projectRef.current!.images!.length);
    }
  }, []);

  // Handle previous image navigation
  const handlePrevImage = useCallback(() => {
    if (projectRef.current?.images && projectRef.current.images.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + projectRef.current!.images!.length) % projectRef.current!.images!.length);
    }
  }, []);

  // Handle closing lightbox and resetting to the image that was originally opened
  const handleCloseLightbox = useCallback(() => {
    setLightboxOpen(false);
    setSelectedImageIndex(initialImageIndex);
  }, [initialImageIndex]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        handleCloseLightbox();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen, handleNextImage, handlePrevImage, handleCloseLightbox]);

  // Reset lightbox state when panel closes or project changes
  useEffect(() => {
    if (!isOpen) {
      setLightboxOpen(false);
      setSelectedImageIndex(0);
      setInitialImageIndex(0);
    }
  }, [isOpen]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!project) return null;

  const projectDetail = project as ProjectDetail;
  
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setInitialImageIndex(index);
    setLightboxOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'live': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'web': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'mobile': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ai/ml': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'full-stack': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:z-40"
            />
            
            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[600px] lg:w-[700px] bg-background border-l border-border shadow-2xl z-50 md:z-40 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex-shrink-0 border-b border-border bg-sidebar/50 backdrop-blur-sm p-4 md:p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors -ml-2"
                    aria-label="Close panel"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {projectDetail.status && (
                      <Badge className={getStatusColor(projectDetail.status)}>
                        {projectDetail.status}
                      </Badge>
                    )}
                    {projectDetail.category && (
                      <Badge variant="outline" className={getCategoryColor(projectDetail.category)}>
                        {projectDetail.category}
                      </Badge>
                    )}
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {projectDetail.title}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {projectDetail.description}
                </p>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {projectDetail.link && (
                    <Button 
                      className="flex-1 text-base h-11"
                      onClick={() => window.open(projectDetail.link, '_blank', 'noopener,noreferrer')}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      View Live
                    </Button>
                  )}
                  {projectDetail.github && (
                    <Button 
                      variant="outline" 
                      className="flex-1 text-base h-11"
                      onClick={() => window.open(projectDetail.github, '_blank', 'noopener,noreferrer')}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                  )}
                  {projectDetail.caseStudyUrl && (
                    <Button 
                      variant="outline" 
                      className="flex-1 text-base h-11"
                      onClick={() => window.open(projectDetail.caseStudyUrl, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Case Study
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Project Details */}
                <div className="space-y-6">
                  {/* Project Overview */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Project Overview
                    </h3>
                    <div className="space-y-3 text-sm md:text-base">
                      {projectDetail.duration && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium text-foreground">{projectDetail.duration}</span>
                        </div>
                      )}
                      {projectDetail.teamSize && (
                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground">Team Size:</span>
                          <span className="font-medium text-foreground">{projectDetail.teamSize}</span>
                        </div>
                      )}
                      {projectDetail.role && (
                        <div className="flex items-center gap-3">
                          <Award className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground">My Role:</span>
                          <span className="font-medium text-foreground">{projectDetail.role}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {projectDetail.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Key Features */}
                  {projectDetail.features && projectDetail.features.length > 0 && (
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">Key Features</h3>
                      <ul className="space-y-2">
                        {projectDetail.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm md:text-base">
                            <span className="text-accent mr-3 mt-1 text-lg flex-shrink-0">•</span>
                            <span className="text-muted-foreground leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Results & Impact */}
                  {projectDetail.results && projectDetail.results.length > 0 && (
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Results & Impact
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {projectDetail.results.map((result, index) => (
                          <div key={index} className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                            <div className="text-2xl md:text-3xl font-bold text-accent">
                              {result.value}
                            </div>
                            <div className="text-xs md:text-sm text-muted-foreground mt-1">
                              {result.metric}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Gallery */}
                {projectDetail.images && projectDetail.images.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">Project Gallery</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {projectDetail.images.map((image, index) => (
                          <div key={index} className="relative overflow-hidden rounded-lg aspect-video bg-secondary/20 group">
                            <img
                              src={image}
                              alt={`${projectDetail.title} screenshot ${index + 1}`}
                              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
                              onClick={() => handleImageClick(index)}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 cursor-pointer" onClick={() => handleImageClick(index)} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Learnings */}
                {projectDetail.learnings && projectDetail.learnings.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">Key Learnings</h3>
                      <div className="space-y-3">
                        {projectDetail.learnings.map((learning, index) => (
                          <div key={index} className="p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                            <div className="text-sm md:text-base text-muted-foreground leading-relaxed">{learning}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lightbox for full-size image viewing */}
      {lightboxOpen && projectDetail.images && projectDetail.images.length > 0 && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4" onClick={handleCloseLightbox}>
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 p-3 bg-black/60 hover:bg-black/80 rounded-full backdrop-blur-sm shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              handleCloseLightbox();
            }}
            aria-label="Close lightbox"
          >
            <X className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>
          
          <div className="max-w-7xl max-h-full w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={projectDetail.images[selectedImageIndex]}
              alt={`${projectDetail.title} - Image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          {projectDetail.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm z-10 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
              {selectedImageIndex + 1} / {projectDetail.images.length}
            </div>
          )}
        </div>
        , document.body
      )}
    </>
  );
};

