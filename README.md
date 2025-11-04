This is my personal portfolio and I am working on other features also if you have suggestions reach out to me 
sudhakarkatam777@gmail.com

## AI Mode Setup

This portfolio includes AI-powered chat modes using multiple providers. To enable AI modes:

### Gemini API Setup

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env` file in the root directory
3. Add your API key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

### OpenRouter API Setup (for DeepSeek)

1. Get your OpenRouter API key from [OpenRouter](https://openrouter.ai/keys)
2. Add your API key to the `.env` file:
   ```
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```
3. Restart your development server

**Note:** The chat works in multiple modes:
- **Normal Mode** (default): Uses rule-based responses with predefined components
- **Gemini 2.5 Flash**: Uses Google's Gemini API for AI-powered responses
- **DeepSeek V3**: Uses DeepSeek model via OpenRouter API

Select your preferred mode using the model selector dropdown in the chat interface.