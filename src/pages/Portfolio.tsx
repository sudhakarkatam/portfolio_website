import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolioData";
import { GitHubCalendar } from 'react-github-calendar';
import { Tooltip } from 'react-tooltip';
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
  Download,
  Share2,
  Globe,
  Sun,
  Moon,
  MessageSquare,
  Star,
  GitFork,
  Code2,
  Award,
  Box,
  Server,
  Code,
  Layers,
  Flame,
  GitBranch,
  Cloud,
  Bot,
  FileCode,
  Coffee,
  Database
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
  FaReact, FaJava, FaNodeJs, FaPython, FaGitAlt, FaGithub, FaDocker, FaAws, FaHtml5, FaCss3, FaAndroid
} from "react-icons/fa";
import {
  SiJavascript, SiTypescript, SiRedux, SiSpringboot, SiPostgresql, SiMysql, SiSupabase, SiFirebase, SiTailwindcss, SiNextdotjs, SiMongodb, SiExpress, SiSvelte, SiNuxtdotjs, SiSass, SiVercel, SiCapacitor, SiVite
} from "react-icons/si";
import { TbBrandNextjs } from "react-icons/tb";
import { BiBrain } from "react-icons/bi";

// Map skill names to React Icons
const skillIcons: Record<string, any> = {
  "react": FaReact,
  "javascript": SiJavascript,
  "typescript": SiTypescript,
  "java": FaJava,
  "html5": FaHtml5,
  "css3": FaCss3,
  "redux": SiRedux,
  "node.js": FaNodeJs,
  "python": FaPython,
  "spring boot": SiSpringboot,
  "postgresql": SiPostgresql,
  "mysql": SiMysql,
  "supabase": SiSupabase,
  "firebase": SiFirebase,
  "git": FaGitAlt,
  "github": FaGithub,
  "docker": FaDocker,
  "aws": FaAws,
  //"vs code": SiVisualstudiocode,
  "ai tools": BiBrain,
  "tailwind css": SiTailwindcss,
  "next.js": SiNextdotjs,
  "mongodb": SiMongodb,
  "express.js": SiExpress,
  "svelte": SiSvelte,
  "nuxt.js": SiNuxtdotjs,
  "sass": SiSass,
  "vercel": SiVercel,
  "capacitor": SiCapacitor,
  "vite": SiVite,
  "android": FaAndroid
};

// Color for each skill
const iconColors: Record<string, string> = {
  "react": "#61DAFB",
  "javascript": "#F7DF1E",
  "typescript": "#3178C6",
  "java": "#E76F00",
  "html5": "#E34F26",
  "css3": "#1572B6",
  "redux": "#764ABC",
  "node.js": "#339933",
  "python": "#3776AB",
  "spring boot": "#6DB33F",
  "postgresql": "#336791",
  "mysql": "#4479A1",
  "supabase": "#3ecf8e",
  "firebase": "#FFCA28",
  "git": "#F05032",
  "github": "#000000",
  "docker": "#2496ED",
  "aws": "#FF9900",
  "android": "#3DDC84",
  "ai tools": "#9b59b6",
  "tailwind css": "#38BDF8",
  "next.js": "#000000",
  "mongodb": "#47A248",
  "express.js": "#000000",
  "svelte": "#FF3E00",
  "nuxt.js": "#00DC82",
  "sass": "#CC6699",
  "vercel": "#000000",
  "capacitor": "#119EFF",
  "vite": "#646CFF"
};

