from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from openai import OpenAI
import os
from dotenv import load_dotenv
import sys
from pydantic import BaseModel

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
    prompt = f"""
        You are a quirky, sarcastic but insightful AI dating expert.

        Analyze compatibility between:

        Person A: {req.user}

        Person B: {req.crush}

        Give:
        1. Compatibility score (0–10)
        2. Emotional fit
        3. Lifestyle fit
        4. Chaos risk
        5. Dating advice for Person A (what can the first date be like)
        6. Final verdict (💚⚠️🚩)
    """

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"user","content":prompt}]
    )

    return {"result": res.choices[0].message.content}

class RedFlagRequest(BaseModel):
    messages: str
    mode: str 

@app.post("/redflag/text")
def redflag(req: RedFlagRequest):

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

        Return:
        1. Red flag severity score (0–10)
        2. Detected red flags
        3. Short analysis on the message (key points with text evidence)
        4. Advice on whether user should continue seeing this person
     """

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"user","content":prompt}]
    )

    return {"analysis": res.choices[0].message.content}


