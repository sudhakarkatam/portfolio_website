/**
 * Platform detection utilities for serverless deployments
 * Supports both Netlify Functions and Vercel API Routes for maximum deployment flexibility
 */

export type DeploymentPlatform = "netlify" | "vercel" | "local";

/**
 * Detects the current deployment platform
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

  // Client-side - check hostname and URL patterns
  const hostname = window.location.hostname;
  const url = window.location.href;

  // Netlify detection
  if (
    hostname.includes("netlify.app") ||
    hostname.includes("netlify.com") ||
    url.includes("/.netlify/functions/")
  ) {
    return "netlify";
  }

  // Vercel detection
  if (hostname.includes("vercel.app") || hostname.includes("vercel.com")) {
    return "vercel";
  }

  // Local development detection - but check if dev server is running
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.endsWith(".local")
  ) {
    return "local";
  }

  // Default to Vercel (Next.js API routes work everywhere)
  return "vercel";
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
    userAgent:
      typeof window !== "undefined" ? navigator.userAgent : "server-side",
    environmentVars: {
      NETLIFY:
        (typeof process !== "undefined" && process.env?.NETLIFY) || false,
      VERCEL: (typeof process !== "undefined" && process.env?.VERCEL) || false,
      NODE_ENV:
        (typeof process !== "undefined" && process.env?.NODE_ENV) || "unknown",
    },
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
