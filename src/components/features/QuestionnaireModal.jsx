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
  const [currentPage, setCurrentPage] = useState(0); // 0-2 for 3 pages: Questions, Educational, Path Selection
  const [formData, setFormData] = useState({
    // Page 1
    userType: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [customRole, setCustomRole] = useState('');
  const [selectedPath, setSelectedPath] = useState(null); // 'positioning' | 'auto' | 'playbook' | 'explore'
  const [mode, setMode] = useState(null); // 'established' | 'new'

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
    ]
  ];

  const totalPages = 3; // Page 0: Questions, Page 1: Educational, Page 2: Path Selection
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
            setCurrentPage(parsed.currentPage || 0);
            setFormData(parsed.formData || { userType: '', role: '' });
            if (parsed.selectedPath) setSelectedPath(parsed.selectedPath);
            if (parsed.mode) setMode(parsed.mode);
            // Restore role input state if needed
            if (parsed.formData?.role && parsed.formData.role !== '' &&
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
        selectedPath,
        mode,
        timestamp: Date.now()
      }));
    } catch (_) {}
  };

  // Validate current page
  const validateCurrentPage = () => {
    if (currentPage === 0) {
      // Validate first page questions
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
    } else if (currentPage === 1) {
      // Educational page - no validation needed, always allows next
      return true;
    } else if (currentPage === 2) {
      // Validate path selection
      if (!selectedPath) {
        setErrors({ path: 'Please select a path to continue' });
        return false;
      }
      setErrors({});
      return true;
    }
    return false;
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
  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
      onComplete({
        ...formData,
        selectedPath,
        mode
      });
    }
  };

  // Handle path selection
  const handlePathSelect = (path) => {
    setSelectedPath(path);
    // Map path to mode: 'auto' and 'playbook' -> 'established', 'positioning' and 'explore' -> 'new'
    if (path === 'auto' || path === 'playbook') {
      setMode('established');
    } else if (path === 'positioning' || path === 'explore') {
      setMode('new');
    }
    // Clear path error if exists
    if (errors.path) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.path;
        return newErrors;
      });
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
      <div className={`questionnaire-modal ${currentPage === 1 ? 'questionnaire-modal--wide' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="questionnaire-modal__header">
          <div className="questionnaire-modal__logo">
            <span>EA</span>
          </div>
          <h2 className="questionnaire-modal__title">Welcome to Ella!</h2>
        </div>

        {/* Form */}
        <form onSubmit={(e) => {
          e.preventDefault();
          if (isLastPage) {
            handleFinish(e);
          } else {
            handleNext(e);
          }
        }} className="questionnaire-modal__form">
          {/* Render current page questions */}
          {currentPage === 0 && questionPages[0] && questionPages[0].map(question => renderQuestion(question))}
          
          {/* Page 1: Educational Content */}
          {currentPage === 1 && (
            <div className="questionnaire-modal__educational">
              <div className="questionnaire-modal__educational-section">
                <h3 className="questionnaire-modal__educational-title">What is a Brand Bot?</h3>
                <div className="questionnaire-modal__educational-content">
                  <p>
                    A Brand Bot is your personalized AI assistant that understands your brand's unique voice, 
                    messaging, and goals. Think of it as a digital team member that knows your brand inside and out— 
                    from your tone of voice to your target audience—and helps you create consistent, on-brand content.
                  </p>
                </div>
              </div>

              <div className="questionnaire-modal__educational-section">
                <h3 className="questionnaire-modal__educational-title">Why it matters</h3>
                <div className="questionnaire-modal__educational-content">
                  <p>
                    Your Brand Bot ensures everything you create aligns with your brand identity. It helps maintain 
                    consistency across all your content, saves time by understanding your preferences, and scales your 
                    brand voice across your entire team.
                  </p>
                </div>
              </div>

              <div className="questionnaire-modal__educational-section">
                <h3 className="questionnaire-modal__educational-title">What are Elements?</h3>
                <div className="questionnaire-modal__educational-content">
                  <p>
                    Elements are the building blocks of your brand—the essential pieces that define who you are. 
                    These include your brand voice, messaging, positioning, target audience, values, and more. 
                    Think of Elements as your brand's DNA: once Ella understands them, she can create content that 
                    truly represents your brand.
                  </p>
                </div>
              </div>

              <div className="questionnaire-modal__educational-section">
                <h3 className="questionnaire-modal__educational-title">What to expect</h3>
                <div className="questionnaire-modal__educational-content">
                  <ul className="questionnaire-modal__educational-list">
                    <li>
                      <strong>Ella will generate things:</strong> Based on your inputs, Ella will create content, 
                      suggestions, and recommendations tailored to your brand.
                    </li>
                    <li>
                      <strong>There will be checkpoints:</strong> You'll have opportunities to review, refine, and 
                      approve what Ella creates before moving forward.
                    </li>
                    <li>
                      <strong>You'll talk back and forth with Ella:</strong> This is a collaborative process. 
                      You can provide feedback, ask questions, and guide Ella to better understand your brand.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Page 2: Path Selection */}
          {currentPage === 2 && (
            <div className="questionnaire-modal__path-selection">
              <h2 className="questionnaire-modal__path-title">What would you like to start with?</h2>
              
              <div className="questionnaire-modal__path-options">
                <button
                  type="button"
                  className={`questionnaire-modal__path-card ${selectedPath === 'positioning' ? 'questionnaire-modal__path-card--selected' : ''}`}
                  onClick={() => handlePathSelect('positioning')}
                >
                  <div className="questionnaire-modal__path-content">
                    <h3 className="questionnaire-modal__path-card-title">Create a Positioning Statement</h3>
                    <p className="questionnaire-modal__path-card-description">
                      Work through a guided interview to define your brand's positioning and messaging.
                    </p>
                  </div>
                  <div className="questionnaire-modal__path-radio">
                    {selectedPath === 'positioning' && (
                      <div className="questionnaire-modal__path-radio-check"></div>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  className={`questionnaire-modal__path-card ${selectedPath === 'auto' ? 'questionnaire-modal__path-card--selected' : ''}`}
                  onClick={() => handlePathSelect('auto')}
                >
                  <div className="questionnaire-modal__path-content">
                    <h3 className="questionnaire-modal__path-card-title">Build My Brand Bot (Autobot)</h3>
                    <p className="questionnaire-modal__path-card-description">
                      Use your existing website and materials so Ella can learn quickly.
                    </p>
                  </div>
                  <div className="questionnaire-modal__path-radio">
                    {selectedPath === 'auto' && (
                      <div className="questionnaire-modal__path-radio-check"></div>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  className={`questionnaire-modal__path-card ${selectedPath === 'playbook' ? 'questionnaire-modal__path-card--selected' : ''}`}
                  onClick={() => handlePathSelect('playbook')}
                >
                  <div className="questionnaire-modal__path-content">
                    <h3 className="questionnaire-modal__path-card-title">Sharpen the Edge</h3>
                    <p className="questionnaire-modal__path-card-description">
                      Turn your current brand assets into a tailored playbook and guidance.
                    </p>
                  </div>
                  <div className="questionnaire-modal__path-radio">
                    {selectedPath === 'playbook' && (
                      <div className="questionnaire-modal__path-radio-check"></div>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  className={`questionnaire-modal__path-card ${selectedPath === 'explore' ? 'questionnaire-modal__path-card--selected' : ''}`}
                  onClick={() => handlePathSelect('explore')}
                >
                  <div className="questionnaire-modal__path-content">
                    <h3 className="questionnaire-modal__path-card-title">Explore Ella</h3>
                    <p className="questionnaire-modal__path-card-description">
                      Jump in and explore Ella's tools before setting up your brand.
                    </p>
                  </div>
                  <div className="questionnaire-modal__path-radio">
                    {selectedPath === 'explore' && (
                      <div className="questionnaire-modal__path-radio-check"></div>
                    )}
                  </div>
                </button>
              </div>
              
              {errors.path && (
                <div className="questionnaire-modal__error">{errors.path}</div>
              )}
            </div>
          )}

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
                Continue
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
