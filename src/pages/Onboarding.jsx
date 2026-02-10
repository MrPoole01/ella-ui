import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context';
import QuestionnaireModal from '../components/features/QuestionnaireModal';
import '../styles/Onboarding.scss';

const Onboarding = () => {
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);

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
    // Save only the fields we collect (userType and role)
    localStorage.setItem('ella-user-type', data.userType || '');
    localStorage.setItem('ella-user-role', data.role || '');
    
    // Store selected path and mode for BrandBot setup
    if (data.selectedPath) {
      localStorage.setItem('ella-brandbot-selected-path', data.selectedPath);
    }
    if (data.mode) {
      localStorage.setItem('ella-brandbot-mode', data.mode);
    }
    
    // Mark onboarding questionnaire as complete
    localStorage.setItem('ella-onboarding-complete', 'true');
    
    if (data.selectedPath === 'playbook') {
      // Open Template Drawer in workspace for playbook path
      localStorage.removeItem('ella-show-brandbot-setup');
      localStorage.setItem('ella-open-template-drawer', 'true');
    } else {
      // Set flag to open BrandBot modal in workspace
      localStorage.setItem('ella-show-brandbot-setup', 'true');
    }

    setShowQuestionnaire(false);

    // Navigate directly to workspace (skip Pendo tour)
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

    </div>
  );
};

export default Onboarding;
