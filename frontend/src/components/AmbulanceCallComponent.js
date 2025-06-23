// =================================================================
// 4. 上書き: frontend/src/components/AmbulanceCallComponent.js
// (電話番号表示を追加)
// =================================================================
import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const BackButton = ({ onClick }) => (
    <button onClick={onClick} className="button-back" title="戻る">
        <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{width: '30px', height: '30px'}}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
    </button>
);

const AmbulanceCallComponent = ({ step, onProceed, onGoBack }) => {
    const { settings } = useSettings();
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [summary, setSummary] = useState('');
    const [symptom, setSymptom] = useState(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [error, setError] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (!SpeechRecognition) {
            setError("お使いのブラウザは音声認識をサポートしていません。");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'ja-JP';
        recognition.interimResults = false;
        recognition.onresult = (event) => {
            const lastResult = event.results[event.results.length - 1];
            if(lastResult.isFinal) {
                setTranscript(prev => prev + lastResult[0].transcript + '。');
            }
        };
        recognition.onend = () => setIsRecording(false);
        recognition.onerror = (event) => setError(`音声認識エラー: ${event.error}`);
        recognitionRef.current = recognition;
        return () => { if (recognitionRef.current) recognitionRef.current.stop(); };
    }, []);

    if (!step) return null;

    const toggleRecording = () => {
        if (!recognitionRef.current) return;
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setTranscript('');
            setSummary('');
            setError('');
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const handleSummarize = async () => {
        if (!transcript) return;
        setIsSummarizing(true);
        setError('');
        try {
            const response = await axios.post(`${API_BASE_URL}/api/summarize`, { text: transcript });
            setSummary(response.data.summary);
            setSymptom(response.data.symptom);
        } catch (err) {
            console.error("AI要約エラー:", err);
            setError("AIによる要約に失敗しました。バックエンドの起動とAPIキーを確認してください。");
            setSymptom("Others"); 
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <div className="screen-container ambulance-container">
            <BackButton onClick={onGoBack} />
            <div className="ambulance-content">
                <h2 className="screen-header" style={{color: 'var(--danger-color)'}}>{step.message}</h2>
                <div className="call-script">
                    <p><strong>「救急です。」</strong></p>
                    <p>「住所は {settings.address || '(未設定)'} です」</p>
                    <p>「電話番号は {settings.phoneNumber || '(未設定)'} です」</p>
                    <p>「男性（女性）、〇〇歳くらいです」</p>
                </div>
                <div className="audio-input-section">
                    <p style={{fontSize: 'var(--font-size-md)'}}>「何がどうなっていますか？」</p>
                    <button onClick={toggleRecording} className={`audio-button ${isRecording ? 'is-recording' : ''}`} title={isRecording ? "停止" : "録音開始"}>
                         <svg className="mic-icon" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 016 0v8.25a3 3 0 01-3 3z" /></svg>
                    </button>
                    <p>{isRecording ? "音声認識中..." : "マイクボタンを押して話してください"}</p>
                    <div className="transcribed-text">
                        <strong>あなたの発言:</strong>
                        <p>{transcript || "（結果がここに表示されます）"}</p>
                    </div>
                    {transcript && !summary &&
                        <button className="button button-primary" onClick={handleSummarize} disabled={isSummarizing} style={{width:'auto', padding:'0.8rem 2rem', marginTop:'1rem', alignSelf: 'center'}}>
                            {isSummarizing ? "AIが要約中..." : "AIで要約する"}
                        </button>
                    }
                    {summary &&
                        <div className="summary-text">
                            <strong>AIによる要約:</strong>
                            <p>{summary}</p>
                        </div>
                    }
                     {error && <p style={{color: 'red', marginTop: '1rem'}}>{error}</p>}
                </div>
            </div>
            {summary &&
                <div className="footer-actions">
                    <button onClick={() => onProceed(symptom || 'Heat_Stroke')} className="button button-success">応急処置にうつる</button>
                </div>
            }
        </div>
    );
};
export default AmbulanceCallComponent;