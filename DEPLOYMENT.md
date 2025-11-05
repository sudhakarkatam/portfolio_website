# 🚀 Deployment Checklist

## Pre-Deployment Setup

### 1. Get Your API Keys
- [ ] **Web3Forms**: Go to https://web3forms.com → Sign up → Get access key
- [ ] **Gemini AI**: Go to https://makersuite.google.com/app/apikey → Create API key
- [ ] **OpenRouter**: Go to https://openrouter.ai/keys → Sign up → Generate key

### 2. Test Locally
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add your API keys to `.env.local`
- [ ] Run `npm run dev`
- [ ] Test contact form and AI chat at http://localhost:5173

---

## Deploy to Netlify (Recommended)

### Step 1: Connect Repository
- [ ] Go to https://netlify.com
- [ ] Click "New site from Git"
- [ ] Connect your GitHub account
- [ ] Select your repository

### Step 2: Configure Build
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Functions directory: `netlify/functions` (auto-detected)

### Step 3: Set Environment Variables
- [ ] Go to Site Settings → Environment Variables
- [ ] Add these variables (NO `VITE_` prefix):
  ```
  WEB3FORMS_ACCESS_KEY = your_web3forms_key_here
  GEMINI_API_KEY = your_gemini_key_here
  OPENROUTER_API_KEY = your_openrouter_key_here
  ```

### Step 4: Deploy & Test
- [ ] Click "Deploy site"
- [ ] Wait for build to complete
- [ ] Test your live site
- [ ] Open browser dev tools → Network tab
- [ ] Use contact form - should only see `/.netlify/functions/` calls
- [ ] Use AI chat - should work without exposing API keys

---

## Deploy to Vercel (Alternative)

### Step 1: Connect Repository  
- [ ] Go to https://vercel.com
- [ ] Click "New Project"
- [ ] Import from GitHub
- [ ] Select your repository

### Step 2: Configure Build
- [ ] Framework Preset: Other
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### Step 3: Set Environment Variables
- [ ] Go to Settings → Environment Variables
- [ ] Add for Production, Preview, AND Development:
  ```
  WEB3FORMS_ACCESS_KEY = your_web3forms_key_here
  GEMINI_API_KEY = your_gemini_key_here  
  OPENROUTER_API_KEY = your_openrouter_key_here
  ```

### Step 4: Deploy & Test
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Test your live site
- [ ] Verify API calls go to `/api/` endpoints
- [ ] Confirm no API keys are visible in browser

---

## Security Verification

### ✅ What You Should See:
- [ ] Contact form sends emails successfully
- [ ] AI chat responds to questions
- [ ] Browser Network tab shows only internal function calls
- [ ] No API keys visible anywhere in browser
- [ ] Functions appear in platform dashboard

### ❌ Red Flags:
- [ ] Direct calls to `generativelanguage.googleapis.com`
- [ ] Direct calls to `openrouter.ai`
- [ ] Direct calls to `api.web3forms.com`
- [ ] API keys visible in Network tab
- [ ] Console errors about missing environment variables

---

## Troubleshooting

### Functions Not Working?
- [ ] Check build logs for errors
- [ ] Verify environment variables are set correctly
- [ ] Make sure functions directory exists (`netlify/functions/` or `pages/api/`)
- [ ] Redeploy after adding environment variables

### API Keys Not Found?
- [ ] Don't use `VITE_` prefix for sensitive keys
- [ ] Set variables in platform dashboard, not in code
- [ ] Use exact variable names: `WEB3FORMS_ACCESS_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY`
- [ ] Redeploy after adding variables

### Contact Form Not Working?
- [ ] Verify Web3Forms key is valid
- [ ] Check spam folder for test emails
- [ ] Try different email address for testing

### AI Chat Not Responding?
- [ ] Check API key validity in provider dashboard
- [ ] Verify API quotas haven't been exceeded
- [ ] Check function logs for detailed error messages

---

## Post-Deployment

### Monitor Usage
- [ ] Set up billing alerts in API provider dashboards
- [ ] Monitor function invocations in Netlify/Vercel dashboard
- [ ] Check error rates and response times

### Security Maintenance
- [ ] Rotate API keys quarterly
- [ ] Monitor for any security vulnerabilities
- [ ] Keep dependencies updated

### Performance Optimization
- [ ] Monitor Core Web Vitals
- [ ] Optimize images and assets
- [ ] Consider CDN for better global performance

---

## 🎉 Success!

Once all checkboxes are complete:
- ✅ Your portfolio is live and secure
- ✅ API keys are protected server-side
- ✅ Contact form and AI chat work perfectly
- ✅ No sensitive data exposed to browsers
- ✅ Ready for professional use

**Your secure portfolio is now live! 🚀**