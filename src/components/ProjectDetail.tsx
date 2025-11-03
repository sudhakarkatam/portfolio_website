import { motion } from 'framer-motion';
import { ExternalLink, Github, Calendar, Users, Award, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProjectDetail as ProjectDetailType } from '@/types/portfolio';

interface ProjectDetailProps {
  project: ProjectDetailType;
}

export const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const getStatusColor = (status?: string) => {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'live': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return '';
    switch (category.toLowerCase()) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-lg space-y-4 md:space-y-6"
    >
      {/* Header */}
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          {project.status && (
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          )}
          {project.category && (
            <Badge variant="outline" className={getCategoryColor(project.category)}>
              {project.category}
            </Badge>
          )}
        </div>
        <h3 className="text-2xl md:text-3xl font-bold mb-2">{project.title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-4">{project.description}</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {project.link && (
          <Button
            onClick={() => window.open(project.link, '_blank')}
            className="flex-1 bg-accent hover:bg-accent/90 text-base h-11"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Live
          </Button>
        )}
        {project.github && (
          <Button
            variant="outline"
            onClick={() => window.open(project.github, '_blank')}
            className="flex-1 text-base h-11"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        )}
      </div>

      <Separator />

      {/* Project Overview */}
      {(project.duration || project.teamSize || project.role) && (
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Project Overview
          </h4>
          <div className="space-y-2 text-sm md:text-base">
            {project.duration && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium text-foreground">{project.duration}</span>
              </div>
            )}
            {project.teamSize && (
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Team Size:</span>
                <span className="font-medium text-foreground">{project.teamSize}</span>
              </div>
            )}
            {project.role && (
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">My Role:</span>
                <span className="font-medium text-foreground">{project.role}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Technologies */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-3">Technologies Used</h4>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-sm px-3 py-1">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Key Features */}
      {project.features && project.features.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-3">Key Features</h4>
          <ul className="space-y-2">
            {project.features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm md:text-base">
                <span className="text-accent mr-2 mt-1 text-lg flex-shrink-0">•</span>
                <span className="text-muted-foreground leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

             {/* Learnings */}
      {project.learnings && project.learnings.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Key Learnings
            </h4>
            <div className="space-y-3">
              {project.learnings.map((learning, index) => (
                <div key={index} className="p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                  <div className="text-sm md:text-base text-muted-foreground leading-relaxed">{learning}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
