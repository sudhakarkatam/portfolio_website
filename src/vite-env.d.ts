/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Client-side environment variables are no longer needed
  // API keys are now handled securely by server-side API routes
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
