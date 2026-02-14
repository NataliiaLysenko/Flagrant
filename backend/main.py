from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://flagrant.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "Backend running"}

class MatchRequest(BaseModel):
    user: dict
    crush: dict

@app.post("/match")
def match(req: MatchRequest):
    # Prompt GPT to return STRICT JSON
    prompt = f"""
    You are a quirky, sarcastic but insightful and poignant AI dating expert.

    Analyze compatibility between:

    Person A: {req.user}
    Person B: {req.crush}

    Be flexible - same gender can used with different dynamics.

    RETURN STRICT JSON ONLY:
    {{
      "compatibility": 0-10,
      "emotional_fit": "<short description>",
      "lifestyle_fit": "<short description>",
      "chaos_risk": "<short description>",
      "commentary": "<funny commentary>",
      "verdict": "💚 / ⚠️ / 🚩"
    }}
    Only return JSON, no extra text.
    """

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"user","content":prompt}]
    )

    text = res.choices[0].message.content.strip()

    # Remove markdown formatting if present
    if text.startswith("```"):
        text = re.sub(r"```json|```", "", text).strip()

    try:
        parsed = json.loads(text)
    except Exception as e:
        print("JSON parse error:", e)
        parsed = {
            "compatibility": 0,
            "emotional_fit": "N/A",
            "lifestyle_fit": "N/A",
            "chaos_risk": "N/A",
            "commentary": text,
            "verdict": "⚠️"
        }


    return parsed


# 1. Keep only ONE definition of the Request Model
class RedFlagRequest(BaseModel):
    messages: str
    mode: str

# 2. Improved Extraction Helper
def extract_json(text: str) -> dict:
    try:
        # Remove potential markdown code blocks
        clean_text = re.sub(r"```json|```", "", text).strip()
        # Find the first { and last }
        start_idx = clean_text.find('{')
        end_idx = clean_text.rfind('}')
        if start_idx != -1 and end_idx != -1:
            return json.loads(clean_text[start_idx:end_idx+1])
    except Exception as e:
        print(f"Parsing error: {e}")
    return None

@app.post("/redflag/text")
def redflag(req: RedFlagRequest):
    if req.mode == "delulu":
        style_prompt = """
        You are a dating behavior analyst AI.
        You infer personality traits, attachment styles, and manipulation patterns from text.
        You dramatize emotions, exaggerate humor, but never remove analytical depth.
        Sound simple, informal, gen-z friendly.
        Be sarcastic and extremely funny.
        """
    else:
        style_prompt = """
        You are a brutally honest dating behavior analyst AI.
        You infer personality traits, attachment styles, and manipulation patterns from text.
        Sound simple, informal, gen-z friendly.
        You are direct, blunt, and insightful.
        """
    prompt = f"""
    {style_prompt}
    Analyze this conversation: "{req.messages}"
    
    RETURN STRICT JSON ONLY:
    {{
        "score": 0,
        "vibe_summary": "string",
        "red_flags": [{{ "category": "string", "indicator": "string", "severity": 1, "evidence": "string", "interpretation": "string" }}],
        "translations": [{{ "user_text": "string", "ai_translation": "string" }}],
        "next_moves": {{ "pivot": "string", "slow_down": "string", "eject": "string" }}
    }}
    """

    try:
        res = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" } # <--- FORCES GPT TO SEND JSON
        )
        raw = res.choices[0].message.content
        parsed = json.loads(raw)
    except Exception as e:
        print(f"OpenAI or Parsing Error: {e}")
        parsed = {}

    # Ensure the frontend always gets the keys it expects
    return {
        "score": parsed.get("score", 0),
        "vibe_summary": parsed.get("vibe_summary", "Could not analyze this vibe."),
        "red_flags": parsed.get("red_flags", []),
        "translations": parsed.get("translations", []),
        "next_moves": parsed.get("next_moves", {
            "pivot": "Try asking a direct question.",
            "slow_down": "Take a break from replying.",
            "eject": "Ghosting is an option."
        })
    }