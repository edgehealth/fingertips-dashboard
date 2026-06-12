import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FingertipsProvider } from './context/FingertipsContext';
import Fingertips from './pages/Fingertips/Fingertips';
import { sections } from './config/sections';
import './App.css';

const basename = process.env.PUBLIC_URL || '/';

function App() {
  return (
    <FingertipsProvider>
      <BrowserRouter basename={basename}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/cyp" replace />} />
            <Route path="/cyp" element={<Fingertips section={sections.cyp} />} />
            <Route
              path="/early-cancer"
              element={<Fingertips section={sections['early-cancer']} />}
            />
            <Route path="*" element={<Navigate to="/cyp" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </FingertipsProvider>
  );
}

export default App;
