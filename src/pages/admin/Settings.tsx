import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Loader2, RefreshCw } from "lucide-react";

const Settings = () => {
    const [systemPrompt, setSystemPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'system_prompt')
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // Not found, set empty or default
                    setSystemPrompt("");
                } else {
                    throw error;
                }
            } else if (data) {
                setSystemPrompt(data.value);
            }
        } catch (error: any) {
            toast.error("Failed to fetch settings: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('app_settings')
                .upsert({
                    key: 'system_prompt',
                    value: systemPrompt,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            toast.success("System prompt updated successfully");
        } catch (error: any) {
            toast.error("Failed to save settings: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Settings</h1>
                <Button variant="outline" onClick={fetchSettings} disabled={isLoading || isSaving}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>AI System Prompt (Context)</CardTitle>
                    <CardDescription>
                        This is the "Brain" of your AI. It defines the persona, knowledge, and instructions.
                        Changes here take effect immediately for new chat sessions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Textarea
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            className="min-h-[500px] font-mono text-sm"
                            placeholder="Enter the system prompt here..."
                        />
                    )}
                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={isSaving || isLoading}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;
