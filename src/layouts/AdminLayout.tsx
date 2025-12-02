import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, MessageSquare, LogOut, Menu, FolderGit2, Wrench, Mail, Bot, RefreshCw, Image as ImageIcon, Briefcase, User, Phone, Award } from "lucide-react";
import { toast } from "sonner";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/login");
            }
        };
        checkAuth();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
        { icon: MessageSquare, label: "Guestbook", path: "/admin/guestbook" },
        { icon: FolderGit2, label: "Projects", path: "/admin/projects" },
        { icon: Briefcase, label: "Experience", path: "/admin/experience" },
        { icon: Wrench, label: "Skills", path: "/admin/skills" },
        { icon: User, label: "Traits", path: "/admin/traits" },
        { icon: Phone, label: "Contact", path: "/admin/contact" },
        { icon: Mail, label: "Messages", path: "/admin/messages" },
        { icon: MessageSquare, label: "Chat Logs", path: "/admin/chat-logs" },
        { icon: ImageIcon, label: "Custom Images", path: "/admin/custom-images" },
        { icon: Bot, label: "Model Contexts", path: "/admin/model-contexts" },
        { icon: Award, label: "Certifications", path: "/admin/certifications" },
        { icon: Wrench, label: "Settings", path: "/admin/settings" },
    ];

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-64" : "w-20"
                    } bg-card border-r border-border transition-all duration-300 flex flex-col fixed h-full z-20`}
            >
                <div className="p-4 border-b border-border flex items-center justify-between">
                    {isSidebarOpen && <span className="font-bold text-xl">Admin</span>}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Button
                            key={item.path}
                            variant={location.pathname === item.path ? "secondary" : "ghost"}
                            className={`w-full justify-start ${!isSidebarOpen && "justify-center px-2"}`}
                            onClick={() => navigate(item.path)}
                        >
                            <item.icon className={`h-5 w-5 ${isSidebarOpen && "mr-2"}`} />
                            {isSidebarOpen && <span>{item.label}</span>}
                        </Button>
                    ))}
                </nav>

                <div className="p-4 border-t border-border space-y-2">
                    <Button
                        variant="ghost"
                        className={`w-full justify-start text-primary hover:text-primary hover:bg-primary/10 ${!isSidebarOpen && "justify-center px-2"}`}
                        onClick={async () => {
                            const toastId = toast.loading("Refreshing AI Memory...");
                            try {
                                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                                const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

                                // Use Edge Function URL in production, or local if needed (but we are migrating to Edge)
                                const response = await fetch(`${supabaseUrl}/functions/v1/refresh-embeddings`, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `Bearer ${supabaseAnonKey}`,
                                        'Content-Type': 'application/json'
                                    }
                                });

                                if (response.ok) {
                                    toast.success("AI Memory Refreshed!", { id: toastId });
                                } else {
                                    const errorData = await response.json();
                                    throw new Error(errorData.error || 'Failed to refresh');
                                }
                            } catch (e: any) {
                                console.error(e);
                                toast.error(`Failed to refresh memory: ${e.message}`, { id: toastId });
                            }
                        }}
                    >
                        <RefreshCw className={`h-5 w-5 ${isSidebarOpen && "mr-2"}`} />
                        {isSidebarOpen && <span>Refresh Memory</span>}
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 ${!isSidebarOpen && "justify-center px-2"}`}
                        onClick={handleLogout}
                    >
                        <LogOut className={`h-5 w-5 ${isSidebarOpen && "mr-2"}`} />
                        {isSidebarOpen && <span>Logout</span>}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"
                    } p-8`}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