const TechBadge = ({ name, theme }: { name: string; theme: string }) => {
  // Normalize name to match keys
  const normalizedName = name.toLowerCase().replace(" & ", " ").split("/")[0].trim();
  // Try to find exact match or partial match
  const iconKey = Object.keys(skillIcons).find(key => normalizedName.includes(key) || key.includes(normalizedName));
  const Icon = iconKey ? skillIcons[iconKey] : LucideIcons.Code2;
  const color = iconKey ? iconColors[iconKey] : (theme === "dark" ? "#ffffff" : "#000000");

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-default ${theme === 'dark'
      ? 'bg-zinc-800/50 text-zinc-300 border-white/10 hover:bg-zinc-800 hover:text-white'
      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900 shadow-sm'
      }`}>
      <Icon size={14} style={{ color }} />
      {name}
    </span>
  );
};

const Portfolio = () => {
  const { name, title, bio, skills, projects, experience, contact } = portfolioData;
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [repoStats, setRepoStats] = useState<Record<string, { stars: number; forks: number }>>({});
  const githubUsername = contact.github ? contact.github.split('/').pop() : 'sudhakarkatam';

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Fetch GitHub repo stats
  useEffect(() => {
    const fetchRepoData = async () => {
      const repos = [
        "finance_cal",
        "tracker22",
        "portfolio_website",
        "droply_app",
        "Jobfinder-hub"
      ];
      const stats: Record<string, { stars: number; forks: number }> = {};

      for (const repo of repos) {
        try {
          const res = await fetch(`https://api.github.com/repos/${githubUsername}/${repo}`);
          if (res.ok) {
            const data = await res.json();
            stats[repo] = { stars: data.stargazers_count, forks: data.forks_count };
          } else {
            stats[repo] = { stars: 0, forks: 0 };
          }
        } catch (e) {
          console.error(`Failed to fetch stats for ${repo}`, e);
          stats[repo] = { stars: 0, forks: 0 };
        }
      }
      setRepoStats(stats);
    };
    fetchRepoData();
  }, [githubUsername]);

  // Filter out Education, keep Work and Virtual Internship
  const workExperience = experience.filter(exp => exp.type !== "Education");

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Code;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0A0A0A] text-white' : 'bg-white text-gray-900'
      }`}>
      {/* Theme Toggle & Chat Button */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <a
          href="/"
          className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 font-medium text-sm ${theme === 'dark'
            ? 'bg-blue-600 text-white hover:bg-blue-500'
            : 'bg-black text-white hover:bg-gray-800'
            }`}
        >
          <MessageSquare size={18} />
          <span className="hidden sm:inline">Chat with AI</span>
        </a>
        <button
          onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
          className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 ${theme === 'dark'
            ? 'bg-zinc-800 text-white hover:bg-zinc-700'
            : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
            }`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">

          {/* LEFT SIDEBAR */}
          <div className="space-y-6">

            {/* Profile Card */}
            <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-50'
              }`}>
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-500">
                <img
                  src="/profile_image.jpeg"
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className={`hidden w-full h-full flex items-center justify-center text-5xl font-bold ${theme === 'dark' ? 'bg-zinc-800 text-zinc-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                  {name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>

              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-1">{name}</h1>
                <p className="text-purple-500 font-medium">{title}</p>
                <p className={`text-sm mt-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {bio}
                </p>
              </div>

              {contact.resume && (
                <a
                  href={contact.resume}
                  target="_blank"
                  rel="noreferrer"
                  className={`block w-full py-3 rounded-xl font-medium transition-all mb-4 text-center ${theme === 'dark'
                    ? 'bg-white text-black hover:bg-gray-100'
                    : 'bg-black text-white hover:bg-gray-800'
                    }`}
                >
                  <Download size={18} className="inline mr-2" />
                  Download CV
                </a>
              )}

              <div className="flex justify-center gap-2">
                {[
                  { icon: Mail, link: contact.email ? `mailto:${contact.email}` : null },
                  { icon: Github, link: contact.github },
                  { icon: Linkedin, link: contact.linkedin },
                  { icon: Globe, link: contact.website },
                  { icon: Twitter, link: contact.twitter }
                ].map((item, i) => item.link && (
                  <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2.5 rounded-lg transition-all hover:scale-110 ${theme === 'dark'
                      ? 'bg-zinc-800 text-gray-400 hover:text-white'
                      : 'bg-white text-gray-600 hover:text-black border border-gray-200'
                      }`}
                  >
                    <item.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-50'
              }`}>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider opacity-60">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <TechBadge key={skill.name} name={skill.name} theme={theme} />
                ))}
              </div>
            </div>

            {/* Work Experience */}
            <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-50'
              }`}>
              <h3 className="font-bold mb-6 text-sm uppercase tracking-wider opacity-60">
                Work Experience
              </h3>
              <div className="space-y-6 relative pl-6 border-l border-orange-500">
                {workExperience.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-orange-500" />
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🏢</span>
                      <div>
                        <h4 className="font-semibold">{exp.company}</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {exp.role}
                        </p>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          {exp.period}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="space-y-8">

            {/* Projects Header */}
            <h2 className="text-3xl font-bold">Projects I've Made</h2>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-2xl p-5 border transition-all hover:shadow-xl ${theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-100'
                      }`}>
                      {(() => {
                        const Icon = getIconComponent(project.icon || "Code");
                        return <Icon className={`w-5 h-5 ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-700'
                          }`} />;
                      })()}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${project.status === "Live"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : project.status === "Building"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-purple-500/10 text-purple-500"
                        }`}>
                        {project.status || "Building"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                      {project.title}
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noreferrer">
                          <ArrowUpRight size={16} className="opacity-50 hover:opacity-100" />
                        </a>
                      )}
                    </h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-50 mb-2">
                      🔧 TECH STACK
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <TechBadge key={tech} name={tech} theme={theme} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* GitHub Section */}
            <div className={`rounded-3xl p-8 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-50'
              }`}>
              <h2 className="text-2xl font-bold mb-2">GitHub</h2>
              <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Highlights from my open-source activity and pinned repositories.
              </p>

              {/* Contribution Graph */}
              <div className={`rounded-2xl p-6 mb-8 overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-white border border-gray-200'
                }`}>
                <div className="flex items-center gap-2 mb-4">
                  <Github size={20} />
                  <span className="font-semibold">{githubUsername} • Contributions</span>
                </div>
                <div className="flex justify-center overflow-x-auto">
                  <GitHubCalendar
                    username={githubUsername}
                    colorScheme={theme === 'dark' ? 'dark' : 'light'}
                    theme={{
                      light: ['#ebedf0', '#fdcb82', '#fdac54', '#f98634', '#e05d44'],
                      dark: ['#161b22', '#fdcb82', '#fdac54', '#f98634', '#e05d44'],
                    }}
                    fontSize={12}
                    blockSize={12}
                    blockMargin={4}
                    renderBlock={(block, activity) => (
                      // Clone the block (which is an SVG rect) and add tooltip attributes
                      // Wrapping in a div breaks the SVG structure
                      React.cloneElement(block as React.ReactElement, {
                        'data-tooltip-id': 'github-tooltip',
                        'data-tooltip-content': `${activity.count} contributions on ${activity.date}`,
                      })
                    )}
                  />
                  <Tooltip id="github-tooltip" />
                </div>
              </div>

              {/* Pinned Repos */}
              <div className="mb-4">
                <span className="text-sm font-medium opacity-60">
                  📌 Pinned Repositories
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "finance_cal", lang: "React", desc: "Comprehensive financial calculator PWA" },
                  { name: "tracker22", lang: "TypeScript", desc: "Offline-first habit tracking application" },
                  { name: "portfolio_website", lang: "TypeScript", desc: "Personal portfolio website with AI integration" },
                  { name: "droply_app", lang: "TypeScript", desc: "File sharing application" },
                  { name: "Jobfinder-hub", lang: "JavaScript", desc: "Job search aggregator platform" }
                ].map((repo) => {
                  const stats = repoStats[repo.name] || { stars: 0, forks: 0 };
                  return (
                    <a
                      key={repo.name}
                      href={`https://github.com/${githubUsername}/${repo.name}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`p-4 rounded-xl border transition-all hover:-translate-y-1 ${theme === 'dark'
                        ? 'bg-black border-zinc-800 hover:border-zinc-700'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-blue-500 truncate pr-2">{repo.name}</span>
                        <ArrowUpRight size={14} className="opacity-50 flex-shrink-0" />
                      </div>
                      <p className={`text-xs mb-3 line-clamp-2 h-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                        {repo.desc}
                      </p>
                      <div className="flex items-center gap-3 text-xs opacity-60">
                        <div className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${repo.lang === 'TypeScript' ? 'bg-blue-400' :
                            repo.lang === 'JavaScript' ? 'bg-yellow-400' : 'bg-orange-400'
                            }`} />
                          {repo.lang}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={12} /> {stats.stars}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork size={12} /> {stats.forks}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`border-t mt-12 py-8 text-center ${theme === 'dark' ? 'border-zinc-800' : 'border-gray-200'
          }`}>
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} {name}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Portfolio;
