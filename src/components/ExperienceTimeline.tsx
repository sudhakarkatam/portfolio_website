import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, MapPin, Building, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Experience } from '@/types/portfolio';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export const ExperienceTimeline = ({ experiences }: ExperienceTimelineProps) => {
  return (
    <div className="space-y-6">
      {experiences.map((exp, index) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-8 pb-6 border-l-2 border-accent last:border-l-0"
        >
          {/* Timeline dot with current indicator */}
          <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-lg ${
            exp.current ? 'bg-green-500' : 'bg-accent'
          }`} />

          <div className={`bg-card border border-border rounded-lg p-4 shadow-md hover:shadow-glow transition-all duration-300 ${
            exp.current ? 'ring-2 ring-green-200 shadow-green-100' : ''
          }`}>
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Briefcase className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold">{exp.role}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                  {exp.current && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Current
                    </Badge>
                  )}
                </div>

                {/* Duration, Location, and Type */}
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span className="font-medium">{exp.period}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-xs">{exp.duration}</span>
                  </div>
                  {exp.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{exp.location}</span>
                    </div>
                  )}
                  {exp.type && (
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      <span className="capitalize">{exp.type}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{exp.description}</p>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Key Achievements:</p>
                <div className="space-y-2">
                  {exp.achievements.map((achievement, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Used */}
              {exp.technologies && exp.technologies.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Technologies Used:</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificate Link */}
              {exp.certificateUrl && (
                <div className="pt-2 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => window.open(exp.certificateUrl, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Certificate
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
