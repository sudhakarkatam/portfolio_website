import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ExternalLink, Github, Play, Calendar, Users, Award, Zap, TrendingUp, X, 
  ArrowLeft, ArrowRight, Sparkles, Lightbulb 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ProjectDetail } from '@/types/portfolio';
import { FollowUpSuggestions } from './FollowUpSuggestions';

interface ProjectAITourProps {
  project: ProjectDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (section: string, projectId?: string) => void;
}

export const ProjectAITour = ({ project, isOpen, onClose, onNavigate }: ProjectAITourProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false);
  const [narrationText, setNarrationText] = useState('');
  const [completedNarration, setCompletedNarration] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const narrationTimeoutRef = useRef<NodeJS.Timeout>();
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout>();

  // Build dynamic slides based on available content - must be computed before hooks
  const availableSlides = React.useMemo(() => {
    if (!project) return [];
    
    const slides = [
      {
        type: 'intro',
        narration: `Let me walk you through **${project.title}**! This is one of my favorite ${project.category?.toLowerCase() || 'projects'}.`,
        hasContent: false,
      },
      {
        type: 'overview',
        narration: project.description || `${project.title} is an innovative project that showcases modern development practices.`,
        hasContent: true,
      },
      {
        type: 'technologies',
        narration: `I built this using modern technologies that allowed me to create a robust and scalable solution.`,
        hasContent: true,
      },
      {
        type: 'features',
        narration: `Here's what makes this project special - the unique features that set it apart.`,
        hasContent: project.features && project.features.length > 0,
      },
      {
        type: 'results',
        narration: `The results were impressive and exceeded my initial expectations.`,
        hasContent: project.results && project.results.length > 0,
      },
      {
        type: 'gallery',
        narration: `Here's what it looks like in action - you can click on any image to see it full size.`,
        hasContent: project.images && project.images.length > 0,
      },
      {
        type: 'learnings',
        narration: `This project taught me valuable lessons that shaped my approach to development.`,
        hasContent: project.learnings && project.learnings.length > 0,
      },
      {
        type: 'cta',
        narration: `Want to explore it yourself? Check out the live version or browse the code on GitHub.`,
        hasContent: true,
      },
    ];

    // Filter out slides without content
    return slides.filter(slide => slide.hasContent || slide.type === 'intro');
  }, [project]);

  const totalSlides = availableSlides.length;

  // Color helpers
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
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Streaming narration effect
  useEffect(() => {
    if (!isOpen || !project || availableSlides.length === 0) {
      setCurrentSlide(0);
      setNarrationText('');
      setIsNarrating(false);
      setCompletedNarration(false);
      return;
    }

    const slideContent = availableSlides[currentSlide] || { narration: '', hasContent: false, type: '' };
    
    // Clear any existing timeouts
    if (narrationTimeoutRef.current) clearInterval(narrationTimeoutRef.current);
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);

    // Only stream narration if slide has content
    if (slideContent.hasContent) {
      setIsNarrating(true);
      setCompletedNarration(false);
      setNarrationText('');
      
      const words = slideContent.narration.split(' ');
      let wordIndex = 0;

      narrationTimeoutRef.current = setInterval(() => {
        if (wordIndex < words.length) {
          setNarrationText(words.slice(0, wordIndex + 1).join(' '));
          wordIndex++;
        } else {
          clearInterval(narrationTimeoutRef.current);
          setIsNarrating(false);
          setCompletedNarration(true);
        }
      }, 40);
    } else {
      setIsNarrating(false);
      setCompletedNarration(true);
    }

    return () => {
      if (narrationTimeoutRef.current) clearInterval(narrationTimeoutRef.current);
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    };
  }, [currentSlide, isOpen, project, availableSlides, totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      } else if (e.key === 'ArrowRight' && currentSlide < totalSlides - 1) {
        setCurrentSlide(currentSlide + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentSlide, totalSlides, onClose]);

  // Prevent body scroll when tour is open
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

  // Early return after all hooks
  if (!project) return null;

  const projectDetail = project as ProjectDetail;

  const handleSkipNarration = () => {
    if (narrationTimeoutRef.current) clearInterval(narrationTimeoutRef.current);
    const slideContent = availableSlides[currentSlide] || { narration: '', hasContent: false, type: '' };
    setNarrationText(slideContent.narration);
    setIsNarrating(false);
    setCompletedNarration(true);
  };

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  // Render slide content
  const renderSlideContent = () => {
    const currentSlideData = availableSlides[currentSlide];
    const slideType = currentSlideData?.type || '';
    
    switch (slideType) {
      case 'intro': // Introduction
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-3xl" />
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-accent/50 shadow-2xl">
                  <AvatarFallback className="bg-gradient-to-br from-accent to-accent/60">
                    <Sparkles className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </motion.div>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">{projectDetail.title}</h2>
              <div className="flex flex-wrap gap-2 justify-center">
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
          </div>
        );

      case 'overview': // Overview
        return (
          <div className="space-y-6">
            {(projectDetail.duration || projectDetail.teamSize || projectDetail.role) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {projectDetail.duration && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-secondary/30 border border-border rounded-xl p-4 text-center"
                  >
                    <Calendar className="w-8 h-8 text-accent mx-auto mb-2" />
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Duration</div>
                    <div className="text-2xl font-bold">{projectDetail.duration}</div>
                  </motion.div>
                )}
                {projectDetail.teamSize && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-secondary/30 border border-border rounded-xl p-4 text-center"
                  >
                    <Users className="w-8 h-8 text-accent mx-auto mb-2" />
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Team Size</div>
                    <div className="text-2xl font-bold">{projectDetail.teamSize}</div>
                  </motion.div>
                )}
                {projectDetail.role && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-secondary/30 border border-border rounded-xl p-4 text-center"
                  >
                    <Award className="w-8 h-8 text-accent mx-auto mb-2" />
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">My Role</div>
                    <div className="text-2xl font-bold">{projectDetail.role}</div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        );

      case 'technologies': // Technologies
        return (
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 justify-center"
            >
              {projectDetail.technologies.map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );

      case 'features': // Key Features
        return (
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {projectDetail.features?.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 bg-secondary/20 border border-border rounded-lg p-4 hover:bg-secondary/30 transition-colors"
                >
                  <span className="text-accent text-2xl flex-shrink-0">•</span>
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );

      case 'results': // Results & Impact
        return (
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {projectDetail.results?.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center p-6 bg-accent/10 border border-accent/20 rounded-xl"
                >
                  <div className="text-4xl font-bold text-accent mb-2">{result.value}</div>
                  <div className="text-sm text-muted-foreground">{result.metric}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );

      case 'gallery': // Gallery
        return projectDetail.images && projectDetail.images.length > 0 ? (
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {projectDetail.images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.2 }}
                  className="relative overflow-hidden rounded-xl bg-secondary/20 border border-border cursor-pointer group"
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={image}
                    alt={`${projectDetail.title} screenshot ${index + 1}`}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : null;

      case 'learnings': // Key Learnings
        return projectDetail.learnings && projectDetail.learnings.length > 0 ? (
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              {projectDetail.learnings.map((learning, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.2 }}
                  className="p-4 bg-accent/10 border-l-4 border-accent rounded-lg"
                >
                  <div className="text-foreground">{learning}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : null;

      case 'cta': // Call to Action
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-center">
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
            </div>
          </div>
        );

      default:
        return null;
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
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]"
            />
            
            {/* Tour Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Content Area */}
              <div className="w-full max-w-4xl bg-background border border-border rounded-2xl shadow-2xl flex flex-col h-full max-h-[90vh]">
                {/* Header */}
                <div className="flex-shrink-0 border-b border-border p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-accent/30">
                      <AvatarFallback className="bg-gradient-to-br from-accent to-accent/60">
                        <Sparkles className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-lg">AI Tour Guide</div>
                      <div className="text-sm text-muted-foreground">Walking you through this project</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="hover:bg-secondary"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Narration Area */}
                <div className="flex-shrink-0 border-b border-border p-6 bg-secondary/10">
                  <div className="max-w-3xl mx-auto">
                    <p className="text-lg leading-relaxed">
                      {narrationText.split('**').map((part, i) =>
                        i % 2 === 1 ? <span key={i} className="font-bold text-accent">{part}</span> : part
                      )}
                      {isNarrating && (
                        <motion.span
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="inline-block w-2 h-5 bg-current ml-1 align-middle"
                        />
                      )}
                    </p>
                  </div>
                  {isNarrating && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSkipNarration}
                        className="text-xs"
                      >
                        Skip narration
                      </Button>
                    </div>
                  )}
                </div>

                {/* Slide Content */}
                <div className="flex-1 overflow-y-auto p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex items-center justify-center"
                    >
                      {renderSlideContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Bottom Navigation */}
                <div className="flex-shrink-0 border-t border-border p-4 bg-secondary/10">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={currentSlide === 0}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    {/* Progress Dots */}
                    <div className="flex gap-2">
                      {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentSlide
                              ? 'bg-accent w-8'
                              : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                          }`}
                        />
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNext}
                      disabled={currentSlide >= totalSlides - 1}
                      className="gap-2"
                    >
                      {currentSlide >= totalSlides - 1 ? 'Close' : 'Next'}
                      {currentSlide < totalSlides - 1 && <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      {lightboxOpen && projectDetail.images && projectDetail.images.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleCloseLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 p-3 bg-black/60 hover:bg-black/80 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleCloseLightbox();
            }}
          >
            <X className="h-8 w-8" />
          </button>
          
          <div className="max-w-7xl max-h-full w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={projectDetail.images[selectedImageIndex]}
              alt={`${projectDetail.title} - Image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </motion.div>
      )}
    </>
  );
};

