import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Book, X, Plus, Save, Trash2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
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
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

// Zod Schema for Validation
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    message: z
        .string()
        .min(5, "Message must be at least 5 characters")
        .max(200, "Message must be less than 200 characters"),
});

interface Note {
    id: string;
    name: string;
    message: string;
    color: string;
    rotation: number;
    date: string;
}

const STICKY_COLORS = [
    "bg-yellow-200 dark:bg-yellow-900/80",
    "bg-pink-200 dark:bg-pink-900/80",
    "bg-blue-200 dark:bg-blue-900/80",
    "bg-green-200 dark:bg-green-900/80",
    "bg-purple-200 dark:bg-purple-900/80",
    "bg-orange-200 dark:bg-orange-900/80",
];

export const Guestbook = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingValues, setPendingValues] = useState<z.infer<typeof formSchema> | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            message: "",
        },
    });

    // Load notes from Supabase on mount
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedColor, setSelectedColor] = useState(STICKY_COLORS[0]);
    const NOTES_PER_PAGE = 9;

    useEffect(() => {
        fetchNotes(0, true);

        // Realtime subscription
        const channel = supabase
            .channel('guestbook_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook' }, (payload) => {
                // Refresh to get correct order and count
                fetchNotes(page, true);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [page]); // Re-fetch when page changes

    const fetchNotes = async (pageIndex: number, isRefresh = false) => {
        const from = pageIndex * NOTES_PER_PAGE;
        const to = from + NOTES_PER_PAGE - 1;

        const { data, error, count } = await supabase
            .from('guestbook')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error('Error fetching notes:', error);
            toast.error("Failed to load notes");
        } else if (data) {
            const formattedNotes = data.map((note: any) => ({
                id: note.id,
                name: note.name,
                message: note.message,
                color: note.color,
                rotation: note.rotation,
                date: new Date(note.created_at).toLocaleDateString()
            }));

            setNotes(formattedNotes);
            if (count) {
                setTotalPages(Math.ceil(count / NOTES_PER_PAGE));
            }
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setPendingValues(values);
        setShowConfirm(true);
    };

    const handleConfirmPost = async () => {
        if (!pendingValues) return;

        const rotation = Math.random() * 6 - 3;

        const { error } = await supabase
            .from('guestbook')
            .insert([
                {
                    name: pendingValues.name,
                    message: pendingValues.message,
                    color: selectedColor,
                    rotation,
                }
            ]);

        if (error) {
            toast.error("Failed to post note: " + error.message);
            return;
        }

        form.reset();
        setShowConfirm(false);
        setPendingValues(null);
        // Reset color to random or keep selected? Let's keep selected for now or reset to first.
        setSelectedColor(STICKY_COLORS[0]);
        toast.success("Note posted successfully!");
    };

    const handleDeleteNote = async (id: string) => {
        // Optional: Implement delete if you want users to delete their own notes (requires Auth)
        // For now, just local removal or admin only
        toast.error("Deletion is restricted to admins.");
    };

    const [isWriting, setIsWriting] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
        setIsWriting(false); // Always start with the board view
    };

    return (
        <>
            {/* Mobile Trigger Button - Top Right (Left of Eye/Theme) */}
            <button
                onClick={handleOpen}
                className="md:hidden fixed top-3 right-28 z-50 h-10 w-10 flex items-center justify-center bg-background/80 backdrop-blur-sm border border-border rounded-md shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Sign the Wall"
            >
                <Book className="h-5 w-5" />
            </button>

            {/* Desktop Trigger Button - Floating Bottom Right */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleOpen}
                className="hidden md:flex fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow items-center gap-2"
                title="Sign the Wall"
            >
                <Book className="h-6 w-6" />
                <span className="font-semibold">Sign the Wall</span>
            </motion.button>

            {/* Fullscreen Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8"
                    >
                        {/* The "Board" Container */}
                        <motion.div
                            initial={{ scale: 0.8, rotateX: 10, opacity: 0 }}
                            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
                            exit={{ scale: 0.8, rotateX: -10, opacity: 0 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="relative w-full max-w-6xl h-full md:h-[85vh] bg-[#f0e6d2] dark:bg-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row border-8 border-[#8b5a2b] dark:border-[#4a3b2a]"
                            style={{
                                backgroundImage: "url('https://www.transparenttextures.com/patterns/cork-board.png')",
                            }}
                        >
                            {/* Close Button - Enhanced Visibility */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 z-50 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors shadow-md border-2 border-white/20"
                                title="Close Guestbook"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            {/* Mobile: "Add Note" Toggle Button (Visible only on Board view) */}
                            <div className="md:hidden absolute bottom-6 right-6 z-40">
                                {!isWriting && (
                                    <Button
                                        onClick={() => setIsWriting(true)}
                                        className="rounded-full h-14 w-14 shadow-lg bg-primary text-primary-foreground"
                                    >
                                        <Plus className="h-6 w-6" />
                                    </Button>
                                )}
                            </div>

                            {/* Left Side: Form (The "Writing Pad") */}
                            <div className={`
                                w-full md:w-1/3 p-6 bg-background/95 backdrop-blur border-r border-border/50 flex flex-col shadow-xl z-10 overflow-y-auto 
                                ${isWriting ? 'flex h-full absolute inset-0 md:relative md:h-auto' : 'hidden md:flex'}
                            `}>
                                {/* Mobile Back Button */}
                                <div className="md:hidden mb-4">
                                    <Button variant="ghost" onClick={() => setIsWriting(false)} className="gap-2">
                                        <X className="h-4 w-4" /> Cancel
                                    </Button>
                                </div>

                                <div className="mb-6 text-center">
                                    <h2 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
                                        <Plus className="h-6 w-6" /> Add a Note
                                    </h2>
                                    <p className="text-muted-foreground text-sm">
                                        Leave a thought, review, or just say hi!
                                    </p>
                                </div>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Your Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="John Doe" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Message</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Textarea
                                                                placeholder="Write your thoughts here..."
                                                                className="min-h-[100px] md:min-h-[120px] resize-none pb-6"
                                                                {...field}
                                                                onChange={(e) => {
                                                                    const words = e.target.value.trim().split(/\s+/);
                                                                    if (words.length <= 35 || e.target.value.length < field.value.length) {
                                                                        field.onChange(e);
                                                                    }
                                                                }}
                                                            />
                                                            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground pointer-events-none">
                                                                {field.value?.trim().split(/\s+/).filter(Boolean).length || 0}/35 words
                                                            </div>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Color Picker */}
                                        <div className="space-y-2">
                                            <FormLabel>Pick a Color</FormLabel>
                                            <div className="flex gap-2 flex-wrap">
                                                {STICKY_COLORS.map((color) => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        onClick={() => setSelectedColor(color)}
                                                        className={`w-8 h-8 rounded-full border-2 transition-all ${color} ${selectedColor === color
                                                            ? "border-primary scale-110 shadow-md"
                                                            : "border-transparent hover:scale-105"
                                                            }`}
                                                        aria-label="Select color"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full mt-4 gap-2">
                                            <Save className="h-4 w-4" /> Post Note
                                        </Button>
                                    </form>
                                </Form>


                                <div className="mt-6 p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                                    <p>
                                        <strong>Note:</strong> Thanks for stopping by! Feel free to leave a mark. ✨
                                    </p>
                                </div>
                            </div>

                            {/* Right Side: The Board (Sticky Notes Grid) */}
                            <div className="flex-1 p-6 overflow-y-auto bg-transparent relative flex flex-col justify-between">
                                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 pb-4 space-y-6">
                                    <AnimatePresence mode="wait">
                                        {notes.map((note) => (
                                            <motion.div
                                                key={note.id}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="break-inside-avoid mb-6"
                                            >
                                                <motion.div
                                                    animate={{ rotate: note.rotation }}
                                                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                                                    className={`relative p-5 shadow-lg ${note.color} text-foreground rounded-sm min-h-[100px] flex flex-col`}
                                                    style={{
                                                        boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                                                    }}
                                                >
                                                    {/* Pin Effect */}
                                                    <div className="absolute -top-3 left-[calc(50%-0.5rem)] w-4 h-4 rounded-full bg-red-500 shadow-sm border border-red-700 z-20"></div>

                                                    <div className="flex-1 font-handwriting text-lg leading-relaxed relative">
                                                        <Quote className="h-4 w-4 absolute -top-1 -left-1 opacity-20" />
                                                        <p className="break-words font-medium">{note.message}</p>
                                                    </div>

                                                    <div className="mt-4 pt-3 border-t border-black/10 flex justify-between items-center text-xs font-semibold opacity-70">
                                                        <span>- {note.name}</span>
                                                        <span>{note.date}</span>
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-4 pb-20 md:pb-4">
                                        <button
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 0}
                                            className="p-2 rounded-full hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            &lt;
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handlePageChange(i)}
                                                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${page === i
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-black/10"
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page === totalPages - 1}
                                            className="p-2 rounded-full hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                )}

                                {notes.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                                        <p className="text-4xl font-bold text-primary/50 rotate-[-10deg]">
                                            Empty Board...
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div >
                    </motion.div >
                )}
            </AnimatePresence >

            {/* Confirmation Dialog */}
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Post this note?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to add this note to the board?
                            <div className="mt-4 p-3 bg-muted rounded-md text-sm italic border-l-4 border-primary">
                                "{pendingValues?.message}"
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            handleConfirmPost();
                            setIsWriting(false); // Close form on success
                        }}>Yes, Post It</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
