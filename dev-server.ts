import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "@ai-sdk/google";
import { streamText, tool, generateText } from "ai";
import { z } from "zod";
import { findRelevantChunks } from "./src/utils/ragUtils";
import { createOpenAI } from "@ai-sdk/openai";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config();
process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize OpenRouter
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "Sudhakar Portfolio AI Chat",
  },
});

const app = express();
const PORT = 3001;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Supabase Client
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log("✅ Supabase client initialized");
} else {
  console.warn(
    "⚠️ Supabase keys not found in environment variables. Supabase features will be disabled.",
  );
}

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

// Helper to sanitize messages for providers that strictly expect strings
// and to clean up reasoning traces (think tags) from previous turns.
const sanitizeMessages = (messages: any[]) => {
  console.log(`🧹 Sanitizing ${messages.length} messages...`);

  const sanitized = messages.map((message, index) => {
    let content = message.content;

    // 1. Handle Array Content (Multimodal)
    // 1. Handle Array Content (Multimodal)
    if (Array.isArray(content)) {
      // Look for text parts with various type names used by different SDK versions/providers
      const textPart = content.find(
        (part: any) =>
          part.type === "text" ||
          part.type === "input_text" ||
          part.type === "output_text",
      );

      if (textPart && (textPart.text || textPart.content)) {
        content = textPart.text || textPart.content;
      } else {
        // If it's an array but we can't find text, try to join all text fields or fallback
        const allText = content
          .filter((p: any) => p.text || p.content)
          .map((p: any) => p.text || p.content)
          .join("\n");

        content = allText || "[Content not supported by this model]";
      }
    }

    // 2. Ensure Content is String
    if (typeof content !== "string") {
      content = String(content || "");
    }

    // 3. Remove <think> tags (DeepSeek R1 reasoning traces)
    if (content.includes("<think>")) {
      // console.log(`🧠 Removing <think> tags from message ${index} (${message.role})`);
      content = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
    }

    // 4. Handle Empty Content (Prevent invalid history)
    if (!content.trim()) {
      console.warn(
        `⚠️ Message ${index} (${message.role}) became empty after sanitization. Using placeholder.`,
      );
      content = "[...thinking...]"; // Placeholder to preserve turn structure
    }

    // 5. Map 'developer' role to 'system' (Fix for OpenRouter/Chutes error)
    let role = message.role;
    if (role === "developer") {
      role = "system";
    }

    return { ...message, content, role };
  });

  // Log the roles sequence to debug history issues
  console.log(
    "📝 Sanitized History Roles:",
    sanitized.map((m) => m.role).join(" -> "),
  );

  return sanitized;
};

