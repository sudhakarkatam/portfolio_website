/**
 * Platform Detection Test Utility
 * Use this to verify platform detection is working correctly
 *
 * Usage in browser console:
 * 1. Open browser console (F12)
 * 2. Type: window.checkPlatform()
 * 3. Verify the detected platform is correct
 */

import {
  detectPlatform,
  getPlatformDebugInfo,
  getApiEndpoints,
  getPlatformConfig,
  validatePlatformSetup,
} from "./platformUtils";

// Extend Window interface for test utilities
declare global {
  interface Window {
    runPlatformTests?: () => unknown;
    quickPlatformCheck?: () => unknown;
    testCustomDomain?: () => void;
  }
}

/**
 * Run comprehensive platform detection tests
 */
export function runPlatformTests() {
  console.log("🧪 Running Platform Detection Tests...\n");

  // Test 1: Basic platform detection
  console.log("Test 1: Platform Detection");
  const platform = detectPlatform();
  console.log(`✅ Detected Platform: ${platform}`);
  console.log("");

  // Test 2: API Endpoints
  console.log("Test 2: API Endpoints");
  const endpoints = getApiEndpoints();
  console.log("Gemini Endpoint:", endpoints.gemini);
  console.log("OpenRouter Endpoint:", endpoints.openrouter);
  console.log("Contact Endpoint:", endpoints.contact);

  // Verify Netlify endpoints
  if (platform === "netlify") {
    const isCorrect = endpoints.gemini.includes("/.netlify/functions/");
    console.log(
      isCorrect
        ? "✅ Netlify endpoints correct"
        : "❌ Netlify endpoints incorrect",
    );
  }
  console.log("");

  // Test 3: Platform Configuration
  console.log("Test 3: Platform Configuration");
  const config = getPlatformConfig();
  console.log("Functions Path:", config.functionsPath);
  console.log("Max Timeout:", config.maxTimeout);
  console.log("Framework:", config.framework);
  console.log("");

  // Test 4: Environment Variables
  console.log("Test 4: Environment Variables");
  console.log(
    "VITE_DEPLOYMENT_PLATFORM:",
    import.meta.env.VITE_DEPLOYMENT_PLATFORM || "not set",
  );
  console.log("");

  // Test 5: URL and Hostname
  console.log("Test 5: Current Environment");
  console.log("Hostname:", window.location.hostname);
  console.log("URL:", window.location.href);
  console.log("Protocol:", window.location.protocol);
  console.log("");

  // Test 6: Detection Checks
  console.log("Test 6: Detection Checks");
  console.log(
    "Has Netlify in hostname:",
    window.location.hostname.includes("netlify"),
  );
  console.log(
    "Has Vercel in hostname:",
    window.location.hostname.includes("vercel"),
  );
  console.log("Has __NETLIFY__ global:", window.__NETLIFY__ === true);
  console.log("Has netlifyIdentity:", window.netlifyIdentity !== undefined);
  console.log(
    "Has Netlify meta tag:",
    document.querySelector('meta[name="netlify"]') !== null,
  );
  console.log("Is localhost:", window.location.hostname === "localhost");
  console.log("");

  // Test 7: Platform Validation
  console.log("Test 7: Platform Validation");
  const validation = validatePlatformSetup();
  console.log("Is Valid:", validation.isValid);
  console.log("Platform:", validation.platform);
  if (validation.errors.length > 0) {
    console.log("❌ Errors:", validation.errors);
  } else {
    console.log("✅ No errors");
  }
  if (validation.warnings.length > 0) {
    console.log("⚠️ Warnings:", validation.warnings);
  } else {
    console.log("✅ No warnings");
  }
  console.log("");

  // Test 8: Full Debug Info
  console.log("Test 8: Full Debug Info");
  const debugInfo = getPlatformDebugInfo();
  console.log(JSON.stringify(debugInfo, null, 2));
  console.log("");

  // Test 9: Test API Call (optional)
  console.log("Test 9: Testing API Endpoint Accessibility");
  testApiEndpoint(endpoints.gemini);

  console.log("✅ All platform detection tests completed!\n");

  return {
    platform,
    endpoints,
    config,
    validation,
    debugInfo,
  };
}

/**
 * Test if an API endpoint is accessible
 */
async function testApiEndpoint(endpoint: string) {
  console.log(`Testing endpoint: ${endpoint}`);

  try {
    // Try OPTIONS request first (preflight)
    const response = await fetch(endpoint, {
      method: "OPTIONS",
    });

    console.log("Response Status:", response.status);
    console.log("Response OK:", response.ok);

    if (response.ok || response.status === 405) {
      console.log("✅ Endpoint is accessible (405 is expected for OPTIONS)");
    } else if (response.status === 404) {
      console.log("❌ Endpoint returned 404 - Function not found!");
      console.log(
        "This is the issue! The function is not accessible at this path.",
      );
    } else {
      console.log("⚠️ Unexpected status code:", response.status);
    }
  } catch (error) {
    console.log("❌ Error accessing endpoint:", error);
  }
}

/**
 * Quick platform check - minimal output
 */
export function quickPlatformCheck() {
  const platform = detectPlatform();
  const endpoints = getApiEndpoints();

  console.log(`Platform: ${platform}`);
  console.log(`Gemini Endpoint: ${endpoints.gemini}`);
  console.log(`Hostname: ${window.location.hostname}`);

  return { platform, endpoint: endpoints.gemini };
}

/**
 * Test custom domain detection specifically
 */
export function testCustomDomain() {
  console.log("🌐 Testing Custom Domain Detection\n");

  const hostname = window.location.hostname;
  console.log("Current hostname:", hostname);

  const isNetlifySubdomain =
    hostname.includes("netlify.app") || hostname.includes("netlify.com");
  const isCustomDomain = !isNetlifySubdomain && !hostname.includes("localhost");

  console.log("Is Netlify subdomain:", isNetlifySubdomain);
  console.log("Is custom domain:", isCustomDomain);

  if (isCustomDomain) {
    console.log("✅ Custom domain detected!");
    console.log("Testing if platform detection works correctly...");

    const platform = detectPlatform();
    const endpoints = getApiEndpoints();

    console.log("Detected platform:", platform);
    console.log("Gemini endpoint:", endpoints.gemini);

    if (
      platform === "netlify" &&
      endpoints.gemini.includes("/.netlify/functions/")
    ) {
      console.log("✅ Custom domain detection is working correctly!");
      console.log("✅ Using correct Netlify functions path");
    } else {
      console.log("❌ Custom domain detection may have issues");
      console.log(`Expected: netlify with /.netlify/functions/ path`);
      console.log(`Got: ${platform} with ${endpoints.gemini}`);
    }
  } else {
    console.log("Not a custom domain, testing standard detection...");
    const platform = detectPlatform();
    console.log("Platform:", platform);
  }

  console.log("");
}

// Export to window for easy console access
if (typeof window !== "undefined") {
  window.runPlatformTests = runPlatformTests;
  window.quickPlatformCheck = quickPlatformCheck;
  window.testCustomDomain = testCustomDomain;

  console.log("🔧 Platform Test Utilities loaded!");
  console.log("Available commands:");
  console.log("  - window.runPlatformTests() - Run all tests");
  console.log("  - window.quickPlatformCheck() - Quick platform check");
  console.log("  - window.testCustomDomain() - Test custom domain detection");
  console.log(
    "  - window.checkPlatform() - Show debug info (from platformUtils)",
  );
}
