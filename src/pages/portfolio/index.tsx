import React, { useState, useEffect } from "react";
import { portfolioData } from "@/data/portfolioData";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { AboutSection } from "./components/AboutSection";
import { WorkSection } from "./components/WorkSection";
import { SkillsMarquee } from "./components/SkillsMarquee";
import { SkillsSection } from "./components/SkillsSection";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";

const PortfolioPage: React.FC = () => {
  const { name, bio, skills, projects, contact } = portfolioData;
  const [activeSection, setActiveSection] = useState("about");
  
  // Manage theme state
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("portfolio-theme");
    return (saved as "light" | "dark") || "dark";
  });

  // Dynamically crop browser tab title bar favicon into a perfect round circle
  useEffect(() => {
    const img = new Image();
    img.src = "/profile pic.png";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 64;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw round circular clip path
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        
        // Draw profile image into circle
        ctx.drawImage(img, 0, 0, size, size);

        // Update favicon element in browser title bar
        let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.type = "image/png";
        link.href = canvas.toDataURL("image/png");
      }
    };
  }, []);

  // Sync dark class and save theme choice
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#0a0a0c";
      document.body.style.color = "#f4f4f5";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#fafafa";
      document.body.style.color = "#18181b";
    }
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  // Scroll spy listener
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "projects", "skills", "contact"];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      setActiveSection(id);
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleToggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0c] text-zinc-900 dark:text-[#f4f4f5] font-sans selection:bg-[#eaeaea]/20 relative transition-colors duration-300">
      
      {/* Subtle Background Grid overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-30"
        style={{
          backgroundImage: theme === "dark"
            ? `
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `
            : `
              linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
            `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)'
        }}
      />

      {/* Scroll Marquee animation keyframe styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      {/* Capsule Navigation Navbar */}
      <Navbar 
        activeSection={activeSection} 
        onNavigate={handleNavigate} 
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container aligned to 780px centered column */}
      <main className="relative z-10 mx-auto max-w-[780px] px-4 sm:px-6 py-12 space-y-24">
        
        {/* Hero Section */}
        <Hero name={name} bio={bio} contact={contact} />

        {/* Section 1: About Section */}
        <AboutSection />

        {/* Work Section (Hidden for now) */}
        {/* <WorkSection /> */}

        {/* Technical Skills Marquee Banner */}
        <SkillsMarquee skills={skills} />

        {/* Section 2: Projects List */}
        <Projects projects={projects} />

        {/* Section 3: Skills & Technologies Grid */}
        <SkillsSection />

        {/* Section 4: Contact */}
        <Contact contact={contact} />

      </main>
    </div>
  );
};

export default PortfolioPage;
