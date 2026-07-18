import React from "react";
import { 
  SiC, SiTypescript, SiJavascript, SiPython, SiReact, 
  SiNextdotjs, SiTailwindcss, SiNodedotjs, SiPostgresql, 
  SiSupabase, SiFirebase, SiRedis, SiDocker, SiLinux, 
  SiVercel, SiGit, SiGithub, SiPostman, SiFigma, SiOpenai
} from "react-icons/si";

export const SkillsSection: React.FC = () => {
  const allSkills: { name: string; icon?: React.ReactNode }[] = [
    { name: "C", icon: <SiC className="text-blue-500" /> },
    { name: "TypeScript", icon: <SiTypescript className="text-[#3178C6]" /> },
    { name: "JavaScript", icon: <SiJavascript className="text-[#F7DF1E]" /> },
    { name: "Python", icon: <SiPython className="text-[#3776AB]" /> },
    { name: "React", icon: <SiReact className="text-[#61DAFB]" /> },
    { name: "Next.js", icon: <SiNextdotjs className="text-zinc-900 dark:text-white" /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss className="text-[#06B6D4]" /> },
    { name: "shadcn/ui" },
    { name: "Node.js", icon: <SiNodedotjs className="text-[#339933]" /> },
    { name: "REST APIs" },
    { name: "LangChain" },
    { name: "LangGraph" },
    { name: "OpenAI", icon: <SiOpenai className="text-zinc-900 dark:text-white" /> },
    { name: "Google Gemini" },
    { name: "Claude" },
    { name: "Agentic AI" },
    { name: "AI Agents" },
    { name: "RAG" },
    { name: "Prompt Engineering" },
    { name: "MCP" },
    { name: "PostgreSQL", icon: <SiPostgresql className="text-[#4169E1]" /> },
    { name: "Supabase", icon: <SiSupabase className="text-[#3ECF8E]" /> },
    { name: "Firebase", icon: <SiFirebase className="text-[#DD2C00]" /> },
    { name: "Redis", icon: <SiRedis className="text-[#DC382D]" /> },
    { name: "Docker", icon: <SiDocker className="text-[#2496ED]" /> },
    { name: "Linux", icon: <SiLinux className="text-[#FCC624]" /> },
    { name: "GitHub Actions" },
    { name: "Vercel", icon: <SiVercel className="text-zinc-900 dark:text-white" /> },
    { name: "Render" },
    { name: "Git", icon: <SiGit className="text-[#F05032]" /> },
    { name: "GitHub", icon: <SiGithub className="text-zinc-900 dark:text-white" /> },
    { name: "Postman", icon: <SiPostman className="text-[#FF6C37]" /> },
    { name: "Figma", icon: <SiFigma className="text-[#F24E1E]" /> }
  ];

  return (
    <section id="skills" className="scroll-mt-24 space-y-8">
      
      {/* Section Header with Subtle Divider Line */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 dark:text-zinc-500 font-mono uppercase">
          SKILLS & TECHNOLOGIES
        </div>
        <div className="flex items-center gap-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Skills & Technologies
          </h2>
          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800/40" />
        </div>
      </div>

      {/* Increased Size Skills Pill Badges Grid */}
      <div className="flex flex-wrap gap-3 sm:gap-3.5 justify-center sm:justify-start">
        {allSkills.map((skill) => (
          <div
            key={skill.name}
            className="bg-white dark:bg-[#070709] border border-zinc-200 dark:border-[#1e1e24] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 sm:gap-2.5 hover:border-zinc-400 dark:hover:border-zinc-650 hover:scale-[1.04] transition-all duration-200 shadow-sm cursor-default"
          >
            {skill.icon && (
              <span className="text-sm sm:text-base shrink-0 flex items-center justify-center">
                {skill.icon}
              </span>
            )}
            <span>{skill.name}</span>
          </div>
        ))}
      </div>

    </section>
  );
};
