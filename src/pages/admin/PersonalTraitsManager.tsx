import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Trash2, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface Trait {
    id: string;
    type: 'strength' | 'weakness' | 'hobby';
    value: string;
}

const PersonalTraitsManager = () => {
    const [traits, setTraits] = useState<Trait[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTrait, setNewTrait] = useState({ strength: "", weakness: "", hobby: "" });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTrait, setEditingTrait] = useState<Trait | null>(null);
    const [editValue, setEditValue] = useState("");

    const fetchTraits = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("personal_traits")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            toast.error("Failed to fetch traits");
        } else {
            setTraits(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTraits();
    }, []);

    const handleAdd = async (type: 'strength' | 'weakness' | 'hobby') => {
        const value = newTrait[type];
        if (!value) return;

        const { error } = await supabase.from("personal_traits").insert([{ type, value }]);

        if (error) {
            toast.error("Failed to add trait");
        } else {
            toast.success("Added successfully");
            setNewTrait({ ...newTrait, [type]: "" });
            fetchTraits();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this trait?")) return;

        const { error } = await supabase.from("personal_traits").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete");
        } else {
            setTraits(traits.filter(t => t.id !== id));
            toast.success("Deleted");
        }
    };

    const openEdit = (trait: Trait) => {
        setEditingTrait(trait);
        setEditValue(trait.value);
        setIsDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingTrait || !editValue) return;

        const { error } = await supabase
            .from("personal_traits")
            .update({ value: editValue })
            .eq("id", editingTrait.id);

        if (error) {
            toast.error("Failed to update trait");
        } else {
            toast.success("Updated successfully");
            setIsDialogOpen(false);
            setEditingTrait(null);
            fetchTraits();
        }
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    const strengths = traits.filter(t => t.type === 'strength');
    const weaknesses = traits.filter(t => t.type === 'weakness');
    const hobbies = traits.filter(t => t.type === 'hobby');

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold">Personal Traits</h1>

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Trait</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder="Trait value..."
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Strengths */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-500">Strengths</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                value={newTrait.strength}
                                onChange={e => setNewTrait({ ...newTrait, strength: e.target.value })}
                                placeholder="Add strength..."
                                onKeyDown={e => e.key === 'Enter' && handleAdd('strength')}
                            />
                            <Button size="icon" onClick={() => handleAdd('strength')}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {strengths.map(t => (
                                <Badge
                                    key={t.id}
                                    variant="outline"
                                    className="pl-3 pr-1 py-1 flex items-center gap-2 border-green-500/50 bg-green-500/10 cursor-pointer hover:bg-green-500/20 transition-colors"
                                    onClick={() => openEdit(t)}
                                >
                                    {t.value}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                                        className="hover:text-destructive p-1 rounded-full hover:bg-background/50"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-500">Weaknesses</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                value={newTrait.weakness}
                                onChange={e => setNewTrait({ ...newTrait, weakness: e.target.value })}
                                placeholder="Add weakness..."
                                onKeyDown={e => e.key === 'Enter' && handleAdd('weakness')}
                            />
                            <Button size="icon" onClick={() => handleAdd('weakness')}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {weaknesses.map(t => (
                                <Badge
                                    key={t.id}
                                    variant="outline"
                                    className="pl-3 pr-1 py-1 flex items-center gap-2 border-red-500/50 bg-red-500/10 cursor-pointer hover:bg-red-500/20 transition-colors"
                                    onClick={() => openEdit(t)}
                                >
                                    {t.value}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                                        className="hover:text-destructive p-1 rounded-full hover:bg-background/50"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Hobbies */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-blue-500">Hobbies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                value={newTrait.hobby}
                                onChange={e => setNewTrait({ ...newTrait, hobby: e.target.value })}
                                placeholder="Add hobby..."
                                onKeyDown={e => e.key === 'Enter' && handleAdd('hobby')}
                            />
                            <Button size="icon" onClick={() => handleAdd('hobby')}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {hobbies.map(t => (
                                <Badge
                                    key={t.id}
                                    variant="outline"
                                    className="pl-3 pr-1 py-1 flex items-center gap-2 border-blue-500/50 bg-blue-500/10 cursor-pointer hover:bg-blue-500/20 transition-colors"
                                    onClick={() => openEdit(t)}
                                >
                                    {t.value}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                                        className="hover:text-destructive p-1 rounded-full hover:bg-background/50"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PersonalTraitsManager;
