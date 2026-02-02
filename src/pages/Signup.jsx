import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context';
import { Button, Input } from '../components/ui';
import '../styles/Signup.scss';

const Signup = () => {
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
  }, [currentTheme]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignupSuccess = (authToken) => {
    // Store authentication token
    localStorage.setItem('ella-auth-token', authToken);

    // Clear any stale onboarding state from prior sessions
    localStorage.removeItem('ella-onboarding-complete');
    localStorage.removeItem('ella-brandbot-setup-complete');
    localStorage.removeItem('questionnaire-progress');
    localStorage.removeItem('brandbot-onboarding-state');
    localStorage.removeItem('brandbot-setup-state');

    // Set new user flag for onboarding flow
    localStorage.setItem('ella-is-new-user', 'true');

    // Store user role (new users default to 'user' role)
    localStorage.setItem('ella-user-role', 'user');

    console.log('Signup complete - navigating to workspace with flags:', {
      'ella-is-new-user': localStorage.getItem('ella-is-new-user'),
      'ella-onboarding-complete': localStorage.getItem('ella-onboarding-complete')
    });

    // Navigate to workspace (onboarding modals will appear within workspace)
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

      // Simulate signup logic
      // In production, this would be an actual API call to your auth service
      // Check if email already exists (mock)
      const mockExistingEmails = ['demo@example.com'];
      if (mockExistingEmails.includes(formData.email)) {
        setErrors({
          email: 'An account with this email already exists'
        });
      } else {
        // Success - simulate receiving auth token
        const mockAuthToken = 'signup-jwt-token-' + Date.now();

        // In production, this would also:
        // 1. Create Organization entity
        // 2. Create User entity
        // 3. Auto-create default workspace
        // 4. Create HubSpot records

        handleSignupSuccess(mockAuthToken);
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

      // In production, this would integrate with Google OAuth
      const mockAuthToken = 'google-signup-token-' + Date.now();
      handleSignupSuccess(mockAuthToken);
    } catch (error) {
      setErrors({
        password: 'Google authentication failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.companyName.trim() &&
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.password.trim();

  return (
    <div className="signup-container">
      <div className="signup-background">
        <div className="background-image"></div>
      </div>

      <div className="signup-form-container">
        <div className="signup-form-wrapper">
          {/* Logo */}
          <div className="signup-logo">
            <span>EA</span>
          </div>

          {/* Title */}
          <h1 className="signup-title">Create Your Account</h1>
          <p className="signup-subtitle">Start your free 14-day trial</p>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <Input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleInputChange}
                error={errors.companyName}
                disabled={isLoading}
                size="large"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  disabled={isLoading}
                  size="large"
                />
              </div>

              <div className="form-group">
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  disabled={isLoading}
                  size="large"
                />
              </div>
            </div>

            <div className="form-group">
              <Input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                disabled={isLoading}
                size="large"
              />
            </div>

            <div className="form-group">
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                helpText="At least 8 characters with uppercase, lowercase, and numbers"
                disabled={isLoading}
                size="large"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
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
            Sign up with Google
          </Button>

          {/* Footer */}
          <div className="signup-footer">
            Already have an account?{' '}
            <button
              type="button"
              className="signin-link"
              onClick={() => navigate('/login')}
              disabled={isLoading}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
