// =================================================================
// 7. 上書き: frontend/src/components/QuestionComponent.js
// =================================================================
import React from 'react';

const BackButton = ({ onClick }) => (
    <button onClick={onClick} className="button-back" title="戻る">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{width: '30px', height: '30px'}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
    </button>
);

const QuestionComponent = ({ step, onOptionSelect, onGoBack }) => {
    if (!step || !step.id || !Array.isArray(step.options)) return null;

    return (
        <div className="screen-container">
             {step.id !== 'start' && <BackButton onClick={onGoBack} />}
            <div className="question-content">
                <h2 className="screen-header">{step.question_text || step.message}</h2>
                <div className="question-list">
                    {step.options.map(option => (
                        <button
                            key={option.next_step_id}
                            className="question-list-item"
                            onClick={() => onOptionSelect(option.next_step_id)}
                        >
                           <span>{option.text}</span>
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{width: '24px', height: '24px', color: '#ccc'}}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                           </svg>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default QuestionComponent;