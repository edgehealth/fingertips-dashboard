import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FingertipsProvider } from './context/FingertipsContext';
import Fingertips from './pages/Fingertips/Fingertips';
import AccessibilityStatement from './pages/Accessibility/AccessibilityStatement';
import { sections } from './config/sections';
import './App.css';

const basename = process.env.PUBLIC_URL || '/';

function App() {
  return (
    <BrowserRouter basename={basename}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/cyp" replace />} />
          <Route
            path="/cyp"
            element={
              <FingertipsProvider category={sections.cyp.category}>
                <Fingertips section={sections.cyp} />
              </FingertipsProvider>
            }
          />
          <Route
            path="/early-cancer"
            element={
              <FingertipsProvider category={sections['early-cancer'].category}>
                <Fingertips section={sections['early-cancer']} />
              </FingertipsProvider>
            }
          />
          <Route path="/accessibility" element={<AccessibilityStatement />} />
          <Route path="*" element={<Navigate to="/cyp" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
