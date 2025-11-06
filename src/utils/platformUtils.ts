/**
 * Platform detection utilities for serverless deployments
 * Supports both Netlify Functions and Vercel API Routes for maximum deployment flexibility
 * Fixed to properly detect Netlify deployments even with custom domains
 */

export type DeploymentPlatform = "netlify" | "vercel" | "local";

// Extend Window interface for platform-specific globals
declare global {
  interface Window {
    __NETLIFY__?: boolean;
    __VERCEL__?: boolean;
    netlifyIdentity?: unknown;
    checkPlatform?: () => unknown;
  }
}

/**
 * Detects the current deployment platform
 * Enhanced to support custom domains on Netlify
 */
export function detectPlatform(): DeploymentPlatform {
  if (typeof window === "undefined") {
    // Server-side rendering - check environment variables safely
    if (typeof process !== "undefined" && process.env) {
      if (process.env.NETLIFY) {
        return "netlify";
      }
      if (process.env.VERCEL) {
        return "vercel";
      }
    }
    return "local";
  }

  // Client-side detection
  const hostname = window.location.hostname;
  const url = window.location.href;

  // Check for build-time environment variable (most reliable for custom domains)
  if (import.meta.env.VITE_DEPLOYMENT_PLATFORM === "netlify") {
    return "netlify";
  }
  if (import.meta.env.VITE_DEPLOYMENT_PLATFORM === "vercel") {
    return "vercel";
  }

  // Netlify detection - multiple methods for reliability
  const isNetlify =
    // Standard Netlify domains
    hostname.includes("netlify.app") ||
    hostname.includes("netlify.com") ||
    // Check if Netlify functions path is being used
    url.includes("/.netlify/functions/") ||
    // Check for Netlify-injected indicators
    window.__NETLIFY__ === true ||
    // Check for Netlify deployment meta tag
    document.querySelector('meta[name="netlify"]') !== null ||
    // Check for Netlify-specific global
    window.netlifyIdentity !== undefined;

  if (isNetlify) {
    return "netlify";
  }

  // Vercel detection
  if (
    hostname.includes("vercel.app") ||
    hostname.includes("vercel.com") ||
    window.__VERCEL__ === true
  ) {
    return "vercel";
  }

  // Local development detection
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.endsWith(".local")
  ) {
    return "local";
  }

  // For custom domains where we can't detect the platform:
  // Default to Netlify since that's the primary deployment target
  // The redirect rules in netlify.toml will ensure /api/* works correctly
  return "netlify";
}

/**
 * Checks if we're in local development environment
 */
export function isLocalDevelopment(): boolean {
  return detectPlatform() === "local";
}

/**
 * Gets the appropriate API endpoint based on deployment platform
 */
export function getApiEndpoint(functionName: string): string {
  const platform = detectPlatform();

  switch (platform) {
    case "netlify":
      // On Netlify, always use /.netlify/functions/
      // The redirect rules in netlify.toml will also make /api/* work
      return `/.netlify/functions/${functionName}`;
    case "vercel":
      return `/api/${functionName}`;
    case "local":
    default:
      // Local development uses the same API routes as Vercel
      return `/api/${functionName}`;
  }
}

/**
 * Platform-specific configuration
 */
export const platformConfig = {
  netlify: {
    functionsPath: "/.netlify/functions",
    maxTimeout: 26000, // Netlify has 26s timeout for free tier
    supportsCron: true,
    supportsEdgeFunctions: true,
    supportsSSR: false, // Use functions instead
    framework: "Netlify Functions",
    renderingMode: "Static + Serverless Functions",
  },
  vercel: {
    functionsPath: "/api",
    maxTimeout: 60000, // Vercel supports longer timeouts
    supportsCron: true,
    supportsEdgeFunctions: true,
    supportsSSR: true,
    framework: "Next.js API Routes",
    renderingMode: "SSR/API Routes",
  },
  local: {
    functionsPath: "/api",
    maxTimeout: 30000,
    supportsCron: false,
    supportsEdgeFunctions: false,
    supportsSSR: true,
    framework: "Development Server",
    renderingMode: "Local Development",
  },
} as const;

/**
 * Gets platform-specific configuration
 */
export function getPlatformConfig() {
  const platform = detectPlatform();
  return platformConfig[platform];
}

/**
 * Checks if a feature is supported on the current platform
 */
export function isFeatureSupported(
  feature: keyof typeof platformConfig.netlify,
): boolean {
  const config = getPlatformConfig();
  return config[feature] as boolean;
}

/**
 * Gets all available API endpoints for the current platform
 */
export function getApiEndpoints() {
  return {
    contact: getApiEndpoint("contact"),
    gemini: getApiEndpoint("gemini"),
    openrouter: getApiEndpoint("openrouter"),
  };
}

/**
 * Gets the appropriate timeout for API requests based on platform
 */
export function getApiTimeout(): number {
  const config = getPlatformConfig();
  return config.maxTimeout - 1000; // Leave 1s buffer for processing
}

/**
 * Platform detection debug information
 */
