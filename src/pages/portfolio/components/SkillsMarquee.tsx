import React from "react";
import { Code2 } from "lucide-react";
import {
  FaReact, FaJava, FaGitAlt, FaDocker, FaAws
} from "react-icons/fa6";
import {
  SiJavascript, SiTypescript, SiRedux, SiSpringboot, SiPostgresql, SiMysql, SiSupabase, SiFirebase, SiTailwindcss, SiNextdotjs, SiMongodb, SiExpress, SiVercel, SiCapacitor, SiVite
} from "react-icons/si";
import { BiBrain } from "react-icons/bi";

interface Skill {
  name: string;
  category: string;
  icon: string;
}

interface SkillsMarqueeProps {
  skills: Skill[];
}

const skillIcons: Record<string, any> = {
  "react": FaReact,
  "javascript": SiJavascript,
  "typescript": SiTypescript,
  "java": FaJava,
  "redux": SiRedux,
  "node.js": SiNextdotjs, // Fallback
  "spring boot": SiSpringboot,
  "postgresql": SiPostgresql,
  "mysql": SiMysql,
  "supabase": SiSupabase,
  "firebase": SiFirebase,
  "git & github": FaGitAlt,
  "docker": FaDocker,
  "aws": FaAws,
  "ai tools": BiBrain,
  "tailwind css": SiTailwindcss,
  "next.js": SiNextdotjs,
  "mongodb": SiMongodb,
  "express.js": SiExpress,
  "vercel": SiVercel,
  "capacitor": SiCapacitor,
  "vite": SiVite
};

export const SkillsMarquee: React.FC<SkillsMarqueeProps> = ({ skills }) => {
  return (
    <section className="overflow-hidden py-4 border-y border-zinc-200 dark:border-zinc-900 bg-zinc-55/40 dark:bg-[#070709] -mx-6 px-6 relative select-none">
      <div className="flex gap-12 whitespace-nowrap overflow-hidden">
        <div className="flex items-center gap-16 animate-marquee">
          {skills.map((skill, index) => (
            <div key={`skill-main-${index}`} className="flex items-center gap-2 group cursor-default">
              {skillIcons[skill.name.toLowerCase()] ? (
                React.createElement(skillIcons[skill.name.toLowerCase()], {
                  size: 15,
                  className: "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors"
                })
              ) : (
                <Code2 size={15} className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors" />
              )}
              <span className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 uppercase transition-colors">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
        {/* Duplicate for loop */}
        <div className="flex items-center gap-16 animate-marquee" aria-hidden="true">
          {skills.map((skill, index) => (
            <div key={`skill-dup-${index}`} className="flex items-center gap-2 group cursor-default">
              {skillIcons[skill.name.toLowerCase()] ? (
                React.createElement(skillIcons[skill.name.toLowerCase()], {
                  size: 15,
                  className: "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors"
                })
              ) : (
                <Code2 size={15} className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors" />
              )}
              <span className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 uppercase transition-colors">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
