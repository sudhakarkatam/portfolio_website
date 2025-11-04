import { ReactNode } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  component?: ReactNode;
  suggestions?: string[];
  timestamp: Date;
}

export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools';
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  image?: string;
}

export interface ProjectChallenge {
  title: string;
  solution: string;
}

export interface ProjectResult {
  value: string;
  metric: string;
}

export interface ProjectDetail extends Project {
  status?: string;
  category?: string;
  demoUrl?: string;
  caseStudyUrl?: string;
  duration?: string;
  teamSize?: string;
  role?: string;
  features?: string[];
  challenges?: ProjectChallenge[];
  results?: ProjectResult[];
  achievements?: string[];
  images?: string[];
  learnings?: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
  current?: boolean;
  position?: string;
  duration?: string;
  location?: string;
  type?: string;
  technologies?: string[];
  certificateUrl?: string;
}

export interface AvailabilityStatus {
  available: boolean;
  statusText: string;
  lastUpdated: Date;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  category: 'entertainment' | 'educational';
  icon: string;
}

export interface PersonalTraits {
  strengths: string[];
  weaknesses: string[];
  hobbies: string[];
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  skills: Skill[];
  projects: ProjectDetail[];
  experience: Experience[];
  contact: {
    email: string;
    github?: string;
    linkedin?: string;
    resume?: string;
    twitter?: string;
  };
  availability?: AvailabilityStatus;
  personalTraits?: PersonalTraits;
}
