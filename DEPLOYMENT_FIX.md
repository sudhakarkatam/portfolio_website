# Deployment Fix for Custom Domain Issue

## Problem Summary

When deploying to Netlify with a custom domain (e.g., `sudhakarkatam.dev`), the API endpoints were returning 404 errors because the platform detection was not recognizing it as a Netlify deployment.

- ✅ **Working**: `sudhakar-katam2.netlify.app` 
- ❌ **Not Working**: `sudhakarkatam.dev` (custom domain)

## Root Cause

The `detectPlatform()` function in `src/utils/platformUtils.ts` was only checking for hostnames containing "netlify.app" or "netlify.com". When using a custom domain, this check failed, causing the app to default to the wrong API endpoint pattern (`/api/gemini` instead of `/.netlify/functions/gemini`).

## Solution Applied

### 1. Updated `platformUtils.ts`
- Added build-time environment variable check (`VITE_DEPLOYMENT_PLATFORM`)
- Enhanced Netlify detection with multiple fallback methods
- Changed default behavior to assume Netlify for custom domains
- Added comprehensive debug utilities

### 2. Updated `netlify.toml`
- Added `VITE_DEPLOYMENT_PLATFORM = "netlify"` to build environment
- This ensures reliable platform detection regardless of domain

### 3. Added Test Utilities
- Created `testPlatformDetection.ts` for debugging
- Added browser console commands for testing

## Deployment Steps

### Step 1: Commit and Push Changes

```bash
git add .
git commit -m "Fix: Platform detection for custom domain on Netlify"
git push origin main
```

### Step 2: Redeploy on Netlify

Option A: Automatic (if auto-deploy is enabled)
- Push to GitHub will automatically trigger a new deploy

Option B: Manual
1. Go to Netlify Dashboard
2. Select your site
3. Click "Deploys" tab
4. Click "Trigger deploy" → "Deploy site"

### Step 3: Verify Environment Variables

In Netlify Dashboard:
1. Go to Site settings → Build & deploy → Environment
2. Ensure these variables are set:
   - `GEMINI_API_KEY` = your Gemini API key
   - `OPENROUTER_API_KEY` = your OpenRouter API key
   - `WEB3FORMS_ACCESS_KEY` = your Web3Forms key
   - `VITE_DEPLOYMENT_PLATFORM` = `netlify` (should be set automatically from netlify.toml)

### Step 4: Wait for Build to Complete

- Monitor the build logs in Netlify
- Ensure build completes successfully (usually 2-5 minutes)

## Testing the Fix

### Test 1: Quick Visual Test

1. Visit your custom domain: `https://sudhakarkatam.dev`
2. Try to use the AI chat feature
3. If it responds without errors, the fix is working! ✅

### Test 2: Browser Console Check

1. Open your site on the custom domain
2. Press `F12` to open browser console
3. Run any of these commands:

```javascript
// Quick platform check
window.checkPlatform()

// Full platform tests
window.runPlatformTests()

// Test custom domain detection specifically
window.testCustomDomain()

// Quick check
window.quickPlatformCheck()
```

**Expected Output:**
```
Detected Platform: netlify
Gemini Endpoint: /.netlify/functions/gemini
```

### Test 3: Network Tab Check

1. Open browser DevTools (`F12`)
2. Go to "Network" tab
3. Try using the AI chat
4. Look for requests to `/.netlify/functions/gemini`
5. Status should be `200 OK`, not `404`

### Test 4: Test Both Domains

Test on **both** domains to ensure everything works:

- ✅ `sudhakar-katam2.netlify.app` (should still work)
- ✅ `sudhakarkatam.dev` (should now work)

## Troubleshooting

### Issue: Still Getting 404 Errors

**Solution 1: Clear Cache**
```bash
# In Netlify Dashboard:
# Deploys → Trigger deploy → Clear cache and deploy site
```

**Solution 2: Check Build Logs**
- Go to Netlify Dashboard → Deploys → Click latest deploy
- Check if `VITE_DEPLOYMENT_PLATFORM` is being set
- Look for any build errors

