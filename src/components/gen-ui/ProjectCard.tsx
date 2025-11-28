import { motion } from 'framer-motion';
import { ExternalLink, Github, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectCardProps {
    title: string;
    description: string;
    techStack: string[];
    link?: string;
    github?: string;
}

export const ProjectCard = ({ title, description, techStack, link, github }: ProjectCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-4 max-w-md"
        >
            <Card className="overflow-hidden border-accent/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-accent to-purple-500" />
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Code className="w-5 h-5 text-accent" />
                        {title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {techStack.map((tech) => (
                            <Badge key={tech} variant="secondary" className="bg-secondary/50">
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 bg-secondary/10 p-4">
                    {github && (
                        <Button variant="outline" size="sm" asChild>
                            <a href={github} target="_blank" rel="noopener noreferrer">
                                <Github className="w-4 h-4 mr-2" />
                                Code
                            </a>
                        </Button>
                    )}
                    {link && (
                        <Button size="sm" asChild>
                            <a href={link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Demo
                            </a>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
};
