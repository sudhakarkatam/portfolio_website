import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createClient } from '@supabase/supabase-js';
import { findRelevantChunks } from '../src/utils/ragUtils';

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;
const supabaseAdmin = (supabaseUrl && supabaseServiceKey) ? createClient(supabaseUrl, supabaseServiceKey) : null;

// Initialize OpenRouter Client
const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

// Helper for System Prompt
const getSystemPrompt = async (context: string) => {
    // CORE IDENTITY - HARDCODED SOURCE OF TRUTH
    // This ensures the AI NEVER hallucinates the owner's identity, even if RAG fails.
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
            console.warn(
                "⚠️ Failed to fetch system_prompt from Supabase:",
                error.message,
            );
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

export default async function handler(req: any, res: any) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust in production if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { messages, model } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        const lastMessage = messages[messages.length - 1];
        const userQuery = lastMessage.content;

        // 1. Retrieve relevant chunks (RAG)
        const relevantChunks = await findRelevantChunks(userQuery);
        const context = relevantChunks.map(chunk => chunk.text).join('\n\n');

        // 2. Get System Prompt
        const systemPrompt = await getSystemPrompt(context);

        // 3. Select Model Provider
        let selectedModel;
        if (model && !model.includes('gemini')) {
            // Assume OpenRouter for non-Gemini models
            selectedModel = openrouter(model);
        } else {
            // Default to Gemini
            selectedModel = google('gemini-2.5-flash');
        }

        // 4. Generate Stream
        const result = await streamText({
            model: selectedModel,
            system: systemPrompt,
            messages: messages,
            onFinish: async ({ text }) => {
                // Log to Supabase
                if (supabaseAdmin) {
                    try {
                        await supabaseAdmin.from('chat_logs').insert({
                            user_message: userQuery,
                            ai_response: text,
                            session_id: 'anonymous' // Could be passed from frontend if needed
                        });
                    } catch (err) {
                        console.error('Failed to log chat:', err);
                    }
                }
            }
        });

        // 4. Pipe Stream to Response
        (result as any).pipeDataStreamToResponse(res);

    } catch (error: any) {
        console.error('Error in Gemini API:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
