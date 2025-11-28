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
import { Mail, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Message {
    id: string;
    created_at: string;
    name: string;
    email: string;
    message: string;
    read: boolean;
}

const MessagesManager = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("contact_messages")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch messages");
        } else {
            setMessages(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const toggleRead = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from("contact_messages")
            .update({ read: !currentStatus })
            .eq("id", id);

        if (error) {
            toast.error("Failed to update status");
        } else {
            setMessages(messages.map(m => m.id === id ? { ...m, read: !currentStatus } : m));
            toast.success(currentStatus ? "Marked as unread" : "Marked as read");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Inbox</h1>
                <Button onClick={fetchMessages} variant="outline">
                    Refresh
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No messages found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            messages.map((msg) => (
                                <TableRow key={msg.id} className={!msg.read ? "bg-muted/30 font-medium" : ""}>
                                    <TableCell>
                                        {msg.read ? (
                                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Read</Badge>
                                        ) : (
                                            <Badge variant="default" className="bg-blue-500">New</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {new Date(msg.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{msg.name}</span>
                                            <span className="text-xs text-muted-foreground">{msg.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-md truncate" title={msg.message}>
                                        {msg.message}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleRead(msg.id, msg.read)}
                                            title={msg.read ? "Mark as unread" : "Mark as read"}
                                        >
                                            {msg.read ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default MessagesManager;
