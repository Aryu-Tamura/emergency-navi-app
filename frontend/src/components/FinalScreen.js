// =================================================================
// 7. 上書き: frontend/src/components/FinalScreen.js
// (onGoHomeを受け取るように変更)
// =================================================================
import React from 'react';

const FinalScreen = ({ step, onGoHome }) => {
    if (!step) {
        return null;
    }

    return (
        <div className="screen-container" style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
            <h2 className="screen-header">{step.message}</h2>
            <p style={{fontSize: 'var(--font-size-md)', color: '#555'}}>必要に応じて、かかりつけ医や近隣の医療機関にご相談ください。</p>
            <div className="footer-actions">
                <button onClick={onGoHome} className="button button-primary">ホーム画面に戻る</button>
            </div>
        </div>
    );
};

export default FinalScreen;