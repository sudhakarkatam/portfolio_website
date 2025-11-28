import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Save, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface Skill {
    id: string;
    name: string;
    category: string;
}

const CATEGORIES = [
    "Frontend",
    "Backend",
    "Database",
    "Tools",
    "DevOps",
    "Mobile",
    "Other"
];

const SkillsManager = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [newSkill, setNewSkill] = useState({ name: "", category: "Frontend" });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [editForm, setEditForm] = useState({ name: "", category: "" });

    const fetchSkills = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("skills")
            .select("*")
            .order("category", { ascending: true });

        if (error) {
            toast.error("Failed to fetch skills");
        } else {
            setSkills(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleAdd = async () => {
        if (!newSkill.name) return;

        const { error } = await supabase.from("skills").insert([newSkill]);

        if (error) {
            toast.error("Failed to add skill");
        } else {
            toast.success("Skill added");
            setNewSkill({ name: "", category: "Frontend" });
            fetchSkills();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this skill?")) return;

        const { error } = await supabase.from("skills").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete skill");
        } else {
            setSkills(skills.filter((s) => s.id !== id));
            toast.success("Skill deleted");
        }
    };

    const openEdit = (skill: Skill) => {
        setEditingSkill(skill);
        setEditForm({ name: skill.name, category: skill.category });
        setIsDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingSkill || !editForm.name) return;

        const { error } = await supabase
            .from("skills")
            .update(editForm)
            .eq("id", editingSkill.id);

        if (error) {
            toast.error("Failed to update skill");
        } else {
            toast.success("Skill updated");
            setIsDialogOpen(false);
            setEditingSkill(null);
            fetchSkills();
        }
    };

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Skills Manager</h1>

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Skill</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label>Skill Name</label>
                            <Input
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label>Category</label>
                            <Select
                                value={CATEGORIES.includes(editForm.category) ? editForm.category : "Other"}
                                onValueChange={(val) => setEditForm({ ...editForm, category: val === "Other" ? "" : val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                    <SelectItem value="Other">Other (Custom)</SelectItem>
                                </SelectContent>
                            </Select>
                            {(!CATEGORIES.includes(editForm.category) || editForm.category === "") && (
                                <Input
                                    value={editForm.category}
                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                    placeholder="Enter new category"
                                    className="mt-1"
                                />
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex gap-4 items-end bg-card p-4 rounded-lg border">
                <div className="grid gap-2 flex-1">
                    <label className="text-sm font-medium">Skill Name</label>
                    <Input
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        placeholder="e.g. React Native"
                    />
                </div>
                <div className="grid gap-2 w-48">
                    <label className="text-sm font-medium">Category</label>
                    <div className="flex flex-col gap-2">
                        <Select
                            value={CATEGORIES.includes(newSkill.category) ? newSkill.category : "Other"}
                            onValueChange={(val) => setNewSkill({ ...newSkill, category: val === "Other" ? "" : val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                                <SelectItem value="Other">Other (Create New)</SelectItem>
                            </SelectContent>
                        </Select>
                        {(!CATEGORIES.includes(newSkill.category) || newSkill.category === "") && (
                            <Input
                                value={newSkill.category}
                                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                                placeholder="Enter new category"
                                className="mt-1"
                            />
                        )}
                    </div>
                </div>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Add Skill
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                    <div key={category} className="bg-card p-4 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">{category}</h3>
                        <div className="flex flex-wrap gap-2">
                            {categorySkills.map((skill) => (
                                <Badge
                                    key={skill.id}
                                    variant="secondary"
                                    className="pl-3 pr-1 py-1 flex items-center gap-2 cursor-pointer hover:bg-secondary/80 transition-colors"
                                    onClick={() => openEdit(skill)}
                                >
                                    {skill.name}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(skill.id); }}
                                        className="hover:bg-destructive/20 p-0.5 rounded-full text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsManager;
