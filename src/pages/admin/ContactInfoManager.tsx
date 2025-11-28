import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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

interface Contact {
    id: string;
    platform: string;
    value: string;
    icon?: string;
}

const ContactInfoManager = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ platform: "", value: "", icon: "" });

    const fetchContacts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("contact_info")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            toast.error("Failed to fetch contact info");
        } else {
            setContacts(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleSave = async () => {
        if (!formData.platform || !formData.value) {
            toast.error("Platform and Value are required");
            return;
        }

        let error;
        if (editingId) {
            const { error: updateError } = await supabase
                .from("contact_info")
                .update(formData)
                .eq("id", editingId);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("contact_info")
                .insert([formData]);
            error = insertError;
        }

        if (error) {
            toast.error("Failed to save: " + error.message);
        } else {
            toast.success("Saved successfully");
            setIsDialogOpen(false);
            resetForm();
            fetchContacts();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const { error } = await supabase.from("contact_info").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete");
        } else {
            toast.success("Deleted");
            setContacts(contacts.filter(c => c.id !== id));
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ platform: "", value: "", icon: "" });
    };

    const openEdit = (contact: Contact) => {
        setEditingId(contact.id);
        setFormData({
            platform: contact.platform,
            value: contact.value,
            icon: contact.icon || "",
        });
        setIsDialogOpen(true);
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Contact Information</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" /> Add Contact
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Contact" : "Add Contact"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label>Platform / Label</label>
                                <Input
                                    value={formData.platform}
                                    onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                    placeholder="e.g. Email, LinkedIn"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label>Value / URL</label>
                                <Input
                                    value={formData.value}
                                    onChange={e => setFormData({ ...formData, value: e.target.value })}
                                    placeholder="e.g. user@example.com"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label>Icon Name (Lucide React) - Optional</label>
                                <Input
                                    value={formData.icon}
                                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                    placeholder="e.g. Mail, Linkedin"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {contacts.map((contact) => (
                    <Card key={contact.id}>
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{contact.platform}</h3>
                                <p className="text-sm text-muted-foreground truncate max-w-[200px]">{contact.value}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => openEdit(contact)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(contact.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ContactInfoManager;
