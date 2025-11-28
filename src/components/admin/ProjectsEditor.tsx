import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Trash2, Save, X, Loader2 } from 'lucide-react';
import { useToast } from '../ui/use-toast';

interface Project {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    features: string[];
    results: { value: string; metric: string }[];
    github: string;
    link: string;
    demo_url: string;
}

export const ProjectsEditor = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Project>>({});
    const { toast } = useToast();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
        if (error) {
            toast({ title: 'Error fetching projects', description: error.message, variant: 'destructive' });
        } else {
            setProjects(data || []);
        }
        setLoading(false);
    };

    const handleEdit = (project: Project) => {
        setEditingId(project.id);
        setEditForm(project);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSave = async () => {
        if (!editForm.id) return;

        const { error } = await supabase.from('projects').upsert(editForm);
        if (error) {
            toast({ title: 'Error saving project', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: 'Project saved', description: 'Changes have been saved to Supabase.' });
            setEditingId(null);
            fetchProjects();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) {
            toast({ title: 'Error deleting project', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: 'Project deleted', description: 'Project has been removed.' });
            fetchProjects();
        }
    };

    const handleAddNew = () => {
        const newId = (projects.length + 1).toString();
        const newProject: Project = {
            id: newId,
            title: 'New Project',
            description: '',
            technologies: [],
            features: [],
            results: [],
            github: '',
            link: '',
            demo_url: ''
        };
        setEditingId(newId);
        setEditForm(newProject);
        setProjects([...projects, newProject]);
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Projects</h2>
                <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
            </div>

            <div className="grid gap-6">
                {projects.map((project) => (
                    <Card key={project.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-semibold">
                                {editingId === project.id ? (
                                    <Input
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        className="font-bold text-xl"
                                    />
                                ) : (
                                    project.title
                                )}
                            </CardTitle>
                            <div className="flex gap-2">
                                {editingId === project.id ? (
                                    <>
                                        <Button size="sm" variant="ghost" onClick={handleCancel}><X className="h-4 w-4" /></Button>
                                        <Button size="sm" onClick={handleSave}><Save className="h-4 w-4" /></Button>
                                    </>
                                ) : (
                                    <>
                                        <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>Edit</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {editingId === project.id ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Description</label>
                                        <Textarea
                                            value={editForm.description}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium">GitHub URL</label>
                                            <Input
                                                value={editForm.github}
                                                onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Live Demo URL</label>
                                            <Input
                                                value={editForm.link || editForm.demo_url}
                                                onChange={(e) => setEditForm({ ...editForm, link: e.target.value, demo_url: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Technologies (comma separated)</label>
                                        <Input
                                            value={editForm.technologies?.join(', ')}
                                            onChange={(e) => setEditForm({ ...editForm, technologies: e.target.value.split(',').map(s => s.trim()) })}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-muted-foreground">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies?.map(tech => (
                                            <span key={tech} className="bg-secondary px-2 py-1 rounded text-xs">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
