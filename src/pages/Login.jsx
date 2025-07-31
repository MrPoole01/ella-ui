import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context';
import { Button, Input } from '../components/ui';
import '../styles/Login.scss';

const Login = () => {
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  // Apply theme to body when component mounts
  useEffect(() => {
    const applyTheme = (themeName) => {
      // Remove existing theme classes
      document.body.classList.remove('theme-ui', 'theme-light', 'theme-dark', 'theme-web-light', 'theme-web-dark', 'theme-electric-dark', 'theme-modern-dark', 'theme-modern-light', 'theme-citrus-grove', 'theme-neumorphism', 'theme-neumorphism-dark');
      
      // Add the appropriate theme class
      switch (themeName) {
        case 'UI Theme':
          document.body.classList.add('theme-ui');
          break;
        case 'Ella Current Light':
          document.body.classList.add('theme-light');
          break;
        case 'Ella Current Dark':
          document.body.classList.add('theme-dark');
          break;
        case 'Ella Web Light':
          document.body.classList.add('theme-web-light');
          break;
        case 'Ella Web Dark':
          document.body.classList.add('theme-web-dark');
          break;
        case 'Ella Electric Dark':
          document.body.classList.add('theme-electric-dark');
          break;
        case 'Ella Modern Dark':
          document.body.classList.add('theme-modern-dark');
          break;
        case 'Ella Modern Light':
          document.body.classList.add('theme-modern-light');
          break;
        case 'Ella Citrus Grove':
          document.body.classList.add('theme-citrus-grove');
          break;
        case 'Ella Neumorphism':
          document.body.classList.add('theme-neumorphism');
          break;
        case 'Ella Neumorphism Dark':
          document.body.classList.add('theme-neumorphism-dark');
          break;
        default:
          document.body.classList.add('theme-ui');
      }
    };

    // Get theme from localStorage or use current theme
    const savedTheme = localStorage.getItem('ella-ui-theme') || currentTheme;
    applyTheme(savedTheme);

    // Cleanup: don't remove theme on unmount since user will navigate to main app
    // return () => {
    //   document.body.classList.remove('theme-ui', 'theme-light', 'theme-dark', 'theme-web-light', 'theme-web-dark', 'theme-electric-dark', 'theme-modern-dark', 'theme-modern-light', 'theme-citrus-grove', 'theme-neumorphism', 'theme-neumorphism-dark');
    // };
  }, [currentTheme]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthSuccess = (authToken) => {
    // Store authentication token
    localStorage.setItem('ella-auth-token', authToken);
    
    // Navigate to homepage
    navigate('/', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate authentication logic
      // In production, this would be an actual API call to your auth service
      if (formData.email === 'demo@example.com' && formData.password === 'password') {
        // Success - simulate receiving auth token
        const mockAuthToken = 'mock-jwt-token-' + Date.now();
        handleAuthSuccess(mockAuthToken);
      } else {
        // Failure
        setErrors({ 
          password: 'Invalid email or password. Please try again.' 
        });
      }
    } catch (error) {
      setErrors({ 
        password: 'An error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    // Implement Google OAuth flow
    setIsLoading(true);
    
    try {
      // Simulate Google OAuth success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, this would integrate with Google OAuth and WorkOS
      const mockAuthToken = 'google-auth-token-' + Date.now();
      handleAuthSuccess(mockAuthToken);
    } catch (error) {
      setErrors({ 
        password: 'Google authentication failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim()) return;
    
    try {
      // Simulate forgot password request to WorkOS
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Forgot password request for:', forgotPasswordEmail);
      // In production, this would send request to WorkOS password reset endpoint
      
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
      
      // Show success message (you could add a toast notification here)
      alert('Password reset link sent to your email!');
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  };

  const isFormValid = formData.email.trim() && formData.password.trim();

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="background-image"></div>
      </div>
      
      <div className="login-form-container">
        <div className="login-form-wrapper">
          {/* Logo */}
          <div className="login-logo">
            <span>EA</span>
          </div>
          
          {/* Title */}
          <h1 className="login-title">Sign in to your account</h1>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                disabled={isLoading}
                size="large"
              />
            </div>
            
            <div className="form-group password-group">
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                disabled={isLoading}
                size="large"
              />
            </div>
            
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <span>Remember me</span>
              </label>
              
              <Button
                variant="link"
                onClick={() => setShowForgotPassword(true)}
                disabled={isLoading}
              >
                Forgot password?
              </Button>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? 'Signing in...' : 'Continue'}
            </Button>
          </form>
          
          {/* Divider */}
          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">or</span>
            <div className="divider-line"></div>
          </div>
          
          {/* Google Auth Button */}
          <Button
            variant="google"
            size="large"
            fullWidth
            onClick={handleGoogleAuth}
            loading={isLoading}
            disabled={isLoading}
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            }
          >
            Continue with Google
          </Button>
          
          {/* Footer */}
          <div className="login-footer">
            If you don't yet have an account,{' '}
            <a
              href="https://www.ellaai.com/free-trial"
              target="_blank"
              rel="noopener noreferrer"
              className="trial-link"
            >
              please request a free trial
            </a>
          </div>
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Reset Password</h2>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleForgotPassword}>
              <Input
                type="email"
                placeholder="Email address"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
                size="large"
              />
              <div className="modal-actions">
                <Button
                  variant="secondary"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login; 