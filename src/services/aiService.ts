import axios from 'axios';
import { GoogleGenAI } from "@google/genai";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || '' });

const GEMINI_MODEL = 'gemini-2.0-flash';

export const aiService = {
  async analyzeJobMatch(jobDescription: string, resumeText: string) {
    const prompt = `
      Compare the following job description with the resume provided.
      Return a JSON object with:
      {
        "score": number (0-100),
        "verdict": string (one paragraph),
        "greenFlags": string[],
        "redFlags": string[],
        "gapAnalysis": string,
        "matchedSkills": string[],
        "missingSkills": string[]
      }

      Job Description: ${jobDescription}
      Resume: ${resumeText}
    `;

    try {
      if (GROQ_API_KEY) {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        }, {
          headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
        });
        return JSON.parse(response.data.choices[0].message.content);
      } else {
        const result = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });
        return JSON.parse(result.text || '{}');
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
      throw error;
    }
  },

  async generateContent(prompt: string, useGroq = true) {
    try {
      if (useGroq && GROQ_API_KEY) {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }]
        }, {
          headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
        });
        return response.data.choices[0].message.content;
      } else {
        const result = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt
        });
        return result.text;
      }
    } catch (error) {
      console.error("Content generation failed:", error);
      return "Failed to generate content. Please check your API keys.";
    }
  },

  async parseResume(file: File): Promise<{ skills: string[]; title?: string; summary?: string }> {
    const extractPrompt = `
      Extract structured information from this resume document.
      Return a JSON object with:
      {
        "title": "the candidate's most recent or target job title",
        "skills": ["list", "of", "technical", "skills", "tools", "and", "frameworks"],
        "summary": "one-sentence professional summary"
      }
      Focus on technical skills: programming languages, frameworks, libraries, cloud platforms, and tools.
    `;

    try {
      if (GEMINI_API_KEY) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        const result = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: [{
            role: "user",
            parts: [
              { inlineData: { mimeType: file.type as 'application/pdf', data: base64 } },
              { text: extractPrompt }
            ]
          }],
          config: { responseMimeType: "application/json" }
        });
        return JSON.parse(result.text || '{"skills":[],"title":""}');
      } else if (GROQ_API_KEY) {
        const text = await file.text().catch(() => '');
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: `${extractPrompt}\n\nResume text:\n${text}` }],
          response_format: { type: "json_object" }
        }, {
          headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
        });
        return JSON.parse(response.data.choices[0].message.content);
      }
    } catch (error) {
      console.error("Resume parsing failed:", error);
    }
    return { skills: [], title: '' };
  }
};