export function getPlatformDebugInfo() {
  const platform = detectPlatform();
  const config = getPlatformConfig();
  const endpoints = getApiEndpoints();

  return {
    platform,
    config,
    endpoints,
    timeout: getApiTimeout(),
    hostname:
      typeof window !== "undefined" ? window.location.hostname : "server-side",
    url: typeof window !== "undefined" ? window.location.href : "server-side",
    userAgent:
      typeof window !== "undefined" ? navigator.userAgent : "server-side",
    environmentVars: {
      NETLIFY:
        (typeof process !== "undefined" && process.env?.NETLIFY) || false,
      VERCEL: (typeof process !== "undefined" && process.env?.VERCEL) || false,
      NODE_ENV:
        (typeof process !== "undefined" && process.env?.NODE_ENV) || "unknown",
      VITE_DEPLOYMENT_PLATFORM:
        import.meta.env.VITE_DEPLOYMENT_PLATFORM || "not set",
    },
    detectionChecks:
      typeof window !== "undefined"
        ? {
            hasNetlifyHostname: window.location.hostname.includes("netlify"),
            hasVercelHostname: window.location.hostname.includes("vercel"),
            hasNetlifyGlobal: window.__NETLIFY__ === true,
            hasNetlifyIdentity: window.netlifyIdentity !== undefined,
            hasNetlifyMeta:
              document.querySelector('meta[name="netlify"]') !== null,
            isLocalhost: window.location.hostname === "localhost",
          }
        : {},
    timestamp: new Date().toISOString(),
  };
}

/**
 * Logs platform information to console (development only)
 */
export function logPlatformInfo() {
  if (
    typeof process !== "undefined" &&
    process.env?.NODE_ENV === "development"
  ) {
    const info = getPlatformDebugInfo();
    console.log(`🌐 Platform Detection (${info.platform}):`, info);
  }
}

/**
 * Validates that the current platform setup is correct
 */
export function validatePlatformSetup(): {
  isValid: boolean;
  platform: DeploymentPlatform;
  errors: string[];
  warnings: string[];
} {
  const platform = detectPlatform();
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check environment variables (only on server-side)
  if (typeof process !== "undefined" && process.env) {
    const requiredEnvVars = [
      "WEB3FORMS_ACCESS_KEY",
      "GEMINI_API_KEY",
      "OPENROUTER_API_KEY",
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        errors.push(`Missing environment variable: ${envVar}`);
      }
    }
  }

  // Platform-specific checks (only on server-side)
  if (
    typeof process !== "undefined" &&
    process.env &&
    typeof window === "undefined"
  ) {
    if (platform === "netlify") {
      if (!process.env.NETLIFY) {
        warnings.push(
          "Not detected as Netlify environment but expecting Netlify functions",
        );
      }
    } else if (platform === "vercel") {
      if (!process.env.VERCEL) {
        warnings.push(
          "Not detected as Vercel environment but expecting Vercel API routes",
        );
      }
    }
  }

  // Client-side validation
  if (typeof window !== "undefined") {
    if (platform === "netlify") {
      // Try to validate that Netlify functions are accessible
      const endpoints = getApiEndpoints();
      if (!endpoints.gemini.includes("/.netlify/functions/")) {
        errors.push(
          "Netlify platform detected but endpoint doesn't use Netlify functions path",
        );
      }
    }
  }

  return {
    isValid: errors.length === 0,
    platform,
    errors,
    warnings,
  };
}

/**
 * Helper function to determine the best platform for deployment
 */
export function getRecommendedPlatform(): {
  platform: DeploymentPlatform;
  reasons: string[];
} {
  const reasons: string[] = [];

  // Check for existing platform indicators
  if (
    (typeof process !== "undefined" && process.env?.NETLIFY) ||
    (typeof window !== "undefined" &&
      window.location.hostname.includes("netlify"))
  ) {
    reasons.push("Netlify environment detected");
    return { platform: "netlify", reasons };
  }

  if (
    (typeof process !== "undefined" && process.env?.VERCEL) ||
    (typeof window !== "undefined" &&
      window.location.hostname.includes("vercel"))
  ) {
    reasons.push("Vercel environment detected");
    return { platform: "vercel", reasons };
  }

  // Default recommendation
  reasons.push(
    "Next.js API routes provide better compatibility across platforms",
  );
  reasons.push("Vercel offers longer timeout limits for AI requests");
  reasons.push("Better TypeScript integration with Next.js");

  return { platform: "vercel", reasons };
}

/**
 * Debug helper - Call this in browser console to check platform detection
 * Usage: window.checkPlatform()
 */
if (typeof window !== "undefined") {
  window.checkPlatform = () => {
    const info = getPlatformDebugInfo();
    console.log("=== Platform Detection Debug Info ===");
    console.log("Detected Platform:", info.platform);
    console.log("Hostname:", info.hostname);
    console.log("URL:", info.url);
    console.log("Endpoints:", info.endpoints);
    console.log("Detection Checks:", info.detectionChecks);
    console.log("Environment Variables:", info.environmentVars);
    console.log("====================================");
    return info;
  };
}
