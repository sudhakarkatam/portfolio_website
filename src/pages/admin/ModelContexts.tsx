import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Loader2, RefreshCw, Bot } from "lucide-react";

const ModelContexts = () => {
    const [selectedModel, setSelectedModel] = useState("gemini");
    const [modelContext, setModelContext] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchModelContext();
    }, [selectedModel]);

    const fetchModelContext = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('model_contexts')
                .select('content')
                .eq('provider', selectedModel)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    setModelContext("");
                } else {
                    throw error;
                }
            } else if (data) {
                setModelContext(data.content || "");
            }
        } catch (error: any) {
            toast.error(`Failed to fetch ${selectedModel} context: ` + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveModel = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('model_contexts')
                .upsert({
                    provider: selectedModel,
                    content: modelContext,
                    created_at: new Date().toISOString()
                }, { onConflict: 'provider' });

            if (error) throw error;
            toast.success(`${selectedModel.toUpperCase()} context updated successfully`);
        } catch (error: any) {
            toast.error("Failed to save model context: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Model Contexts</h1>
                <Button variant="outline" onClick={fetchModelContext} disabled={isLoading || isSaving}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Model Specific Instructions</CardTitle>
                    <CardDescription>
                        Add specific rules for different AI models. These instructions are appended to the Global Context.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex space-x-2 mb-4">
                        <Button
                            variant={selectedModel === "gemini" ? "secondary" : "outline"}
                            onClick={() => setSelectedModel("gemini")}
                        >
                            <Bot className="mr-2 h-4 w-4" />
                            Google Gemini
                        </Button>
                        <Button
                            variant={selectedModel === "openrouter" ? "secondary" : "outline"}
                            onClick={() => setSelectedModel("openrouter")}
                        >
                            <Bot className="mr-2 h-4 w-4" />
                            OpenRouter (DeepSeek/Llama)
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Textarea
                            value={modelContext}
                            onChange={(e) => setModelContext(e.target.value)}
                            className="min-h-[400px] font-mono text-sm"
                            placeholder={`Enter specific instructions for ${selectedModel}...`}
                        />
                    )}
                    <div className="flex justify-end">
                        <Button onClick={handleSaveModel} disabled={isSaving || isLoading}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save {selectedModel.toUpperCase()} Context
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ModelContexts;
