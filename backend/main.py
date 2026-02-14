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
    allow_origins=["*"],
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
    You are a quirky, sarcastic but insightful AI dating expert.

    Analyze compatibility between:

    Person A: {req.user}
    Person B: {req.crush}

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


class RedFlagRequest(BaseModel):
    messages: str
    mode: str

@app.post("/redflag/text")
def redflag(req: RedFlagRequest):
    # Style prompt
    if req.mode == "delulu":
        style_prompt = """
        You are an overly dramatic, delusional, hopeless romantic AI.
        You believe in destiny, soulmates, and emotional chaos.
        You exaggerate emotions, add humor, and dramatic flair.
        """
    else:
        style_prompt = """
        You are a brutally honest, emotionally intelligent AI.
        You give harsh truths, no sugar-coating, no emotional cushioning.
        You are direct, blunt, and savage but correct.
        """

    # Prompt for structured JSON
    prompt = f"""
    {style_prompt}
    Analyze the following conversation:

    {req.messages}

    Detect:
    - Gaslighting
    - Manipulation
    - Guilt-tripping
    - Love bombing
    - Controlling behavior
    - Narcissistic traits
    - Passive aggression
    - Sexual Pressure
    - Ghosting potential
    - Abusive tendencies

    RETURN YOUR RESPONSE AS STRICT JSON:
    {{
      "score": 0-10,
      "flags": [
        {{ "name": "<flag name>", "detail": "<short description>" }}
      ],
      "analysis": [
        {{ "flag": "<flag name>", "detail": "<short text explanation>" }}
      ],
      "advice": "<advice text>"
    }}
    Only return JSON. No extra text.
    """

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    # GPT response text
    text = res.choices[0].message.content

    # Try to parse JSON safely
    try:
        parsed = json.loads(text)
    except:
        # fallback if GPT returns bad format
        parsed = {
            "score": 0,
            "flags": [],
            "analysis": [],
            "advice": text
        }

    return parsed