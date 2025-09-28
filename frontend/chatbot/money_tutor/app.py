import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY in .env")

client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI(title="MoneyTutor (Python)")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- sanity check route ---
@app.get("/ping")
def ping():
    return {"message": "pong"}

SYSTEM_PROMPT = (
    "You are MoneyTutor, a friendly financial literacy educator. "
    "Explain concepts simply with tiny examples. "
    "Never give personalized investment advice. "
    "Always end with: 'Educational information, not financial advice.'"
)

class AskRequest(BaseModel):
    question: str = Field(min_length=1)

class AskResponse(BaseModel):
    answer: str

@app.post("/api/ask", response_model=AskResponse)
def ask(req: AskRequest):
    try:
        rsp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": req.question},
            ],
            temperature=0.3,
        )
        return {"answer": rsp.choices[0].message.content}
    except Exception as e:
        raise HTTPException(500, f"Model call failed: {e}")
