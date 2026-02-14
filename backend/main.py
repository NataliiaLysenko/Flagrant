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
    allow_origins=["https://flagrant.vercel.app"],
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
    You are a quirky, sarcastic but insightful and humorous AI dating expert.

    Analyze compatibility between:

    Person A: {req.user}
    Person B: {req.crush}

    Be flexible and open - same gender can used with different dynamics, or how different zodiac signs can interact in unexpected ways. Consider emotional needs, lifestyle preferences, communication styles, and potential red flags.

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
        You are a delusional, hopeless romantic AI who believes the bare minimum is elite treatment.
        You sound soft, supportive, slightly naive, Gen-Z friendly, funny, and optimistic.
        You initially justify the other person's behavior and try to interpret it as care/passion.
        You may still notice issues, but you frame them gently as "attachment activation" or "big feelings".
        You DO NOT panic the user. You avoid harsh labels like "abusive" unless it's truly extreme.
        """

        scoring_rules = """
        SCORING MODE: DELULU (downplay severity)
        "score" is a RED FLAG SEVERITY SCORE where 0=green and 10=red, BUT you are biased optimistic:
        - If the chat is mildly concerning, keep score low (0-3).
        - If the chat is clearly manipulative/controlling, keep score moderate (4-6) unless there are threats/coercion.
        - Only use 7-10 if there are explicit threats, stalking/surveillance, coercion, or repeated severe patterns.
        Also: your red_flags "interpretation" should include a charitable explanation FIRST, then a gentle reality check.
        Example interpretation style: "okay wait… maybe he just cares… BUT this could become controlling."
        """
        interpretation_rules = """
        INTERPRETATION STYLE (DELULU):
        For each red flag:
        1) Start with a justification/benefit-of-doubt sentence (romantic/optimistic).
        2) Then add a subtle concern sentence (gentle warning).
        Keep it funny, not scary.
        """
    elif req.mode == "big_sis":
        style_prompt = """
        You are a calm, emotionally intelligent big sister AI mediator.
        You care about the user's well-being.
        You are honest but never cruel.
        You don't romanticize red flags and you don't exaggerate.
        You explain clearly, logically, and give practical next steps.
        Tone: grounded, warm but firm, mature, direct.
        """

        scoring_rules = """
        SCORING MODE: BIG SIS (balanced accuracy)
        "score" is a RED FLAG SEVERITY SCORE:
        - 0 = extremely green / emotionally safe
        - 10 = extremely red flag / emotionally unsafe
        Choose an integer 0-10 based on evidence.
        Be fair: do not inflate or downplay.
        """
        interpretation_rules = """
        INTERPRETATION STYLE (BIG SIS):
        For each red flag:
        - Explain what happened + why it matters (clear, calm).
        - Offer a boundary or communication script (practical).
        No sarcasm, no cruelty.
        """
    else:
        style_prompt = """
        You are a brutally honest dating behavior analyst AI.
        You are a brutally honest dating behavior analyst AI.
        You infer manipulation patterns and do not sugar-coat.
        Tone: blunt, savage, funny, Gen-Z, extremely direct.
        You call out tactics clearly and prioritize user safety.
        """
        scoring_rules = """
        SCORING MODE: BRUTAL (strict severity)
        "score" is a RED FLAG SEVERITY SCORE (0 green → 10 red), but you are pessimistic/strict:
        - If there are any control/guilt/gaslighting indicators, do not give below 4.
        - If there is repeated manipulation, push to 7-9.
        - Use 10 for threats/coercion/stalking/explicit abuse patterns.
        """
        interpretation_rules = """
        INTERPRETATION STYLE (BRUTAL):
        For each red flag:
        - Name it directly.
        - Explain the tactic in one sentence.
        - Give a blunt recommendation.
        You can be sarcastic, but still specific and evidence-based.
        """
    prompt = f"""
    {style_prompt}
    Analyze this conversation (quote evidence exactly):

    {req.messages}

    {scoring_rules}

    DETECT (if present):
    - Gaslighting
    - Manipulation
    - Guilt-tripping
    - Love bombing
    - Controlling behavior
    - Narcissistic traits
    - Passive aggression
    - Sexual pressure
    - Ghosting potential
    - Abusive tendencies

    RETURN STRICT JSON ONLY:
    {{
    "score": 0,
    "vibe_summary": "string",
    "red_flags": [
        {{
        "category": "string",
        "indicator": "string",
        "severity": 1,
        "evidence": "string",
        "interpretation": "string"
        }}
    ],
    "translations": [
        {{ "user_text": "string", "ai_translation": "string" }}
    ],
    "next_moves": {{
        "pivot": "string",
        "slow_down": "string",
        "eject": "string"
    }}
    }}

    RULES:
    - score must follow THIS mode's scoring rules.
    - severity in each red_flags item is 1-5 (5 worst) and must match the mode's bias.
    - evidence MUST be a short exact quote from the conversation.
    - vibe_summary should match the mode's personality.
    {interpretation_rules}
    - Return ONLY valid JSON. No markdown. No extra text.
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