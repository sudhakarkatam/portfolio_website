import { portfolioData } from "@/data/portfolioData";
import { ProjectDetail } from "@/components/ProjectDetail";
import { ProjectMiniCard } from "@/components/ProjectMiniCard";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { SkillsVisualization } from "@/components/SkillsVisualization";
import { AboutSection } from "@/components/AboutSection";
import { ContactForm } from "@/components/ContactForm";
import { ReactNode } from "react";
import { ProjectMiniGrid } from "@/components/ProjectMiniGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ChatResponse {
  text?: string;
  component?: ReactNode;
  suggestions?: string[];
}

// Helper to wrap responses
const createResponse = (
  text?: string,
  component?: ReactNode,
  suggestions?: string[],
): ChatResponse => ({
  text,
  component,
  suggestions,
});

// Helper function for fuzzy string matching with typo tolerance
const fuzzyMatch = (query: string, keywords: string[]): boolean => {
  const lowercaseQuery = query.toLowerCase();
  return keywords.some((keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    // Exact match
    if (lowercaseQuery.includes(lowerKeyword)) return true;

    // Common typo variations
    const typoVariations = [
      lowerKeyword.replace("ght", "ht"), // strength -> strenght
      lowerKeyword.replace("ht", "ght"), // strenght -> strength
      lowerKeyword.replace("ss", "s"), // strengths -> strength
      lowerKeyword.replace("s", "ss"), // strength -> strengths
      lowerKeyword.replace("e", "a"), // weekness -> weakness
      lowerKeyword.replace("a", "e"), // weakness -> weekness
      lowerKeyword.replace("ie", "y"), // hobbie -> hobby
      lowerKeyword.replace("y", "ie"), // hobby -> hobbie
    ];

    return typoVariations.some((variation) =>
      lowercaseQuery.includes(variation),
    );
  });
};