// Gemini AI Endpoint (Streaming + RAG)
app.post("/api/gemini", async (req, res) => {
  try {
    console.log("🤖 Processing Gemini AI request (Streaming)...");

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content;

    console.log(`🔍 Processing RAG for query: "${userQuery}"`);

    // 1. Retrieve relevant chunks (RAG)
    const relevantChunks = await findRelevantChunks(userQuery);
    const context = relevantChunks.map((chunk) => chunk.text).join("\n\n");

    console.log(`✅ Retrieved ${relevantChunks.length} chunks`);

    // 2. Get System Prompt (await it!)
    const systemPrompt = await getSystemPrompt(context);

    // 3. Generate Stream
    const result = await streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: messages,
      // @ts-expect-error - maxSteps is experimental but works
      maxSteps: 2,
    });

    console.log("Stream result keys:", Object.keys(result));

    // Manual stream handling for Node.js response
    try {
      const response = result.toTextStreamResponse();

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("X-Vercel-AI-Data-Stream", "v1");

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          if (text) {
            res.write(`0:${JSON.stringify(text)}\n`);
          }
        }
      }
      res.end();
    } catch (streamError) {
      console.error("Error piping stream:", streamError);
      res.status(500).json({ error: "Stream processing failed" });
    }
  } catch (error: any) {
    console.error("Error in Gemini API:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// OpenRouter AI Endpoint (Streaming + RAG)
app.post("/api/openrouter", async (req, res) => {
  try {
    console.log("🤖 Processing OpenRouter AI request (Streaming)...");

    const { messages, model } = req.body;
    console.log("🔍 Received model:", model);
    console.log("🔍 Model type:", typeof model);

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content;

    console.log(`🔍 Processing RAG for query: "${userQuery}"`);

    // 1. Retrieve relevant chunks (RAG)
    const relevantChunks = await findRelevantChunks(userQuery);
    const context = relevantChunks.map((chunk) => chunk.text).join("\n\n");

    console.log(`✅ Retrieved ${relevantChunks.length} chunks`);

    // 2. Get System Prompt
    const systemPrompt = await getSystemPrompt(context);

    // 3. Sanitize messages for OpenRouter
    const sanitizedMessages = sanitizeMessages(messages)
      .filter((m) => ["user", "assistant", "system"].includes(m.role))
      .map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));

    console.log(
      `📤 Sending to OpenRouter with model: ${model || "tngtech/deepseek-r1t2-chimera:free"}`,
    );

    // 4. Generate Streaming Response with error handling
    let result;
    try {
      result = await streamText({
        model: openrouter(model || "tngtech/deepseek-r1t2-chimera:free"),
        system: systemPrompt,
        messages: sanitizedMessages,
        onFinish: async ({ text }) => {
          // Log to Supabase if available
          if (supabase) {
            try {
              await supabase.from("chat_logs").insert({
                user_message: userQuery,
                ai_response: text,
                session_id: "anonymous",
                model: model || "tngtech/deepseek-r1t2-chimera:free",
              });
            } catch (err) {
              console.error("Failed to log chat:", err);
            }
          }
        },
      });
    } catch (streamError: any) {
      console.error("❌ Error creating stream:", streamError);

      // Handle rate limit errors
      if (
        streamError.statusCode === 429 ||
        streamError.message?.includes("Rate limit exceeded")
      ) {
        let resetTime = "";
        let errorMessage = "Rate limit exceeded for this model.";

        if (streamError.responseBody) {
          try {
            const errorData =
              typeof streamError.responseBody === "string"
                ? JSON.parse(streamError.responseBody)
                : streamError.responseBody;

            const resetTimestamp =
              errorData?.error?.metadata?.headers?.["X-RateLimit-Reset"];
            if (resetTimestamp) {
              const resetDate = new Date(parseInt(resetTimestamp));
              resetTime = ` Resets at ${resetDate.toLocaleString()}`;
              errorMessage += resetTime;
              console.warn(
                `⚠️ Rate limit hit for model: ${model || "unknown"}.${resetTime}`,
              );
            } else {
              errorMessage +=
                " Please try again later or use a different model.";
            }
          } catch (parseError) {
            console.error("Failed to parse reset time:", parseError);
            errorMessage += " Please try again later or use a different model.";
          }
        } else {
          errorMessage += " Please try again later or use a different model.";
        }

        // Send error in format compatible with useChat
        res.setHeader("Content-Type", "application/json");
        return res.status(429).json({
          error: {
            message: errorMessage,
          },
        });
      }

      // Handle other errors
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: {
          message: streamError.message || "Failed to generate response",
        },
      });
    }

    console.log("✅ Streaming OpenRouter response to client...");

    // 5. Manual stream handling for Node.js response (same as Gemini endpoint)
    try {
      const response = result.toTextStreamResponse();

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("X-Vercel-AI-Data-Stream", "v1");

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          if (text) {
            res.write(text);
          }
        }
      }
      res.end();
    } catch (streamError) {
      console.error("Error piping stream:", streamError);
      res.status(500).json({ error: "Stream processing failed" });
    }
  } catch (error: any) {
    console.error("❌ Error in OpenRouter API:", error);
    console.error("❌ Error Details:", error.message);

    // Generic error handler (rate limits are now handled above)
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({
      error: {
        message: error.message || "Internal Server Error",
      },
    });
  }
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Development API server is running (TypeScript)",
    timestamp: new Date().toISOString(),
    environment: {
      WEB3FORMS_ACCESS_KEY: !!process.env.WEB3FORMS_ACCESS_KEY,
      GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Development API server running on http://localhost:${PORT}`);
  console.log(
    `   POST http://localhost:${PORT}/api/gemini (Streaming enabled)`,
  );
});

// --- REFRESH EMBEDDINGS ENDPOINT ---
app.post("/api/refresh-embeddings", (req, res) => {
  console.log("🔄 Manual embedding refresh triggered via API...");
  exec("npm run generate-embeddings", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error regenerating embeddings: ${error.message}`);
      return res.status(500).json({
        error: "Failed to refresh embeddings",
        details: error.message,
      });
    }
    if (stderr) {
      console.error(`Embedding generation stderr: ${stderr}`);
    }
    console.log(`Embeddings updated successfully: ${stdout}`);
    res.json({ success: true, message: "Embeddings refreshed successfully" });
  });
});

// --- AUTO-UPDATE EMBEDDINGS ---
import chokidar from "chokidar";
import { exec } from "child_process";
import path from "path";

const watcher = chokidar.watch(
  [
    path.join(process.cwd(), "src", "data", "portfolioData.ts"),
    path.join(process.cwd(), "src", "data", "customContext.ts"),
  ],
  {
    persistent: true,
    ignoreInitial: true,
  },
);

watcher.on("change", (path) => {
  console.log(`File changed: ${path}`);
  console.log("Regenerating embeddings...");
  exec("npm run generate-embeddings", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error regenerating embeddings: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Embedding generation stderr: ${stderr}`);
    }
    console.log(`Embeddings updated successfully: ${stdout}`);
  });
});
