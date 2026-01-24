// services/geminiService.ts

import { GoogleGenAI } from "@google/genai";
import { LegalDraftRequest } from "../../types";
import { Language } from "../../translations";

// Vite env variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY is missing in .env");
}

// System prompt for legal drafting
const SYSTEM_PROMPT = `
You are an expert Indian legal drafting assistant.

Your job is to draft well-structured Indian legal petitions and applications.
Follow proper Indian court formats.
Use clear headings, formal legal language, and numbered paragraphs.
Do NOT give legal advice. Only draft document.

Use legal language even for case details.

Output ONLY the draft text.

Format your response in markdown to to render on web.. i am putting directly on webpage
`;

// Init Gemini
const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

export async function generateLegalDraft(
  data: LegalDraftRequest,
  language: Language
): Promise<string> {

  const userPrompt = `
Draft a legal petition with the following details:

Language: ${language}

Case Details (JSON):
${JSON.stringify(data, null, 2)}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\n${userPrompt}`,
          },
        ],
      },
    ],
  });

  return response.text;
}
