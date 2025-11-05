// Netlify function for secure OpenRouter AI integration
// This function proxies requests to OpenRouter API with server-side API key protection

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed. Use POST.'
      })
    };
  }

  try {
    // Validate required environment variable
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY is not set in environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Server configuration error'
        })
      };
    }

    // Parse and validate request body
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid JSON in request body'
        })
      };
    }

    const {
      messages,
      model = 'tngtech/deepseek-r1t2-chimera:free',
      temperature = 0.7,
      maxTokens = 2048,
      stream = false
    } = body;

    // Basic validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing or invalid messages array'
        })
      };
    }

    // Validate messages format
    for (const message of messages) {
      if (!message.role || !message.content) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Each message must have role and content fields'
          })
        };
      }
      if (!['system', 'user', 'assistant'].includes(message.role)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Message role must be system, user, or assistant'
          })
        };
      }
    }

    // Calculate total content length for validation
    const totalLength = messages.reduce((sum, msg) => sum + msg.content.length, 0);
    if (totalLength > 100000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Total message content too long. Maximum 100,000 characters allowed.'
        })
      };
    }

    console.log(`🚀 Generating OpenRouter response with model: ${model}`);

    // Prepare the request to OpenRouter API
    const requestBody = {
      model: model,
      messages: messages,
      temperature: Math.min(Math.max(temperature, 0), 2), // Clamp between 0 and 2
      max_tokens: Math.min(Math.max(maxTokens, 1), 4096), // Clamp between 1 and 4096
      stream: false, // Always disable streaming for Netlify functions
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    };

    // Add retry logic with exponential backoff
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Send request to OpenRouter API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout for Netlify

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://your-portfolio-site.com', // Replace with your actual domain
            'X-Title': 'Portfolio AI Chat'
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();

          // Validate response structure
          if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('Invalid OpenRouter API response structure:', data);
            return {
              statusCode: 502,
              headers,
              body: JSON.stringify({
                success: false,
                error: 'Invalid response from OpenRouter API'
              })
            };
          }

          const message = data.choices[0].message;
          const generatedText = message.content;

          if (!generatedText || generatedText.trim().length === 0) {
            return {
              statusCode: 502,
              headers,
              body: JSON.stringify({
                success: false,
                error: 'Empty response from OpenRouter API'
              })
            };
          }

          console.log('✅ OpenRouter response generated successfully');

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              response: generatedText.trim(),
              model: model,
              finishReason: data.choices[0].finish_reason || 'stop',
              usage: data.usage || null
            })
          };
        }

        // Handle non-ok responses
        const errorData = await response.json().catch(() => ({}));
        console.error(`OpenRouter API error (attempt ${attempt}):`, {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });

        // Handle specific error cases
        if (response.status === 429) {
          // Rate limit - wait before retry
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
            console.log(`Rate limited, waiting ${delay}ms before retry ${attempt + 1}`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          return {
            statusCode: 429,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Rate limit exceeded. Please try again in a moment.'
            })
          };
        } else if (response.status === 400) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: errorData.error?.message || 'Invalid request to OpenRouter API'
            })
          };
        } else if (response.status === 401) {
          return {
            statusCode: 503,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'API key invalid or unauthorized'
            })
          };
        } else if (response.status === 402) {
          return {
            statusCode: 503,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Insufficient credits or quota exceeded'
            })
          };
        } else if (response.status >= 500) {
          // Server error - retry
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`Server error, waiting ${delay}ms before retry ${attempt + 1}`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }

        lastError = new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
        break;

      } catch (fetchError) {
        console.error(`OpenRouter API fetch error (attempt ${attempt}):`, fetchError);
        lastError = fetchError;

        if (fetchError.name === 'AbortError') {
          return {
            statusCode: 408,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Request timeout. Please try again.'
            })
          };
        }

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Fetch error, waiting ${delay}ms before retry ${attempt + 1}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
    }

    // If all retries failed, return the last error
    throw lastError;

  } catch (error) {
    console.error('OpenRouter function error:', error);

    // Handle different types of errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Unable to connect to OpenRouter API. Please try again later.'
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error. Please try again later.'
      })
    };
  }
};
