// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Users/gragh/Projects%20On%20VS%20Code/skin-herb-sanctuary-ai-feature-skin-analyzer/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/gragh/Projects%20On%20VS%20Code/skin-herb-sanctuary-ai-feature-skin-analyzer/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///C:/Users/gragh/Projects%20On%20VS%20Code/skin-herb-sanctuary-ai-feature-skin-analyzer/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\gragh\\Projects On VS Code\\skin-herb-sanctuary-ai-feature-skin-analyzer";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 8080
    },
    plugins: [
      react(),
      mode === "development" && componentTagger()
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    define: {
      // Explicitly expose env vars to client
      "process.env.NEXT_PUBLIC_GROQ_API_KEY": JSON.stringify(env.NEXT_PUBLIC_GROQ_API_KEY),
      // Alternatively for Vite's default import.meta.env:
      "import.meta.env.NEXT_PUBLIC_GROQ_API_KEY": JSON.stringify(env.NEXT_PUBLIC_GROQ_API_KEY)
    },
    optimizeDeps: {
      include: ["groq-sdk"]
      // Ensure Groq SDK is optimized
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxncmFnaFxcXFxQcm9qZWN0cyBPbiBWUyBDb2RlXFxcXHNraW4taGVyYi1zYW5jdHVhcnktYWktZmVhdHVyZS1za2luLWFuYWx5emVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxncmFnaFxcXFxQcm9qZWN0cyBPbiBWUyBDb2RlXFxcXHNraW4taGVyYi1zYW5jdHVhcnktYWktZmVhdHVyZS1za2luLWFuYWx5emVyXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9ncmFnaC9Qcm9qZWN0cyUyME9uJTIwVlMlMjBDb2RlL3NraW4taGVyYi1zYW5jdHVhcnktYWktZmVhdHVyZS1za2luLWFuYWx5emVyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIC8vIExvYWQgZW52IHZhcnMgYmFzZWQgb24gbW9kZVxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcblxuICByZXR1cm4ge1xuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogXCI6OlwiLFxuICAgICAgcG9ydDogODA4MCxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KCksXG4gICAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmIGNvbXBvbmVudFRhZ2dlcigpLFxuICAgIF0uZmlsdGVyKEJvb2xlYW4pLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgLy8gRXhwbGljaXRseSBleHBvc2UgZW52IHZhcnMgdG8gY2xpZW50XG4gICAgICAncHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfR1JPUV9BUElfS0VZJzogSlNPTi5zdHJpbmdpZnkoZW52Lk5FWFRfUFVCTElDX0dST1FfQVBJX0tFWSksXG4gICAgICAvLyBBbHRlcm5hdGl2ZWx5IGZvciBWaXRlJ3MgZGVmYXVsdCBpbXBvcnQubWV0YS5lbnY6XG4gICAgICAnaW1wb3J0Lm1ldGEuZW52Lk5FWFRfUFVCTElDX0dST1FfQVBJX0tFWSc6IEpTT04uc3RyaW5naWZ5KGVudi5ORVhUX1BVQkxJQ19HUk9RX0FQSV9LRVkpXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFsnZ3JvcS1zZGsnXSwgLy8gRW5zdXJlIEdyb3EgU0RLIGlzIG9wdGltaXplZFxuICAgIH0sXG4gIH07XG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQSthLFNBQVMsY0FBYyxlQUFlO0FBQ3JkLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFIaEMsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFFeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBRTNDLFNBQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixTQUFTLGlCQUFpQixnQkFBZ0I7QUFBQSxJQUM1QyxFQUFFLE9BQU8sT0FBTztBQUFBLElBQ2hCLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQTtBQUFBLE1BRU4sd0NBQXdDLEtBQUssVUFBVSxJQUFJLHdCQUF3QjtBQUFBO0FBQUEsTUFFbkYsNENBQTRDLEtBQUssVUFBVSxJQUFJLHdCQUF3QjtBQUFBLElBQ3pGO0FBQUEsSUFDQSxjQUFjO0FBQUEsTUFDWixTQUFTLENBQUMsVUFBVTtBQUFBO0FBQUEsSUFDdEI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
