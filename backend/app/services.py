# =================================================================
# 1. backend/app/services.py (AIの応答処理を強化)
# =================================================================
import os
import json
from dotenv import load_dotenv
import openai
from .models import SymptomType

load_dotenv()

client = openai.AsyncOpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

MODEL_NAME = "gpt-4o-mini" 

async def summarize_and_classify_symptom(text: str) -> (str, SymptomType):
    if not client.api_key:
        print("警告: OPENAI_API_KEYが設定されていません。")
        return "（AI要約機能はAPIキーが設定されていないため利用できません）", "Others"

    system_prompt = f"""
あなたは、緊急通報の内容を整理するアシスタントです。
以下の文章から、客観的な事実のみを抽出し、救急隊員に伝えるための簡潔な箇条書きの「要約」と、最も可能性の高い症状の「分類」を判断してください。

分類は以下の3つのいずれかを選択してください:
- Heat_Stroke: 熱中症、暑さ、炎天下、めまい、汗、などのキーワードが含まれる場合
- No_Problem: 明らかに緊急性が低い、または問題がないと判断される場合
- Others: 上記以外すべての場合

応答は必ず以下のJSON形式で返してください:
{{
  "summary": "ここに箇条書きの要約文",
  "symptom": "ここに分類結果（Heat_Stroke, No_Problem, Othersのいずれか）"
}}
"""
    
    try:
        chat_completion = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            model=MODEL_NAME,
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        response_text = chat_completion.choices[0].message.content
        response_data = json.loads(response_text)
        
        summary_raw = response_data.get("summary", "要約の取得に失敗しました。")
        if isinstance(summary_raw, list):
            summary = "\n".join(summary_raw)
        else:
            summary = str(summary_raw)
        
        symptom = response_data.get("symptom", "Others")

        if symptom not in ["Heat_Stroke", "No_Problem", "Others"]:
            symptom = "Others"

        return summary, symptom

    except Exception as e:
        print(f"OpenAI APIの呼び出し中にエラーが発生しました: {e}")
        return "（AIによる要約中にエラーが発生しました）", "Others"

async def generate_speech_from_text(text: str) -> bytes:
    if not client.api_key:
        print("警告: OPENAI_API_KEYが設定されていません。音声生成はスキップされます。")
        return b""

    try:
        response = await client.audio.speech.create(
            model="tts-1", voice="alloy", input=text, speed=1.1,
        )
        audio_content = await response.aread()
        return audio_content
    except Exception as e:
        print(f"OpenAI TTSの呼び出し中にエラーが発生しました: {e}")
        return b""