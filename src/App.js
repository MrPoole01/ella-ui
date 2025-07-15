import React from 'react';
import Workspace from './components/Workspace';
import { ThemeProvider } from './context/ThemeContext';
import { CssVarsProvider } from '@mui/joy/styles';
import './App.scss';

function App() {
  return (
    <CssVarsProvider>
      <ThemeProvider>
        <div className="App">
          <Workspace />
        </div>
      </ThemeProvider>
    </CssVarsProvider>
  );
}

export default App; 