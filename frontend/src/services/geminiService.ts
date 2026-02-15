// services/geminiService.ts

import { LegalDraftRequest } from "../../types";
import { Language } from "../../translations";

// API URL for backend generation endpoint.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function generateLegalDraft(
  data: LegalDraftRequest,
  language: Language
): Promise<string> {
  try {
    const res = await fetch(`${API_URL}/api/generate-draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, language }),
    });

    if (!res.ok) {
      const message = await res.text();
      throw new Error(message || "Failed to generate legal draft");
    }

    const payload = await res.json();
    return payload.draft;
  } catch (error) {
    console.error("Error generating legal draft:", error);
    throw new Error("Failed to generate legal draft. Please try again.");
  }
}