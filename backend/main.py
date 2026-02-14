from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from openai import OpenAI
import os
from dotenv import load_dotenv
import sys

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

@app.get("/test")
def test_ai():
    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"user","content":"Say hello in a funny way"}]
    )
    return JSONResponse(
    content={"reply": res.choices[0].message.content},
    media_type="application/json; charset=utf-8"
)


