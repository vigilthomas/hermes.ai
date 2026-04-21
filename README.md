# Hermes AI 🧭

A sophisticated, AI-powered job search aggregator and career assistant.

## Features
- **Multi-Source Aggregation**: Fetch jobs from LinkedIn, Indeed, Glassdoor, and specific career portals.
- **Smart Resume Parsing**: Upload your resume to auto-extract skills and preferences.
- **AI Gap Analysis**: Powered by Groq/Gemini, get real-time feedback on how well you match a role.
- **Micro-Learning Recommendations**: Get actionable advice on how to close skill gaps.
- **Tailored AI Actions**: Auto-generate cover letters, tailor resumes, and find similar companies.
- **PWA Ready**: Install as a mobile app for on-the-go searching.
- **Persistence**: Bookmarks and applications synced via Supabase.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4, Motion (Animations)
- **UI Components**: shadcn/ui
- **AI Models**: Groq (Llama 3.3), Google Gemini 3 Flash
- **Search & Crawling**: Tavily Search, Firecrawler
- **Database/Auth**: Supabase

## Setup & API Keys

To use the full potential of CareerCompass AI, you need the following API keys. Add them to your environment variables in the AI Studio Secrets panel.

### 1. Groq (Fast AI Inference)
- **Get Key**: [Groq Console](https://console.groq.com/keys)
- **Variable**: `GROQ_API_KEY`

### 2. Tavily (Smart Search)
- **Get Key**: [Tavily Dashboard](https://tavily.com/)
- **Variable**: `TAVILY_API_KEY`

### 3. Firecrawler (Deep Crawling)
- **Get Key**: [Firecrawler](https://firecrawler.dev/)
- **Variable**: `FIRECRAWLER_API_KEY`

### 4. Supabase (Database)
- **Setup**: Create a project on [Supabase](https://supabase.com/)
- **Variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **SQL Setup**: Run the SQL script found in `src/lib/supabase.ts` in your Supabase SQL Editor.

### 5. Gemini API (Default fallback)
- Handle by AI Studio automatically via `GEMINI_API_KEY`.

## Development
```bash
npm install
npm run dev
```

## Production
```bash
npm run build
```
