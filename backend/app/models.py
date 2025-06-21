# =================================================================
# 1. 上書き: backend/app/models.py
# (AIからの戻り値にsymptomを追加)
# =================================================================
from pydantic import BaseModel, Field
from typing import List, Optional, Literal

StepType = Literal[
    "QUESTION", "INSTRUCTION", "AMBULANCE_CALL", "FINAL_NO_EMERGENCY"
]
SymptomType = Literal["Heat_Stroke", "Others", "No_Problem"]

class Option(BaseModel):
    text: str
    next_step_id: str

class Step(BaseModel):
    id: str
    step_type: StepType
    message: str
    question_text: Optional[str] = None
    options: Optional[List[Option]] = None
    symptom_on_arrival: Optional[SymptomType] = None
    audio_url: Optional[str] = None

class SummarizeRequest(BaseModel):
    text: str

# AIからのレスポンスを定義
class SummarizeResponse(BaseModel):
    summary: str
    symptom: SymptomType