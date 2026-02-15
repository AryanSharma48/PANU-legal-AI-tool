import os
import json
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from dotenv import load_dotenv
load_dotenv()

import google.generativeai as genai
from supabase import create_client, Client

# --- CONFIG ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

# Supabase admin client (server-side, uses secret key)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)

print("✅ Supabase URL:", SUPABASE_URL)
print("✅ Gemini API Key found:", bool(GEMINI_API_KEY))


SYSTEM_PROMPT = """
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
"""


# --- PYDANTIC MODELS ---

class ProfileCreate(BaseModel):
    id: str  # Supabase auth user ID (UUID)
    email: str
    full_name: Optional[str] = ""
    address: Optional[str] = ""
    phone: Optional[str] = ""
    age: Optional[int] = 0
    jurisdiction: Optional[str] = ""
    avatar_url: Optional[str] = ""


class PetitionerInfo(BaseModel):
    name: str
    parentOrSpouseName: Optional[str] = ""
    address: str
    age: int


class RespondentInfo(BaseModel):
    name: str
    parentOrSpouseName: Optional[str] = ""
    address: str


class JurisdictionInfo(BaseModel):
    territorial: str
    pecuniary: str


class DraftRequest(BaseModel):
    data: dict
    language: str = "en"


# --- APP ---

app = FastAPI(title="PANU Legal AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://panu.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- HELPER: Get current user from Supabase JWT ---

async def get_current_user(request: Request) -> dict:
    """Extract and verify the Supabase JWT from the Authorization header."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = auth_header.split(" ")[1]
    try:
        user_response = supabase.auth.get_user(token)
        return user_response.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


# --- PROFILE ROUTES ---

@app.post("api/profile")
async def upsert_profile(profile: ProfileCreate):
    """Create or update a user profile after login."""
    try:
        data = {
            "id": profile.id,
            "email": profile.email,
            "full_name": profile.full_name or "",
            "address": profile.address or "",
            "phone": profile.phone or "",
            "age": profile.age or 0,
            "jurisdiction": profile.jurisdiction or "",
            "avatar_url": profile.avatar_url or "",
            "updated_at": "now()",
        }
        
        result = supabase.table("profiles").upsert(data, on_conflict="id").execute()
        return {"msg": "Profile saved", "data": result.data}
    except Exception as e:
        print(f"❌ Profile upsert error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("api/profile/{user_id}")
async def get_profile(user_id: str):
    """Get a user's profile by their Supabase auth ID."""
    try:
        result = supabase.table("profiles").select("*").eq("id", user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Profile fetch error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# --- DRAFT GENERATION ROUTE ---

@app.post("api/generate-draft")
async def generate_draft(req: DraftRequest):
    """Generate a legal petition draft using Gemini AI."""
    try:
        data = req.data
        language = req.language

        if not data:
            raise HTTPException(status_code=400, detail="Missing petition data")

        user_prompt = f"""
Generate the legal draft based on the following:

Language Required: {language}

Case Details (JSON):
{json.dumps(data, indent=2)}
"""

        prompt = f"{SYSTEM_PROMPT}\n\n{user_prompt}"

        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        draft = response.text

        if not draft or len(draft.strip()) < 50:
            raise HTTPException(status_code=502, detail="Empty draft generated")

        return {"draft": draft}

    except HTTPException:
        raise
    except Exception as e:
        print("🔥 Draft generation error:", e)
        raise HTTPException(status_code=500, detail=str(e))


# --- DRAFTS STORAGE ---
# 
# CREATE THIS TABLE IN SUPABASE SQL EDITOR:
#
# create table if not exists drafts (
#   id uuid default gen_random_uuid() primary key,
#   user_id text not null,
#   petition_type text not null,
#   draft_content text not null,
#   form_data jsonb,
#   created_at timestamptz default now()
# );
#
# -- Enable RLS (optional)
# alter table drafts enable row level security;
#

class DraftSave(BaseModel):
    user_id: str
    petition_type: str
    draft_content: str
    form_data: Optional[dict] = None


@app.post("api/drafts")
async def save_draft(draft: DraftSave):
    """Save a generated draft to the database."""
    try:
        data = {
            "user_id": draft.user_id,
            "petition_type": draft.petition_type,
            "draft_content": draft.draft_content,
            "form_data": draft.form_data or {},
        }
        result = supabase.table("drafts").insert(data).execute()
        return {"msg": "Draft saved", "data": result.data}
    except Exception as e:
        print(f"❌ Draft save error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("api/drafts/{user_id}")
async def get_drafts(user_id: str):
    """Get all drafts for a user, newest first."""
    try:
        result = (
            supabase.table("drafts")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []
    except Exception as e:
        print(f"❌ Drafts fetch error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# --- AI CHATBOT ENDPOINT ---

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)


@app.post("api/chat")
async def chat(req: ChatRequest):
    """AI Legal Assistant chatbot powered by Gemini 1.5 Flash."""
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")

        system_prompt = (
            "You are a professional Indian legal drafting assistant. "
            "Help users with their questions in an easy to understand language no heavy legal terms and really short like max words are 100. "
            "Do not fabricate laws. If unsure, say so. "
            "Be concise and helpful. Format your responses clearly."
        )

        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(f"{system_prompt}\n\nUser query: {req.message}")

        # Safely extract text from response
        ai_text = ""
        if response and response.text:
            ai_text = response.text.strip()

        if not ai_text:
            ai_text = "I'm sorry, I could not generate a response. Please try rephrasing your question."

        return {"reply": ai_text}

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Chat error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate response. Please try again.")


# --- HEALTH CHECK ---

@app.get("api/health")
async def health():
    return {"status": "ok", "service": "PANU Legal AI"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)