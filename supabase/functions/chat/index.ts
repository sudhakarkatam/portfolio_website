import { createClient } from 'npm:@supabase/supabase-js@2';
import { createGoogleGenerativeAI } from 'npm:@ai-sdk/google';
import { createOpenAI } from 'npm:@ai-sdk/openai';
import { streamText } from 'npm:ai';
import { findRelevantChunks } from '@shared/ragUtils.ts';

// CORS Headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase Client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;
const supabaseAdmin = (supabaseUrl && supabaseServiceKey) ? createClient(supabaseUrl, supabaseServiceKey) : null;

// Initialize Google Provider
const google = createGoogleGenerativeAI({
    apiKey: Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_GENERATIVE_AI_API_KEY'),
});

// Initialize OpenRouter Client
const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: Deno.env.get('OPENROUTER_API_KEY'),
    headers: {
        "HTTP-Referer": "https://sudhakarkatam.dev",
        "X-Title": "Sudhakar Portfolio AI Chat",
    },
});

// Helper for System Prompt
const getSystemPrompt = async (context: string) => {
    // CORE IDENTITY - HARDCODED SOURCE OF TRUTH
    const coreIdentity = `
    PORTFOLIO OWNER IDENTITY:
    - Name: Sudhakar Reddy Katam
    - Role: Aspiring Software Engineer | Building with AI & Web
    - Bio: Computer Science graduate passionate about building web and mobile applications. Expert in React, Node.js, and AI integration.
    - Location: Hyderabad, Telangana, India
    `;

    let customInstructions = `
    You are a helpful and friendly AI assistant for Sudhakar Reddy Katam's portfolio website.
    Your PRIMARY role is to represent Sudhakar and answer questions about HIS projects, skills, and experience.

    CRITICAL RULES:
    1. YOU ARE NOT Sudhakar. You are his AI assistant.
    2. NEVER invent or hallucinate a name for yourself or the portfolio owner. The owner is ALWAYS Sudhakar Reddy Katam.
    3. If asked "Who are you?", say "I am Sudhakar's AI portfolio assistant."
    4. If asked "Who is this?", describe Sudhakar based on the identity above.
    `;

    // 1. Fetch custom instructions from Supabase (if available)
    if (supabase) {
        const { data, error } = await supabase
            .from("app_settings")
            .select("value")
            .eq("key", "system_prompt")
            .single();

        if (data && data.value) {
            customInstructions = data.value;
        } else if (error) {
            console.warn("⚠️ Failed to fetch system_prompt from Supabase:", error.message);
        }
    }

    // 2. Combine with RAG context
    let systemPrompt = `
${coreIdentity}

${customInstructions}

Here is the relevant context about the portfolio (from RAG):
${context}

Instructions:
1. Use the provided context to answer the user's question.
2. **CRITICAL**: The "Core Identity" and "Custom Instructions" provided above take PRECEDENCE over the "RAG Context".
3. If the answer is not in the context, politely say you don't have that information. DO NOT MAKE UP FACTS.
4. Be concise and professional.
5. You can use markdown for formatting (bold, lists, code blocks).
6. CRITICAL: ALWAYS include links to projects (GitHub, Live Demo) if they are mentioned in the context.
7. If the user asks about a specific project, focus ONLY on that project. Do not confuse it with others.
    8. **IMAGES**: If the context contains an image URL (e.g., in a project or custom image description), YOU MUST DISPLAY IT using markdown: \`![Alt Text](url)\`.
    9. **MULTIPLE IMAGES**:
       - If there are multiple images for the SAME topic/project, show **UP TO 5 IMAGES** in a grid.
       - If there are MORE than 5 images, show the first 5 and ASK the user if they want to see the rest.
       - If the user asks for "images" and there are multiple relevant topics (e.g., "Show me workshop images" and there are 2 different workshops), **ASK THE USER TO CLARIFY** which one they mean before showing images.
       - Do NOT dump all images at once if they are from different contexts.
    10. If you are discussing a project or event and there is an image for it, SHOW THE IMAGE immediately. Do not ask for permission.
        - **CRITICAL**: Do NOT wrap images in code blocks. Use standard markdown: \`![Alt Text](url)\`.
    11. **NAVIGATION LINKS**:
        - To open the Projects sidebar: \`[View All Projects](#projects)\`
        - To open the Skills sidebar: \`[View Skills](#skills)\`
        - To open the Experience sidebar: \`[View Experience](#experience)\`
        - To open the About section: \`[About Me](#about)\`
        - For specific projects, provide the GitHub or Live Demo links directly as markdown links.
    12. **STYLE & TONE**:
        - **FORMATTING**: Be FLEXIBLE. Do not use the same fixed format every time. Adapt to the content.
        - **SPACING**: Use **DOUBLE LINE BREAKS** between paragraphs and list items.
        - **SKILLS**: When listing skills, use **BULLET POINTS** with relevant **ICONS/EMOJIS** for each category. Do NOT use plain text.
        - **EMOJIS**: Use **up to 15 relevant emojis** to keep it engaging.
        - **LINKS**: If a GitHub or Demo link is missing in the context, **OMIT IT**. DO NOT write "(Placeholder)" or make up a link.
        - **HIGHLIGHT**: If the context mentions a "Current Focus", "Learning Goal", or "Key Achievement", highlight it in a blockquote:
          > 🚀 **Current Focus:** [Goal]
    13. **SUGGESTIONS**:
        - Provide 3 **NEW** follow-up questions.
        - **PRIORITY**: If discussing projects, the suggestions **MUST** be specific project names to explore (e.g., "Tell me about [Project Name]").
        - Keep them short and clickable (max 5-6 words).
`;
    // 3. Add Suggestions Instructions
    systemPrompt += `
\n\nIMPORTANT: You must provide suggestions for follow-up questions.
1. **Text Suggestions**: At the end of your response, provide a list of 3 relevant follow-up questions in a markdown list.
2. **Button Suggestions**: ALSO provide 3 SHORT, specific topics or project names as "suggestions" for the UI buttons.
   - If discussing projects, the buttons MUST be the exact project names (e.g., "Personal Tracker", "Financial App").
   - If discussing skills, the buttons can be "Frontend", "Backend", "AI".
   - Do NOT use generic labels like "View Projects" for buttons if you can use specific names.
   - The button text MUST be the exact input you want the user to send.
`;
    return systemPrompt;
};

