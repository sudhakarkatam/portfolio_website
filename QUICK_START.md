# Quick Start - Deploy Custom Domain Fix

## 🚀 Deploy in 3 Steps

### Step 1: Push to GitHub
```bash
cd C:\Users\Sudhakar\Downloads\chatty-cv-main\chatty-cv-main
git add .
git commit -m "Fix: Platform detection for custom domain on Netlify"
git push origin main
```

### Step 2: Wait for Netlify Build
- Netlify will automatically deploy (2-5 minutes)
- Or manually: Netlify Dashboard → Deploys → Trigger deploy

### Step 3: Test on Custom Domain
Visit: https://sudhakarkatam.dev

Open console (F12) and run:
```javascript
window.checkPlatform()
```

**Expected:**
```
Detected Platform: netlify
Gemini Endpoint: /.netlify/functions/gemini
```

## ✅ Success Check

Try the AI chat on `sudhakarkatam.dev`:
- [ ] Chat responds without errors
- [ ] No 404 errors in console
- [ ] Network tab shows 200 status on API calls

## 🐛 If Still Broken

1. **Clear Netlify Cache:**
   - Netlify Dashboard → Deploys → "Clear cache and deploy site"

2. **Hard Refresh Browser:**
   - Press: `Ctrl + Shift + R` (Windows/Linux)
   - Press: `Cmd + Shift + R` (Mac)

3. **Check Environment Variables:**
   - Netlify Dashboard → Site settings → Environment variables
   - Verify: `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `WEB3FORMS_ACCESS_KEY`

4. **Run Full Tests:**
   ```javascript
   window.runPlatformTests()
   ```

## 📋 What Changed

- ✅ Fixed platform detection for custom domains
- ✅ Added `VITE_DEPLOYMENT_PLATFORM = "netlify"` to build
- ✅ Enhanced detection with multiple fallback methods
- ✅ Defaults to Netlify for unknown custom domains

## 🎯 The Fix

**Before:**
- Custom domain → Detected as "vercel" → Used `/api/gemini` → 404 error ❌

**After:**
- Custom domain → Detected as "netlify" → Uses `/.netlify/functions/gemini` → Works! ✅

## 📞 Need Help?

Run debug command:
```javascript
window.runPlatformTests()
```

Copy the output and check:
- Platform should be "netlify"
- Endpoint should be "/.netlify/functions/gemini"
- No 404 errors

## 📄 More Info

- `FIX_SUMMARY.md` - Quick overview
- `DEPLOYMENT_FIX.md` - Detailed guide
- `DEPLOY_CHECKLIST.md` - Complete checklist

---

**Status:** ✅ Ready to Deploy
**Time Needed:** ~5 minutes
**Risk Level:** Low (only affects platform detection)