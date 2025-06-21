// =================================================================
// 5. 上書き: frontend/src/App.js
// =================================================================
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StandbyScreen from './components/StandbyScreen';
import EmergencyScreen from './components/EmergencyScreen';
import SettingsScreen from './components/SettingsScreen';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<StandbyScreen />} />
          <Route path="/emergency" element={<EmergencyScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;