import React, { useState, useEffect } from "react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

interface HeroProps {
  name: string;
  bio: string;
  contact: {
    email: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    resume?: string;
  };
}

export const Hero: React.FC<HeroProps> = ({ name, bio, contact }) => {
  const [typedText, setTypedText] = useState("");
  const titles = [
    "Learning relentlessly.",
    "Curiosity outstared the void.",
    "Figuring out things.",
    "Exploring AI, hardware,new tech updates daily."
  ];
  const [titleIdx, setTitleIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect matching Keshavv's hero status line
  useEffect(() => {
    const currentTitle = titles[titleIdx];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (typedText.length < currentTitle.length) {
        timer = setTimeout(() => {
          setTypedText(currentTitle.slice(0, typedText.length + 1));
        }, 60);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else {
      if (typedText.length > 0) {
        timer = setTimeout(() => {
          setTypedText(currentTitle.slice(0, typedText.length - 1));
        }, 30);
      } else {
        setIsDeleting(false);
        setTitleIdx((prev) => (prev + 1) % titles.length);
      }
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, titleIdx, titles]);

  const handleScrollToWork = () => {
    const el = document.getElementById("projects");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8 pt-16">

      {/* Top Typewriter Status Line */}
      <div className="h-6 flex items-center">
        <span className="text-sm font-mono text-zinc-650 dark:text-zinc-400 font-medium border-r-2 border-zinc-400 dark:border-zinc-500 pr-1 animate-pulse">
          {typedText}
        </span>
      </div>

      {/* Upper Hero Section - Directly on Grid */}
      <div className="space-y-6 py-2">

        {/* Profile Avatar & Header Title */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* Completely Round Profile Image */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 border border-zinc-300 dark:border-[#1e1e24] shadow-md">
            <img
              src="/profile pic.png"
              className="w-full h-full object-cover bg-zinc-100 dark:bg-zinc-900"
              alt={name}
            />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Sudhakar.
            </h1>
            <p className="text-lg sm:text-xl font-semibold text-zinc-700 dark:text-zinc-300">
              Engineer with many interests, always curious to explore new technologies
            </p>
          </div>
        </div>

        {/* Bio Text */}
        <p className="text-zinc-650 dark:text-zinc-400 text-base leading-relaxed max-w-3xl">
          Driven by curiosity. I love learning new technologies and building products that genuinely excite me—from AI experiments to full-stack systems.
        </p>

        {/* Action Button & Glowing Social Icons Row */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {/* 'see my work' pill button */}
          <button
            onClick={handleScrollToWork}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-black text-xs sm:text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 hover:scale-105 transition-all shadow-md cursor-pointer outline-none"
          >
            see my work
          </button>

          {/* Social Icon Circles */}
          <div className="flex items-center gap-2.5">
            {[
              { icon: FaGithub, href: contact.github, label: "GitHub" },
              { icon: FaXTwitter, href: contact.twitter, label: "Twitter" },
              { icon: FaLinkedin, href: contact.linkedin, label: "LinkedIn" },
              { icon: MdEmail, href: `mailto:${contact.email}`, label: "Email" }
            ].map((social, idx) => (
              social.href && (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-zinc-300 dark:border-[#1e1e24] bg-zinc-100/80 dark:bg-[#070709] flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 hover:scale-110 hover:shadow-[0_0_14px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_14px_rgba(255,255,255,0.2)] transition-all duration-300 outline-none"
                  title={social.label}
                >
                  <social.icon size={16} />
                </a>
              )
            ))}
          </div>
        </div>

      </div>

      {/* Bottom 3 Bento Status Cards Row (Larger Card Size & Padding) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">

        {/* Card 1: Availability Status */}
        <div className="bg-white dark:bg-[#070709] border border-zinc-200 dark:border-[#1e1e24] rounded-2xl p-6 flex items-center gap-3.5 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all min-h-[105px]">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-snug">
            Open to work
          </span>
        </div>

        {/* Card 2: Building */}
        <div className="bg-white dark:bg-[#070709] border border-zinc-200 dark:border-[#1e1e24] rounded-2xl p-6 space-y-2 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all flex flex-col justify-center min-h-[105px]">
          <div className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase font-mono">BUILDING</div>
          <div className="text-xs sm:text-sm font-medium text-zinc-750 dark:text-zinc-300 truncate">
            may be Content in future
          </div>
        </div>

        {/* Card 3: Learning */}
        <div className="bg-white dark:bg-[#070709] border border-zinc-200 dark:border-[#1e1e24] rounded-2xl p-6 space-y-2 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all flex flex-col justify-center min-h-[105px]">
          <div className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase font-mono">LEARNING</div>
          <div className="text-xs sm:text-sm font-medium text-zinc-750 dark:text-zinc-300 truncate">
            Agentic AI • LLMs • MCP • RAG
          </div>
        </div>

      </div>

    </div>
  );
};
