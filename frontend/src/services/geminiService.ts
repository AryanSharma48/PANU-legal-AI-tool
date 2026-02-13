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
You are an elite legal counsel and drafting expert practicing in the Indian Judicial System.
Your exclusive task is to generate highly professional, court-ready legal drafts based on the provided JSON data.

CRITICAL RULES:
1. NO CONVERSATION OR FILLER: Output ONLY the legal draft. Do not include greetings, explanations, or phrases like "Here is your draft".
2. NO BRANDING: Do not include any watermarks, app names, or AI branding.
3. LANGUAGE & TONE: Draft entirely in the requested language using formal, highly professional Indian legal terminology. Convert the user's raw problem explanation into objective, chronological, legal facts.
4. FORMATTING: Use Markdown. Center-align titles using standard Markdown headers (##). Use bolding (**) for emphasis. 

DYNAMIC STRUCTURE BASED ON PETITION TYPE:
Analyze the JSON data to determine the "type of petition". Adapt the structure accordingly:

- FOR ALL DRAFTS (BASE STRUCTURE):
  1. COURT HEADING: **IN THE COURT OF [Jurisdiction/Court from JSON]**
  2. CAUSE TITLE: [Petitioner Name] vs [Respondent Name]
  3. TITLE OF PETITION: e.g., **APPLICATION UNDER [Relevant Section] FOR [Relief]**
  4. OPENING: **MOST RESPECTFULLY SHOWETH:**
  5. PRAYER: Must begin with **PRAYER**. Conclude with: *"AND FOR THIS ACT OF KINDNESS, THE PETITIONER SHALL AS IN DUTY BOUND EVER PRAY."*
  6. SIGNATURE & VERIFICATION: Standard Indian verification clause at the bottom.

- IF CIVIL SUIT / RECOVERY:
  - Must include numbered paragraphs specifically titled or detailing: **Cause of Action**, **Jurisdiction**, and **Valuation & Court Fee** (using the 'amount' from JSON).

- IF CRIMINAL BAIL / COMPLAINT:
  - Prominently feature the FIR Number, Police Station, and Sections (BNS/BNSS or IPC/CrPC) at the top. Focus paragraphs on liberty, presumption of innocence, or exact timeline of the offense.

- IF WRIT PETITION (HIGH COURT/SUPREME COURT):
  - Must include a **SYNOPSIS & LIST OF DATES** before the Court Heading. 
  - Body must be divided into **FACTS** and **GROUNDS**.

- IF FAMILY/MATRIMONIAL:
  - Include exact dates of marriage, separation, and statutory grounds for relief.

INSTRUCTIONS: Synthesize the provided JSON data into this exact structure. Leave blank lines (____) for missing specific details so the user can fill them in later.
`;

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

export async function generateLegalDraft(
  data: LegalDraftRequest,
  language: Language
): Promise<string> {

  // Build extra context based on petition type
  let caseSpecificInfo = '';
  if (data.petitionType === 'Criminal') {
    if (data.firNumber) caseSpecificInfo += `\nFIR Number: ${data.firNumber}`;
    if (data.policeStation) caseSpecificInfo += `\nPolice Station: ${data.policeStation}`;
    if (data.custodyStatus) caseSpecificInfo += `\nCustody Status: ${data.custodyStatus === 'judicial_custody' ? 'Accused is in Judicial Custody' : 'Applying for Anticipatory Bail'}`;
  } else if (data.petitionType === 'Civil') {
    if (data.dateOfCauseOfAction) caseSpecificInfo += `\nDate of Cause of Action: ${data.dateOfCauseOfAction}`;
  } else if (data.petitionType === 'Family') {
    if (data.dateOfMarriage) caseSpecificInfo += `\nDate of Marriage: ${data.dateOfMarriage}`;
  }

  const userPrompt = `
Generate the legal draft based on the following:

Language Required: ${language}

Case Details (JSON):
${JSON.stringify(data, null, 2)}
`;

  try {
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
      config: {
        temperature: 0.2,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating legal draft:", error);
    throw new Error("Failed to generate legal draft. Please try again.");
  }
}