
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
        project.category === 'ai/ml' ? '🤖' : '💻'
    }
  </div >
)}

{/* Status Badge */ }
{
  project.status && (
    <Badge className={`absolute top-2 right-2 ${getStatusColor(project.status)}`}>
      {project.status}
    </Badge>
  )
}

{/* Category Badge */ }
{
  project.category && (
    <Badge variant="outline" className={`absolute top-2 left-2 ${getCategoryColor(project.category)}`}>
      {project.category}
    </Badge>
  )
}
{/* Tags */ }
{
  project.tags && project.tags.length > 0 && (
    <div className="absolute bottom-2 right-2 flex gap-1">
      {project.tags.map((tag, index) => (
        <Badge key={index} className="bg-green-100 text-green-800 border-green-200 text-xs">
          {tag}
        </Badge>
      ))}
    </div>
  )
}

{/* Featured Badge */ }
{
  featured && (
    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-2.5 py-0.5 rounded-full text-xs font-semibold">
      ⭐ Featured
    </div>
  )
}
      </div >

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {project.title}
            </CardTitle>
            <CardDescription className="text-xs text-gray-600 mt-1">
              {project.description.substring(0, 100) + '...'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tech Stack */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
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
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          {project.duration && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{project.duration}</span>
            </div>
          )}
          {project.teamSize && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{project.teamSize}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {project.demoUrl && (
            <Button size="sm" className="flex-1" asChild>
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <Play className="w-3 h-3 mr-1" />
                Demo
              </a>
            </Button>
          )}
          {project.github && (
            <Button size="sm" variant="outline" className="flex-1" asChild>
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-3 h-3 mr-1" />
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
            <ExternalLink className="w-3 h-3 mr-1" />
            Details
          </Button>
        </div>

        {/* Key Achievements */}
        {project.achievements && project.achievements.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-700 mb-1.5">Key Achievements:</div>
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
    </Card >
  );
};