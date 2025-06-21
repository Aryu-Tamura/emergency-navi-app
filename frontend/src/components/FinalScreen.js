// =================================================================
// 5. frontend/src/components/FinalScreen.js (変更なし)
// =================================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FinalScreen = ({ step }) => {
    const navigate = useNavigate();

    // === 安全装置: stepデータがなければクラッシュしない ===
    if (!step) {
        return null;
    }

    return (
        <div className="screen-container" style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
            <h2 className="screen-header">{step.message}</h2>
            <p style={{fontSize: 'var(--font-size-md)', color: '#555'}}>必要に応じて、かかりつけ医や近隣の医療機関にご相談ください。</p>
            <div className="footer-actions">
                <button onClick={() => navigate('/')} className="button button-primary">ホーム画面に戻る</button>
            </div>
        </div>
    );
};

export default FinalScreen;
