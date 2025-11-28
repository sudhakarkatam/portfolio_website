import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface Skill {
    name: string;
    level: number; // 0-100
}

interface SkillBadgesProps {
    skills: Skill[];
}

export const SkillBadges = ({ skills }: SkillBadgesProps) => {
    console.log('SkillBadges received:', skills);
    if (!skills || skills.length === 0) {
        console.log('SkillBadges: No skills to display');
        return null;
    }

    // Group skills by level for visual hierarchy (optional, but nice)
    // For now, just a nice cloud

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full bg-card/50 border border-border/50 rounded-xl p-6 shadow-sm my-4"
        >
            <h3 className="text-lg font-semibold mb-4 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Technical Proficiency
            </h3>

            <div className="flex flex-wrap justify-center gap-2">
                {skills.map((skill, index) => (
                    <motion.div key={`${skill.name}-${index}`} variants={item}>
                        <Badge
                            variant="secondary"
                            className="px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-default border-accent/20"
                        >
                            {skill.name}
                        </Badge>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
