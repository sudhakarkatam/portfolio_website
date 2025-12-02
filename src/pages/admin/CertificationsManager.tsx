import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Trash2, Plus, Pencil } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

interface Certification {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url: string;
    description: string;
    created_at: string;
}

const CertificationsManager = () => {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        issuer: "",
        date: "",
        url: "",
        description: "",
    });

    const fetchCertifications = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("certifications")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch certifications");
        } else {
            setCertifications(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCertifications();
    }, []);

    const handleSave = async () => {
        const dataToSave = {
            name: formData.name,
            issuer: formData.issuer,
            date: formData.date,
            url: formData.url,
            description: formData.description,
        };

        let error;
        if (editingId) {
            const { error: updateError } = await supabase
                .from("certifications")
                .update(dataToSave)
                .eq("id", editingId);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("certifications")
                .insert([dataToSave]);
            error = insertError;
        }

        if (error) {
            toast.error("Failed to save certification: " + error.message);
        } else {
            toast.success("Certification saved");
            setIsDialogOpen(false);
            resetForm();
            fetchCertifications();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const { error } = await supabase.from("certifications").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete");
        } else {
            toast.success("Deleted successfully");
            setCertifications(certifications.filter(c => c.id !== id));
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: "",
            issuer: "",
            date: "",
            url: "",
            description: "",
        });
    };

    const openEdit = (cert: Certification) => {
        setEditingId(cert.id);
        setFormData({
            name: cert.name,
            issuer: cert.issuer,
            date: cert.date,
            url: cert.url,
            description: cert.description,
        });
        setIsDialogOpen(true);
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Certifications</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" /> Add Certification
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Certification" : "Add Certification"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label>Name</label>
                                    <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="AWS Certified Solutions Architect" />
                                </div>
                                <div className="grid gap-2">
                                    <label>Issuer</label>
                                    <Input value={formData.issuer} onChange={e => setFormData({ ...formData, issuer: e.target.value })} placeholder="Amazon Web Services" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label>Date</label>
                                <Input value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} placeholder="July 2023" />
                            </div>
                            <div className="grid gap-2">
                                <label>Certificate URL</label>
                                <Input value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} placeholder="https://..." />
                            </div>
                            <div className="grid gap-2">
                                <label>Description</label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="min-h-[100px]" />
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
                {certifications.map((cert) => (
                    <Card key={cert.id}>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">{cert.name}</h3>
                                    <p className="text-lg text-primary">{cert.issuer}</p>
                                    <p className="text-sm text-muted-foreground mb-2">{cert.date}</p>
                                    <p className="whitespace-pre-wrap mb-4">{cert.description}</p>
                                    {cert.url && (
                                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                                            View Certificate
                                        </a>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => openEdit(cert)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(cert.id)}>
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

export default CertificationsManager;