**Solution 3: Hard Refresh Browser**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`
- Or clear browser cache completely

### Issue: Environment Variables Not Set

If environment variables are missing:

1. Go to Netlify Dashboard
2. Site settings → Build & deploy → Environment variables
3. Click "Add a variable"
4. Add each required variable:
   - Variable name: `GEMINI_API_KEY`
   - Value: Your actual API key
   - Scopes: Select all
5. Repeat for other variables
6. Trigger a new deploy

### Issue: Functions Not Deploying

Check that functions directory is correct:

```bash
# Should have these files:
netlify/functions/gemini.cjs
netlify/functions/openrouter.cjs
netlify/functions/contact.cjs
```

If missing, ensure `netlify.toml` has:
```toml
[functions]
  directory = "netlify/functions"
```

### Issue: Still Detecting Wrong Platform

Run this in browser console:
```javascript
window.checkPlatform()
```

If it shows the wrong platform:
1. Clear browser cache completely
2. Check `import.meta.env.VITE_DEPLOYMENT_PLATFORM` in console
3. If it's undefined, the build environment variable didn't apply
4. Redeploy with cache clear

## Technical Details

### How Platform Detection Works Now

1. **First Priority**: Build-time environment variable
   - Checks `import.meta.env.VITE_DEPLOYMENT_PLATFORM`
   - Set in `netlify.toml` during build
   - Most reliable for custom domains

2. **Second Priority**: Runtime detection
   - Checks hostname for "netlify.app", "netlify.com"
   - Checks for Netlify-specific globals
   - Checks for Netlify meta tags

3. **Fallback**: Defaults to Netlify
   - If can't determine, assumes Netlify
   - Works because your primary deployment is Netlify
   - Redirect rules in `netlify.toml` ensure compatibility

### API Endpoint Patterns

| Platform | Pattern | Example |
|----------|---------|---------|
| Netlify | `/.netlify/functions/[name]` | `/.netlify/functions/gemini` |
| Vercel | `/api/[name]` | `/api/gemini` |
| Local | `/api/[name]` | `/api/gemini` |

### Redirect Rules

The `netlify.toml` contains redirect rules that also support the `/api/*` pattern:

```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
  force = true
```

This means **both** patterns work on Netlify:
- `/.netlify/functions/gemini` → Direct access
- `/api/gemini` → Redirects to `/.netlify/functions/gemini`

However, using the direct path is more reliable and faster.

## Verification Checklist

After deployment, verify:

- [ ] Build completed successfully in Netlify
- [ ] All environment variables are set
- [ ] Custom domain DNS is pointed correctly
- [ ] `https://sudhakarkatam.dev` loads correctly
- [ ] AI chat works on custom domain
- [ ] No 404 errors in browser console
- [ ] `window.checkPlatform()` shows "netlify"
- [ ] API endpoints use `/.netlify/functions/` path
- [ ] Original Netlify subdomain still works

## Additional Notes

### For Future Custom Domains

If you add more custom domains in the future:

1. Add them in Netlify Dashboard → Domain settings
2. Configure DNS records as instructed by Netlify
3. No code changes needed - the fix handles all custom domains
4. Test with `window.testCustomDomain()` after deployment

### For Vercel Deployment

If you ever want to deploy to Vercel instead:

1. Set `VITE_DEPLOYMENT_PLATFORM=vercel` in Vercel environment variables
2. Ensure `api/` directory has the function files (not `netlify/functions/`)
3. Update `vercel.json` configuration
4. The platform detection will automatically switch

### Monitoring

To monitor platform detection in production:

1. Add this to your analytics:
```javascript
const platform = detectPlatform();
analytics.track('Platform Detected', { platform });
```

2. Or check logs in Netlify Functions:
   - Go to Functions tab in Netlify Dashboard
   - View logs for any errors

## Success Criteria

✅ Custom domain `sudhakarkatam.dev` works perfectly
✅ AI chat responds without errors
✅ No 404 errors in console
✅ Platform detection shows "netlify"
✅ API requests go to `/.netlify/functions/gemini`
✅ Original Netlify subdomain still works

## Support

If issues persist after following this guide:

1. Check Netlify build logs for errors
2. Run `window.runPlatformTests()` and share output
3. Check browser console for detailed error messages
4. Verify all environment variables are set correctly
5. Try clearing all caches and hard refresh

## Files Modified

- ✅ `src/utils/platformUtils.ts` - Enhanced platform detection
- ✅ `netlify.toml` - Added build environment variable
- ✅ `src/utils/testPlatformDetection.ts` - New test utilities
- ✅ `src/App.tsx` - Import test utilities in dev mode

---

**Last Updated**: 2025
**Status**: Fixed and Ready for Deployment ✅