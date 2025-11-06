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

  // Skills responses - more natural and conversational
    // Skills responses - more natural and conversational
    if (
      lowercaseQuery.includes("skill") ||
      lowercaseQuery.includes("technolog") ||
      lowercaseQuery.includes("know") ||
      lowercaseQuery.includes("stack")
    ) {
      return createResponse(
        "I have a solid foundation across the **full stack**! Here's a visual breakdown of my technical skills:",
        <SkillsVisualization skills={portfolioData.skills} />,
        [
          "Show me your projects",
          "Which framework do you prefer?",
          "Tell me about your experience",
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
      const contactFormText = `I'd **love to hear from you!** The contact form is right below - just fill out your name, email, and message, and I'll get back to you soon.

**You can also connect with me on:**
- 🐙 **[GitHub Profile](${contact.github})**
- 💼 **[LinkedIn Profile](${contact.linkedin})**
${contact.twitter ? `- 🐦 **[Twitter/X Profile](${contact.twitter})**\n` : ""}
The form will appear below this message automatically! ⬇️`;

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

  // Enhanced question pattern recognition
  const patterns = {
    framework:
      /framework|react|angular|vue|next\.?js|tech stack|development tools|prefer.*code|what.*use.*dev/i,
    frontendBackend:
      /frontend.*backend|backend.*frontend|full.?stack|type.*developer|specializ/i,
    ide: /ide|editor|vs.?code|vim|atom|sublime|development environment/i,
    hometown:
      /hometown|where.*from|background|village|rural|andhra|prakasam|kothapalem/i,
    gaming: /games?|gaming|play|mobile.*game|freefire|free.*fire/i,
    food: /food|eat|favorite.*dish|cuisine|biryani|cook/i,
    friends: /friends?|buddies|college.*friends?|social.*circle|eshwar|pavan/i,
    motivation: /motivat|drives?.*you|what.*keeps.*going|passion|curious/i,
    values: /values?|philosophy|principles|matter.*you|important|belief/i,
    technology:
      /tech.*excit|future.*tech|AI|IoT|blockchain|innovation|emerging/i,
    exercise: /exercise|fitness|workout|gym|physical|health/i,
    sleep: /morning.*person|night.*owl|sleep|wake.*up|schedule/i,
    languages: /language|speak|telugu|english|hindi|native/i,
    hobbies:
      /hobbies|interests|free.*time|activities|cricket|volleyball|badminton|content.*creation/i,
    birthday: /birthday|birth.*date|when.*born|age|february|feb.*4/i,
  };

  // Check for specific pattern matches
  for (const [category, pattern] of Object.entries(patterns)) {
    if (pattern.test(query)) {
      switch (category) {
        case "framework":
          return createResponse(
            `For web development, I absolutely **love React with TypeScript** - it's my go-to combination! I also work with **Next.js** for full-stack applications.\n\n*Also, I prefer being a full-stack developer working with both frontend, backend, AND cloud technologies.* ☁️`,
            undefined,
            [
              "What IDE do you use?",
              "Show me your projects",
              "Tell me about your experience",
            ],
          );
        case "frontendBackend":
          return createResponse(
            `I prefer **both frontend and backend** - I'm a full-stack developer! Plus I'm really interested in **cloud technologies** too.\n\n*I believe understanding the complete development cycle makes you a better developer.* 🚀`,
            undefined,
            [
              "Which framework do you prefer?",
              "Show me your projects",
              "What are your technical skills?",
            ],
          );
        case "ide":
          return createResponse(
            `I mostly use **VS Code** - it's fantastic for development! But I'm always exploring different editors and I really want to **learn Vim editor** too.\n\n*Always curious about new tools that can make development more efficient!* ⚡`,
            undefined,
            [
              "Which framework do you prefer?",
              "Tell me about your projects",
              "What motivates you?",
            ],
          );
        case "hometown":
          return createResponse(
            `I'm **22 years old** and from **Kothapalem village** in Talluru Mandal, Prakasam District, Andhra Pradesh. The nearest towns are Darsi, Addanki, and Ongole.\n\n*I love my hometown like everyone does!* 🌾\n\nWant to know more about my village life or hear about my favorite Telugu traditions?`,
            undefined,
            [
              "Tell me about your family background",
              "What are your favorite traditions?",
              "Do you miss your hometown?",
            ],
          );
        case "gaming":
          return createResponse(
            `I used to play **FreeFire** on mobile, but now I'm not playing much because I'm focused on **learning technologies and building apps**.\n\n*These days, coding feels more exciting than gaming!* 💻`,
            undefined,
            [
              "What do you do in your free time?",
              "Are you a morning person?",
              "Tell me about your interests",
            ],
          );
        case "food":
          return createResponse(
            `Oh, I **love biryani** and any chicken recipe! Also enjoy **dosa, idly, and chapathi**. For sweets, **bread halwa** is my absolute favorite! 🍛\n\n*I can manage basic cooking but wouldn't call myself a proficient chef.* 😅\n\nCurious about my other hobbies or want to know what languages I speak?`,
            undefined,
            [
              "What languages do you speak?",
              "Tell me about your hobbies",
              "Do you exercise?",
            ],
          );
        case "friends":
          return createResponse(
            `I have some amazing friends! In college, there's **Eshwar** - he's from Hyderabad, really good and nice person, always there for me. We call him "bhai" sometimes for fun! And **Pavan** - he's a true techie from Vijayawada, great at technology.\n\n*When we three (Eshwar, Pavan, and me) meet, it's pure fun - no tensions, just desi-style enjoyment with random topics and lots of jokes!* 😄\n\n*I also have some great hometown friends...* Want to know more about my college days or hear about my hometown friends?`,
            undefined,
            [
              "Tell me about your hometown friends",
              "How was college with them?",
              "What do you value in friends?",
            ],
          );
        case "motivation":
          return createResponse(
            `I'm driven by a constant desire to **learn new things and explore new ways** of doing things. I'm a **curious person** who wants to understand how everything works!\n\n*That curiosity is what fuels my passion for technology and coding.* 🔍\n\nWant to hear about my core values or curious about my dream projects?`,
            undefined,
            [
              "What are your core values?",
              "Tell me about your dream projects",
              "What excites you about technology?",
            ],
          );
        case "values":
          return createResponse(
            `My core values are **patience, honesty, integrity**, and having the right intention. I have a growing interest in **philosophy** and I'm slowly adapting to reading books.\n\n*Whatever I do, I want my family to be happy always. Family happiness is my priority.* ❤️\n\nWant to know about my life motto or curious about my family background?`,
            undefined,
            [
              "What's your life motto?",
              "Tell me about your family",
              "When is your birthday?",
            ],
          );
        case "technology":
          return createResponse(
            `**Everything** excites me about technology! AI, IoT, smart things, blockchain, and all new technologies - not only in software but also in **hardware and arts**!\n\n*I always love teaching too. Maybe I'll start a startup around education or tech in the future.* 🚀\n\nWant to see my technical skills or curious about my current projects?`,
            undefined,
            [
              "What are your technical skills?",
              "Show me your projects",
              "Tell me about your dream projects",
            ],
          );
        case "exercise":
          return createResponse(
            `Yes, I exercise **a little bit** and try to stay active! 💪\n\n*It's important to balance coding with some physical activity, right?*`,
            undefined,
            [
              "Are you a morning person?",
              "What's your favorite food?",
              "What do you do in free time?",
            ],
          );
        case "sleep":
          return createResponse(
            `I'm naturally a **night owl**, but I'm slowly trying to become a **morning person** - let's see how it goes! 🌙➡️🌅\n\n*Old habits die hard, but I'm working on it!*\n\nCurious about my other lifestyle habits or want to know what I do for exercise?`,
            undefined,
            [
              "Do you exercise?",
              "What do you do in free time?",
              "Tell me about your hobbies",
            ],
          );
        case "languages":
          return createResponse(
            `I speak **three languages**! **Telugu** is my native language, I'm **proficient in English**, and I have **intermediate proficiency in Hindi**.\n\n*Growing up in Andhra Pradesh, Telugu comes naturally to me!* 🗣️\n\nWant to know more about my cultural connections or curious about my hobbies?`,
            undefined,
            [
              "What are your favorite traditions?",
              "Tell me about your hobbies",
              "Do you miss your hometown?",
            ],
          );
        case "hobbies":
          return createResponse(
            `When I'm not coding, I love staying active and exploring! I enjoy playing **outdoor games like cricket, volleyball, and badminton**. I also spend time **reading tech blogs**, contributing to **open-source projects**, and even dabble in **content creation** on Instagram and YouTube!\n\n*Always coding side projects and exploring new technologies too!* 🏃‍♂️\n\nCurious about my gaming habits or want to know about my content creation?`,
            undefined,
            [
              "Do you play video games?",
              "Tell me about content creation",
              "What outdoor games do you play?",
            ],
          );
        case "birthday":
          return createResponse(
            `My birthday is on **February 4th**! 🎂\n\n*Just turned 22 this year!* 🎉\n\nWant to know more about my personal life or curious about my college friends?`,
            undefined,
            [
              "Tell me about your friends",
              "How was your college experience?",
              "What are your hobbies?",
            ],
          );
      }
    }
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
