# =================================================================
# 2. backend/app/main.py (変更なし)
# =================================================================
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from .models import Step, SummarizeRequest, SummarizeResponse, SymptomType
from .scenarios import SCENARIO_DATA
from . import services
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SpeakRequest(BaseModel):
    text: str

@app.get("/api/step/{step_id}", response_model=Step)
async def get_step(step_id: str):
    if step_id not in SCENARIO_DATA:
        raise HTTPException(status_code=404, detail="Step not found")
    return SCENARIO_DATA[step_id]

@app.post("/api/summarize", response_model=SummarizeResponse)
async def summarize_symptom(request: SummarizeRequest):
    summary, symptom = await services.summarize_and_classify_symptom(request.text)
    return SummarizeResponse(summary=summary, symptom=symptom)

@app.post("/api/speak")
async def speak_text(request: SpeakRequest):
    audio_content = await services.generate_speech_from_text(request.text)
    if not audio_content:
        raise HTTPException(status_code=500, detail="音声の生成に失敗しました。")
    return StreamingResponse(iter([audio_content]), media_type="audio/mpeg")

@app.get("/")
def read_root():
    return {"message": "Emergency Navi API is running."}