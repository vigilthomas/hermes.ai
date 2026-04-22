/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly AI_MODEL_API_KEY: string;
  readonly FIRECRAWLER_API_KEY: string;
  readonly TAVILY_API_KEY: string;
  readonly AI_MODEL: string;
  readonly API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
