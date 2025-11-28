import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Trash2, Upload, Image as ImageIcon } from "lucide-react";

interface CustomImage {
    id: string;
    url: string;
    description: string;
    tags: string[];
    created_at: string;
}

const CustomImagesManager = () => {
    const [images, setImages] = useState<CustomImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const { data, error } = await supabase
                .from("custom_images")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setImages(data || []);
        } catch (error: any) {
            toast.error("Error fetching images: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        if (!selectedFile && !editingId) {
            toast.error("Please select an image");
            return;
        }

        setUploading(true);
        try {
            let publicUrl = "";

            // 1. Upload to Storage (only if new file selected)
            if (selectedFile) {
                const fileExt = selectedFile.name.split(".").pop();
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `custom/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("portfolio-images")
                    .upload(filePath, selectedFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from("portfolio-images")
                    .getPublicUrl(filePath);
                publicUrl = data.publicUrl;
            }

            // 2. Insert or Update Table
            if (editingId) {
                const updateData: any = { description };
                if (publicUrl) updateData.url = publicUrl;

                const { error: dbError } = await supabase
                    .from("custom_images")
                    .update(updateData)
                    .eq("id", editingId);

                if (dbError) throw dbError;
                toast.success("Image updated successfully!");
            } else {
                const { error: dbError } = await supabase
                    .from("custom_images")
                    .insert({
                        url: publicUrl,
                        description: description,
                        tags: []
                    });

                if (dbError) throw dbError;
                toast.success("Image uploaded successfully!");
            }

            setSelectedFile(null);
            setDescription("");
            setEditingId(null);
            fetchImages();
        } catch (error: any) {
            console.error(error);
            toast.error("Operation failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setDescription("");
        setSelectedFile(null);
    };

    const openEdit = (img: CustomImage) => {
        setEditingId(img.id);
        setDescription(img.description);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string, url: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        try {
            // 1. Delete from Table
            const { error: dbError } = await supabase
                .from("custom_images")
                .delete()
                .eq("id", id);

            if (dbError) throw dbError;

            // 2. Delete from Storage (Optional, but good practice)
            const path = url.split("/portfolio-images/")[1];
            if (path) {
                const { error: storageError } = await supabase.storage
                    .from("portfolio-images")
                    .remove([path]);
                if (storageError) console.warn("Failed to delete file from storage", storageError);
            }

            toast.success("Image deleted");
            setImages(images.filter(img => img.id !== id));
        } catch (error: any) {
            toast.error("Delete failed: " + error.message);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Custom Images Gallery</h1>
            </div>

            {/* Upload/Edit Section */}
            <Card className={editingId ? "border-accent" : ""}>
                <CardHeader>
                    <CardTitle>{editingId ? "Edit Image Details" : "Upload New Image"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {editingId && !selectedFile && (
                                <p className="text-xs text-muted-foreground">Leave empty to keep existing image</p>
                            )}
                            <Textarea
                                placeholder="Describe this image (e.g., 'Hackathon team photo at TechCrunch 2024'). The AI will use this description to find the image."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={handleSave}
                                disabled={uploading || (!selectedFile && !editingId)}
                                className="h-auto py-2"
                            >
                                {uploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />}
                                {editingId ? "Update" : "Upload"}
                            </Button>
                            {editingId && (
                                <Button variant="outline" onClick={handleCancelEdit}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img) => (
                    <Card key={img.id} className={`overflow-hidden ${editingId === img.id ? 'ring-2 ring-accent' : ''}`}>
                        <div className="aspect-video relative bg-muted group">
                            <img
                                src={img.url}
                                alt={img.description}
                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                            />
                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button variant="secondary" size="sm" onClick={() => openEdit(img)}>
                                    <Loader2 className="h-4 w-4 mr-1" /> Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(img.id, img.url)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <CardContent className="p-4 space-y-2">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {img.description || "No description"}
                            </p>
                        </CardContent>
                    </Card>
                ))}
                {images.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No custom images yet. Upload one above!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomImagesManager;
