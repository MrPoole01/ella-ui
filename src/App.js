import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Workspace from './pages/Workspace';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import AdminTool from './pages/AdminTool';
import { ThemeProvider } from './context';
import { CssVarsProvider } from '@mui/joy/styles';
import './styles/global.css';
import './App.scss';

// Simple authentication check - in production, this would connect to your auth system
const useAuth = () => {
  // For demonstration, you can check localStorage or a context
  // Return true if user is authenticated, false otherwise
  const isAuthenticated = localStorage.getItem('ella-auth-token') ? true : false;
  const isAdmin = localStorage.getItem('ella-user-role') === 'admin'; // Simple admin check
  return { isAuthenticated, isAdmin };
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Admin-only Route component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <CssVarsProvider>
      <ThemeProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Onboarding Route - Protected */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />

              {/* Admin Tool Routes - Admin Only */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminTool />
                  </AdminRoute>
                }
              />
              
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