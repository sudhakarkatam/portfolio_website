import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Play, Calendar, Users } from 'lucide-react';
import { ProjectDetail } from '@/types/portfolio';

interface ProjectCardProps {
  project: ProjectDetail;
  featured?: boolean;
  onViewDetails?: (project: ProjectDetail) => void;
}

export const ProjectCard = ({ project, featured = false, onViewDetails }: ProjectCardProps) => {
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
    <Card className={`group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
      featured ? 'ring-2 ring-blue-200 shadow-md' : ''
    }`}>
      {/* Project Image/Thumbnail */}
      <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-50 to-indigo-100 h-48 flex items-center justify-center">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-6xl opacity-20">
            {project.category === 'web' ? '🌐' :
             project.category === 'mobile' ? '📱' :
             project.category === 'ai/ml' ? '🤖' : '💻'}
          </div>
        )}

        {/* Status Badge */}
        {project.status && (
          <Badge className={`absolute top-3 right-3 ${getStatusColor(project.status)}`}>
            {project.status}
          </Badge>
        )}

        {/* Category Badge */}
        {project.category && (
          <Badge variant="outline" className={`absolute top-3 left-3 ${getCategoryColor(project.category)}`}>
            {project.category}
          </Badge>
        )}

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
            ⭐ Featured
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {project.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              {project.description.substring(0, 100) + '...'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tech Stack */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Project Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          {project.duration && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{project.duration}</span>
            </div>
          )}
          {project.teamSize && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{project.teamSize}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {project.demoUrl && (
            <Button size="sm" className="flex-1" asChild>
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <Play className="w-4 h-4 mr-1" />
                Demo
              </a>
            </Button>
          )}
          {project.github && (
            <Button size="sm" variant="outline" className="flex-1" asChild>
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-1" />
                Code
              </a>
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewDetails?.(project)}
            className="flex-1"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Details
          </Button>
        </div>

        {/* Key Achievements */}
        {project.achievements && project.achievements.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-700 mb-2">Key Achievements:</div>
            <ul className="text-xs text-gray-600 space-y-1">
              {project.achievements.slice(0, 2).map((achievement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};