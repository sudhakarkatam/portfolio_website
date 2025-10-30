import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Github, Play, Calendar, Users, Award, Zap, TrendingUp, X } from 'lucide-react';
import { ProjectDetail } from '@/types/portfolio';

interface ProjectDetailModalProps {
  project: ProjectDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (section: string, projectId?: string) => void;
}

export const ProjectDetailModal = ({ project, isOpen, onClose, onNavigate }: ProjectDetailModalProps) => {
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

  // Reset lightbox state when modal closes or project changes
  useEffect(() => {
    if (!isOpen) {
      setLightboxOpen(false);
      setSelectedImageIndex(0);
      setInitialImageIndex(0);
    }
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
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'live': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'web': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'mobile': return 'bg-green-50 text-green-700 border-green-200';
      case 'ai/ml': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'full-stack': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border w-[95vw] h-[95vh] md:w-auto md:h-auto md:max-w-4xl md:max-h-[90vh] [&>button]:opacity-100 [&>button]:bg-background/80 [&>button]:backdrop-blur-sm [&>button]:border [&>button]:border-border [&>button]:shadow-lg [&>button]:h-10 [&>button]:w-10 [&>button]:right-2 [&>button]:top-2 [&>button>svg]:h-5 [&>button>svg]:w-5 [&>button>svg]:text-foreground">
        <DialogHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
                {projectDetail.title}
              </DialogTitle>
              <DialogDescription className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                {projectDetail.description}
              </DialogDescription>
            </div>
            <div className="flex flex-wrap gap-2 sm:ml-4">
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
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-col gap-3">
            {projectDetail.link && (
              <Button 
                className="w-full text-base sm:text-lg h-12"
                onClick={() => window.open(projectDetail.link, '_blank', 'noopener,noreferrer')}
              >
                <Play className="w-5 h-5 mr-2" />
                View Live
              </Button>
            )}
            {projectDetail.github && (
              <Button 
                variant="outline" 
                className="w-full text-base sm:text-lg h-12"
                onClick={() => window.open(projectDetail.github, '_blank', 'noopener,noreferrer')}
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            )}
            {projectDetail.caseStudyUrl && (
              <Button 
                variant="outline" 
                className="w-full text-base sm:text-lg h-12"
                onClick={() => window.open(projectDetail.caseStudyUrl, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Case Study
              </Button>
            )}
          </div>

          <Separator />

          {/* Project Details Grid */}
          <div className="space-y-6">
            {/* Project Overview */}
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                Project Overview
              </h3>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg">
                {projectDetail.duration && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium text-foreground">{projectDetail.duration}</span>
                  </div>
                )}
                {projectDetail.teamSize && (
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">Team Size:</span>
                    <span className="font-medium text-foreground">{projectDetail.teamSize}</span>
                  </div>
                )}
                {projectDetail.role && (
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">My Role:</span>
                    <span className="font-medium text-foreground">{projectDetail.role}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {projectDetail.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-sm sm:text-base md:text-lg px-2 sm:px-3 py-1 sm:py-2">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Key Features */}
            {projectDetail.features && projectDetail.features.length > 0 && (
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-4">Key Features</h3>
                <ul className="space-y-2 sm:space-y-3">
                  {projectDetail.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm sm:text-base md:text-lg">
                      <span className="text-accent mr-2 sm:mr-3 mt-1 text-lg sm:text-xl flex-shrink-0">•</span>
                      <span className="text-muted-foreground leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Results & Impact */}
            {projectDetail.results && projectDetail.results.length > 0 && (
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  Results & Impact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {projectDetail.results.map((result, index) => (
                    <div key={index} className="text-center p-3 sm:p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-accent">
                        {result.value}
                      </div>
                      <div className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
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
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-4">Project Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-4">Key Learnings</h3>
                <div className="space-y-3 sm:space-y-4">
                  {projectDetail.learnings.map((learning, index) => (
                    <div key={index} className="p-3 sm:p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                      <div className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">{learning}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>

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