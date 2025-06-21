# =================================================================
# 3. 上書き: backend/app/main.py
# (summarizeエンドポイントの戻り値を変更)
# =================================================================
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import Step, SummarizeRequest, SummarizeResponse
from .scenarios import SCENARIO_DATA
from . import services

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/step/{step_id}", response_model=Step)
async def get_step(step_id: str):
    if step_id not in SCENARIO_DATA:
        raise HTTPException(status_code=404, detail="Step not found")
    return SCENARIO_DATA[step_id]

@app.post("/api/summarize", response_model=SummarizeResponse)
async def summarize_symptom(request: SummarizeRequest):
    """
    受け取ったテキストをAIで要約・分類して返す
    """
    summary, symptom = await services.summarize_and_classify_symptom(request.text)
    return SummarizeResponse(summary=summary, symptom=symptom)

@app.get("/")
def read_root():
    return {"message": "Emergency Navi API is running."}