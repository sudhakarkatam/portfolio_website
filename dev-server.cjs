// Development server for local API routes
// This server provides the same API endpoints as the production serverless functions
// Run with: node dev-server.cjs

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env.local
// Load environment variables from .env.local and .env
dotenv.config({ path: ".env.local" });
dotenv.config();

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

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  try {
    console.log("📧 Processing contact form submission...");

    // Validate required environment variable
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.error("WEB3FORMS_ACCESS_KEY is not set in .env.local");
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
    }

    // Extract and validate request body
    const { name, email, message, subject, phone } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, email, message",
      });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // Prepare form data for Web3Forms (using URLSearchParams for Node.js compatibility)
    const formData = new URLSearchParams();
    formData.append("access_key", accessKey);
    formData.append("name", name.trim());
    formData.append("email", email.trim().toLowerCase());
    formData.append("message", message.trim());

    // Optional fields
    if (subject) {
      formData.append("subject", subject.trim());
    } else {
      formData.append(
        "subject",
        `New Message from ${name.trim()} - Portfolio Contact Form`,
      );
    }

    if (phone) {
      formData.append("phone", phone.trim());
    }

    // Add additional metadata
    formData.append("from_name", "Portfolio Website");
    formData.append("redirect", "false");

    console.log(`📧 Sending contact form for: ${name} (${email})`);

    // Send request to Web3Forms API
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Web3Forms API error:", data);
      return res.status(response.status).json({
        success: false,
        error: data.message || "Failed to send email",
      });
    }

    if (data.success) {
      console.log("✅ Contact form email sent successfully");
      return res.json({
        success: true,
        message: "Message sent successfully!",
      });
    } else {
      console.error("Web3Forms returned failure:", data);
      return res.status(400).json({
        success: false,
        error: data.message || "Failed to send email",
      });
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
});

// Gemini AI endpoint
app.post("/api/gemini", async (req, res) => {
  try {
    console.log("🤖 Processing Gemini AI request...");

    // Validate required environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in .env.local");
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
    }

    // Extract and validate request body
    const {
      prompt,
      type,
      text,
      model = "gemini-2.5-flash",
      apiVersion = "v1beta",
      temperature = 0.8,
      maxTokens = 2048,
    } = req.body;

    // --- EMBEDDING REQUEST HANDLING ---
    if (type === 'embedding') {
      if (!text) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: text'
        });
      }

      console.log(`🤖 Generating Embedding...`);
      const embeddingModel = 'text-embedding-004';
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${embeddingModel}:embedContent?key=${apiKey}`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${embeddingModel}`,
          content: { parts: [{ text: text }] }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini Embedding API error:', errorData);
        return res.status(response.status).json({
          success: false,
          error: errorData.error?.message || 'Embedding generation failed'
        });
      }

      const data = await response.json();
      return res.status(200).json({
        success: true,
        embedding: data.embedding.values
      });
    }
    // --- END EMBEDDING HANDLING ---

    // Basic validation
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: prompt",
      });
    }

    // Validate prompt length
    if (prompt.length > 50000) {
      return res.status(400).json({
        success: false,
        error: "Prompt too long. Maximum 50,000 characters allowed.",
      });
    }

    console.log(`🤖 Generating Gemini response with model: ${model}`);

    // Prepare the request to Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: Math.min(Math.max(temperature, 0), 2),
        maxOutputTokens: Math.min(Math.max(maxTokens, 1), 8192),
        candidateCount: 1,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    // Send request to Gemini API
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API error:", errorData);

      if (response.status === 429) {
        return res.status(429).json({
          success: false,
          error: "Rate limit exceeded. Please try again in a moment.",
        });
      } else if (response.status === 400) {
        return res.status(400).json({
          success: false,
          error: errorData.error?.message || "Invalid request to Gemini API",
        });
      } else if (response.status === 403) {
        return res.status(503).json({
          success: false,
          error: "API key invalid or quota exceeded",
        });
      }

      return res.status(response.status).json({
        success: false,
        error: `Gemini API error: ${response.status} ${response.statusText}`,
      });
    }

    const data = await response.json();

    // Validate response structure
    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      !data.candidates[0].content.parts[0]
    ) {
      console.error("Invalid Gemini API response structure:", data);
      return res.status(502).json({
        success: false,
        error: "Invalid response from Gemini API",
      });
    }

    // Check if response was blocked by safety filters
    const candidate = data.candidates[0];
    if (candidate.finishReason === "SAFETY") {
      return res.status(400).json({
        success: false,
        error:
          "Response was blocked by safety filters. Please try rephrasing your question.",
      });
    }

    const generatedText = candidate.content.parts[0].text;

    if (!generatedText || generatedText.trim().length === 0) {
      return res.status(502).json({
        success: false,
        error: "Empty response from Gemini API",
      });
    }

    console.log("✅ Gemini response generated successfully");

    return res.json({
      success: true,
      response: generatedText.trim(),
      model: model,
      finishReason: candidate.finishReason || "STOP",
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
});

