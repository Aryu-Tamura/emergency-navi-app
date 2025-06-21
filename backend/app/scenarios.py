# scenarios.py
# このファイルに緊急対応のフローチャートをデータとして定義します。
# keyがStepのIDに対応します。

SCENARIO_DATA = {
    "start": {
        "id": "start",
        "step_type": "QUESTION",
        "message": "意識はありますか？",
        "question_text": "以下の症状で、当てはまるものはありますか。",
        "options": [
            {"text": "呼吸をしていない。息がない。", "next_step_id": "call_ambulance_critical"},
            {"text": "脈がない。心臓が止まっている。", "next_step_id": "call_ambulance_critical"},
            {"text": "水没している。沈んでいる。", "next_step_id": "call_ambulance_critical"},
            {"text": "冷たくなっている。", "next_step_id": "call_ambulance_critical"},
            {"text": "どれにもあてはまらない", "next_step_id": "q_can_speak"},
        ]
    },
    "call_ambulance_critical": {
        "id": "call_ambulance_critical",
        "step_type": "AMBULANCE_CALL",
        "message": "今すぐ救急車を呼びましょう。",
        "symptom_on_arrival": "Others" # 現状はOthersに分類
    },
    "q_can_speak": {
        "id": "q_can_speak",
        "step_type": "QUESTION",
        "message": "会話はできますか？",
        "question_text": "（いつもどおり）ふつうにしゃべれていますか？声は出せていますか？",
        "options": [
            {"text": "はい", "next_step_id": "q_breathing_hard"},
            {"text": "いいえ", "next_step_id": "call_ambulance_critical"},
        ]
    },
    "q_breathing_hard": {
        "id": "q_breathing_hard",
        "step_type": "QUESTION",
        "message": "呼吸の状態は？",
        "question_text": "ハアハアしますか（ハアハアしていますか）？ 息は苦しい（苦しそう）ですか？",
        "options": [
            {"text": "はい", "next_step_id": "q_face_color"},
            {"text": "いいえ", "next_step_id": "q_can_respond"},
        ]
    },
    "q_face_color": {
        "id": "q_face_color",
        "step_type": "QUESTION",
        "message": "顔色は？",
        "question_text": "顔色、唇、耳の色が悪いですか？ 冷や汗をかいていますか？",
        "options": [
            {"text": "はい", "next_step_id": "call_ambulance_critical"},
            {"text": "いいえ", "next_step_id": "q_can_respond"}, # 元のフローだと分岐が曖昧なため、一旦こちらへ
        ]
    },
    "q_can_respond": {
        "id": "q_can_respond",
        "step_type": "QUESTION",
        "message": "受け答えは？",
        "question_text": "しっかりと受け答えができていますか？",
        "options": [
            {"text": "はい", "next_step_id": "final_no_emergency"},
            {"text": "いいえ", "next_step_id": "call_ambulance_critical"},
        ]
    },
    "final_no_emergency": {
        "id": "final_no_emergency",
        "step_type": "FINAL_NO_EMERGENCY",
        "message": "緊急ではありませんが、医療機関を受診しましょう。",
        "symptom_on_arrival": "No_Problem"
    },
    # ... 今後、熱中症などのシナリオもここに追加していく ...
    # 例： "heatstroke_q_breathing": { ... }
}