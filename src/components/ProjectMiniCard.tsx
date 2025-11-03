import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import { ProjectDetail as ProjectDetailType } from '@/types/portfolio';

interface ProjectMiniCardProps {
  project: ProjectDetailType;
}

export const ProjectMiniCard = ({ project }: ProjectMiniCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg leading-snug">
            {project.title} {project.category === 'Productivity' ? '📱' : project.category === 'FinTech' ? '💰' : project.category === 'E-Commerce' ? '🛒' : project.category === 'Job Portal' ? '💼' : '💻'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
          {/* Action Buttons */}
          {(project.link || project.github) && (
            <div className="flex gap-3 pt-2">
              {project.link && (
                <Button
                  onClick={() => window.open(project.link, '_blank')}
                  className="flex-1 bg-accent hover:bg-accent/90 text-base h-9"
                  size="sm"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live
                </Button>
              )}
              {project.github && (
                <Button
                  variant="outline"
                  onClick={() => window.open(project.github, '_blank')}
                  className="flex-1 text-base h-9"
                  size="sm"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