// OpenRouter AI endpoint
app.post("/api/openrouter", async (req, res) => {
  try {
    console.log("🚀 Processing OpenRouter AI request...");

    // Validate required environment variable
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not set in .env.local");
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
    }

    // Extract and validate request body
    const {
      messages,
      model = "tngtech/deepseek-r1t2-chimera:free",
      temperature = 0.7,
      maxTokens = 2048,
      stream = false,
    } = req.body;

    // Basic validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid messages array",
      });
    }

    // Validate messages format
    for (const message of messages) {
      if (!message.role || !message.content) {
        return res.status(400).json({
          success: false,
          error: "Each message must have role and content fields",
        });
      }
      if (!["system", "user", "assistant"].includes(message.role)) {
        return res.status(400).json({
          success: false,
          error: "Message role must be system, user, or assistant",
        });
      }
    }

    console.log(`🚀 Generating OpenRouter response with model: ${model}`);

    // Prepare the request to OpenRouter API
    const requestBody = {
      model: model,
      messages: messages,
      temperature: Math.min(Math.max(temperature, 0), 2),
      max_tokens: Math.min(Math.max(maxTokens, 1), 4096),
      stream: false,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    // Send request to OpenRouter API
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Portfolio AI Chat",
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API error:", errorData);

      if (response.status === 429) {
        return res.status(429).json({
          success: false,
          error: "Rate limit exceeded. Please try again in a moment.",
        });
      } else if (response.status === 400) {
        return res.status(400).json({
          success: false,
          error:
            errorData.error?.message || "Invalid request to OpenRouter API",
        });
      } else if (response.status === 401) {
        return res.status(503).json({
          success: false,
          error: "API key invalid or unauthorized",
        });
      } else if (response.status === 402) {
        return res.status(503).json({
          success: false,
          error: "Insufficient credits or quota exceeded",
        });
      }

      return res.status(response.status).json({
        success: false,
        error: `OpenRouter API error: ${response.status} ${response.statusText}`,
      });
    }

    const data = await response.json();

    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid OpenRouter API response structure:", data);
      return res.status(502).json({
        success: false,
        error: "Invalid response from OpenRouter API",
      });
    }

    const message = data.choices[0].message;
    const generatedText = message.content;

    if (!generatedText || generatedText.trim().length === 0) {
      return res.status(502).json({
        success: false,
        error: "Empty response from OpenRouter API",
      });
    }

    console.log("✅ OpenRouter response generated successfully");

    return res.json({
      success: true,
      response: generatedText.trim(),
      model: model,
      finishReason: data.choices[0].finish_reason || "stop",
      usage: data.usage || null,
    });
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Development API server is running",
    timestamp: new Date().toISOString(),
    endpoints: ["/api/contact", "/api/gemini", "/api/openrouter"],
    environment: {
      WEB3FORMS_ACCESS_KEY: !!process.env.WEB3FORMS_ACCESS_KEY,
      GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
      OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.method} ${req.path} not found`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Development API server running on http://localhost:${PORT}`);
  console.log("📋 Available endpoints:");
  console.log(`   POST http://localhost:${PORT}/api/contact`);
  console.log(`   POST http://localhost:${PORT}/api/gemini`);
  console.log(`   POST http://localhost:${PORT}/api/openrouter`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log("\n🔧 Environment variables status:");
  console.log(`   WEB3FORMS_ACCESS_KEY: ${!!process.env.WEB3FORMS_ACCESS_KEY ? "✅ Set" : "❌ Missing"}`);
  console.log(`   GEMINI_API_KEY: ${!!process.env.GEMINI_API_KEY ? "✅ Set" : "❌ Missing"}`);
  console.log(`   OPENROUTER_API_KEY: ${!!process.env.OPENROUTER_API_KEY ? "✅ Set" : "❌ Missing"}`);
  console.log("\n⚡ Frontend should be running on http://localhost:5173");
  console.log("💡 Make sure to run both servers for full functionality!");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down development server...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\nShutting down development server...");
  process.exit(0);
});
