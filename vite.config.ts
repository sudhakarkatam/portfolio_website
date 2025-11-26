import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("Proxy error:", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              console.log("Sending Request to the Target:", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log(
                "Received Response from the Target:",
                proxyRes.statusCode,
                req.url,
              );
            });
          },
        },
      },
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: false,
      minify: "esbuild",
      target: "es2020",
      rollupOptions: {
        output: {
          format: "es",
          entryFileNames: "assets/[name].[hash].js",
          chunkFileNames: "assets/[name].[hash].js",
          assetFileNames: "assets/[name].[hash].[ext]",
          manualChunks: {
            vendor: ["react", "react-dom"],
            ui: [
              "@radix-ui/react-accordion",
              "@radix-ui/react-alert-dialog",
              "@radix-ui/react-avatar",
            ],
          },
        },
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "framer-motion"],
    },
    define: {
      'process.env.WEB3FORMS_ACCESS_KEY': JSON.stringify(env.WEB3FORMS_ACCESS_KEY)
    }
  };
});
