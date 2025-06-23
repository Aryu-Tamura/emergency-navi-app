// =================================================================
// 3. 上書き: frontend/src/components/InstructionComponent.js
// (ブラウザ標準のTTSからOpenAI TTSに置き換え)
// =================================================================
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const BackButton = ({ onClick }) => (
    <button onClick={onClick} className="button-back" title="戻る">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{width: '30px', height: '30px'}}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
    </button>
);

const instructions = [
    { number: 1, text: "涼しい場所へ避難させます。エアコンが効いた室内や、風通しの良い日陰に移動してください。" },
    { number: 2, text: "衣服をゆるめます。熱がこもらないように、ベルトやネクタイをゆるめてください。" },
    { number: 3, text: "体を冷やします。濡らしたタオルや氷のうを、首の周り、脇の下、足の付け根に当ててください。" },
    { number: 4, text: "水分を補給します。意識がはっきりしていれば、冷たい水や経口補水液を少しずつ飲ませてください。" }
];

const InstructionComponent = ({ step, onGoBack, onGoHome }) => {
    const [audioUrl, setAudioUrl] = useState(null);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (step) {
            const fetchAudio = async () => {
                setIsLoadingAudio(true);
                // 読み上げるテキストを結合
                const title = `${step.message}の応急処置を開始します。`;
                const allInstructions = instructions.map(i => `手順${i.number}。${i.text}`).join(' ');
                const textToSpeak = `${title} ${allInstructions}`;

                try {
                    // バックエンドに音声生成をリクエスト
                    const response = await axios.post(`${API_BASE_URL}/api/speak`, 
                        { text: textToSpeak },
                        { responseType: 'blob' } // 音声データをblobとして受け取る
                    );
                    
                    // 受け取った音声データからURLを生成
                    const url = URL.createObjectURL(response.data);
                    setAudioUrl(url);

                } catch (error) {
                    console.error("音声の生成に失敗しました:", error);
                } finally {
                    setIsLoadingAudio(false);
                }
            };
            fetchAudio();
        }
        
        // コンポーネントがアンマウントされる時にURLを解放
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        }
    }, [step]);

    if (!step) return null;

    return (
        <div className="screen-container">
            <BackButton onClick={onGoBack} />
            <div className="instruction-content">
                <h2 className="screen-header">{step.message}</h2>
                <div className="instruction-list">
                    {instructions.map(item => (
                        <div key={item.number} className="instruction-list-item">
                            <div className="number">{item.number}</div>
                            <div className="text">{item.text}</div>
                        </div>
                    ))}
                </div>
            </div>
             {/* 音声再生用の非表示要素 */}
            {isLoadingAudio && <p>音声を生成中...</p>}
            {audioUrl && <audio ref={audioRef} src={audioUrl} autoPlay />}
            
            <div className="footer-actions">
                 <button onClick={onGoHome} className="button button-primary">ホーム画面に戻る</button>
            </div>
        </div>
    );
};
export default InstructionComponent;