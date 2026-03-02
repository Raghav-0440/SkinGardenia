import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars based on mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Explicitly expose env vars to client
      'process.env.NEXT_PUBLIC_GROQ_API_KEY': JSON.stringify(env.NEXT_PUBLIC_GROQ_API_KEY),
      // Alternatively for Vite's default import.meta.env:
      'import.meta.env.NEXT_PUBLIC_GROQ_API_KEY': JSON.stringify(env.NEXT_PUBLIC_GROQ_API_KEY)
    },
    optimizeDeps: {
      include: ['groq-sdk'], // Ensure Groq SDK is optimized
    },
  };
});