import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Activity } from "lucide-react";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalNotes: 0,
        recentNotes: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            const { count: totalNotes } = await supabase
                .from("guestbook")
                .select("*", { count: "exact", head: true });

            // Get notes from last 24 hours
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const { count: recentNotes } = await supabase
                .from("guestbook")
                .select("*", { count: "exact", head: true })
                .gt("created_at", yesterday.toISOString());

            setStats({
                totalNotes: totalNotes || 0,
                recentNotes: recentNotes || 0,
            });
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalNotes}</div>
                        <p className="text-xs text-muted-foreground">
                            All time guestbook entries
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Notes (24h)</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.recentNotes}</div>
                        <p className="text-xs text-muted-foreground">
                            Since yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Admin Status</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">Active</div>
                        <p className="text-xs text-muted-foreground">
                            You are logged in
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
