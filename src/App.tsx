import React from 'react';
import { FingertipsProvider } from './context/FingertipsContext';
import Fingertips from './pages/Fingertips/Fingertips';
import './App.css';

function App() {
  return (
    <FingertipsProvider>
      <div className="App">
        <Fingertips />
      </div>
    </FingertipsProvider>
  );
}

export default App;