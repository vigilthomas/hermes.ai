import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
        manifest: {
          name: "CareerCompass AI",
          short_name: "CCompass",
          description: "AI-Powered Job Search & Career Assistant",
          theme_color: "#0f172a",
          icons: [
            {
              src: "/icon-192.svg",
              sizes: "192x192",
              type: "image/svg+xml",
              purpose: "any maskable",
            },
            {
              src: "/icon-512.svg",
              sizes: "512x512",
              type: "image/svg+xml",
              purpose: "any maskable",
            },
          ],
        },
      }),
    ],
    define: {
      // Support both VITE_-prefixed and non-prefixed env var names
      "process.env.GEMINI_API_KEY": JSON.stringify(
        env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY,
      ),
      "process.env.GROQ_API_KEY": JSON.stringify(
        env.VITE_GROQ_API_KEY || env.GROQ_API_KEY,
      ),
      "process.env.TAVILY_API_KEY": JSON.stringify(
        env.VITE_TAVILY_API_KEY || env.TAVILY_API_KEY,
      ),
      "process.env.FIRECRAWLER_API_KEY": JSON.stringify(
        env.VITE_FIRECRAWLER_API_KEY || env.FIRECRAWLER_API_KEY,
      ),
      // Legacy / additional keys
      "process.env.AI_MODEL_API_KEY": JSON.stringify(
        env.VITE_AI_MODEL_API_KEY || env.AI_MODEL_API_KEY,
      ),
      "process.env.AI_MODEL": JSON.stringify(env.AI_MODEL),
      "process.env.API_URL": JSON.stringify(env.API_URL),
      "process.env.SUPABASE_URL": JSON.stringify(env.SUPABASE_URL),
      "process.env.SUPABASE_ANON_KEY": JSON.stringify(env.SUPABASE_ANON_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== "true",
    },
  };
});
