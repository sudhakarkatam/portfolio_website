import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChatLog {
    id: string;
    user_message: string;
    ai_response: string;
    session_id: string;
    created_at: string;
}

const ChatLogs = () => {
    const [logs, setLogs] = useState<ChatLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("chat_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50); // Limit to last 50 for performance

        if (error) {
            toast.error("Failed to fetch logs");
        } else {
            setLogs(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Visitor Analytics (Chat Logs)</h1>
                <Button variant="outline" onClick={fetchLogs}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[180px]">Time</TableHead>
                                <TableHead>User Query</TableHead>
                                <TableHead>AI Response</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(log.created_at).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="font-medium">{log.user_message}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm max-w-md truncate" title={log.ai_response}>
                                        {log.ai_response}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {logs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                        No chat logs found yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChatLogs;
