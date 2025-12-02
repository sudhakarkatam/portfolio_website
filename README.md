# 🚀 Sudhakar Portfolio AI

A modern, secure portfolio with AI chat functionality and protected API keys.

## ✨ Features

- 🤖 **AI Chat**: Google Gemini & OpenRouter integration
- 📧 **Contact Form**: Secure Web3Forms integration
- 🛡️ **API Protection**: No keys exposed to browsers
- 📱 **Responsive Design**: Works on all devices
- 🚀 **Fast Deployment**: One-click deploy to Netlify/Vercel

## 🏃‍♂️ Quick Start

### 1. Get API Keys
- **Web3Forms**: https://web3forms.com/ (free)
- **Gemini**: https://makersuite.google.com/app/apikey (free)
- **OpenRouter**: https://openrouter.ai/keys (free tier available)

### 2. Local Development Setup
```bash
git clone <your-repo>
cd chatty-cv-main
npm install

# Copy environment template and add your API keys
cp .env.example .env.local
# Edit .env.local with your actual API keys

# Start both frontend and API server
npm run dev
```

**Full Local Development Features:**
- ✅ **Complete AI functionality** - Gemini & OpenRouter work locally
- ✅ **Working contact form** - Sends real emails via Web3Forms
- ✅ **Secure API handling** - Development server proxies API calls
- ✅ **Hot reload** - Frontend updates instantly
- ✅ **Production parity** - Same functionality as deployed version

**Local Development Commands:**
- `npm run dev` - Start both frontend (5173) and API server (3001)
- `npm run dev:client` - Frontend only (for UI work)
- `npm run dev:api` - API server only

## 🚀 Deploy to Production

### Option A: Netlify (Recommended)

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Set Environment Variables**
   - Site Settings → Environment Variables
   - Add all three API keys (without `VITE_` prefix)

3. **Deploy**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions` (auto-detected)

4. **Done!** 
   - Your site will be live at `https://yoursite.netlify.app`
   - Functions available at `/.netlify/functions/[name]`

### Option B: Vercel

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository

2. **Set Environment Variables**
   - Project Settings → Environment Variables
   - Add all three API keys for Production, Preview, and Development

3. **Deploy**
   - Framework: Other
   - Build command: `npm run build`
   - Output directory: `dist`

4. **Done!**
   - Your site will be live at `https://yoursite.vercel.app`
   - API routes available at `/api/[name]`

## 🔒 Security Verified

After deployment, verify your API keys are protected:

1. Open your live site
2. Open browser dev tools (F12) → Network tab
3. Use contact form or AI chat
4. ✅ You should only see calls to your secure functions
5. ❌ No API keys should be visible anywhere

## 🛠️ Development Commands

```bash
npm run dev          # Start both frontend + API server (FULL functionality)
npm run dev:client   # Frontend only (UI/UX work)
npm run dev:api      # API server only
npm run build        # Build for production
npm run preview      # Preview production build
```

**Local Development Architecture:**
- **Frontend**: `http://localhost:5173` (Vite dev server)
- **API Server**: `http://localhost:3001` (Express with your API keys)
- **Proxy**: Frontend automatically routes `/api/*` to API server
- **Environment**: API keys loaded from `.env.local`

## 📁 Project Structure

```
chatty-cv-main/
├── src/                 # React frontend
├── netlify/functions/   # Netlify serverless functions
├── pages/api/          # Vercel API routes
├── public/             # Static assets
├── .env.example        # Environment template
└── README.md          # This file
```

## 🤖 AI Models Available

- **Normal Mode**: Rule-based responses (no API key needed)
- **Gemini 2.5 Flash**: Google's fast AI model (free tier)
- **DeepSeek R1T2**: Advanced reasoning model via OpenRouter

## 🔧 Troubleshooting

### API Keys Not Working
- Verify keys are set in platform dashboard (not in code)
- Make sure no `VITE_` prefix on sensitive keys
- Redeploy after adding environment variables

### Functions Not Found (404)
- **Netlify**: Check `netlify/functions/` directory exists
- **Vercel**: Check `pages/api/` directory exists
- Verify build completed successfully

### Local Development
```bash
# Start full development environment
npm run dev

# This starts:
# - Frontend: http://localhost:5173
# - API Server: http://localhost:3001
# - Auto-proxy: API calls routed securely

# Check API server health
curl http://localhost:3001/api/health
```

### Local AI Features Not Working?
**Check these common issues:**

1. **Missing .env.local file**
   ```bash
   cp .env.example .env.local
   # Add your actual API keys to .env.local
   ```

2. **API server not running**
   ```bash
   # Use npm run dev (not npm run dev:client)
   npm run dev
   ```

3. **Invalid API keys**
   - Check API keys are valid in provider dashboards
   - Verify no extra spaces or quotes in .env.local

4. **Port conflicts**
   - Make sure ports 3001 and 5173 are available

## 📧 Contact

For questions about this portfolio template:
- Email: your-email@example.com
- LinkedIn: your-linkedin-profile

## 🎉 You're Done!

Your portfolio is now live with:
- ✅ Protected API keys
- ✅ Working AI chat
- ✅ Secure contact form
- ✅ Professional design
- ✅ Mobile responsive

**No more exposed API keys in production!** 🔒