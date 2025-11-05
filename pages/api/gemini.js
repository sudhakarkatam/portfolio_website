// Next.js API route for secure Gemini AI integration
// This route proxies requests to Google Gemini API with server-side API key protection

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    // Validate required environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    // Extract and validate request body
    const { prompt, model = 'gemini-2.5-flash', apiVersion = 'v1beta', temperature = 0.8, maxTokens = 2048 } = req.body;

    // Basic validation
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: prompt'
      });
    }

    // Validate prompt length (reasonable limits)
    if (prompt.length > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Prompt too long. Maximum 50,000 characters allowed.'
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
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: Math.min(Math.max(temperature, 0), 2), // Clamp between 0 and 2
        maxOutputTokens: Math.min(Math.max(maxTokens, 1), 8192), // Clamp between 1 and 8192
        candidateCount: 1
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    // Send request to Gemini API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });

      // Handle specific error cases
      if (response.status === 429) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded. Please try again in a moment.'
        });
      } else if (response.status === 400) {
        return res.status(400).json({
          success: false,
          error: errorData.error?.message || 'Invalid request to Gemini API'
        });
      } else if (response.status === 403) {
        return res.status(503).json({
          success: false,
          error: 'API key invalid or quota exceeded'
        });
      }

      return res.status(response.status).json({
        success: false,
        error: `Gemini API error: ${response.status} ${response.statusText}`
      });
    }

    const data = await response.json();

    // Validate response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('Invalid Gemini API response structure:', data);
      return res.status(502).json({
        success: false,
        error: 'Invalid response from Gemini API'
      });
    }

    // Check if the response was blocked by safety filters
    const candidate = data.candidates[0];
    if (candidate.finishReason === 'SAFETY') {
      return res.status(400).json({
        success: false,
        error: 'Response was blocked by safety filters. Please try rephrasing your question.'
      });
    }

    const generatedText = candidate.content.parts[0].text;

    if (!generatedText || generatedText.trim().length === 0) {
      return res.status(502).json({
        success: false,
        error: 'Empty response from Gemini API'
      });
    }

    console.log('✅ Gemini response generated successfully');

    return res.status(200).json({
      success: true,
      response: generatedText.trim(),
      model: model,
      finishReason: candidate.finishReason || 'STOP'
    });

  } catch (error) {
    console.error('Gemini API error:', error);

    // Handle different types of errors
    if (error.name === 'AbortError') {
      return res.status(408).json({
        success: false,
        error: 'Request timeout. Please try again.'
      });
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return res.status(503).json({
        success: false,
        error: 'Unable to connect to Gemini API. Please try again later.'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.'
    });
  }
}
