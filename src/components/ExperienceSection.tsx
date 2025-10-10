
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Building, Award } from 'lucide-react';
import { Experience } from '@/types/portfolio';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export const ExperienceSection = ({ experiences }: ExperienceSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Experience</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          My journey through various roles and the impact I've made along the way
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 transform md:-translate-x-px"></div>

        <div className="space-y-8">
          {experiences.map((experience, index) => (
            <div key={experience.id} className={`relative flex items-center ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            } flex-col`}>
              {/* Timeline Dot */}
              <div className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-4 border-white shadow-lg transform md:-translate-x-2 z-10 ${
                experience.current ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>

              {/* Content Card */}
              <div className={`ml-12 md:ml-0 w-full md:w-5/12 ${
                index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
              }`}>
                <Card className={`hover:shadow-lg transition-all duration-300 ${
                  experience.current ? 'ring-2 ring-green-200 shadow-green-100' : ''
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {experience.role}
                        </CardTitle>
                        <CardDescription className="text-base font-medium text-blue-600 mt-1">
                          {experience.company}
                        </CardDescription>
                      </div>
                      {experience.current && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Current
                        </Badge>
                      )}
                    </div>

                    {/* Duration and Location */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{experience.duration}</span>
                      </div>
                      {experience.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{experience.location}</span>
                        </div>
                      )}
                      {experience.type && (
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span className="capitalize">{experience.type}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed">
                        {experience.description}
                      </p>
                    </div>

                    {/* Achievements */}
                    {experience.achievements && experience.achievements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {experience.achievements.map((achievement, achievementIndex) => (
                            <li key={achievementIndex} className="flex items-start text-sm">
                              <span className="text-blue-500 mr-2 mt-1.5 flex-shrink-0">•</span>
                              <span className="text-gray-700">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies Used */}
                    {experience.technologies && experience.technologies.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Technologies Used</h4>
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-2/12"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{experiences.length}</div>
          <div className="text-sm text-gray-600">Total Roles</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {experiences.filter(exp => exp.current).length}
          </div>
          <div className="text-sm text-gray-600">Current Role</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(experiences.flatMap(exp => exp.technologies || [])).size}
          </div>
          <div className="text-sm text-gray-600">Technologies</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {Math.floor(experiences.reduce((total, exp) => {
              const years = exp.duration.match(/(\d+)\s*years?/i);
              return total + (years ? parseInt(years[1]) : 0);
            }, 0))}
          </div>
          <div className="text-sm text-gray-600">Years Experience</div>
        </div>
      </div>
    </div>
  );
};