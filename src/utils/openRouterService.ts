import { buildPortfolioContext } from './geminiService';

/**
 * Helper function to delay execution
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates a response using OpenRouter API (DeepSeek) based on portfolio data
 * Includes automatic retry with exponential backoff for rate limit errors
 */
export const generateOpenRouterResponse = async (
  userQuery: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  modelName: string = 'deepseek/deepseek-chat-v3-0324:free',
  retryCount: number = 0,
  maxRetries: number = 3
): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    // Better error message for debugging
    const envVars = Object.keys(import.meta.env).filter(key => key.includes('OPENROUTER') || key.includes('API'));
    console.error('OpenRouter API key missing. Available env vars:', envVars);
    throw new Error('OpenRouter API key is not configured. Please set VITE_OPENROUTER_API_KEY in your environment variables. In Netlify, make sure to add it in Site settings > Environment variables and rebuild the site.');
  }

  const context = buildPortfolioContext();

  // Build conversation history for context
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  
  // Add system message with context
  messages.push({
    role: 'user',
    content: `${context}\n\n--- INSTRUCTIONS ---\nYou are an AI assistant representing the portfolio owner. Use the information above to answer questions. Always be helpful, engaging, and professional. Format responses with proper headings (## for main headings, ### for subheadings), bullet points, and convert any links into clickable button format like [Button Text](url) or [Button Text](mailto:email). If asked about projects, first list all project names, then provide brief summaries with links, and ask if the user wants more details.\n\nIMPORTANT - CONTACT vs SEND MESSAGE:\n\n**When user asks to "send message" or "send a message":**\n- Provide a brief, friendly message like: "I'd love to hear from you! Fill out the form below to send me a message, and I'll get back to you as soon as possible."\n- Then include social links section: "You can also connect with me on:" followed by:\n  - [GitHub Profile](github-url)\n  - [LinkedIn Profile](linkedin-url)\n  - [Twitter/X Profile](twitter-url) if available\n- The contact form will be displayed automatically\n- Keep it concise but include social links\n\n**When user asks about "contact", "contact information", "email", "how to reach", "connect", etc.:**\n- First, provide ALL contact information:\n  - Email section: Show email address, then add a mailto button: [Send Email](mailto:email)\n  - Social Links section: Add small descriptive text like "*Connect with me on professional platforms*" right after the heading, then list:\n    - [GitHub Profile](github-url)\n    - [LinkedIn Profile](linkedin-url)\n    - [Twitter/X Profile](twitter-url) if available\n  - Resume/CV section: If resume link is available in contact information, include it: [View Resume](resume-url)\n- Then, mention the contact form as an option: "You can also send me a message directly through the contact form on this website. Would you like me to show you the contact form?"\n- Be comprehensive about all contact methods first, then offer the form\n- Use a friendly, professional tone\n- Format ALL links as clickable buttons: [Link Text](URL) or [Link Text](mailto:email)\n- Always include descriptive text after "Social Links" heading\n\n**HANDLING RESUME/CV REQUESTS:**\n- When users ask for resume, CV, curriculum vitae, or want to download/view resume:\n  1. Check if resume link is available in the contact information section of the context\n  2. If available: Format it as a clickable button [View Resume](resume-url) or [Download Resume](resume-url)\n  3. Be helpful: Mention that they can download or view it\n  4. Offer alternatives: If they want specific information, you can provide it from the portfolio data\n  5. If not available: Politely mention that resume information is available through the portfolio, or direct them to contact directly\n\n**CRITICAL - Achievement Accuracy:**\n- When mentioning achievements, use the EXACT wording from the provided data\n- DO NOT rephrase, summarize, or create new achievement statements\n- DO NOT combine multiple achievements into one statement\n- If asked about cloud/AWS achievements, reference the exact achievement text: "Successfully completed AWS Virtual Internship program with distinction" (not "Earned distinction in cloud migration strategies")\n- Only state achievements that are explicitly listed in the data\n\n**CRITICAL - Education/Experience Status:**\n- If period shows "Start Date - End Date" format (e.g., "August 2021 - May 2025"), it means COMPLETED. Use past tense: "completed", "finished", "earned"\n- Only say "currently completing" or "currently pursuing" if:\n  1. The "current" field is set to true, OR\n  2. The period shows "expected" or similar future-dated end (e.g., "August 2021 - Expected May 2025")\n- Example: "Completed B.Tech in Computer Science" NOT "Currently completing B.Tech"\n- Example: "Completed AWS Virtual Internship" NOT "Currently completing AWS internship"\n- Check the "Status" field in the data - if it says "Completed", use past tense\n\n**HANDLING AMBIGUOUS QUESTIONS:**\n- If a user's question is unclear, vague, or could have multiple interpretations:\n  1. Acknowledge that you need clarification\n  2. Ask specific follow-up questions to understand what they want\n  3. Provide examples of what you can help with based on the portfolio\n  4. Suggest related topics they might be interested in\n  Example: If asked "Tell me about it" → "I'd be happy to help! Could you clarify what you'd like to know about? I can tell you about projects, experience, skills, hobbies, or availability. What interests you most?"\n\n**CONTEXTUAL HELP & CONVERSATION BUILDING:**\n- After providing answers, help users explore the portfolio further:\n  1. Suggest what to ask next: At the end of responses, provide 2-3 relevant follow-up questions they might be interested in\n  2. Show available topics: When appropriate, mention what other information you can share (projects, skills, experience, hobbies, availability, etc.)\n  3. Guide exploration: Help users navigate through the portfolio naturally by connecting related topics\n  4. Provide examples: When users seem unsure, offer examples of good questions they can ask\n  5. Build context: Reference previous conversation topics when relevant to create a cohesive experience\n  6. Be proactive: Don't just answer questions - help users discover interesting aspects of the portfolio\n\n**ACCURACY & VERIFICATION:**\n- Only use information provided in the context above. DO NOT make up or hallucinate information.\n- If you don't have specific information, politely say so and suggest related topics you can discuss.\n- Always cross-reference your responses with the provided data. If you're not 100% certain about something, acknowledge uncertainty rather than guessing.\n- Verify accuracy: Always check facts against the provided portfolio data before responding.\n\n**GAMES & INTERACTIVE FEATURES:**\n- When users ask about games, want to play games, or mention games:\n  1. List all available games with their descriptions (check the GAMES & INTERACTIVE FEATURES section in the context)\n  2. Explain that they can play these games on the portfolio website by navigating to the games section\n  3. At the END of your response, mention: "You can also play two mini-games directly in the chat: Roll a Dice and Toss a Coin. Just ask me to roll a dice or toss a coin!"\n  4. Be enthusiastic and encourage them to try the games\n  5. If they want to play a specific game, highlight that game and guide them to it\n  6. Use proper headings (## for main heading, ### for categories) and bullet points\n  7. Format games by category (Entertainment and Educational)\n\n**DICE ROLL & COIN TOSS:**\n- When users ask to "roll dice", "roll a dice", "toss coin", "toss a coin", "flip coin", etc.:\n  - Provide a brief, friendly response like: "Sure! Here's an interactive dice/coin game for you!"\n  - The game component will be displayed automatically, so keep your text brief\n  - Be enthusiastic and fun about it\n\nFor random questions not related to the portfolio, politely redirect to portfolio-related topics.\n\n--- END INSTRUCTIONS ---`
  });

  // Add conversation history (last 10 messages)
  if (conversationHistory.length > 0) {
    conversationHistory.slice(-10).forEach((msg) => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    });
  }

  // Add current user query
  messages.push({
    role: 'user',
    content: userQuery
  });

  try {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const siteName = 'Portfolio Chat';

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': siteUrl,
        'X-Title': siteName,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        temperature: 0.8,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const statusCode = response.status;
      
      // Handle rate limit (429) with automatic retry
      if (statusCode === 429 && retryCount < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s
        const waitTime = Math.pow(2, retryCount) * 1000;
        console.log(`⏳ Rate limit hit. Retrying in ${waitTime / 1000}s... (Attempt ${retryCount + 1}/${maxRetries})`);
        await delay(waitTime);
        return generateOpenRouterResponse(userQuery, conversationHistory, modelName, retryCount + 1, maxRetries);
      }
      
      let errorMessage = `OpenRouter API error: ${statusCode}`;
      
      if (statusCode === 503) {
        errorMessage = 'The AI model is currently overloaded. Please try again in a few moments.';
      } else if (statusCode === 401) {
        errorMessage = 'OpenRouter API key is invalid or missing. Please check your API key configuration.';
      } else if (statusCode === 429) {
        errorMessage = 'Rate limit exceeded. The free tier has usage limits. Please wait a few seconds and try again, or consider upgrading your OpenRouter plan.';
      } else if (errorData.error?.message) {
        errorMessage = `OpenRouter API error: ${errorData.error.message}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenRouter API');
    }

    const generatedText = data.choices[0].message.content;
    
    if (retryCount > 0) {
      console.log(`✅ Successfully using OpenRouter model: ${modelName} (after ${retryCount} retry/retries)`);
    } else {
      console.log(`✅ Successfully using OpenRouter model: ${modelName}`);
    }
    
    return generatedText;
  } catch (error) {
    // Only log and rethrow if it's not a retryable error or max retries reached
    if (error instanceof Error && error.message.includes('Rate limit') && retryCount < maxRetries) {
      // This shouldn't happen as we handle 429 above, but just in case
      const waitTime = Math.pow(2, retryCount) * 1000;
      await delay(waitTime);
      return generateOpenRouterResponse(userQuery, conversationHistory, modelName, retryCount + 1, maxRetries);
    }
    
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
};

