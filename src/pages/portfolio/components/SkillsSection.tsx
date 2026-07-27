import React from "react";

export const SkillsSection: React.FC = () => {
  const skillCategories = [
    {
      category: "LANGUAGES",
      items: ["TypeScript", "Python", "Java "]
    },
    {
      category: "FRAMEWORKS & WEB",
      items: ["React", "Next.js", "Node.js", "Tailwind CSS", "REST APIs", "shadcn/ui",]
    },
    {
      category: "AI & AGENTS",
      items: ["Agentic AI", "AI Agents", "RAG", "MCP", "LangChain", "LangGraph", "OpenAI", "Google Gemini", "Claude", "Prompt Engineering"]
    },
    {
      category: "DATABASES",
      items: ["PostgreSQL", "Supabase", "Redis", "Firebase"]
    },
    {
      category: "DEVOPS & TOOLS",
      items: ["Git", "Vercel", "Docker"]
    }
  ];

  return (
    <section id="skills" className="scroll-mt-24 space-y-6">

      {/* Section Header */}
      <div className="space-y-1">
        <div className="text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase">
          // SKILLS & TECHNOLOGIES
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Skills & Other Stuff
        </h2>
      </div>

      {/* Categorized Monospace Text Index */}
      <div className="space-y-4 text-xs font-mono pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
        {skillCategories.map((group) => (
          <div key={group.category} className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-4 py-2 border-b border-zinc-150 dark:border-zinc-800/50">
            <span className="text-zinc-500 dark:text-zinc-500 font-bold shrink-0">
              {group.category}
            </span>
            <span className="text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
              {group.items.join(" • ")}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
};

export default SkillsSection;
