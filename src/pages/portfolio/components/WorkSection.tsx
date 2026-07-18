import React from "react";

export const WorkSection: React.FC = () => {
  return (
    <section id="work" className="scroll-mt-24 space-y-8">
      
      {/* Section Header */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 dark:text-zinc-400 font-mono uppercase">
          WORK
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          where I've worked
        </h2>
      </div>

      {/* Experience Card (Sleek Matte Black Box) */}
      <div className="bg-white dark:bg-[#070709] border border-zinc-200 dark:border-zinc-850 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Independent
            </h3>
            <p className="text-xs font-semibold text-zinc-650 dark:text-zinc-400">
              AI & Full Stack Engineer
            </p>
          </div>

          <div className="font-mono text-xs text-zinc-450 dark:text-zinc-500 font-medium shrink-0">
            2025 — Present
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-300 leading-relaxed max-w-2xl pt-1">
          Designing and building AI-native products from scratch. I work across the entire stack—from modern frontend experiences and scalable backend systems to agentic AI workflows, real-time infrastructure, authentication, and cloud deployment. Every project is an opportunity to solve real problems and push my engineering skills further.
        </p>

      </div>

    </section>
  );
};
