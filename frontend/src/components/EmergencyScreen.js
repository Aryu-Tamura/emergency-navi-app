// =================================================================
// 10. 上書き: frontend/src/components/EmergencyScreen.js
// (症状に応じた画面遷移ロジックを追加)
// =================================================================
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionComponent from './QuestionComponent';
import AmbulanceCallComponent from './AmbulanceCallComponent';
import InstructionComponent from './InstructionComponent';
import FinalScreen from './FinalScreen';

const API_BASE_URL = 'http://localhost:8000';

const DUMMY_SCENARIO_DATA = {
    "heatstroke_instructions": { "id": "heatstroke_instructions", "step_type": "INSTRUCTION", "message": "熱中症の応急処置" },
    "others_instructions": { "id": "others_instructions", "step_type": "INSTRUCTION", "message": "専門家の指示に従ってください" }
};

const EmergencyScreen = () => {
    const [history, setHistory] = useState(['start']);
    const [currentStep, setCurrentStep] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchStep(history[history.length - 1]);
    }, [history]);

    const fetchStep = async (stepId) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/step/${stepId}`);
            setCurrentStep(response.data);
        } catch (err) {
            if (DUMMY_SCENARIO_DATA[stepId]) {
                setCurrentStep(DUMMY_SCENARIO_DATA[stepId]);
            } else {
                setError('データの取得に失敗しました。');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextStep = (nextStepId) => {
        setHistory(prev => [...prev, nextStepId]);
    };

    const handleGoBack = () => {
        if (history.length > 1) {
            setHistory(prev => prev.slice(0, -1));
        }
    };
    
    const handleProceedToInstructions = (symptom) => {
        if (symptom === 'Heat_Stroke') {
            handleNextStep('heatstroke_instructions');
        } else {
            // For "Others" or "No_Problem" or any error case
            handleNextStep('others_instructions');
        }
    };

    const renderCurrentStep = () => {
        if (isLoading) return <div style={{textAlign: 'center', fontSize: '2rem'}}>読み込み中...</div>;
        if (error) return <div style={{color: 'red', textAlign: 'center', fontSize: '2rem'}}>{error}</div>;
        if (!currentStep) return null;

        const props = { step: currentStep, onGoBack: handleGoBack };

        switch (currentStep.step_type) {
            case 'QUESTION':
                return <QuestionComponent {...props} onOptionSelect={handleNextStep} />;
            case 'AMBULANCE_CALL':
                return <AmbulanceCallComponent {...props} onProceed={handleProceedToInstructions} />;
            case 'INSTRUCTION':
                return <InstructionComponent {...props} />;
            case 'FINAL_NO_EMERGENCY':
                 return <FinalScreen {...props} />;
            default:
                return <div>不明なステップタイプです。</div>;
        }
    };

    return renderCurrentStep();
};
export default EmergencyScreen;
