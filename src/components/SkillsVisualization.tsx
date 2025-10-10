import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Skill } from '@/types/portfolio';

interface SkillsVisualizationProps {
  skills: Skill[];
}

export const SkillsVisualization = ({ skills }: SkillsVisualizationProps) => {
  const categories = ['Frontend', 'Backend', 'Database', 'Tools'] as const;
  
  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Code;
  };

  const categoryColors: Record<string, string> = {
    Frontend: 'from-blue-500 to-cyan-500',
    Backend: 'from-purple-500 to-pink-500',
    Database: 'from-green-500 to-emerald-500',
    Tools: 'from-orange-500 to-red-500',
  };

  return (
    <div className="space-y-8">
      {categories.map((category, catIndex) => {
        const categorySkills = skills.filter(s => s.category === category);
        if (categorySkills.length === 0) return null;

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className={`w-1 h-6 bg-gradient-to-b ${categoryColors[category]} rounded-full`} />
              {category}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categorySkills.map((skill, index) => {
                const IconComponent = getIconComponent(skill.icon);
                
                return (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: catIndex * 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-card border border-border rounded-lg p-4 shadow-md hover:shadow-glow transition-all duration-300 cursor-pointer"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${categoryColors[category]} rounded-lg flex items-center justify-center mb-3 shadow-lg`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-semibold">{skill.name}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
