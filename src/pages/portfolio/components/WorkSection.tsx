import React from "react";
import { ExternalLink, GraduationCap, Briefcase, Cloud } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  type: string;
  icon: React.ReactNode;
  technologies?: string[];
  certificateUrl?: string;
}

export const WorkSection: React.FC = () => {
  const experiences: Experience[] = [
    {
      id: "1",
      title: "AI & Full Stack Engineer",
      company: "Independent",
      period: "2025 — Present",
      description:
        "Designing and building AI-native products from scratch. Working across the entire stack — from modern frontend experiences and scalable backend systems to agentic AI workflows, real-time infrastructure, authentication, and cloud deployment.",
      type: "Current",
      icon: <Briefcase size={16} />,
      technologies: ["React", "TypeScript", "Supabase", "AI/LLMs", "Vercel"],
    },
    {
      id: "2",
      title: "Salesforce Developer Virtual Intern",
      company: "SmartBridge (Powered by Salesforce)",
      period: "May 2024 — June 2024",
      description:
        "Completed intensive 2-month Salesforce development virtual internship focusing on CRM solutions, Apex programming, Lightning Web Components, and Visualforce.",
      type: "Internship",
      icon: <Briefcase size={16} />,
      technologies: ["Salesforce", "Apex", "LWC", "SOQL"],
      certificateUrl:
        "https://drive.google.com/file/d/1j2jyRZ1Q9HTowxMYL2YXSIgeg6gv_HEu/view?usp=sharing",
    },
    {
      id: "3",
      title: "AWS Cloud Virtual Intern",
      company: "AICTE",
      period: "May 2023 — July 2023",
      description:
        "Completed comprehensive 3-month AWS cloud computing internship covering cloud architecture, core services, security, and scalable application deployment.",
      type: "Internship",
      icon: <Cloud size={16} />,
      technologies: ["AWS", "EC2", "S3", "Lambda", "IAM"],
      certificateUrl:
        "https://drive.google.com/file/d/1Ty2qzZyTdThHYfETXUPkxZw7cIQcs3TV/view?usp=sharing",
    },
    {
      id: "4",
      title: "B.Tech Computer Science Engineering",
      company: "Malla Reddy University",
      period: "Aug 2021 — May 2025",
      description:
        "Bachelor of Technology in Computer Science and Engineering with a specialization in IoT. Maintained 8.58 CGPA. Actively participated in coding competitions, hackathons, and technical workshops.",
      type: "Education",
      icon: <GraduationCap size={16} />,
    },
  ];

  return (
    <section id="work" className="scroll-mt-24 space-y-8">

      {/* Section Header */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 dark:text-zinc-500 font-mono uppercase">
          EXPERIENCE
        </div>
        <div className="flex items-center gap-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            where I've worked
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-zinc-300 dark:from-zinc-700 to-transparent" />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-0">
        {/* Vertical timeline line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-zinc-300 via-zinc-200 to-transparent dark:from-zinc-700 dark:via-zinc-800 dark:to-transparent" />

        {experiences.map((exp, idx) => (
          <div key={exp.id} className="relative flex gap-5 group">
            {/* Timeline dot */}
            <div className="relative z-10 shrink-0 mt-6">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110 ${
                  exp.type === "Current"
                    ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                    : exp.type === "Education"
                    ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
                    : "bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {exp.icon}
              </div>
            </div>

            {/* Card */}
            <div
              className={`flex-1 bg-white dark:bg-[#070709] border border-zinc-200 dark:border-[#1e1e24] rounded-2xl p-5 sm:p-6 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${
                idx < experiences.length - 1 ? "mb-4" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                      {exp.title}
                    </h3>
                    {exp.type === "Current" && (
                      <span className="text-[9px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {exp.company}
                  </p>
                </div>

                <div className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 font-medium shrink-0">
                  {exp.period}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {exp.description}
              </p>

              {/* Tech pills + certificate link */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {exp.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-0.5 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
                {exp.certificateUrl && (
                  <a
                    href={exp.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    <ExternalLink size={10} />
                    View Certificate
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
