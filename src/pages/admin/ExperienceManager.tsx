import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Trash2, Plus, Pencil, Save, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

interface Experience {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
    technologies: string[];
    created_at: string;
}

const ExperienceManager = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        role: "",
        company: "",
        period: "",
        description: "",
        technologies: "",
    });

    const fetchExperience = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("experience")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch experience");
        } else {
            setExperiences(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchExperience();
    }, []);

    const handleSave = async () => {
        const dataToSave = {
            role: formData.role,
            company: formData.company,
            period: formData.period,
            description: formData.description,
            technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
        };

        let error;
        if (editingId) {
            const { error: updateError } = await supabase
                .from("experience")
                .update(dataToSave)
                .eq("id", editingId);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("experience")
                .insert([dataToSave]);
            error = insertError;
        }

        if (error) {
            toast.error("Failed to save experience: " + error.message);
        } else {
            toast.success("Experience saved");
            setIsDialogOpen(false);
            resetForm();
            fetchExperience();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const { error } = await supabase.from("experience").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete");
        } else {
            toast.success("Deleted successfully");
            setExperiences(experiences.filter(e => e.id !== id));
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            role: "",
            company: "",
            period: "",
            description: "",
            technologies: "",
        });
    };

    const openEdit = (exp: Experience) => {
        setEditingId(exp.id);
        setFormData({
            role: exp.role,
            company: exp.company,
            period: exp.period,
            description: exp.description,
            technologies: exp.technologies?.join(", ") || "",
        });
        setIsDialogOpen(true);
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Experience</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" /> Add Experience
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Experience" : "Add Experience"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label>Role / Title</label>
                                    <Input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="Senior Developer" />
                                </div>
                                <div className="grid gap-2">
                                    <label>Company</label>
                                    <Input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder="Tech Corp" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label>Period</label>
                                <Input value={formData.period} onChange={e => setFormData({ ...formData, period: e.target.value })} placeholder="Jan 2023 - Present" />
                            </div>
                            <div className="grid gap-2">
                                <label>Description</label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="min-h-[100px]" />
                            </div>
                            <div className="grid gap-2">
                                <label>Technologies (comma separated)</label>
                                <Input value={formData.technologies} onChange={e => setFormData({ ...formData, technologies: e.target.value })} placeholder="React, Node.js, AWS" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {experiences.map((exp) => (
                    <Card key={exp.id}>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">{exp.role}</h3>
                                    <p className="text-lg text-primary">{exp.company}</p>
                                    <p className="text-sm text-muted-foreground mb-2">{exp.period}</p>
                                    <p className="whitespace-pre-wrap mb-4">{exp.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {exp.technologies?.map(t => (
                                            <span key={t} className="bg-secondary px-2 py-1 rounded text-xs">{t}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => openEdit(exp)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(exp.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ExperienceManager;
