import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Sun, Moon } from "lucide-react";

interface NavbarProps {
  activeSection: string;
  onNavigate: (id: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, theme, onToggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`fixed left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4 transition-all duration-300 ${
      isScrolled ? "top-4" : "top-6"
    }`}>
      <div className={`flex items-center gap-8 sm:gap-10 rounded-full px-8 py-3 transition-all duration-300 ${
        isScrolled 
          ? "backdrop-blur-md bg-white/75 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-900 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)]" 
          : "bg-transparent border-transparent"
      }`}>
        
        {/* Brand Avatar (Clean Round Icon) */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 cursor-pointer group outline-none"
        >
          <img 
            src="/profile pic.png" 
            className="w-6 h-6 rounded-full object-cover shrink-0 border border-zinc-300 dark:border-zinc-700 group-hover:rotate-12 transition-transform duration-300"
            alt="Avatar" 
          />
          <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 tracking-wider">Sudhakar</span>
        </button>

        {/* Divider */}
        <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

        {/* Links */}
        <nav className="flex items-center gap-7 sm:gap-9 text-[11px] font-bold tracking-widest text-zinc-500 dark:text-zinc-455 hover:text-zinc-800 dark:hover:text-zinc-200 uppercase">
          {[
            { id: "about", label: "About" },
            { id: "projects", label: "Projects" },
            { id: "contact", label: "Contact" }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`transition-colors relative py-0.5 outline-none ${
                activeSection === item.id 
                  ? "text-zinc-900 dark:text-white" 
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Divider */}
        <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

        {/* Chat / Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all"
            title="Chat with my AI"
          >
            <MessageSquare size={12} />
          </Link>
          <button 
            onClick={onToggleTheme}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors outline-none" 
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>

      </div>
    </div>
  );
};
