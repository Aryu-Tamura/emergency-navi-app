// =================================================================
// 9. 上書き: frontend/src/components/InstructionComponent.js
// =================================================================
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

const InstructionComponent = ({ step, onGoBack }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if ('speechSynthesis' in window && step) {
            window.speechSynthesis.cancel();
            
            const utteranceTitle = new SpeechSynthesisUtterance(`${step.message}の応急処置を開始します。`);
            utteranceTitle.lang = 'ja-JP';
            window.speechSynthesis.speak(utteranceTitle);

            instructions.forEach(instruction => {
                const utterance = new SpeechSynthesisUtterance(`手順${instruction.number}。${instruction.text}`);
                utterance.lang = 'ja-JP';
                window.speechSynthesis.speak(utterance);
            });
        }
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
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
            <div className="footer-actions">
                 <button onClick={() => navigate('/')} className="button button-primary">ホーム画面に戻る</button>
            </div>
        </div>
    );
};
export default InstructionComponent;