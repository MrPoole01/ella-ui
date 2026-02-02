import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context';
import QuestionnaireModal from '../components/features/QuestionnaireModal';
import BrandBotSetupModal from '../components/features/BrandBotSetupModal';
import '../styles/Onboarding.scss';

const Onboarding = () => {
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  const [showBrandBotSetup, setShowBrandBotSetup] = useState(false);

  // Apply theme to body when component mounts
  useEffect(() => {
    const applyTheme = (themeName) => {
      // Remove existing theme classes
      document.body.classList.remove(
        'theme-ui',
        'theme-light',
        'theme-dark',
        'theme-web-light',
        'theme-web-dark',
        'theme-electric-dark',
        'theme-modern-dark',
        'theme-modern-light',
        'theme-citrus-grove',
        'theme-neumorphism',
        'theme-neumorphism-dark'
      );

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

  const handleQuestionnaireComplete = (data) => {
    // Save all 12 fields to localStorage
    localStorage.setItem('ella-user-type', data.userType || '');
    localStorage.setItem('ella-user-role', data.role);
    localStorage.setItem('ella-primary-goal', data.primaryGoal);
    localStorage.setItem('ella-content-types', JSON.stringify(data.contentTypes));
    localStorage.setItem('ella-team-size', data.teamSize);
    localStorage.setItem('ella-who-will-use', JSON.stringify(data.whoWillUse));
    localStorage.setItem('ella-biggest-challenge', data.biggestChallenge);
    localStorage.setItem('ella-ai-familiarity', data.aiFamiliarity);
    localStorage.setItem('ella-industry', data.industry);
    localStorage.setItem('ella-target-audience', JSON.stringify(data.targetAudience));
    localStorage.setItem('ella-first-action', data.firstAction);
    localStorage.setItem('ella-referral-source', data.referralSource);
    localStorage.setItem('ella-onboarding-complete', 'true');

    setShowQuestionnaire(false);

    // Trigger Pendo tour if available
    if (window.pendo) {
      window.pendo.startTour({
        tourId: 'ella-onboarding-tour',
        onComplete: () => {
          // Tour finished - show BrandBot Setup Modal
          setShowBrandBotSetup(true);
        }
      });
    } else {
      // Pendo not available (dev environment) - skip directly to BrandBot Setup
      setTimeout(() => {
        setShowBrandBotSetup(true);
      }, 1000);
    }
  };

  const handleBrandBotSetupComplete = (data) => {
    console.log('BrandBot setup completed with data:', data);

    // Mark onboarding as fully complete
    localStorage.setItem('ella-brandbot-setup-complete', 'true');

    // Redirect to main workspace
    navigate('/', { replace: true });
  };

  const handleBrandBotSetupClose = () => {
    // User closed the modal - redirect to workspace anyway
    navigate('/', { replace: true });
  };

  return (
    <div className="onboarding-container">
      {/* Background */}
      <div className="onboarding-background">
        <div className="background-image"></div>
      </div>

      {/* Questionnaire Modal */}
      {showQuestionnaire && (
        <QuestionnaireModal
          isOpen={showQuestionnaire}
          onComplete={handleQuestionnaireComplete}
          userType="primary"
        />
      )}

      {/* Pendo Tour will be rendered here by Pendo SDK */}
      {!showQuestionnaire && !showBrandBotSetup && (
        <div className="onboarding-tour-placeholder">
          <div className="onboarding-tour-message">
            <div className="onboarding-tour-spinner" />
            <p>Preparing your tour...</p>
          </div>
        </div>
      )}

      {/* BrandBot Setup Modal */}
      {showBrandBotSetup && (
        <BrandBotSetupModal
          isOpen={showBrandBotSetup}
          onClose={handleBrandBotSetupClose}
          onComplete={handleBrandBotSetupComplete}
          persistedStateKey="brandbot-onboarding-state"
        />
      )}
    </div>
  );
};

export default Onboarding;
