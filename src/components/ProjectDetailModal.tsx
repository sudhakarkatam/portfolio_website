import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Github, Play, Calendar, Users, Award, Zap, TrendingUp } from 'lucide-react';
import { ProjectDetail } from '@/types/portfolio';

interface ProjectDetailModalProps {
  project: ProjectDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailModal = ({ project, isOpen, onClose }: ProjectDetailModalProps) => {
  if (!project) return null;

  const projectDetail = project as ProjectDetail;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {projectDetail.title}
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-600">
                {projectDetail.description}
              </DialogDescription>
            </div>
            <div className="flex gap-2 ml-4">
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

        <div className="space-y-6">
          {/* Project Image */}
          {projectDetail.image && (
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 h-64 flex items-center justify-center">
              <img
                src={projectDetail.image}
                alt={projectDetail.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-3">
            {projectDetail.demoUrl && (
              <Button asChild className="flex-1">
                <a href={projectDetail.demoUrl} target="_blank" rel="noopener noreferrer">
                  <Play className="w-4 h-4 mr-2" />
                  View Live Demo
                </a>
              </Button>
            )}
            {projectDetail.github && (
              <Button variant="outline" asChild className="flex-1">
                <a href={projectDetail.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  View Source Code
                </a>
              </Button>
            )}
            {projectDetail.caseStudyUrl && (
              <Button variant="outline" asChild className="flex-1">
                <a href={projectDetail.caseStudyUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Case Study
                </a>
              </Button>
            )}
          </div>

          <Separator />

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Project Overview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Project Overview
                </h3>
                <div className="space-y-3 text-sm">
                  {projectDetail.duration && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{projectDetail.duration}</span>
                    </div>
                  )}
                  {projectDetail.teamSize && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Team Size:</span>
                      <span className="font-medium">{projectDetail.teamSize}</span>
                    </div>
                  )}
                  {projectDetail.role && (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">My Role:</span>
                      <span className="font-medium">{projectDetail.role}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {projectDetail.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              {projectDetail.features && projectDetail.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {projectDetail.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Challenges & Solutions */}
              {projectDetail.challenges && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Challenges & Solutions</h3>
                  <div className="space-y-3">
                    {projectDetail.challenges.map((challenge, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900 text-sm mb-1">
                          Challenge: {challenge.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          Solution: {challenge.solution}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results & Impact */}
              {projectDetail.results && projectDetail.results.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Results & Impact
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {projectDetail.results.map((result, index) => (
                      <div key={index} className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {result.value}
                        </div>
                        <div className="text-xs text-green-700">
                          {result.metric}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {projectDetail.achievements && projectDetail.achievements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Achievements</h3>
                  <ul className="space-y-2">
                    {projectDetail.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Award className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Project Gallery */}
          {projectDetail.images && projectDetail.images.length > 1 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {projectDetail.images.slice(1).map((image, index) => (
                    <div key={index} className="relative overflow-hidden rounded-lg aspect-video bg-gray-100">
                      <img
                        src={image}
                        alt={`${projectDetail.title} screenshot ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Learnings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {projectDetail.learnings.map((learning, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="text-sm text-gray-700">{learning}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};