// =================================================================
// 3. 上書き: frontend/src/App.js (安定性のため状態管理で画面遷移)
// =================================================================
import React, { useState } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import StandbyScreen from './components/StandbyScreen';
import EmergencyScreen from './components/EmergencyScreen';
import SettingsScreen from './components/SettingsScreen';
import './App.css';

function App() {
  const [appMode, setAppMode] = useState('standby');

  const renderContent = () => {
    switch (appMode) {
      case 'emergency':
        return <EmergencyScreen onGoHome={() => setAppMode('standby')} />;
      case 'settings':
        return <SettingsScreen onGoHome={() => setAppMode('standby')} />;
      case 'standby':
      default:
        return (
          <StandbyScreen
            onStartEmergency={() => setAppMode('emergency')}
            onGoToSettings={() => setAppMode('settings')}
          />
        );
    }
  };

  return (
    <SettingsProvider>
      <div className="App">
        {renderContent()}
      </div>
    </SettingsProvider>
  );
}

export default App;