import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/portfolio';

interface ProjectDetailProps {
  project: Project;
}

export const ProjectDetail = ({ project }: ProjectDetailProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6 shadow-lg"
    >
      <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
      <p className="text-muted-foreground mb-4">{project.description}</p>
      
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2">Technologies Used:</h4>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {project.link && (
          <Button
            onClick={() => window.open(project.link, '_blank')}
            className="bg-accent hover:bg-accent/90"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Live
          </Button>
        )}
        {project.github && (
          <Button
            variant="outline"
            onClick={() => window.open(project.github, '_blank')}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        )}
      </div>
    </motion.div>
  );
};
