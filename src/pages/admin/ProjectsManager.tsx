import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Loader2, Save, X, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ProjectsManager = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Delete Confirmation State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
    const [projectToDelete, setProjectToDelete] = useState<any>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        technologies: "",
        features: "",
        link: "",
        github: "",
        demo_url: "",
        image_url: "",
        results: [] as { metric: string; value: string }[],
    });

    const fetchProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch projects");
        } else {
            setProjects(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        setUploading(true);
        try {
            let imageUrl = formData.image_url;

            // Upload Image if selected
            if (selectedFile) {
                const fileExt = selectedFile.name.split(".").pop();
                const fileName = `projects/${Math.random().toString(36).substring(2)}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from("portfolio-images")
                    .upload(fileName, selectedFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from("portfolio-images")
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
            }

            const projectData = {
                ...formData,
                image_url: imageUrl,
                technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
                features: formData.features.split("\n").map((f) => f.trim()).filter(Boolean),
                results: formData.results,
            };

            let error;
            if (editingProject) {
                const { error: updateError } = await supabase
                    .from("projects")
                    .update(projectData)
                    .eq("id", editingProject.id);
                error = updateError;
            } else {
                const newId = Date.now().toString();
                const { error: insertError } = await supabase
                    .from("projects")
                    .insert([{ ...projectData, id: newId }]);
                error = insertError;
            }

            if (error) throw error;

            toast.success("Project saved successfully");
            setIsDialogOpen(false);
            fetchProjects();
            resetForm();
        } catch (error: any) {
            toast.error("Failed to save project: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const initiateDelete = (project: any) => {
        setProjectToDelete(project);
        setDeleteId(project.id);
        setDeleteConfirmationText("");
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        if (deleteConfirmationText !== "delete") {
            toast.error("Please type 'delete' to confirm.");
            return;
        }

        const { error } = await supabase.from("projects").delete().eq("id", deleteId);

        if (error) {
            toast.error("Failed to delete project");
        } else {
            toast.success("Project deleted");
            setProjects(projects.filter((p) => p.id !== deleteId));
        }
        setDeleteId(null);
        setProjectToDelete(null);
    };

    const resetForm = () => {
        setEditingProject(null);
        setSelectedFile(null);
        setFormData({
            title: "",
            description: "",
            technologies: "",
            features: "",
            link: "",
            github: "",
            demo_url: "",
            image_url: "",
            results: [],
        });
    };

    const openEdit = (project: any) => {
        setEditingProject(project);
        setSelectedFile(null);
        setFormData({
            title: project.title,
            description: project.description,
            technologies: project.technologies?.join(", ") || "",
            features: project.features?.join("\n") || "",
            link: project.link || "",
            github: project.github || "",
            demo_url: project.demo_url || "",
            image_url: project.image_url || project.image || "", // Handle both new and old fields if any
            results: Array.isArray(project.results) ? project.results : [],
        });
        setIsDialogOpen(true);
    };

    // Helper to manage stats/results
    const addStat = () => {
        setFormData({
            ...formData,
            results: [...formData.results, { metric: "", value: "" }],
        });
    };

    const updateStat = (index: number, field: "metric" | "value", val: string) => {
        const newResults = [...formData.results];
        newResults[index][field] = val;
        setFormData({ ...formData, results: newResults });
    };

    const removeStat = (index: number) => {
        const newResults = [...formData.results];
        newResults.splice(index, 1);
        setFormData({ ...formData, results: newResults });
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Projects</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" /> Add Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label>Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label>Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="min-h-[100px]"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label>Project Image</label>
                                <div className="flex items-center gap-4">
                                    {formData.image_url && (
                                        <img src={formData.image_url} alt="Preview" className="h-16 w-16 object-cover rounded" />
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label>Technologies (comma separated)</label>
                                <Input
                                    value={formData.technologies}
                                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                    placeholder="React, TypeScript, Supabase"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label>Features (one per line)</label>
                                <Textarea
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    className="min-h-[100px]"
                                    placeholder="- Feature 1&#10;- Feature 2"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label>Live Link / Demo URL</label>
                                    <Input
                                        value={formData.link || formData.demo_url}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value, demo_url: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label>GitHub URL</label>
                                    <Input
                                        value={formData.github}
                                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Stats / Results Section */}
                            <div className="space-y-2 border-t pt-4 mt-2">
                                <div className="flex items-center justify-between">
                                    <label className="font-semibold">Stats & Metrics (Optional)</label>
                                    <Button type="button" variant="outline" size="sm" onClick={addStat}>
                                        <PlusCircle className="h-4 w-4 mr-2" /> Add Stat
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.results.map((stat, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <Input
                                                placeholder="Metric (e.g. Downloads)"
                                                value={stat.metric}
                                                onChange={(e) => updateStat(index, "metric", e.target.value)}
                                            />
                                            <Input
                                                placeholder="Value (e.g. 10k+)"
                                                value={stat.value}
                                                onChange={(e) => updateStat(index, "value", e.target.value)}
                                            />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeStat(index)}>
                                                <X className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    ))}
                                    {formData.results.length === 0 && (
                                        <p className="text-sm text-muted-foreground italic">No stats added yet.</p>
                                    )}
                                </div>
                            </div>

                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Project</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Tech Stack</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell className="font-medium">{project.title}</TableCell>
                                <TableCell className="max-w-xs truncate">
                                    {project.technologies?.join(", ")}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => openEdit(project)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => initiateDelete(project)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the project
                            <span className="font-bold text-foreground"> "{projectToDelete?.title}"</span>.
                        </AlertDialogDescription>
                        <div className="py-2">
                            <label className="text-sm text-muted-foreground mb-1 block">
                                Type <span className="font-mono font-bold text-destructive">delete</span> to confirm:
                            </label>
                            <Input
                                value={deleteConfirmationText}
                                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                                placeholder="delete"
                                className="border-destructive/50 focus-visible:ring-destructive"
                            />
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setDeleteId(null); setProjectToDelete(null); }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteConfirmationText !== "delete"}
                        >
                            Delete Project
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProjectsManager;