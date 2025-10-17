import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { portfolioData } from '@/data/portfolioData';
import { ProjectDetailModal } from './ProjectDetailModal';

interface ProjectMiniGridProps {
  onNavigate?: (section: string, projectId?: string) => void;
}

export const ProjectMiniGrid = ({ onNavigate }: ProjectMiniGridProps) => {
  const projects = portfolioData.projects;
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="bg-secondary/50 border-border/50 cursor-pointer hover:bg-secondary/70 transition-colors"
            onClick={() => handleProjectClick(project)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg leading-snug">
                {project.title} {project.category === 'Productivity' ? '📱' : project.category === 'FinTech' ? '💰' : project.category === 'E-Commerce' ? '🛒' : '💻'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-sm md:text-base text-muted-foreground line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-2xs md:text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge variant="outline" className="text-2xs md:text-xs">
                    +{project.technologies.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNavigate={onNavigate}
      />
    </div>
  );
};


