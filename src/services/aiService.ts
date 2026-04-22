import axios from "axios";

const AI_MODEL_API_KEY = process.env.AI_MODEL_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || "llama-3.3-70b-versatile";
const API_URL =
  process.env.API_URL || "https://api.groq.com/openai/v1/chat/completions";

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
      const response = await axios.post(
        API_URL,
        {
          model: AI_MODEL,
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
        },
        {
          headers: { Authorization: `Bearer ${AI_MODEL_API_KEY}` },
        },
      );
      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      throw error;
    }
  },

  async parseResume(file: File): Promise<{ skills: string[]; title?: string; summary?: string }> {
    // If PDF and no Gemini key, we can't parse it properly
    if (file.type === 'application/pdf' && !GEMINI_API_KEY) {
      throw new Error(
        'PDF resume parsing requires GEMINI_API_KEY. Please add it to your .env file.',
      );
    }

    // Extract text from non-PDF files (plain text / docx treated as text)
    const text = await file.text();

    const prompt = `
      Extract structured information from this resume text.
      Return a JSON object with:
      {
        "skills": string[],
        "title": string,
        "summary": string
      }

      Resume text: ${text}
    `;

    const response = await axios.post(
      API_URL,
      {
        model: AI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      },
      {
        headers: { Authorization: `Bearer ${AI_MODEL_API_KEY}` },
      },
    );
    return JSON.parse(response.data.choices[0].message.content);
  },

  async generateContent(prompt: string) {
    try {
      const response = await axios.post(
        API_URL,
        {
          model: AI_MODEL,
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: { Authorization: `Bearer ${AI_MODEL_API_KEY}` },
        },
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Content generation failed:", error);
      return "Failed to generate content. Please check your API keys.";
    }
  },
};
