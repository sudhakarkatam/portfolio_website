import { portfolioData } from '@/data/portfolioData';
import { ProjectDetail } from '@/components/ProjectDetail';
import { ExperienceTimeline } from '@/components/ExperienceTimeline';
import { SkillsVisualization } from '@/components/SkillsVisualization';
import { AboutSection } from '@/components/AboutSection';
import { ContactForm } from '@/components/ContactForm';
import { ReactNode } from 'react';
import { ProjectMiniGrid } from '@/components/ProjectMiniGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface ChatResponse {
  text?: string;
  component?: ReactNode;
}

// Helper to wrap responses
const createResponse = (text?: string, component?: ReactNode): ChatResponse => ({
  text,
  component
});

// Helper function for fuzzy string matching with typo tolerance
const fuzzyMatch = (query: string, keywords: string[]): boolean => {
  const lowercaseQuery = query.toLowerCase();
  return keywords.some(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    // Exact match
    if (lowercaseQuery.includes(lowerKeyword)) return true;
    
    // Common typo variations
    const typoVariations = [
      lowerKeyword.replace('ght', 'ht'), // strength -> strenght
      lowerKeyword.replace('ht', 'ght'), // strenght -> strength
      lowerKeyword.replace('ss', 's'),   // strengths -> strength
      lowerKeyword.replace('s', 'ss'),   // strength -> strengths
      lowerKeyword.replace('e', 'a'),    // weekness -> weakness
      lowerKeyword.replace('a', 'e'),    // weakness -> weekness
      lowerKeyword.replace('ie', 'y'),   // hobbie -> hobby
      lowerKeyword.replace('y', 'ie'),   // hobby -> hobbie
    ];
    
    return typoVariations.some(variation => lowercaseQuery.includes(variation));
  });
};

export const generateResponse = (query: string = '', projectId?: string, onNavigate?: (section: string, projectId?: string) => void): ChatResponse => {
  const lowercaseQuery = query.toLowerCase();

  // Specific project request
  if (projectId) {
    const project = portfolioData.projects.find(p => p.id === projectId);
    if (project) {
      return createResponse(
        `Here's detailed information about ${project.title}:`,
        <ProjectDetail project={project} />
      );
    }
  }

  // About responses
  if (
    lowercaseQuery.includes('about') ||
    lowercaseQuery.includes('who') ||
    lowercaseQuery.includes('yourself') ||
    lowercaseQuery.includes('tell me')
  ) {
    return createResponse(undefined, <AboutSection />);
  }

  // Skills responses
  if (
    lowercaseQuery.includes('skill') ||
    lowercaseQuery.includes('technolog') ||
    lowercaseQuery.includes('know') ||
    lowercaseQuery.includes('stack')
  ) {
    return createResponse(
      "Here's an overview of my technical skills organized by category:",
      <SkillsVisualization skills={portfolioData.skills} />
    );
  }

  // Experience responses (check first to avoid conflicts with "work" in projects)
  if (
    lowercaseQuery.includes('experience') ||
    lowercaseQuery.includes('worked') ||
    lowercaseQuery.includes('job') ||
    lowercaseQuery.includes('career') ||
    lowercaseQuery.includes('education') ||
    lowercaseQuery.includes('university') ||
    lowercaseQuery.includes('degree') ||
    lowercaseQuery.includes('internship') ||
    lowercaseQuery.includes('certification')
  ) {
    return createResponse(
      "Here's my educational and professional journey:",
      <ExperienceTimeline experiences={portfolioData.experience} />
    );
  }

  // Projects responses
  if (
    lowercaseQuery.includes('project') ||
    lowercaseQuery.includes('built') ||
    lowercaseQuery.includes('created') ||
    (lowercaseQuery.includes('work') && !lowercaseQuery.includes('experience'))
  ) {
    return createResponse(
      undefined,
      <ProjectMiniGrid onNavigate={onNavigate} />
    );
  }

  // Personal traits responses
  if (fuzzyMatch(query, ['strength', 'strengths', 'strong', 'good at'])) {
    const strengths = portfolioData.personalTraits?.strengths || [];
    return createResponse(
      "Here are my key strengths:",
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-accent">💪 My Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">✓</Badge>
                <span className="text-foreground">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }

  if (fuzzyMatch(query, ['weakness', 'weaknesses', 'weak', 'improve', 'challenge'])) {
    const weaknesses = portfolioData.personalTraits?.weaknesses || [];
    return createResponse(
      "Here are areas I'm working to improve:",
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-accent">🎯 Areas for Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">📈</Badge>
                <span className="text-foreground">{weakness}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }

  if (fuzzyMatch(query, ['hobby', 'hobbies', 'interest', 'fun', 'free time'])) {
    const hobbies = portfolioData.personalTraits?.hobbies || [];
    return createResponse(
      "Here's what I enjoy doing in my free time:",
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-accent">🎨 My Hobbies & Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {hobbies.map((hobby, index) => (
              <li key={index} className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">⭐</Badge>
                <span className="text-foreground">{hobby}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }

  // Contact responses - show contact form
  if (
    lowercaseQuery.includes('contact') ||
    lowercaseQuery.includes('email') ||
    lowercaseQuery.includes('reach') ||
    lowercaseQuery.includes('connect') ||
    (lowercaseQuery.includes('send') && lowercaseQuery.includes('message')) ||
    lowercaseQuery.includes('form')
  ) {
    return createResponse(
      `Feel free to reach out, I'll get back to you soon.`,
      <ContactForm />
    );
  }

  // Default response
  return createResponse(
    `🤖 *Hi! I'm your AI portfolio assistant!*\n\nI can help you learn about:\n\n┌─ 🎓 **Education & Certifications**\n│  • B.Tech Computer Science\n│  • Salesforce & AWS internships\n│  • View certificates & achievements\n└─ Click "Experience" in sidebar\n\n┌─ 🚀 **Projects & Applications**\n│  • 3 real applications built\n│  • Mobile, Web & Finance apps\n│  • Personal & practical projects\n└─ Click "Projects" in sidebar\n\n┌─ 🛠️ **Skills & Technologies**\n│  • Full-stack development\n│  • Cloud & CRM technologies\n│  • Interactive skill visualization\n└─ Click "Skills" in sidebar\n\n💡 *Try asking: "Tell me about your projects" or "Show me your experience"*`
  );
};
