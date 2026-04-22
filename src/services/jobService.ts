import axios from 'axios';
import { GoogleGenAI } from "@google/genai";
import { Job } from '../types';

const TAVILY_API_KEY = import.meta.env.VITE_TAVILY_API_KEY || process.env.TAVILY_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || '' });

const JOB_PARSE_PROMPT = (results: object[]) => `
Parse these web search results into structured job listings.
Return a JSON object with a "jobs" array. Each job must have:
- id: unique string (e.g. "job-1")
- title: job title string
- company: { name, hq (city if found), industry (if found), remotePolicy ("Remote-First"|"Hybrid"|"On-site") }
- location: city/state or "Remote"
- source: one of "LinkedIn" | "Indeed" | "Glassdoor" | "Naukri" | "CareerPage"
- type: one of "Full-time" | "Part-time" | "Contract" | "Remote" | "Hybrid"
- seniority: one of "Entry" | "Mid" | "Senior" | "Lead" | "Director"
- postedAt: ISO date string (use today if unknown: ${new Date().toISOString()})
- description: 1-2 sentence summary from the content
- responsibilities: array of 3-5 strings (extract or infer from description)
- requirements: array of 3-5 strings (extract or infer from description)
- skills: array of { name: string, isMatched: false }
- applyUrl: the result's URL
- perks: array of strings (extract if mentioned, otherwise empty array)
- salary: include only if salary is explicitly mentioned: { min, max, currency, period: "yearly" }

Return ONLY the JSON object. No markdown fences.

Search Results:
${JSON.stringify(results.map((r: any) => ({ title: r.title, url: r.url, content: r.content })))}
`;

async function parseResultsWithAI(results: object[]): Promise<Job[]> {
  const prompt = JOB_PARSE_PROMPT(results);
  try {
    if (GROQ_API_KEY) {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 4096
      }, {
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
      });
      const parsed = JSON.parse(response.data.choices[0].message.content);
      return Array.isArray(parsed) ? parsed : (parsed.jobs || []);
    } else if (GEMINI_API_KEY) {
      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const parsed = JSON.parse(result.text || '{"jobs":[]}');
      return Array.isArray(parsed) ? parsed : (parsed.jobs || []);
    }
  } catch (error) {
    console.error('Failed to parse job results with AI:', error);
  }
  return [];
}

export const jobService = {
  async searchJobs(query: string, location: string): Promise<Job[]> {
    if (!TAVILY_API_KEY) {
      console.warn('TAVILY_API_KEY not configured. Add it to your .env file to enable job search.');
      return [];
    }

    const searchQuery = [
      query || 'software engineer',
      location ? `in ${location}` : '',
      'job opening'
    ].filter(Boolean).join(' ');

    try {
      const resp = await axios.post('https://api.tavily.com/search', {
        api_key: TAVILY_API_KEY,
        query: searchQuery,
        search_depth: "advanced",
        max_results: 8,
        include_domains: [
          "linkedin.com", "indeed.com", "glassdoor.com",
          "greenhouse.io", "lever.co", "workday.com", "jobs.ashbyhq.com"
        ]
      });

      const results: object[] = resp.data?.results ?? [];
      if (!results.length) return [];

      return await parseResultsWithAI(results);
    } catch (error) {
      console.error('Job search failed:', error);
      return [];
    }
  }
};
