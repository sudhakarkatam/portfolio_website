import { useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '@/data/portfolioData';
import { Mail, Github, Linkedin, Twitter, ExternalLink, CheckCircle2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ContactForm } from '@/components/ContactForm';
import { Card, CardContent } from '@/components/ui/card';

const Portfolio = () => {
  const { name, title, bio, skills, projects, experience, contact, personalTraits, availability } = portfolioData;
  const [showContactForm, setShowContactForm] = useState(false);

  // Separate education and work experience, filter out internships
  const education = experience.filter(exp => exp.type === 'Education');
  const workExperience = experience.filter(exp => exp.type !== 'Education' && exp.type !== 'Virtual Internship');

  // Get icon component from icon name
  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Code;
  };

  // Smooth scroll function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to top of portfolio (about section)
  const scrollToTop = () => {
    scrollToSection('about');
  };

  // Handle "Let's work together" click
  const handleLetsWorkTogether = () => {
    setShowContactForm(true);
    setTimeout(() => {
      scrollToSection('contact');
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-20 sticky top-6 z-50 bg-background/80 backdrop-blur-sm py-4 rounded-lg">
          <button 
            onClick={scrollToTop}
            className="text-xl font-semibold hover:text-primary transition-colors cursor-pointer"
          >
            {name.split(' ')[0]}
          </button>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-sm hover:text-primary transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('skills')}
              className="text-sm hover:text-primary transition-colors"
            >
              Skills
            </button>
            <button 
              onClick={() => scrollToSection('experience')}
              className="text-sm hover:text-primary transition-colors"
            >
              Experience
            </button>
            <button 
              onClick={() => scrollToSection('education')}
              className="text-sm hover:text-primary transition-colors"
            >
              Education
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="text-sm hover:text-primary transition-colors"
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-sm hover:text-primary transition-colors"
            >
              Contact
            </button>
            {contact.resume && (
              <a 
                href={contact.resume} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
              >
                Resume
              </a>
            )}
            <a 
              href="/" 
              className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
            >
              Chat
            </a>
          </div>
        </nav>

        {/* Hero / About Section */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                {name}
              </h1>
              <p className="text-lg italic text-muted-foreground mb-6">
                {title}
              </p>
              <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                {bio}
              </p>
              <div className="flex flex-wrap gap-3">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                )}
                {contact.github && (
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                {contact.linkedin && (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {contact.twitter && (
                  <a
                    href={contact.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 relative">
              <img
                src="/profile_image.jpeg"
                alt={name}
                className="w-48 h-48 rounded-full object-cover border-4 border-muted"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {availability && availability.available && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background border border-primary/30 rounded-full shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-foreground">
                      {availability.statusText}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Present Section */}
        <motion.section
          id="present"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-24 scroll-mt-20"
        >
          <h2 className="text-2xl font-bold mb-6">Present</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Currently I'm focused on building innovative projects and creating full-stack applications that solve real problems and push the boundaries of what's possible. Always excited to collaborate on new ideas and take on challenging projects.{' '}
            <button
              onClick={handleLetsWorkTogether}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              Let's work together.
            </button>
          </p>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          id="skills"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-24 scroll-mt-20"
        >
          <h2 className="text-2xl font-bold mb-6">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => {
              const IconComponent = getIconComponent(skill.icon);
              return (
                <Badge 
                  key={skill.name} 
                  className="px-4 py-2 text-sm font-normal bg-muted text-foreground hover:bg-muted/80 transition-colors inline-flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {skill.name}
                </Badge>
              );
            })}
          </div>
        </motion.section>

        {/* Work Experience Section */}
        {workExperience.length > 0 && (
          <motion.section
            id="experience"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-24 scroll-mt-20"
          >
            <h2 className="text-2xl font-bold mb-8">Experience</h2>
            <div className="space-y-8">
              {workExperience.map((exp) => (
                <div key={exp.id} className="pb-8 border-b last:border-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{exp.role}</h3>
                      <p className="text-muted-foreground">{exp.company}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {exp.period}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {exp.description}
                  </p>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs font-normal">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <motion.section
            id="education"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-24 scroll-mt-20"
          >
            <h2 className="text-2xl font-bold mb-8">Education</h2>
            <div className="space-y-8">
              {education.map((edu) => (
                <div key={edu.id} className="pb-8 border-b last:border-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{edu.role}</h3>
                      <p className="text-muted-foreground">{edu.company}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {edu.period}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {edu.description}
                  </p>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {edu.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Projects Section */}
        <motion.section
          id="projects"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-24 scroll-mt-20"
        >
          <h2 className="text-2xl font-bold mb-8">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="border hover:shadow-lg transition-shadow overflow-hidden group">
                <CardContent className="p-0">
                  {project.image && (
                    <div className="w-full h-48 bg-muted overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold mb-2 flex-1">{project.title}</h3>
                      <div className="flex gap-2 flex-shrink-0">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs font-normal">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge variant="secondary" className="text-xs font-normal">
                          +{project.technologies.length - 4}
                        </Badge>
                      )}
                    </div>
                    {project.status && (
                      <Badge variant={project.status === 'Live' ? 'default' : 'outline'} className="text-xs">
                        {project.status}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Hobbies Section */}
        {personalTraits?.hobbies && personalTraits.hobbies.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-24 scroll-mt-20"
          >
            <h2 className="text-2xl font-bold mb-6">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {personalTraits.hobbies.map((hobby, index) => (
                <Badge key={index} variant="secondary" className="text-sm font-normal px-3 py-1">
                  {hobby}
                </Badge>
              ))}
            </div>
          </motion.section>
        )}

        {/* Contact Section */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16 scroll-mt-20"
        >
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          {showContactForm ? (
            <div className="mb-6">
              <ContactForm />
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                Want to chat? Just shoot me a message via email or reach out on social media.
              </p>
              <div className="flex flex-wrap gap-3">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                )}
                {contact.github && (
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                {contact.linkedin && (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {contact.twitter && (
                  <a
                    href={contact.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                )}
              </div>
            </>
          )}
        </motion.section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-8 border-t">
          <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Portfolio;
