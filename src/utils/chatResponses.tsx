import { portfolioData } from '@/data/portfolioData';
import { ProjectDetail } from '@/components/ProjectDetail';
import { ProjectMiniCard } from '@/components/ProjectMiniCard';
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
  suggestions?: string[];
}

// Helper to wrap responses
const createResponse = (text?: string, component?: ReactNode, suggestions?: string[]): ChatResponse => ({
  text,
  component,
  suggestions
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

  // Specific project request by ID
  if (projectId) {
    const project = portfolioData.projects.find(p => p.id === projectId);
    if (project) {
      // Generate suggestions for other projects dynamically
      const otherProjects = portfolioData.projects.filter(p => p.id !== projectId);
      const suggestions = [
        ...otherProjects.slice(0, 2).map(p => `Tell me about ${p.title}`),
        'Show me all your projects'
      ];
      
      // If query is empty (sidebar click), show mini card
      // If query has text (chat/grid click), show full details
      if (!query || query.trim() === '') {
        return createResponse(
          undefined,
          <ProjectMiniCard project={project} />,
          suggestions
        );
      }
      
      return createResponse(
        `I'd be happy to tell you about **${project.title}**! Here are the details:`,
        <ProjectDetail project={project} />,
        suggestions
      );
    }
  }

  // Specific project request by name in query (check BEFORE generic handlers)
  for (const project of portfolioData.projects) {
    const projectTitleLower = project.title.toLowerCase();
    // Check if query mentions this specific project
    if (lowercaseQuery.includes(projectTitleLower)) {
      const otherProjects = portfolioData.projects.filter(p => p.id !== project.id);
      const suggestions = [
        ...otherProjects.slice(0, 2).map(p => `Tell me about ${p.title}`),
        'Show me all your projects'
      ];
      
      return createResponse(
        `I'd be happy to tell you about **${project.title}**! Here are the details:`,
        <ProjectDetail project={project} />,
        suggestions
      );
    }
  }

  // Personal traits responses (check before generic "about" to avoid false matches)
  if (fuzzyMatch(query, ['hobby', 'hobbies', 'interest', 'fun', 'free time'])) {
    const hobbies = portfolioData.personalTraits?.hobbies || [];
    return createResponse(
      "I'd love to share! Here's what I enjoy doing when I'm not coding:",
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
      </Card>,
      ['Tell me about yourself', 'What are your strengths?', 'Tell me about your experience']
    );
  }

  if (fuzzyMatch(query, ['strength', 'strengths', 'strong', 'good at'])) {
    const strengths = portfolioData.personalTraits?.strengths || [];
    return createResponse(
      "That's a thoughtful question! Here are some of my key strengths:",
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
      </Card>,
      ['What are your technical skills?', 'Show me your projects', 'Tell me about yourself']
    );
  }

  if (fuzzyMatch(query, ['weakness', 'weaknesses', 'weak', 'improve', 'challenge'])) {
    const weaknesses = portfolioData.personalTraits?.weaknesses || [];
    return createResponse(
      "I appreciate you asking! Here are areas I'm actively working to improve:",
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
      </Card>,
      ['What are your strengths?', 'Tell me about your experience', 'What are your technical skills?']
    );
  }

  // Experience responses (check BEFORE about to avoid false matches)
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
      "Absolutely! Let me walk you through my educational and professional journey:",
      <ExperienceTimeline experiences={portfolioData.experience} />,
      ['Show me your projects', 'What are your technical skills?', 'Tell me about yourself']
    );
  }

  // Skills responses - more natural
  if (
    lowercaseQuery.includes('skill') ||
    lowercaseQuery.includes('technolog') ||
    lowercaseQuery.includes('know') ||
    lowercaseQuery.includes('stack')
  ) {
    return createResponse(
      "Great question! I work with a variety of technologies. Here's a breakdown of my technical skills:",
      <SkillsVisualization skills={portfolioData.skills} />,
      ['Show me your projects', 'Tell me about your experience', 'What are your strengths?']
    );
  }

  // About responses - more conversational (check AFTER experience and hobbies to avoid false matches)
  if (
    lowercaseQuery.includes('about') ||
    lowercaseQuery.includes('who') ||
    lowercaseQuery.includes('yourself') ||
    (lowercaseQuery.includes('tell me') && !lowercaseQuery.includes('hobby') && !lowercaseQuery.includes('hobbies') && !lowercaseQuery.includes('experience'))
  ) {
    return createResponse(
      `Sure! I'm excited to share my background with you. Here's a bit about me:`,
      <AboutSection />,
      ['What are your technical skills?', 'Show me your projects', 'Tell me about your hobbies']
    );
  }

  // Projects responses - more engaging
  if (
    lowercaseQuery.includes('project') ||
    lowercaseQuery.includes('built') ||
    lowercaseQuery.includes('created') ||
    (lowercaseQuery.includes('work') && !lowercaseQuery.includes('experience'))
  ) {
    return createResponse(
      "I've worked on several projects that I'm proud of! Here are some of the highlights:",
      <ProjectMiniGrid onNavigate={onNavigate} />,
      ['Tell me about your experience', 'What are your technical skills?', 'What are your strengths?']
    );
  }

  // Contact responses
  if (
    lowercaseQuery.includes('contact') ||
    lowercaseQuery.includes('email') ||
    lowercaseQuery.includes('reach') ||
    lowercaseQuery.includes('connect') ||
    (lowercaseQuery.includes('send') && lowercaseQuery.includes('message')) ||
    lowercaseQuery.includes('form')
  ) {
    return createResponse(
      `I'd love to hear from you! Feel free to fill out the form below, and I'll get back to you as soon as possible.`,
      <ContactForm />,
      ['Tell me about yourself', 'Show me your projects', 'What are your technical skills?']
    );
  }

  // Default response - more welcoming
  return createResponse(
    `👋 *Hi! I'm Sudhakar's AI portfolio assistant.*\n\nI can help you explore:\n\n┌─ 👤 **About Me**\n│  Background, interests & personality\n└─ *"Tell me about yourself"*\n\n┌─ 🛠️ **Technical Skills**\n│  Languages, frameworks & tools\n└─ *"What are your technical skills?"*\n\n┌─ 🚀 **Projects**\n│  Applications I've built\n└─ *"Show me your projects"*\n\n┌─ 💼 **Experience**\n│  Education & work history\n└─ *"Tell me about your experience"*\n\n*What interests you?*`,
    undefined,
    ['Tell me about yourself', 'Show me your projects', 'What are your technical skills?', 'Tell me about your experience']
  );
};
