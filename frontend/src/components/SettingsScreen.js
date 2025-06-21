// =================================================================
// 6. 上書き: frontend/src/components/SettingsScreen.js
// =================================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const SettingsScreen = () => {
    const { settings, updateSettings } = useSettings();
    const [localSettings, setLocalSettings] = useState(settings);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLocalSettings({...localSettings, [e.target.name]: e.target.value});
    };

    const handleSave = () => {
        updateSettings(localSettings);
        alert('設定を保存しました。');
        navigate('/');
    };

    return (
        <div className="screen-container settings-container">
            <div className="settings-form">
                <h1 className="screen-header">施設情報設定</h1>
                <div className="form-group">
                    <label htmlFor="address">施設・店舗の住所</label>
                    <input type="text" id="address" name="address" value={localSettings.address} onChange={handleChange} placeholder="例: 東京都千代田区千代田1-1" />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">施設の電話番号</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" value={localSettings.phoneNumber} onChange={handleChange} placeholder="例: 03-1234-5678" />
                </div>
                <div className="footer-actions">
                    <button onClick={() => navigate('/')} className="button button-secondary">戻る</button>
                    <button onClick={handleSave} className="button button-primary">この内容で保存</button>
                </div>
            </div>
        </div>
    );
};
export default SettingsScreen;