// Helper to sanitize messages
const sanitizeMessages = (messages: any[]) => {
    return messages.map((message) => {
        let content = message.content;

        // 1. Handle Array Content (Multimodal) - Flatten to String
        if (Array.isArray(content)) {
            const textPart = content.find(
                (part: any) =>
                    part.type === "text" ||
                    part.type === "input_text" ||
                    part.type === "output_text",
            );

            if (textPart && (textPart.text || textPart.content)) {
                content = textPart.text || textPart.content;
            } else {
                // Join all text parts if multiple exist
                const allText = content
                    .filter((p: any) => p.text || p.content)
                    .map((p: any) => p.text || p.content)
                    .join("\n");

                content = allText || ""; // Default to empty string if no text found
            }
        }

        // 2. Ensure Content is String
        if (typeof content !== "string") {
            content = String(content || "");
        }

        // 3. Remove <think> tags
        if (content.includes("<think>")) {
            content = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
        }

        // 4. Handle Empty Content
        if (!content.trim()) {
            content = "[...thinking...]";
        }

        // 5. Map 'developer' role to 'system'
        let role = message.role;
        if (role === "developer") {
            role = "system";
        }

        // 6. Return clean object with ONLY supported fields
        return {
            role: role as "user" | "assistant" | "system",
            content: content
        };
    });
};

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { messages, model } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const lastMessage = messages[messages.length - 1];
        const userQuery = lastMessage.content;

        // 1. Retrieve relevant chunks (RAG)
        const relevantChunks = await findRelevantChunks(userQuery);
        const context = relevantChunks.map(chunk => chunk.text).join('\n\n');

        // 2. Get System Prompt
        const systemPrompt = await getSystemPrompt(context);

        // 3. Select Model and Generate Response
        if (model && !model.includes('gemini')) {
            // --- OPENROUTER IMPLEMENTATION (Direct Fetch) ---
            // We use direct fetch to bypass SDK validation issues with multimodal content

            // 1. Sanitize messages (Strict String Content)
            const sanitizedMessages = sanitizeMessages(messages)
                .filter((m) => ["user", "assistant", "system"].includes(m.role))
                .map((m) => ({
                    role: m.role as "user" | "assistant" | "system",
                    content: m.content,
                }));

            // 2. Prepend System Prompt
            const finalMessages = [
                { role: "system", content: systemPrompt },
                ...sanitizedMessages
            ];

            console.log(`🚀 Sending request to OpenRouter: ${model}`);

            // 3. Direct API Call
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
                    "HTTP-Referer": "https://sudhakarkatam.dev",
                    "X-Title": "Sudhakar Portfolio AI Chat",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: model,
                    messages: finalMessages,
                    stream: true
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error("OpenRouter API Error:", errText);
                throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText}`);
            }

            // 4. Transform SSE Stream to Data Stream Protocol v1
            const stream = new ReadableStream({
                async start(controller) {
                    const encoder = new TextEncoder();
                    const reader = response.body?.getReader();
                    if (!reader) return;

                    const decoder = new TextDecoder();
                    let buffer = "";
                    let fullText = ""; // For logging

                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            buffer += decoder.decode(value, { stream: true });
                            const lines = buffer.split('\n');
                            buffer = lines.pop() || "";

                            for (const line of lines) {
                                const trimmed = line.trim();
                                if (trimmed === '' || trimmed === 'data: [DONE]') continue;

                                if (trimmed.startsWith('data: ')) {
                                    try {
                                        const data = JSON.parse(trimmed.slice(6));
                                        const content = data.choices?.[0]?.delta?.content;
                                        if (content) {
                                            fullText += content;
                                            // Format: 0:"content"\n (Data Stream Protocol v1)
                                            controller.enqueue(encoder.encode(`0:${JSON.stringify(content)}\n`));
                                        }
                                    } catch (e) {
                                        console.error('Error parsing OpenRouter SSE:', e);
                                    }
                                }
                            }
                        }
                        controller.close();

                        // Log to Supabase after stream finishes
                        if (supabaseAdmin) {
                            try {
                                await supabaseAdmin.from('chat_logs').insert({
                                    user_message: userQuery,
                                    ai_response: fullText,
                                    session_id: 'anonymous',
                                    model: model,
                                });
                            } catch (err) {
                                console.error('Failed to log chat:', err);
                            }
                        }

                    } catch (err) {
                        console.error('Stream processing error:', err);
                        controller.error(err);
                    }
                }
            });

            return new Response(stream, {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'text/plain; charset=utf-8',
                    'X-Vercel-AI-Data-Stream': 'v1'
                }
            });

        } else {
            // --- GEMINI IMPLEMENTATION (SDK) ---
            // Gemini works well with the SDK, so we keep it.

            const selectedModel = google('gemini-2.5-flash');

            // Generate Stream
            const result = await streamText({
                model: selectedModel,
                system: systemPrompt,
                messages: messages, // Gemini SDK handles multimodal content better
            });

            // Manual Stream Construction for Gemini
            const stream = new ReadableStream({
                async start(controller) {
                    const encoder = new TextEncoder();
                    let fullText = "";
                    try {
                        for await (const textPart of result.textStream) {
                            fullText += textPart;
                            controller.enqueue(encoder.encode(`0:${JSON.stringify(textPart)}\n`));
                        }
                        controller.close();

                        // Log to Supabase
                        if (supabaseAdmin) {
                            await supabaseAdmin.from('chat_logs').insert({
                                user_message: userQuery,
                                ai_response: fullText,
                                session_id: 'anonymous',
                                model: 'gemini-2.5-flash',
                            });
                        }
                    } catch (err) {
                        console.error('Stream error:', err);
                        controller.error(err);
                    }
                }
            });

            return new Response(stream, {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'text/plain; charset=utf-8',
                    'X-Vercel-AI-Data-Stream': 'v1'
                }
            });
        }

    } catch (error: any) {
        console.error('Error in Chat API:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