export const generateResponse = (
  query: string = "",
  projectId?: string,
  onNavigate?: (section: string, projectId?: string) => void,
): ChatResponse => {
  const lowercaseQuery = query.toLowerCase();

  // Specific project request by ID
  if (projectId) {
    const project = portfolioData.projects.find((p) => p.id === projectId);
    if (project) {
      // Generate suggestions for other projects dynamically
      const otherProjects = portfolioData.projects.filter(
        (p) => p.id !== projectId,
      );
      const suggestions = [
        ...otherProjects.slice(0, 2).map((p) => `Tell me about ${p.title}`),
        "Show me all your projects",
      ];

      // If query is empty (sidebar click), show mini card
      // If query has text (chat/grid click), show full details
      if (!query || query.trim() === "") {
        return createResponse(
          undefined,
          <ProjectMiniCard project={project} />,
          suggestions,
        );
      }

      return createResponse(
        `I'd be happy to tell you about **${project.title}**! Here are the details:`,
        <ProjectDetail project={project} />,
        suggestions,
      );
    }
  }

  // Specific project request by name in query (check BEFORE generic handlers)
  for (const project of portfolioData.projects) {
    const projectTitleLower = project.title.toLowerCase();
    // Check if query mentions this specific project
    if (lowercaseQuery.includes(projectTitleLower)) {
      const otherProjects = portfolioData.projects.filter(
        (p) => p.id !== project.id,
      );
      const suggestions = [
        ...otherProjects.slice(0, 2).map((p) => `Tell me about ${p.title}`),
        "Show me all your projects",
      ];

      return createResponse(
        `I'd be happy to tell you about **${project.title}**! Here are the details:`,
        <ProjectDetail project={project} />,
        suggestions,
      );
    }
  }

  // Personal traits responses (check before generic "about" to avoid false matches)
  if (fuzzyMatch(query, ["hobby", "hobbies", "interest", "fun", "free time"])) {
    const hobbies = portfolioData.personalTraits?.hobbies || [];
    return createResponse(
      "I'd love to share! Here's what I enjoy doing when I'm not coding:",
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-accent">
            🎨 My Hobbies & Interests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {hobbies.map((hobby, index) => (
              <li key={index} className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  ⭐
                </Badge>
                <span className="text-foreground">{hobby}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>,
      [
        "Tell me about yourself",
        "What are your strengths?",
        "Tell me about your experience",
      ],
    );
  }

  if (fuzzyMatch(query, ["strength", "strengths", "strong", "good at"])) {
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
                <Badge variant="secondary" className="mt-1">
                  ✓
                </Badge>
                <span className="text-foreground">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>,
      [
        "What are your technical skills?",
        "Show me your projects",
        "Tell me about yourself",
      ],
    );
  }

  if (
    fuzzyMatch(query, [
      "weakness",
      "weaknesses",
      "weak",
      "improve",
      "challenge",
    ])
  ) {
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
                <Badge variant="outline" className="mt-1">
                  📈
                </Badge>
                <span className="text-foreground">{weakness}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>,
      [
        "What are your strengths?",
        "Tell me about your experience",
        "What are your technical skills?",
      ],
    );
  }

  // Experience responses (check BEFORE about to avoid false matches)
  if (
    lowercaseQuery.includes("experience") ||
    lowercaseQuery.includes("worked") ||
    lowercaseQuery.includes("job") ||
    lowercaseQuery.includes("career") ||
    lowercaseQuery.includes("education") ||
    lowercaseQuery.includes("university") ||
    lowercaseQuery.includes("degree") ||
    lowercaseQuery.includes("internship") ||
    lowercaseQuery.includes("certification")
  ) {
    return createResponse(
      "Absolutely! Let me walk you through my educational and professional journey:",
      <ExperienceTimeline experiences={portfolioData.experience} />,
      [
        "Show me your projects",
        "What are your technical skills?",
        "Tell me about yourself",
      ],
    );
  }

  // Skills responses - more natural
  if (
    lowercaseQuery.includes("skill") ||
    lowercaseQuery.includes("technolog") ||
    lowercaseQuery.includes("know") ||
    lowercaseQuery.includes("stack")
  ) {
    return createResponse(
      "Great question! I work with a variety of technologies. Here's a breakdown of my technical skills:",
      <SkillsVisualization skills={portfolioData.skills} />,
      [
        "Show me your projects",
        "Tell me about your experience",
        "What are your strengths?",
      ],
    );
  }

  // About responses - more conversational (check AFTER experience and hobbies to avoid false matches)
  if (
    lowercaseQuery.includes("about") ||
    lowercaseQuery.includes("who") ||
    lowercaseQuery.includes("yourself") ||
    (lowercaseQuery.includes("tell me") &&
      !lowercaseQuery.includes("hobby") &&
      !lowercaseQuery.includes("hobbies") &&
      !lowercaseQuery.includes("experience"))
  ) {
    return createResponse(
      `Sure! I'm excited to share my background with you. Here's a bit about me:`,
      <AboutSection />,
      [
        "What are your technical skills?",
        "Show me your projects",
        "Tell me about your hobbies",
      ],
    );
  }

  // Projects responses - more engaging
  if (
    lowercaseQuery.includes("project") ||
    lowercaseQuery.includes("built") ||
    lowercaseQuery.includes("created") ||
    (lowercaseQuery.includes("work") && !lowercaseQuery.includes("experience"))
  ) {
    return createResponse(
      "I've worked on several projects that I'm proud of! Here are some of the highlights:",
      <ProjectMiniGrid onNavigate={onNavigate} />,
      [
        "Tell me about your experience",
        "What are your technical skills?",
        "What are your strengths?",
      ],
    );
  }

  // Resume/CV queries - check before contact queries
  const isResumeQuery =
    lowercaseQuery.includes("resume") ||
    lowercaseQuery.includes("cv") ||
    lowercaseQuery.includes("curriculum vitae") ||
    lowercaseQuery.includes("download resume") ||
    lowercaseQuery.includes("view resume");

  if (isResumeQuery) {
    const { contact } = portfolioData;
    if (contact.resume) {
      return createResponse(
        `Sure! Here's my resume:\n\n[View Resume](${contact.resume})\n\nYou can also download it from the link above. If you need any specific information from my resume, feel free to ask!`,
        undefined,
        [
          "Tell me about your experience",
          "Show me your projects",
          "What are your technical skills?",
        ],
      );
    } else {
      return createResponse(
        `I'm currently updating my resume. In the meantime, you can find all my information here on my portfolio - my projects, experience, skills, and more. Would you like to know about any specific aspect?`,
        undefined,
        [
          "Tell me about your experience",
          "Show me your projects",
          "Contact information",
        ],
      );
    }
  }

  // Enhanced contact form detection - more comprehensive patterns
  const isContactFormQuery =
    lowercaseQuery.includes("contact form") ||
    lowercaseQuery.includes("message form") ||
    lowercaseQuery.includes("send message") ||
    lowercaseQuery.includes("send you a message") ||
    lowercaseQuery.includes("write to you") ||
    lowercaseQuery.includes("message you") ||
    lowercaseQuery.includes("reach out to you") ||
    lowercaseQuery.includes("get in touch with you") ||
    (lowercaseQuery.includes("form") &&
      (lowercaseQuery.includes("contact") ||
        lowercaseQuery.includes("message"))) ||
    (lowercaseQuery.includes("how") &&
      (lowercaseQuery.includes("contact") ||
        lowercaseQuery.includes("message"))) ||
    lowercaseQuery.includes("want to contact") ||
    lowercaseQuery.includes("need to contact") ||
    lowercaseQuery.includes("like to message") ||
    lowercaseQuery.includes("want to message") ||
    lowercaseQuery.includes("show me the form") ||
    lowercaseQuery.includes("contact you");

  // General contact info queries (without form)
  const isContactInfoQuery =
    lowercaseQuery.includes("contact information") ||
    lowercaseQuery.includes("contact details") ||
    lowercaseQuery.includes("email address") ||
    lowercaseQuery.includes("social media") ||
    lowercaseQuery.includes("linkedin") ||
    lowercaseQuery.includes("github profile") ||
    lowercaseQuery.includes("social links") ||
    (lowercaseQuery.includes("contact") && !isContactFormQuery);

  if (isContactFormQuery || isContactInfoQuery) {
    const { contact } = portfolioData;

    // For contact form requests - show the form directly
    if (isContactFormQuery) {
      const contactFormText = `## 📧 **Send Me a Message**

I'd **love to hear from you!** Fill out the form below to send me a message, and I'll get back to you as soon as possible.

### **Social Links**
*You can also connect with me on:*
- 🐙 **[GitHub Profile](${contact.github})** - Check out my code and projects
- 💼 **[LinkedIn Profile](${contact.linkedin})** - Professional networking
${contact.twitter ? `- 🐦 **[Twitter/X Profile](${contact.twitter})** - Follow for tech updates\n` : ""}
---

**The contact form includes fields for your name, email, and message.** Just fill it out below and hit send! ⬇️`;

      return createResponse(contactFormText, <ContactForm />, [
        "Tell me about yourself",
        "Show me your projects",
        "What are your technical skills?",
      ]);
    }

    // For general contact info queries, show comprehensive contact information
    const resumeSection = contact.resume
      ? `### 📄 **Resume/CV**\n**[View Resume](${contact.resume})** - Download my complete CV\n\n`
      : "";
    const contactInfoText = `## 📞 **Contact Information**

I'd **love to connect** with you! Here are the **best ways** to reach me:

### 📧 **Email**
**${contact.email}**
*[Send Email](mailto:${contact.email})*

### 🌐 **Social Links**
*Connect with me on professional platforms:*
- 🐙 **[GitHub Profile](${contact.github})** - Explore my repositories and contributions
- 💼 **[LinkedIn Profile](${contact.linkedin})** - Professional networking and career updates
${contact.twitter ? `- 🐦 **[Twitter/X Profile](${contact.twitter})** - Tech discussions and updates\n` : ""}
${resumeSection}### 💬 **Direct Messaging**
Want to **send me a message** directly? I have a contact form right here on the website!

*Feel free to reach out for **opportunities**, **technical discussions**, **collaborations**, or just to say **hello**!* 😊`;

    return createResponse(contactInfoText, undefined, [
      "Send message",
      "Show contact form",
      "Tell me about yourself",
      "Show me your projects",
    ]);
  }

  // Default response - enhanced with better formatting and contact option
  return createResponse(
    `👋 **Hi! I'm Sudhakar's AI portfolio assistant.**\n\nI can help you explore:\n\n### 👤 **About Me**  \n*Background, interests & personality*  \n*Try: "Tell me about yourself"*\n\n### 🛠️ **Technical Skills**  \n*Languages, frameworks & tools*  \n*Try: "What are your technical skills?"*\n\n### 🚀 **Projects**  \n*Applications I've built*  \n*Try: "Show me your projects"*\n\n### 💼 **Experience**  \n*Education & work history*  \n*Try: "Tell me about your experience"*\n\n### 📧 **Contact**  \n*Get in touch or send a message*  \n*Try: "Contact form" or "Send message"*\n\n---\n\n**What would you like to know about Sudhakar?** ✨`,
    undefined,
    [
      "Tell me about yourself",
      "Show me your projects",
      "What are your technical skills?",
      "Tell me about your experience",
      "Contact form",
    ],
  );
};
