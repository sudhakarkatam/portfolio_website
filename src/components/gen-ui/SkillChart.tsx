import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface Skill {
    name: string;
    level: number; // 0-100
}

interface SkillChartProps {
    skills: Skill[];
}

export const SkillChart = ({ skills }: SkillChartProps) => {
    if (!skills || skills.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-[300px] bg-card border border-border rounded-xl p-4 shadow-sm my-4"
        >
            <h3 className="text-lg font-semibold mb-4 text-center">Technical Proficiency</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skills} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Bar dataKey="level" radius={[0, 4, 4, 0]} barSize={20}>
                        {skills.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(var(--accent) / ${0.5 + (index / skills.length) * 0.5})`} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
};
