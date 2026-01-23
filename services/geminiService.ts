
import { GoogleGenAI, Type } from "@google/genai";
import { LegalDraftRequest } from "../types";
import { Language } from "../translations";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLegalDraft = async (data: LegalDraftRequest, language: Language): Promise<string> => {
  const langText = language === 'hi' ? 'HINDI (Devnagari script)' : 'ENGLISH';
  
  const prompt = `
    You are an expert Indian Legal Advocate. Generate a formal legal petition based on the following details. 
    THE ENTIRE PETITION MUST BE WRITTEN IN ${langText}.
    
    Type: ${data.petitionType}
    Petitioner: ${data.petitioner.name}, Age: ${data.petitioner.age}, Resident of: ${data.petitioner.address}
    Respondent: ${data.respondent.name}, Resident of: ${data.respondent.address}
    Jurisdiction:
      - Territorial: ${data.jurisdiction.territorial}
      - Pecuniary: ${data.jurisdiction.pecuniary}
    Cause of Action: ${data.causeOfAction}
    
    The document MUST follow standard Indian Court formatting:
    1. Name of the Court (Header)
    2. Case Number (Placeholder: Case No. ____ of 202X)
    3. Parties' Information (Petitioner vs Respondent)
    4. Heading of the Petition
    5. Facts of the Case (Numbered points)
    6. Cause of Action details
    7. Jurisdiction statement
    8. Valuations for Court Fees
    9. Prayer (The specific relief sought)
    10. Verification Section
    
    Use formal, authoritative legal language suitable for Indian Courts. If writing in Hindi, use formal "Shuddh Hindi" legal terminology.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    return response.text || "Failed to generate draft. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to communicate with the legal intelligence engine.");
  }
};
