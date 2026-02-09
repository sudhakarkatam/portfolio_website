import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { portfolioData } from "@/data/portfolioData";
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
  Code2,
  Terminal,
  Cpu,
  Globe,
  Database,
  Layout,
  Server,
  Smartphone,
  Cloud,
  Building2,
  MapPin,
  ArrowRight,
  ExternalLink,
  Target,
  Calculator,
  ShoppingCart,
  Share2,
  Briefcase,
  FolderGit2
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
  FaReact, FaJava, FaNodeJs, FaPython, FaGitAlt, FaGithub, FaDocker, FaAws, FaHtml5, FaCss3, FaAndroid, FaLinkedin, FaXTwitter, FaDiscord, FaTelegram
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import {
  SiJavascript, SiTypescript, SiRedux, SiSpringboot, SiPostgresql, SiMysql, SiSupabase, SiFirebase, SiTailwindcss, SiNextdotjs, SiMongodb, SiExpress, SiSvelte, SiNuxtdotjs, SiSass, SiVercel, SiCapacitor, SiVite
} from "react-icons/si";
import { BiBrain } from "react-icons/bi";
import bannerImage from "@/assets/portfolio-banner.png";
import { MessageSquare } from "lucide-react";

// --- Icons & Colors Configuration ---
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

const skillColors: Record<string, { bg: string; text: string; icon: string }> = {
  "react": { bg: "bg-[#0b1b2b]", text: "text-[#61DAFB]", icon: "text-[#61DAFB]" },
  "javascript": { bg: "bg-[#1f1d0b]", text: "text-[#F7DF1E]", icon: "text-[#F7DF1E]" },
  "typescript": { bg: "bg-[#0f1b2c]", text: "text-[#3178C6]", icon: "text-[#3178C6]" },
  "java": { bg: "bg-[#1b100b]", text: "text-[#E76F00]", icon: "text-[#E76F00]" },
  "html5": { bg: "bg-[#1b0d0a]", text: "text-[#E34F26]", icon: "text-[#E34F26]" },
  "css3": { bg: "bg-[#0c1324]", text: "text-[#1572B6]", icon: "text-[#1572B6]" },
  "redux": { bg: "bg-[#110d1b]", text: "text-[#764ABC]", icon: "text-[#764ABC]" },
  "node.js": { bg: "bg-[#0e160e]", text: "text-[#339933]", icon: "text-[#339933]" },
  "python": { bg: "bg-[#0e161c]", text: "text-[#3776AB]", icon: "text-[#3776AB]" },
  "spring boot": { bg: "bg-[#0e160e]", text: "text-[#6DB33F]", icon: "text-[#6DB33F]" },
  "postgresql": { bg: "bg-[#0f161e]", text: "text-[#336791]", icon: "text-[#336791]" },
  "mysql": { bg: "bg-[#001d26]", text: "text-[#00758F]", icon: "text-[#00758F]" },
  "supabase": { bg: "bg-[#0a1612]", text: "text-[#3ECF8E]", icon: "text-[#3ECF8E]" },
  "firebase": { bg: "bg-[#1f1a08]", text: "text-[#FFCA28]", icon: "text-[#FFCA28]" },
  "git": { bg: "bg-[#1c0e0b]", text: "text-[#F05032]", icon: "text-[#F05032]" },
  "github": { bg: "bg-[#24292e]", text: "text-white", icon: "text-white" },
  "docker": { bg: "bg-[#0b1b2b]", text: "text-[#2496ED]", icon: "text-[#2496ED]" },
  "aws": { bg: "bg-[#1c1309]", text: "text-[#FF9900]", icon: "text-[#FF9900]" },
  "tailwind css": { bg: "bg-[#0b1b26]", text: "text-[#38B2AC]", icon: "text-[#38B2AC]" },
  "next.js": { bg: "bg-black", text: "text-white", icon: "text-white" },
  "mongodb": { bg: "bg-[#0a140d]", text: "text-[#47A248]", icon: "text-[#47A248]" },
  "express.js": { bg: "bg-black", text: "text-white", icon: "text-white" },
  "android": { bg: "bg-[#0d1611]", text: "text-[#3DDC84]", icon: "text-[#3DDC84]" },
  "default": { bg: "bg-[#1C1C1C]", text: "text-zinc-400", icon: "text-zinc-400" }
};

// --- Reference UI Components ---

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

function RefCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-[#0f0f0f] text-[#eaeaea] flex flex-col gap-6 rounded-xl border border-[#1f1f1f] py-6 shadow-sm relative overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function RefCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[[data-slot=card-action]]:grid-cols-[1fr_auto] border-b border-[#1f1f1f] pb-6",
        className
      )}
      {...props}
    />
  )
}

function RefCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold text-[#eaeaea]", className)}
      {...props}
    />
  )
}

function RefCardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function RefCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 text-[#9a9a9a]", className)}
      {...props}
    />
  )
}

function RefCardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pt-6 border-t border-[#1f1f1f]", className)}
      {...props}
    />
  )
}

function RefButton({ className, variant = "default", size = "default", ...props }: React.ComponentProps<"button"> & { variant?: "default" | "outline" | "ghost", size?: "default" | "icon" | "sm" }) {
  const variants = {
    default: "bg-[#eaeaea] text-black hover:bg-[#eaeaea]/90",
    outline: "border border-[#1f1f1f] bg-transparent hover:bg-[#141414] text-[#eaeaea]",
    ghost: "hover:bg-[#141414] text-[#eaeaea]"
  }
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    icon: "h-9 w-9"
  }
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}


const ScrollIndicator = ({ activeSection }: { activeSection: string }) => {
  const navItems = ["Home", "Projects", "Contact"];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hidden xl:flex fixed left-12 top-1/2 -translate-y-1/2 flex-col gap-6 z-50">
      {navItems.map((item) => {
        const id = item.toLowerCase();
        const isActive = activeSection === id;

        return (
          <button
            key={item}
            onClick={() => scrollToSection(id)}
            className="group flex items-center gap-4 outline-none"
          >
            <span className={`
               text-xs tracking-widest uppercase transition-all duration-300
               ${isActive ? "text-white font-semibold" : "text-zinc-500 group-hover:text-zinc-300"}
             `}>
              {item}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const ConnectFooter = ({ contact }: { contact: typeof portfolioData.contact }) => {
  const socialLinks = [
    { name: "GitHub", url: contact.github, user: "@sudhakarkatam", icon: FaGithub },
    { name: "Twitter", url: contact.twitter, user: "@sudhakarkatam2", icon: FaXTwitter },
    { name: "LinkedIn", url: contact.linkedin, user: "Sudhakar Katam", icon: FaLinkedin },
    { name: "Discord", url: "https://discord.com/users/sudhakar0379", user: "sudhakar0379", icon: FaDiscord },
    { name: "Telegram", url: "https://t.me/Sudha7248", user: "Sudha7248", icon: FaTelegram },
  ];

  return (
    <footer id="contact" className="py-12 border-t border-dashed border-zinc-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Left Column */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">Let's Connect</h2>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
            Open to collaborations, full-time roles, and interesting problems.
            The fastest way to reach me is email.
          </p>

          <div className="flex flex-col gap-4">
            <div className="inline-flex max-w-fit items-center gap-3 px-5 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl group hover:border-zinc-700 transition-colors cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(contact.email);
              }}
            >
              <MdEmail className="text-zinc-400 group-hover:text-white transition-colors" size={20} />
              <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">{contact.email}</span>
              <span className="text-xs text-zinc-600 ml-2 group-hover:text-zinc-500">Click to copy</span>
            </div>
          </div>
        </div>

        {/* Right Column - Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialLinks.map((link) => (
            link.url && (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-900/50 transition-all group"
              >
                <div>
                  <div className="text-zinc-400 text-xs mb-1">{link.name}</div>
                  <div className="text-zinc-200 text-sm font-medium">{link.user}</div>
                </div>
                <link.icon className="text-zinc-600 group-hover:text-white transition-colors" size={18} />
              </a>
            )
          ))}

          <a href="https://buymeacoffee.com/sudhakarkatam" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-900/50 transition-all group">
            <div>
              <div className="text-zinc-400 text-xs mb-1">Support</div>
              <div className="text-zinc-200 text-sm font-medium">Buy Me a Coffee</div>
            </div>
            <span className="text-xl grayscale group-hover:grayscale-0 transition-all">☕</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

const Portfolio = () => {
  const { name, bio, skills, projects, experience, contact } = portfolioData;
  const [activeSection, setActiveSection] = useState("home");

  // Force dark mode implementation
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#0b0b0b';
    document.body.style.color = '#eaeaea';
  }, []);

  // Scroll Spy logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "projects", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#eaeaea] font-sans selection:bg-[#eaeaea]/20">

      <ScrollIndicator activeSection={activeSection} />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-12 py-6 md:py-12">

        {/* Home Section */}
        <section id="home" className="pt-0 pb-4 sm:pt-0 sm:pb-6 mb-0 scroll-mt-32">

          {/* Banner Image */}
          <div className="mb-8 w-full h-48 sm:h-64 overflow-hidden rounded-3xl border border-[#1f1f1f]">
            <img src={bannerImage} alt="Portfolio Banner" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-center">

            {/* Left Column: Text Content */}
            <div className="flex flex-col justify-center">
              <p className="text-xs tracking-[0.28em] text-[#9a9a9a] mb-5">PORTFOLIO / 2026</p>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl leading-[0.95] font-light tracking-tight mb-6">
                <span className="block text-[#eaeaea]">{name.split(' ')[0]}</span>
                <span className="block text-[#eaeaea]/75">{name.split(' ').slice(1).join(' ')}</span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-[#9a9a9a] mb-6">
                {bio}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#9a9a9a] mb-8">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" aria-hidden />
                  Available for work
                </span>
                <span className="h-4 w-px bg-[#1f1f1f]" aria-hidden />
                <span>Based in India</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <a href={contact.resume} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#1f1f1f] bg-[#0f0f0f] px-4 text-sm font-medium text-[#eaeaea] shadow-sm transition-colors hover:bg-[#141414] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1f1f1f] disabled:pointer-events-none disabled:opacity-50">
                  <Briefcase size={16} />
                  Resume
                </a>

                {[
                  { label: "GitHub", href: contact.github, icon: FaGithub },
                  { label: "LinkedIn", href: contact.linkedin, icon: FaLinkedin },
                  { label: "X", href: contact.twitter, icon: FaXTwitter },
                  { label: "Email", href: `mailto:${contact.email}`, icon: MdEmail }
                ].filter(l => l.href).map(l => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#1f1f1f] bg-[#0f0f0f] px-4 text-sm font-medium text-[#eaeaea] shadow-sm transition-colors hover:bg-[#141414] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1f1f1f] disabled:pointer-events-none disabled:opacity-50">
                    <l.icon size={16} />
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Column: Chat Link (Replaced Currently Card) */}
            <div className="flex items-center justify-center lg:justify-end w-full">
              <Link to="/" className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-8 text-base font-medium text-emerald-500 shadow-sm transition-all hover:bg-emerald-500/20 hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500">
                <MessageSquare size={20} />
                Chat with my AI
              </Link>
            </div>

          </div>

          {/* Skills */}
          <div className="mb-2 mt-6 sm:mt-10">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Technologies</h3>
            <div className="flex flex-wrap gap-x-2 gap-y-3">
              {skills.map((skill) => (
                <span key={skill.name} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111] border border-zinc-800 hover:bg-[#1a1a1a] hover:border-zinc-700 transition-all duration-200 cursor-default">
                  {skillIcons[skill.name.toLowerCase()] ? React.createElement(skillIcons[skill.name.toLowerCase()], { size: 14, className: skillColors[skill.name.toLowerCase()]?.icon || "text-zinc-400" }) : <Code2 size={14} className="text-zinc-400" />}
                  <span className="text-sm font-medium text-zinc-300">{skill.name}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-8 sm:py-10 mb-12 scroll-mt-20">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-[#eaeaea]">Projects</h2>
              <p className="mt-2 text-sm sm:text-base text-[#9a9a9a]">Selected personal and professional work.</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <RefCard key={project.id} className="h-full rounded-2xl group">
                <RefCardHeader>
                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center rounded-full border border-[#1f1f1f] bg-[#0b0b0b] px-3 py-1 text-[10px] tracking-[0.2em] text-[#9a9a9a] mb-4 uppercase">
                      Project
                    </span>
                    <RefCardTitle className="text-lg sm:text-xl font-normal truncate pr-4">{project.title}</RefCardTitle>
                  </div>

                  <div data-slot="card-action" className="flex items-start gap-3">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="text-[#9a9a9a] hover:text-white transition-colors">
                        <FaGithub size={20} />
                      </a>
                    )}
                    {(project.link || project.demoUrl) && (
                      <a href={project.link || project.demoUrl} target="_blank" rel="noreferrer" className="text-[#9a9a9a] hover:text-white transition-colors">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </RefCardHeader>
                <RefCardContent>
                  <p className="text-sm leading-relaxed text-[#9a9a9a] line-clamp-3 group-hover:text-[#b0b0b0] transition-colors">{project.description}</p>
                </RefCardContent>
                <RefCardFooter>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    {project.technologies.slice(0, 5).map((t) => (
                      <span key={t} className="text-[#9a9a9a] underline underline-offset-4 decoration-[#1f1f1f] hover:decoration-[#333] transition-all">
                        {t}
                      </span>
                    ))}
                  </div>
                </RefCardFooter>
              </RefCard>
            ))}
          </div>
        </section>

        {/* Experience Section - HIDDEN */}
        {/* 
          <section id="experience" ... >
             ...
          </section> 
          */}

        {/* Contact Section */}
        <ConnectFooter contact={contact} />

        {/* Final Footer Quote */}
        <div className="border-t border-[#1f1f1f] py-10 mt-12 bg-[#0b0b0b] flex justify-center">
          <p className="text-sm text-[#9a9a9a] italic">"It is not death that a man should fear, but he should fear never beginning to live."</p>
        </div>

      </div>
    </div>
  );
};
export default Portfolio;