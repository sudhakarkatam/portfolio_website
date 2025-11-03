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
      case 'productivity': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'fintech': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'e-commerce': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'job portal': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden bg-background border-border p-0 gap-0 [&>button]:opacity-100 [&>button]:bg-background/80 [&>button]:backdrop-blur-sm [&>button]:border [&>button]:border-border [&>button]:shadow-lg [&>button]:h-10 [&>button]:w-10 [&>button]:right-2 [&>button]:top-2 [&>button>svg]:h-5 [&>button>svg]:w-5 [&>button>svg]:text-foreground">
        {/* Header Section with Image/Gradient */}
        <div className="relative bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 to-transparent" />
          <div className="relative p-6 md:p-8 pb-4 md:pb-6">
            <div className="flex flex-wrap gap-2 mb-4">
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
            <DialogTitle className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {projectDetail.title}
            </DialogTitle>
            <DialogDescription className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 max-w-3xl">
              {projectDetail.description}
            </DialogDescription>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {projectDetail.link && (
                <Button 
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => window.open(projectDetail.link, '_blank', 'noopener,noreferrer')}
                >
                  <Play className="w-5 h-5 mr-2" />
                  View Live
                </Button>
              )}
              {projectDetail.github && (
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.open(projectDetail.github, '_blank', 'noopener,noreferrer')}
                >
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </Button>
              )}
              {projectDetail.caseStudyUrl && (
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.open(projectDetail.caseStudyUrl, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Case Study
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-280px)]">
          <div className="p-6 md:p-8 space-y-8">
            {/* Project Overview Cards */}
            {(projectDetail.duration || projectDetail.teamSize || projectDetail.role) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {projectDetail.duration && (
                  <div className="bg-secondary/30 border border-border rounded-xl p-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-accent" />
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Duration</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{projectDetail.duration}</p>
                  </div>
                )}
                {projectDetail.teamSize && (
                  <div className="bg-secondary/30 border border-border rounded-xl p-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-accent" />
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Team Size</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{projectDetail.teamSize}</p>
                  </div>
                )}
                {projectDetail.role && (
                  <div className="bg-secondary/30 border border-border rounded-xl p-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-accent" />
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">My Role</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{projectDetail.role}</p>
                  </div>
                )}
              </div>
            )}

            {/* Technologies */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {projectDetail.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-3 py-1.5 font-medium">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Key Features */}
            {projectDetail.features && projectDetail.features.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {projectDetail.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 bg-secondary/20 border border-border rounded-lg p-3 hover:bg-secondary/30 transition-colors">
                      <span className="text-accent text-2xl flex-shrink-0 mt-0.5">•</span>
                      <span className="text-sm md:text-base text-foreground leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results & Impact */}
            {projectDetail.results && projectDetail.results.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Results & Impact
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {projectDetail.results.map((result, index) => (
                    <div key={index} className="text-center p-6 bg-accent/10 border border-accent/20 rounded-xl hover:bg-accent/15 transition-colors">
                      <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">
                        {result.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.metric}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Gallery */}
            {projectDetail.images && projectDetail.images.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Project Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectDetail.images.map((image, index) => (
                    <div key={index} className="relative overflow-hidden rounded-xl bg-secondary/20 border border-border group cursor-pointer">
                      <img
                        src={image}
                        alt={`${projectDetail.title} screenshot ${index + 1}`}
                        className="w-full h-full object-cover aspect-video group-hover:scale-105 transition-transform duration-300"
                        onClick={() => handleImageClick(index)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learnings */}
            {projectDetail.learnings && projectDetail.learnings.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Key Learnings</h3>
                <div className="space-y-3">
                  {projectDetail.learnings.map((learning, index) => (
                    <div key={index} className="p-4 bg-accent/10 border-l-4 border-accent rounded-lg hover:bg-accent/15 transition-colors">
                      <div className="text-sm md:text-base text-foreground leading-relaxed">{learning}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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