import { buildPortfolioContext } from "./geminiService";
import { getApiEndpoint } from "./platformUtils";

/**
 * Helper function to delay execution
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates a response using OpenRouter API (DeepSeek) based on portfolio data
 * Includes automatic retry with exponential backoff for rate limit errors
 */
export const generateOpenRouterResponse = async (
  userQuery: string,
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }> = [],
  modelName: string = "tngtech/deepseek-r1t2-chimera:free",
  retryCount: number = 0,
  maxRetries: number = 3,
): Promise<string> => {
  // API key is now handled securely by the Netlify Function

  const context = buildPortfolioContext();

  // Build conversation history for context
  const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

  // Add system message with context
  messages.push({
    role: "user",
    content: `${context}\n\n--- INSTRUCTIONS ---\nYou are an AI assistant representing the portfolio owner. Use the information above to answer questions. Always be helpful, engaging, and professional.

**RESPONSE FORMATTING REQUIREMENTS:**
- Use **bold text** for important keywords, names, skills, and emphasis
- Use *italic text* for descriptions and subtle emphasis
- Use ### for section headers
- Use bullet points (-) and numbered lists (1. 2. 3.)
- Use \`code\` formatting for technical terms
- Use > blockquotes for important notes
- Format links as [Link Text](URL) or [Link Text](mailto:email)
- Be conversational but professional

**CRITICAL - CONTACT FORM TRIGGER INSTRUCTIONS:**
There IS a working ContactForm component that appears automatically. When users ask about:
- "form", "contact form", "message form", "send message"
- "how can I contact you", "get in touch", "reach out"
- "send you a message", "message you", "write to you"
- "want to contact", "contact you", "show me the form"

**CONTACT FORM RESPONSES (keep SHORT):**
When showing contact form, respond with:
"I'd **love to hear from you!** The contact form is right below - just fill out your name, email, and message.

**You can also connect with me on:**
- 🐙 **[GitHub Profile](github-url)**
- 💼 **[LinkedIn Profile](linkedin-url)**
- 🐦 **[Twitter/X Profile](twitter-url)** (if available)

The form will appear below automatically! ⬇️"

DO NOT explain form fields or features - just show it. Keep responses BRIEF for form requests.

**GENERAL CONTACT INFO RESPONSES:**
For contact information queries (not form requests), provide comprehensive contact details:

"## 📞 **Contact Information**

I'd **love to connect** with you! Here are the **best ways** to reach me:

### 📧 **Email**
**email-address**
*[Send Email](mailto:email-address)*

### 🌐 **Social Links**
*Connect with me on professional platforms:*
- 🐙 **[GitHub Profile](github-url)** - Explore my repositories
- 💼 **[LinkedIn Profile](linkedin-url)** - Professional networking
- 🐦 **[Twitter/X Profile](twitter-url)** - Tech updates (if available)

### 📄 **Resume/CV** (if available)
**[View Resume](resume-url)** - Download my complete CV

### 💬 **Direct Messaging**
Want to **send me a message** directly? I have a contact form right here!

*Feel free to reach out for **opportunities**, **technical discussions**, or just to say **hello**!* 😊"

**CRITICAL - Achievement Accuracy:**
- Use EXACT wording from provided data
- DO NOT rephrase or combine achievements
- Only state explicitly listed achievements

**CRITICAL - Education/Experience Status:**
- "Start Date - End Date" format means COMPLETED (use past tense)
- Only say "currently" if "current" field is true or shows expected future dates

**HANDLING AMBIGUOUS QUESTIONS:**
- Acknowledge need for clarification
- Ask specific follow-up questions
- Provide examples of available topics
- Suggest related areas of interest

**CONTEXTUAL HELP & CONVERSATION BUILDING:**
- Suggest 2-3 relevant follow-up questions after responses
- Help users explore portfolio naturally
- Reference previous conversation topics
- Be proactive in guiding exploration

**QUESTION PATTERN RECOGNITION:**
Recognize these common question variations and respond naturally:

**Technical Questions:**
- "Framework preference?" / "React or Angular?" / "What do you use?" → React + TypeScript + Next.js
- "Backend or frontend?" / "Full-stack?" / "What type of developer?" → Both + Cloud
- "IDE?" / "Editor?" / "VS Code?" → VS Code, exploring Vim

**Personal Questions:**
- "Hometown?" / "Where from?" / "Background?" → Village, Prakasam District, farmer father
- "Gaming?" / "Play games?" / "Free time?" → Used to play FreeFire, now focused on tech
- "Food?" / "Favorite dish?" / "What do you eat?" → Biryani, chicken, dosa, bread halwa
- "Friends?" / "College buddies?" / "Social circle?" → College friends first, then hometown

**Values Questions:**
- "What motivates you?" / "What drives you?" → Curiosity, learning, understanding how things work
- "Core values?" / "What matters?" → Patience, honesty, integrity, family happiness
- "Tech passion?" / "What excites you?" → Everything: AI, IoT, blockchain, hardware, arts

**Response Guidelines:**
- Match user's tone and question style
- For brief questions, give focused answers with hints for more
- For detailed questions, provide comprehensive responses
- Always end with something that invites follow-up
- Use "Also..." to add interesting related facts

**ACCURACY & VERIFICATION:**
- Only use provided information - DO NOT hallucinate
- Cross-reference responses with portfolio data
- Acknowledge uncertainty rather than guessing

**GAMES & INTERACTIVE FEATURES:**
- List available games with descriptions
- Mention chat mini-games: "Roll a Dice" and "Toss a Coin"
- Use proper headings and categorization
- Be enthusiastic about interactive features

For random questions not related to the portfolio, politely redirect to portfolio-related topics.

--- END INSTRUCTIONS ---`,
  });

  // Add conversation history (last 10 messages)
  if (conversationHistory.length > 0) {
    conversationHistory.slice(-10).forEach((msg) => {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      });
    });
  }

  // Add current user query
  messages.push({
    role: "user",
    content: userQuery,
  });

  try {
    // Get secure API endpoint based on deployment platform
    const endpoint = getApiEndpoint("openrouter");

    // Use secure function instead of direct API call
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
        model: modelName,
        temperature: 0.8,
        maxTokens: 2048,
        maxRetries: maxRetries,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const statusCode = response.status;

      // Handle rate limit (429) with automatic retry
      if (statusCode === 429 && retryCount < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s
        const waitTime = Math.pow(2, retryCount) * 1000;
        console.log(
          `⏳ Rate limit hit. Retrying in ${waitTime / 1000}s... (Attempt ${retryCount + 1}/${maxRetries})`,
        );
        await delay(waitTime);
        return generateOpenRouterResponse(
          userQuery,
          conversationHistory,
          modelName,
          retryCount + 1,
          maxRetries,
        );
      }

      let errorMessage = `OpenRouter API error: ${statusCode}`;

      if (statusCode === 503) {
        errorMessage =
          "The AI model is currently overloaded. Please try again in a few moments.";
      } else if (statusCode === 401) {
        errorMessage =
          "OpenRouter API key is invalid or missing. Please check your API key configuration.";
      } else if (statusCode === 429) {
        errorMessage =
          "Rate limit exceeded. The free tier has usage limits. Please wait a few seconds and try again, or consider upgrading your OpenRouter plan.";
      } else if (errorData.error) {
        errorMessage = `OpenRouter API error: ${errorData.error}`;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.success || !data.response) {
      throw new Error("Invalid response format from OpenRouter API");
    }

    const generatedText = data.response;

    if (retryCount > 0) {
      console.log(
        `✅ Successfully using OpenRouter model: ${modelName} (after ${retryCount} retry/retries)`,
      );
    } else {
      console.log(`✅ Successfully using OpenRouter model: ${modelName}`);
    }

    return generatedText;
  } catch (error) {
    // Only log and rethrow if it's not a retryable error or max retries reached
    if (
      error instanceof Error &&
      error.message.includes("Rate limit") &&
      retryCount < maxRetries
    ) {
      // This shouldn't happen as we handle 429 above, but just in case
      const waitTime = Math.pow(2, retryCount) * 1000;
      await delay(waitTime);
      return generateOpenRouterResponse(
        userQuery,
        conversationHistory,
        modelName,
        retryCount + 1,
        maxRetries,
      );
    }

    console.error("Error calling OpenRouter API:", error);
    throw error;
  }
};
