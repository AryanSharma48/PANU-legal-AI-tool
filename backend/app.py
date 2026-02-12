import os
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


# --- PYDANTIC MODELS ---

class ProfileCreate(BaseModel):
    id: str  # Supabase auth user ID (UUID)
    email: str
    full_name: Optional[str] = ""
    address: Optional[str] = ""
    phone: Optional[str] = ""
    avatar_url: Optional[str] = ""


class PetitionerInfo(BaseModel):
    name: str
    address: str
    age: int


class RespondentInfo(BaseModel):
    name: str
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
    allow_origins=["*"],
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

@app.post("/api/profile")
async def upsert_profile(profile: ProfileCreate):
    """Create or update a user profile after login."""
    try:
        data = {
            "id": profile.id,
            "email": profile.email,
            "full_name": profile.full_name or "",
            "address": profile.address or "",
            "phone": profile.phone or "",
            "avatar_url": profile.avatar_url or "",
            "updated_at": "now()",
        }
        
        result = supabase.table("profiles").upsert(data, on_conflict="id").execute()
        return {"msg": "Profile saved", "data": result.data}
    except Exception as e:
        print(f"❌ Profile upsert error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/profile/{user_id}")
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

@app.post("/api/generate-draft")
async def generate_draft(req: DraftRequest):
    """Generate a legal petition draft using Gemini AI."""
    try:
        data = req.data
        language = req.language

        if not data:
            raise HTTPException(status_code=400, detail="Missing petition data")

        lang_text = "HINDI (Devnagari script)" if language == "hi" else "ENGLISH"

        prompt = f"""
You are an expert Indian Legal Advocate.

THE ENTIRE PETITION MUST BE WRITTEN IN {lang_text}.

Type: {data.get('petitionType')}
Petitioner: {data['petitioner']['name']}, Age: {data['petitioner']['age']}, Resident of: {data['petitioner']['address']}
Respondent: {data['respondent']['name']}, Resident of: {data['respondent']['address']}

Jurisdiction:
- Territorial: {data['jurisdiction']['territorial']}
- Pecuniary: {data['jurisdiction']['pecuniary']}

Cause of Action:
{data.get('causeOfAction')}

Follow standard Indian court petition format.
"""

        model = genai.GenerativeModel("gemini-1.0-pro")
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


# --- HEALTH CHECK ---

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "PANU Legal AI"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)