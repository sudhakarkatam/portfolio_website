import { useState } from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolioData";
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/ContactForm";

const Portfolio = () => {
  const {
    name,
    title,
    bio,
    skills,
    projects,
    experience,
    contact,
    personalTraits,
    availability,
  } = portfolioData;
  const [showContactForm, setShowContactForm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Separate education and work experience, filter out internships
  const education = experience.filter((exp) => exp.type === "Education");
  const workExperience = experience.filter(
    (exp) => exp.type !== "Education" && exp.type !== "Virtual Internship",
  );

  // Get icon component from icon name
  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Code;
  };

  // Smooth scroll function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Scroll to top of portfolio (about section)
  const scrollToTop = () => {
    scrollToSection("about");
  };

  // Handle "Let's work together" click
  const handleLetsWorkTogether = () => {
    setShowContactForm(true);
    setTimeout(() => {
      scrollToSection("contact");
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-4xl">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-12 sm:mb-20 sticky top-3 sm:top-6 z-50 bg-background/90 backdrop-blur-sm py-3 sm:py-4 px-4 rounded-lg border border-border/50">
          <button
            onClick={scrollToTop}
            className="text-lg sm:text-xl font-semibold hover:text-primary transition-colors cursor-pointer"
          >
            {name.split(" ")[0]}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4 items-center">
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm hover:text-primary transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("skills")}
              className="text-sm hover:text-primary transition-colors"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection("experience")}
              className="text-sm hover:text-primary transition-colors"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection("education")}
              className="text-sm hover:text-primary transition-colors"
            >
              Education
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="text-sm hover:text-primary transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection("contact")}
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-md transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg md:hidden">
              <div className="flex flex-col p-4 space-y-3">
                <button
                  onClick={() => {
                    scrollToSection("about");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-sm hover:text-primary transition-colors py-2"
                >
                  About
                </button>
                <button
                  onClick={() => {
                    scrollToSection("skills");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-sm hover:text-primary transition-colors py-2"
                >
                  Skills
                </button>
                <button
                  onClick={() => {
                    scrollToSection("experience");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-sm hover:text-primary transition-colors py-2"
                >
                  Experience
                </button>
                <button
                  onClick={() => {
                    scrollToSection("education");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-sm hover:text-primary transition-colors py-2"
                >
                  Education
                </button>
                <button
                  onClick={() => {
                    scrollToSection("projects");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-sm hover:text-primary transition-colors py-2"
                >
                  Projects
                </button>
                <button
                  onClick={() => {
                    scrollToSection("contact");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-sm hover:text-primary transition-colors py-2"
                >
                  Contact
                </button>
                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                  {contact.resume && (
                    <a
                      href={contact.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Resume
                    </a>
                  )}
                  <a
                    href="/"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Chat
                  </a>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Hero / About Section */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 sm:mb-24"
        >
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
            <div className="flex-1 order-2 md:order-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
                {name}
              </h1>
              <p className="text-base sm:text-lg italic text-muted-foreground mb-4 sm:mb-6">
                {title}
              </p>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                {bio}
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
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
            <div className="flex-shrink-0 relative order-1 md:order-2 self-center">
              <img
                src="/profile_image.jpeg"
                alt={name}
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-muted"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {availability && availability.available && (
                <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-background border border-primary/30 rounded-full shadow-sm">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
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
          transition={{ delay: 0.2 }}
          className="mb-16 sm:mb-24 scroll-mt-20"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            Present
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Currently I'm focused on building innovative projects and creating
            full-stack applications that solve real problems and push the
            boundaries of what's possible. Always excited to collaborate on new
            ideas and take on challenging projects.{" "}
            <button
              onClick={handleLetsWorkTogether}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              Let's work together.
            </button>
          </p>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-primary">
              Currently Learning
            </h3>
            <div className="space-y-1 text-base text-muted-foreground">
              <div>AI</div>
              <div>DevOps</div>
              <div>Building apps</div>
            </div>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          id="skills"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16 sm:mb-24 scroll-mt-20"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Skills</h2>
          <div className="space-y-6">
            {["Frontend", "Backend", "Database", "Tools"].map((category) => {
              const categorySkills = skills.filter(
                (s) => s.category === category,
              );
              if (categorySkills.length === 0) return null;

              // Color schemes for each category
              const categoryColors: Record<
                string,
                { bg: string; text: string; border: string }
              > = {
                Frontend: {
                  bg: "bg-blue-500/20",
                  text: "text-blue-600 dark:text-blue-400",
                  border: "border-blue-500/30",
                },
                Backend: {
                  bg: "bg-purple-500/20",
                  text: "text-purple-600 dark:text-purple-400",
                  border: "border-purple-500/30",
                },
                Database: {
                  bg: "bg-green-500/20",
                  text: "text-green-600 dark:text-green-400",
                  border: "border-green-500/30",
                },
                Tools: {
                  bg: "bg-orange-500/20",
                  text: "text-orange-600 dark:text-orange-400",
                  border: "border-orange-500/30",
                },
              };

              const colors =
                categoryColors[category] || categoryColors.Frontend;

              return (
                <div key={category}>
                  <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-foreground">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                    {categorySkills.map((skill) => {
                      const IconComponent = getIconComponent(skill.icon);
                      return (
                        <Badge
                          key={skill.name}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-normal ${colors.bg} ${colors.text} ${colors.border} border hover:opacity-80 transition-opacity inline-flex items-center gap-1.5 sm:gap-2`}
                        >
                          <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                          {skill.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Work Experience Section */}
        <motion.section
          id="experience"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-16 sm:mb-24 scroll-mt-20"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
            Experience
          </h2>
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
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-xs font-normal"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Education Section */}
        <motion.section
          id="education"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="mb-16 sm:mb-24 scroll-mt-20"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
            Education
          </h2>
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

        {/* Projects Section */}
        <motion.section
          id="projects"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16 sm:mb-24 scroll-mt-20"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
            Projects
          </h2>
          <div className="space-y-8 sm:space-y-12">
            {projects.map((project) => (
              <div
                key={project.id}
                className="pb-6 sm:pb-8 border-b last:border-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    {project.icon &&
                      (() => {
                        const IconComponent = getIconComponent(project.icon);
                        return (
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                        );
                      })()}
                    <h3 className="text-lg sm:text-xl font-semibold mb-0">
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 self-start">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
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
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.technologies.map((tech) => {
                    // Assign colors based on technology type
                    const getTechColor = (techName: string) => {
                      const lowerTech = techName.toLowerCase();
                      if (
                        lowerTech.includes("react") ||
                        lowerTech.includes("next") ||
                        lowerTech.includes("vue") ||
                        lowerTech.includes("angular")
                      ) {
                        return {
                          bg: "bg-blue-500/20",
                          text: "text-blue-600 dark:text-blue-400",
                          border: "border-blue-500/30",
                        };
                      }
                      if (
                        lowerTech.includes("node") ||
                        lowerTech.includes("express") ||
                        lowerTech.includes("java") ||
                        lowerTech.includes("spring")
                      ) {
                        return {
                          bg: "bg-purple-500/20",
                          text: "text-purple-600 dark:text-purple-400",
                          border: "border-purple-500/30",
                        };
                      }
                      if (
                        lowerTech.includes("postgres") ||
                        lowerTech.includes("mysql") ||
                        lowerTech.includes("mongodb") ||
                        lowerTech.includes("redis") ||
                        lowerTech.includes("supabase") ||
                        lowerTech.includes("firebase")
                      ) {
                        return {
                          bg: "bg-green-500/20",
                          text: "text-green-600 dark:text-green-400",
                          border: "border-green-500/30",
                        };
                      }
                      if (
                        lowerTech.includes("docker") ||
                        lowerTech.includes("aws") ||
                        lowerTech.includes("git") ||
                        lowerTech.includes("vite") ||
                        lowerTech.includes("typescript") ||
                        lowerTech.includes("javascript")
                      ) {
                        return {
                          bg: "bg-orange-500/20",
                          text: "text-orange-600 dark:text-orange-400",
                          border: "border-orange-500/30",
                        };
                      }
                      // Default color
                      return {
                        bg: "bg-slate-500/20",
                        text: "text-slate-600 dark:text-slate-400",
                        border: "border-slate-500/30",
                      };
                    };

                    const colors = getTechColor(tech);
                    return (
                      <Badge
                        key={tech}
                        className={`text-xs font-normal px-2 sm:px-3 py-0.5 sm:py-1 ${colors.bg} ${colors.text} ${colors.border} border`}
                      >
                        {tech}
                      </Badge>
                    );
                  })}
                </div>
              </div>
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
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {personalTraits.hobbies.map((hobby, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs sm:text-sm font-normal px-2 sm:px-3 py-0.5 sm:py-1"
                >
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
          className="mb-12 sm:mb-16 scroll-mt-20"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            Get in Touch
          </h2>
          {showContactForm ? (
            <div className="mb-6">
              <ContactForm />
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                Want to chat? Just shoot me a message via email or reach out on
                social media.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm border rounded-md hover:bg-muted transition-colors"
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
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm border rounded-md hover:bg-muted transition-colors"
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
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm border rounded-md hover:bg-muted transition-colors"
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
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm border rounded-md hover:bg-muted transition-colors"
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
        <footer className="text-center text-xs sm:text-sm text-muted-foreground py-6 sm:py-8 border-t">
          <p>
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Portfolio;
