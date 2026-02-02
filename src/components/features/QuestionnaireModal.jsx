import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui';
import './QuestionnaireModal.scss';

// Multi-Select Checkbox Component
const MultiSelectCheckbox = ({ question, value, onChange, errors }) => {
  const handleToggle = (optionValue) => {
    const currentValues = Array.isArray(value) ? value : [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    onChange(newValues);
  };

  return (
    <div className="questionnaire-modal__checkbox-group">
      {question.options.map(option => (
        <label
          key={option.value}
          className="questionnaire-modal__checkbox-label"
        >
          <input
            type="checkbox"
            className="questionnaire-modal__checkbox-input"
            checked={(Array.isArray(value) ? value : []).includes(option.value)}
            onChange={() => handleToggle(option.value)}
          />
          <span className="questionnaire-modal__checkbox-custom"></span>
          <span className="questionnaire-modal__checkbox-text">{option.label}</span>
        </label>
      ))}
      {errors && (
        <div className="questionnaire-modal__error">{errors}</div>
      )}
    </div>
  );
};

const QuestionnaireModal = ({
  isOpen,
  onComplete,
  userType = 'primary' // 'primary' or 'invited'
}) => {
  const [currentPage, setCurrentPage] = useState(0); // 0-5 for 6 pages
  const [formData, setFormData] = useState({
    // Page 1
    userType: '',
    role: '',
    // Page 2
    primaryGoal: '',
    contentTypes: [],
    // Page 3
    teamSize: '',
    whoWillUse: [],
    // Page 4
    biggestChallenge: '',
    aiFamiliarity: '',
    // Page 5
    industry: '',
    targetAudience: [],
    // Page 6
    firstAction: '',
    referralSource: ''
  });
  const [errors, setErrors] = useState({});
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [customRole, setCustomRole] = useState('');

  // Question pages configuration
  const questionPages = [
    // Page 1
    [
      {
        id: 'userType',
        label: 'Who are you?',
        type: 'select',
        required: true,
        showFor: 'primary',
        options: [
          { value: 'Solo', label: 'Solo' },
          { value: 'SMB', label: 'SMB (Small/Medium Business)' },
          { value: 'Agency', label: 'Agency' },
          { value: 'Enterprise', label: 'Enterprise' }
        ]
      },
      {
        id: 'role',
        label: 'What is your role?',
        type: 'select-or-text',
        required: true,
        options: [
          { value: 'Marketing Manager', label: 'Marketing Manager' },
          { value: 'Content Creator', label: 'Content Creator' },
          { value: 'Brand Manager', label: 'Brand Manager' },
          { value: 'Agency Owner', label: 'Agency Owner' },
          { value: 'Founder/CEO', label: 'Founder/CEO' },
          { value: 'Product Manager', label: 'Product Manager' },
          { value: 'Other', label: 'Other' }
        ]
      }
    ],
    // Page 2
    [
      {
        id: 'primaryGoal',
        label: "What's your primary goal with Ella?",
        type: 'select',
        required: true,
        options: [
          { value: 'consistent-content', label: 'Create consistent branded content' },
          { value: 'brand-messaging', label: 'Develop brand messaging and positioning' },
          { value: 'manage-clients', label: 'Manage multiple client brands (agencies)' },
          { value: 'scale-production', label: 'Scale content production' },
          { value: 'brand-voice', label: 'Maintain brand voice across team' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'contentTypes',
        label: 'What type of content do you create most often?',
        type: 'multi-select',
        required: true,
        options: [
          { value: 'social-media', label: 'Social media posts' },
          { value: 'blog', label: 'Blog articles' },
          { value: 'email', label: 'Marketing emails' },
          { value: 'website', label: 'Website copy' },
          { value: 'ads', label: 'Ad copy' },
          { value: 'sales', label: 'Sales materials' },
          { value: 'multiple', label: 'Multiple types' }
        ]
      }
    ],
    // Page 3
    [
      {
        id: 'teamSize',
        label: 'How large is your marketing team?',
        type: 'select',
        required: true,
        options: [
          { value: 'just-me', label: 'Just me' },
          { value: '2-5', label: '2-5 people' },
          { value: '6-15', label: '6-15 people' },
          { value: '16-50', label: '16-50 people' },
          { value: '50+', label: '50+ people' }
        ]
      },
      {
        id: 'whoWillUse',
        label: 'Who else will be using Ella?',
        type: 'multi-select',
        required: true,
        options: [
          { value: 'just-me', label: 'Just me' },
          { value: 'marketing', label: 'Marketing team members' },
          { value: 'writers', label: 'Content writers' },
          { value: 'designers', label: 'Designers' },
          { value: 'executives', label: 'Executives/Leadership' },
          { value: 'clients', label: 'Clients (for agencies)' },
          { value: 'other', label: 'Other departments' }
        ]
      }
    ],
    // Page 4
    [
      {
        id: 'biggestChallenge',
        label: "What's your biggest content creation challenge?",
        type: 'select',
        required: true,
        options: [
          { value: 'brand-voice', label: 'Maintaining consistent brand voice' },
          { value: 'ideas', label: 'Generating ideas quickly' },
          { value: 'volume', label: 'Keeping up with content volume' },
          { value: 'collaboration', label: 'Collaborating with team' },
          { value: 'resonance', label: 'Understanding what resonates with audience' },
          { value: 'multiple-brands', label: 'Managing multiple brands' }
        ]
      },
      {
        id: 'aiFamiliarity',
        label: 'How familiar are you with AI writing tools?',
        type: 'select',
        required: true,
        options: [
          { value: 'first-time', label: 'First time using AI for content' },
          { value: 'few-times', label: 'Used AI tools a few times' },
          { value: 'regular', label: 'Regular AI tool user' },
          { value: 'power-user', label: 'AI power user' }
        ]
      }
    ],
    // Page 5
    [
      {
        id: 'industry',
        label: 'What industry are you in?',
        type: 'select',
        required: true,
        options: [
          { value: 'tech-saas', label: 'Technology/SaaS' },
          { value: 'ecommerce', label: 'E-commerce/Retail' },
          { value: 'professional-services', label: 'Professional Services' },
          { value: 'healthcare', label: 'Healthcare' },
          { value: 'education', label: 'Education' },
          { value: 'nonprofit', label: 'Non-profit' },
          { value: 'agency', label: 'Agency/Marketing' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'targetAudience',
        label: 'Who is your target audience?',
        type: 'multi-select',
        required: true,
        options: [
          { value: 'b2b', label: 'B2B decision makers' },
          { value: 'smb', label: 'Small business owners' },
          { value: 'enterprise', label: 'Enterprise clients' },
          { value: 'b2c', label: 'Consumers (B2C)' },
          { value: 'agencies', label: 'Other businesses/agencies' },
          { value: 'internal', label: 'Internal teams' }
        ]
      }
    ],
    // Page 6
    [
      {
        id: 'firstAction',
        label: 'What would you like to accomplish first?',
        type: 'select',
        required: true,
        options: [
          { value: 'brand-voice', label: 'Set up my brand voice' },
          { value: 'create-content', label: 'Create content right away' },
          { value: 'explore', label: "Explore Ella's features" },
          { value: 'train-team', label: 'Train my team' },
          { value: 'import-guidelines', label: 'Import existing brand guidelines' }
        ]
      },
      {
        id: 'referralSource',
        label: 'How did you hear about Ella?',
        type: 'select',
        required: true,
        options: [
          { value: 'search', label: 'Search engine' },
          { value: 'social', label: 'Social media' },
          { value: 'referral', label: 'Referral from colleague' },
          { value: 'blog', label: 'Blog/article' },
          { value: 'ad', label: 'Advertisement' },
          { value: 'conference', label: 'Conference/event' },
          { value: 'other', label: 'Other' }
        ]
      }
    ]
  ];

  const totalPages = questionPages.length;
  const isLastPage = currentPage === totalPages - 1;
  const isFirstPage = currentPage === 0;

  // Restore progress when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('questionnaire-progress');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Only restore if less than 24 hours old
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            setCurrentPage(parsed.currentPage);
            setFormData(parsed.formData);
            // Restore role input state if needed
            if (parsed.formData.role && parsed.formData.role !== '' &&
                !questionPages[0][1].options.some(opt => opt.value === parsed.formData.role)) {
              setShowRoleInput(true);
              setCustomRole(parsed.formData.role);
            }
          } else {
            localStorage.removeItem('questionnaire-progress');
          }
        }
      } catch (_) {}
    }
  }, [isOpen]);

  // Persist progress
  const persistProgress = () => {
    try {
      localStorage.setItem('questionnaire-progress', JSON.stringify({
        currentPage,
        formData,
        timestamp: Date.now()
      }));
    } catch (_) {}
  };

  // Validate current page
  const validateCurrentPage = () => {
    const currentQuestions = questionPages[currentPage];
    const newErrors = {};

    currentQuestions.forEach(q => {
      // Skip userType validation for invited users
      if (q.showFor === 'primary' && userType !== 'primary') return;

      if (q.required) {
        const value = formData[q.id];
        if (q.type === 'multi-select') {
          if (!Array.isArray(value) || value.length === 0) {
            newErrors[q.id] = 'Please select at least one option';
          }
        } else if (!value || value.trim() === '') {
          newErrors[q.id] = 'This field is required';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field change
  const handleFieldChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
    // Clear error for this field
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  // Handle role change (special case for select-or-text)
  const handleRoleChange = (value) => {
    if (value === 'Other') {
      setShowRoleInput(true);
      setFormData(prev => ({
        ...prev,
        role: ''
      }));
      setCustomRole('');
    } else {
      setShowRoleInput(false);
      setCustomRole('');
      handleFieldChange('role', value);
    }
  };

  // Handle custom role input
  const handleCustomRoleChange = (e) => {
    const value = e.target.value;
    setCustomRole(value);
    handleFieldChange('role', value);
  };

  // Navigation handlers
  const handleNext = () => {
    if (validateCurrentPage()) {
      persistProgress();
      setCurrentPage(prev => prev + 1);
      setErrors({});
    }
  };

  const handlePrevious = () => {
    setCurrentPage(prev => prev - 1);
    setErrors({});
  };

  const handleFinish = (e) => {
    e.preventDefault();
    if (validateCurrentPage()) {
      localStorage.removeItem('questionnaire-progress');
      onComplete(formData);
    }
  };

  // Prevent closing - mandatory modal
  const handleBackdropClick = (e) => {
    e.stopPropagation();
  };

  // Render question based on type
  const renderQuestion = (question) => {
    // Skip userType question for invited users
    if (question.showFor === 'primary' && userType !== 'primary') {
      return null;
    }

    return (
      <div key={question.id} className="questionnaire-modal__question">
        <label className="questionnaire-modal__label">
          {question.label}
          {question.required && <span className="questionnaire-modal__required">*</span>}
          {question.type === 'multi-select' && (
            <span className="questionnaire-modal__helper-text">(select all that apply)</span>
          )}
        </label>

        {question.type === 'select' && (
          <>
            <select
              className="questionnaire-modal__select"
              value={formData[question.id]}
              onChange={(e) => handleFieldChange(question.id, e.target.value)}
            >
              <option value="">Select an option</option>
              {question.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors[question.id] && (
              <div className="questionnaire-modal__error">{errors[question.id]}</div>
            )}
          </>
        )}

        {question.type === 'select-or-text' && (
          <>
            <select
              className="questionnaire-modal__select"
              value={showRoleInput ? 'Other' : formData[question.id]}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <option value="">Select a role</option>
              {question.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {showRoleInput && (
              <input
                type="text"
                className="questionnaire-modal__input"
                placeholder="Enter your role"
                value={customRole}
                onChange={handleCustomRoleChange}
                autoFocus
              />
            )}
            {errors[question.id] && (
              <div className="questionnaire-modal__error">{errors[question.id]}</div>
            )}
          </>
        )}

        {question.type === 'multi-select' && (
          <MultiSelectCheckbox
            question={question}
            value={formData[question.id]}
            onChange={(value) => handleFieldChange(question.id, value)}
            errors={errors[question.id]}
          />
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="questionnaire-modal-overlay" onClick={handleBackdropClick}>
      <div className="questionnaire-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="questionnaire-modal__header">
          <div className="questionnaire-modal__logo">
            <span>EA</span>
          </div>
          <h2 className="questionnaire-modal__title">Welcome to Ella!</h2>
          <p className="questionnaire-modal__subtitle">
            Help us personalize your experience
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="questionnaire-modal__progress">
          Page {currentPage + 1} of {totalPages}
        </div>

        {/* Form */}
        <form onSubmit={handleFinish} className="questionnaire-modal__form">
          {/* Render current page questions */}
          {questionPages[currentPage].map(question => renderQuestion(question))}

          {/* Navigation Buttons */}
          <div className="questionnaire-modal__navigation">
            {!isFirstPage && (
              <Button
                type="button"
                variant="secondary"
                size="large"
                onClick={handlePrevious}
              >
                Previous
              </Button>
            )}
            {!isLastPage ? (
              <Button
                type="button"
                variant="primary"
                size="large"
                onClick={handleNext}
                fullWidth={isFirstPage}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth={isFirstPage}
              >
                Finish
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default QuestionnaireModal;
