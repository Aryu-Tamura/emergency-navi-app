// =================================================================
// 1. 新規ファイル: frontend/src/context/SettingsContext.js
// =================================================================
import React, { createContext, useState, useEffect, useContext } from 'react';

// Contextの作成
const SettingsContext = createContext();

// Contextを使用するためのカスタムフック
export const useSettings = () => {
    return useContext(SettingsContext);
};

// Providerコンポーネント
export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        address: '',
        phoneNumber: '',
    });

    // アプリ起動時にlocalStorageから設定を読み込む
    useEffect(() => {
        try {
            const savedSettings = localStorage.getItem('emergency-navi-settings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error('Failed to load settings from localStorage', error);
        }
    }, []);

    // 設定を更新し、localStorageに保存する関数
    const updateSettings = (newSettings) => {
        try {
            setSettings(newSettings);
            localStorage.setItem('emergency-navi-settings', JSON.stringify(newSettings));
        } catch (error) {
            console.error('Failed to save settings to localStorage', error);
        }
    };
    
    const value = {
        settings,
        updateSettings,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};