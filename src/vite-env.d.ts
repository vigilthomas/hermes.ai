/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GROQ_API_KEY: string
  readonly VITE_FIRECRAWLER_API_KEY: string
  readonly VITE_TAVILY_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
