// =================================================================
// 3. 上書き: frontend/src/components/StandbyScreen.js
// (useNavigateを削除し、propsで画面遷移)
// =================================================================
import React, { useState, useEffect } from 'react';

const StandbyScreen = ({ onStartEmergency, onGoToSettings }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const formattedTime = time.toLocaleTimeString('ja-JP', {
        hour: '2-digit', minute: '2-digit',
    });

    return (
        <div className="screen-container">
            <header className="standby-header">
                <div className="standby-info-box">
                    <div className="title">暑さ指数(WBGT)</div>
                    <div className="value">27.5℃</div>
                </div>
                <div className="standby-info-box">
                    <div className="title">現在時刻</div>
                    <div className="value">{formattedTime}</div>
                </div>
            </header>

            <main className="standby-main">
                <button className="sos-button" onClick={onStartEmergency}>
                    SOS
                </button>
            </main>

            <footer className="standby-footer">
                <button className="settings-button" onClick={onGoToSettings} title="設定">
                    <svg className="settings-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.485.4.665 1.115.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87-.074-.04-.147-.083-.22-.127-.324-.196-.72-.257-1.075.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.003-.827c.293-.24.438-.613-.438-.995s-.145-.755-.438-.995l-1.003-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.074-.04.147-.083.22-.127.332-.183.582.495-.645-.87l.213-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </footer>
        </div>
    );
};
export default StandbyScreen;
