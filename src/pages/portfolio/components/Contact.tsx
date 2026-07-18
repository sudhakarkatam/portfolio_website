import React, { useState, useEffect } from "react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

interface ContactProps {
  contact: {
    email: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export const Contact: React.FC<ContactProps> = ({ contact }) => {
  const [timeStr, setTimeStr] = useState("");

  // Live IST Clock for footer
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
      setTimeStr(formatter.format(now));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="contact" className="scroll-mt-24 space-y-12">
      
      {/* Bento Container Box (Subtle Muted Dark Border) */}
      <div className="bg-white dark:bg-[#070709] border border-zinc-200 dark:border-[#1e1e24] rounded-3xl p-8 sm:p-12 relative overflow-hidden group hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all duration-300">
        <div className="max-w-xl space-y-6 text-left flex flex-col items-start">
          
          {/* Header Label */}
          <div className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 dark:text-zinc-500 font-mono uppercase">
            CONTACT
          </div>

          {/* Main Title with Horizontal Divider Line */}
          <div className="flex items-center gap-4 w-full">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white shrink-0">
              Let's build something.
            </h2>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800/40" />
          </div>

          {/* Subtitle */}
          <p className="text-zinc-650 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md">
            Have a project, role, or an idea in mind? Just send an email.
          </p>

          {/* Direct Email Pill Button */}
          <div className="pt-2">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-zinc-950 dark:bg-white text-white dark:text-black font-extrabold font-mono text-xs sm:text-sm rounded-full hover:scale-105 transition-all shadow-md cursor-pointer outline-none"
            >
              {contact.email}
            </a>
          </div>

          {/* Social Icons Row */}
          <div className="flex items-center gap-3 pt-2">
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

      {/* Marcus Aurelius Quote */}
      <div className="text-center pt-2">
        <p className="text-xs text-zinc-500 dark:text-zinc-600 italic max-w-md mx-auto leading-relaxed">
          "It is not death that a man should fear, but he should fear never beginning to live." — Marcus Aurelius
        </p>
      </div>

      {/* Page Footer */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-500">
        <div>
          © {new Date().getFullYear()} Sudhakar. Built with <span className="text-red-500">❤️</span> and hardwork
        </div>

        {/* Live IST Clock */}
        <div className="flex items-center gap-2 font-mono font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>India</span>
          <span>·</span>
          <span>{timeStr || "01:36:44 AM"}</span>
        </div>
      </div>

    </section>
  );
};
