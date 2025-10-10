import { portfolioData } from '@/data/portfolioData';
import { ProjectDetail } from '@/components/ProjectDetail';
import { ExperienceTimeline } from '@/components/ExperienceTimeline';
import { SkillsVisualization } from '@/components/SkillsVisualization';
import { AboutSection } from '@/components/AboutSection';
import { ReactNode } from 'react';

export interface ChatResponse {
  text?: string;
  component?: ReactNode;
}

// Helper to wrap responses
const createResponse = (text?: string, component?: ReactNode): ChatResponse => ({
  text,
  component
});

export const generateResponse = (query: string = '', projectId?: string): ChatResponse => {
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
      `I've built ${portfolioData.projects.length} real applications. Here's an overview:\n\n` +
        portfolioData.projects.map((p, i) =>
          `┌─ ${i + 1}. **${p.title}**\n` +
          `│  ${p.description.substring(0, 100)}${p.description.length > 100 ? '...' : ''}\n` +
          `│  🔧 ${p.technologies.slice(0, 3).join(', ')}${p.technologies.length > 3 ? ' +' + (p.technologies.length - 3) + ' more' : ''}\n` +
          `│  📂 ${p.category} • ${p.status}\n` +
          `└─ ${p.duration} • ${p.teamSize}`
        ).join('\n\n') +
        '\n\n💡 *Click on any project in the sidebar to see full details, or ask me about a specific project!*'
    );
  }

  // Contact responses
  if (
    lowercaseQuery.includes('contact') ||
    lowercaseQuery.includes('email') ||
    lowercaseQuery.includes('reach') ||
    lowercaseQuery.includes('connect')
  ) {
    return createResponse(
      `📬 *Let's connect! Here's how to reach me:*\n\n┌─ 📧 **Email**\n│  ${portfolioData.contact.email}\n│  *(Click the email in About section to send message)*\n└─ Best for: opportunities & collaborations\n\n┌─ 💼 **LinkedIn**\n│  Professional Profile & Networking\n│  ${portfolioData.contact.linkedin}\n└─ Connect for: career opportunities\n\n┌─ 🐙 **GitHub**\n│  ${portfolioData.contact.github}\n└─ View my code & contributions\n\n┌─ 🐦 **Twitter**\n│  ${portfolioData.contact.twitter}\n└─ Tech discussions & updates\n\n💬 *I'm always open to discussing new opportunities, tech trends, or potential collaborations!*`
    );
  }

  // Default response
  return createResponse(
    `🤖 *Hi! I'm your AI portfolio assistant!*\n\nI can help you learn about:\n\n┌─ 🎓 **Education & Certifications**\n│  • B.Tech Computer Science\n│  • Salesforce & AWS internships\n│  • View certificates & achievements\n└─ Click "Experience" in sidebar\n\n┌─ 🚀 **Projects & Applications**\n│  • 3 real applications built\n│  • Mobile, Web & Finance apps\n│  • Personal & practical projects\n└─ Click "Projects" in sidebar\n\n┌─ 🛠️ **Skills & Technologies**\n│  • Full-stack development\n│  • Cloud & CRM technologies\n│  • Interactive skill visualization\n└─ Click "Skills" in sidebar\n\n💡 *Try asking: "Tell me about your projects" or "Show me your experience"*`
  );
};
