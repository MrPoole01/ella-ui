import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Workspace from './components/Workspace';
import Login from './components/Login';
import { ThemeProvider } from './context/ThemeContext';
import { CssVarsProvider } from '@mui/joy/styles';
import './App.scss';

// Simple authentication check - in production, this would connect to your auth system
const useAuth = () => {
  // For demonstration, you can check localStorage or a context
  // Return true if user is authenticated, false otherwise
  const isAuthenticated = localStorage.getItem('ella-auth-token') ? true : false;
  return { isAuthenticated };
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <CssVarsProvider>
      <ThemeProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Login Route */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Main Application Route */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Workspace />
                  </ProtectedRoute>
                }
              />
              
              {/* Catch all - redirect to login if not authenticated, home if authenticated */}
              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </CssVarsProvider>
  );
}

export default App; 