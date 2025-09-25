import React, { useState, useEffect, useRef } from 'react';
import ImportModal from './ImportModal';
import './TypeSelectorModal.scss';

const TypeSelectorModal = ({ isOpen, onClose, onContinue, onCancel, initialSelectedType = '', onImportNavigate }) => {
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const modalRef = useRef(null);
  const firstOptionRef = useRef(null);

  const typeOptions = [
    {
      id: 'template',
      title: 'Template',
      description: 'A single, reusable prompt.',
      icon: '📄'
    },
    {
      id: 'playbook',
      title: 'Playbook',
      description: 'An ordered set of templates.',
      icon: '📚'
    },
    {
      id: 'group',
      title: 'Playbook Series',
      description: 'Run multiple playbooks in sequence.',
      icon: '📋'
    }
  ];

  // Focus management and keyboard handling
  useEffect(() => {
    if (isOpen) {
      setIsTransitioning(true);
      
      // Set initial selected type or reset to empty
      setSelectedType(initialSelectedType || '');
      setError('');
      setIsLoading(false);
      
      // Focus first option after modal animation
      const timer = setTimeout(() => {
        firstOptionRef.current?.focus();
        setIsTransitioning(false);
      }, 150);
      
      return () => clearTimeout(timer);
    } else {
      setIsTransitioning(false);
    }
  }, [isOpen, initialSelectedType]);

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        handleCancel();
      } else if (e.key === 'Enter') {
        if (selectedType && !isLoading) {
          handleContinue();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedType, isLoading]);

  // Focus trap within modal
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
    return () => modal.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const handleTypeSelect = (typeId) => {
    if (isTransitioning || isLoading) return; // Prevent selection during transitions
    
    setSelectedType(typeId);
    setError(''); // Clear any previous errors
    
    // Log telemetry event
    logTelemetryEvent('type_selected', { value: typeId });
  };

  const handleContinue = async () => {
    if (!selectedType || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      // Log telemetry event
      logTelemetryEvent('create_draft_started', { type: selectedType });

      // Create draft
      const draft = await createDraft(selectedType);
      
      // Log success
      logTelemetryEvent('create_draft_success', { 
        type: selectedType, 
        draft_id: draft.id 
      });

      // Close modal and continue to drawer
      onContinue(selectedType, draft);
      
    } catch (error) {
      console.error('Failed to create draft:', error);
      
      // Log failure
      logTelemetryEvent('create_draft_failure', { 
        type: selectedType, 
        error_code: error.code || 'unknown',
        error_message: error.message 
      });

      // Handle different error types
      if (error.status === 403) {
        setError('You don\'t have permission to create items.');
        // Close modal after showing error
        setTimeout(() => {
          onClose();
        }, 2000);
      } else if (error.status === 422) {
        setError('Invalid type selected. Please try again.');
      } else {
        setError('Couldn\'t start a new build. Try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isLoading || isTransitioning) return; // Prevent canceling during API call or transition
    
    setSelectedType('');
    setError('');
    setShowImportModal(false);
    onCancel();
  };

  const handleImportClick = () => {
    if (!selectedType) return;
    logTelemetryEvent('import_docs_clicked', { type: selectedType });
    if (onImportNavigate) {
      onImportNavigate(selectedType);
      return;
    }
    setShowImportModal(true);
  };

  const handleImportModalClose = () => {
    setShowImportModal(false);
  };

  const handleImportComplete = (importedItems, type) => {
    // Log successful import
    logTelemetryEvent('import_completed', { 
      type, 
      itemCount: importedItems.length 
    });
    
    // Close import modal
    setShowImportModal(false);
    
    // Close type selector modal and notify parent
    setIsTypeSelectorOpen(false);
    onClose();
    
    // You could also call a callback to refresh the templates list
    // if (onImportComplete) onImportComplete(importedItems, type);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  // Mock draft creation function - replace with actual API call
  const createDraft = async (type) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate potential errors for testing
    if (Math.random() < 0.1) { // 10% chance of server error
      throw { status: 500, message: 'Server error', code: 'server_error' };
    }
    
    // Generate UUID-like ID
    const id = 'draft_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const draft = {
      id,
      type,
      status: 'draft',
      created_by: 'current_user_id', // Replace with actual user ID
      created_at: new Date().toISOString(),
      last_modified_at: new Date().toISOString(),
      origin: 'admin',
      progress_step: 'type_selected'
    };

    // Store in localStorage for demo purposes (replace with actual API)
    const existingDrafts = JSON.parse(localStorage.getItem('ella-drafts') || '[]');
    existingDrafts.push(draft);
    localStorage.setItem('ella-drafts', JSON.stringify(existingDrafts));

    return draft;
  };

  // Telemetry logging function
  const logTelemetryEvent = (eventName, data = {}) => {
    // In production, this would send to your analytics service
    console.log('Telemetry Event:', eventName, data);
    
    // Store events in localStorage for demo purposes
    const events = JSON.parse(localStorage.getItem('ella-telemetry') || '[]');
    events.push({
      event: eventName,
      data,
      timestamp: new Date().toISOString(),
      user_id: 'current_user_id' // Replace with actual user ID
    });
    localStorage.setItem('ella-telemetry', JSON.stringify(events));
  };

  if (!isOpen) return null;

  // Don't render content during rapid transitions to prevent DOM conflicts
  const shouldRenderContent = isOpen && !isTransitioning;

  return (
    <div className="type-selector-modal-overlay" onClick={handleBackdropClick}>
      <div 
        className="type-selector-modal" 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="type-selector-title"
        aria-describedby="type-selector-description"
      >
        <div className="type-selector-header">
          <h2 id="type-selector-title" className="type-selector-title">
            What do you want to create?
          </h2>
          <button
            className="type-selector-close"
            onClick={handleCancel}
            aria-label="Close modal"
            disabled={isLoading}
          >
            <span className="type-selector-close-icon">✕</span>
          </button>
        </div>

        <div className="type-selector-content">
          {shouldRenderContent ? (
            <>
              <div 
                id="type-selector-description" 
                className="type-selector-description"
              >
                Choose the type of content you want to create:
              </div>

              {error && (
                <div className="type-selector-error" role="alert">
                  <span className="type-selector-error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="type-selector-options" role="radiogroup" aria-labelledby="type-selector-title">
                {typeOptions.map((option, index) => (
                  <button
                    key={option.id}
                    ref={index === 0 ? firstOptionRef : null}
                    className={`type-selector-option ${selectedType === option.id ? 'type-selector-option--selected' : ''}`}
                    onClick={() => handleTypeSelect(option.id)}
                    disabled={isLoading}
                    role="radio"
                    aria-checked={selectedType === option.id}
                    aria-describedby={`type-${option.id}-description`}
                  >
                    <div className="type-selector-option-icon">
                      <span className="type-selector-emoji">{option.icon}</span>
                    </div>
                    <div className="type-selector-option-content">
                      <h3 className="type-selector-option-title">{option.title}</h3>
                      <p 
                        id={`type-${option.id}-description`}
                        className="type-selector-option-description"
                      >
                        {option.description}
                      </p>
                    </div>
                    <div className="type-selector-option-radio">
                      <div className="type-selector-radio-button">
                        {selectedType === option.id && (
                          <span className="type-selector-check">✓</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="type-selector-loading">
              <div className="type-selector-spinner">⟳</div>
              <span>Loading...</span>
            </div>
          )}
        </div>

        <div className="type-selector-footer">
          {shouldRenderContent ? (
            <>
              <div className="type-selector-footer-left">
                {selectedType && (
                  <button
                    className="type-selector-btn type-selector-btn--import"
                    onClick={handleImportClick}
                    disabled={isLoading}
                  >
                    <span className="type-selector-excel-icon">📊</span>
                    Import from Excel
                  </button>
                )}
              </div>
              
              <div className="type-selector-footer-right">
                <button
                  className="type-selector-btn type-selector-btn--secondary"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  className="type-selector-btn type-selector-btn--primary"
                  onClick={handleContinue}
                  disabled={!selectedType || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="type-selector-spinner">⟳</div>
                      Creating...
                    </>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="type-selector-footer-placeholder">
              <span>Loading...</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Import Modal */}
      <ImportModal
        isOpen={showImportModal}
        onClose={handleImportModalClose}
        onImport={handleImportComplete}
        selectedType={selectedType}
      />
    </div>
  );
};

export default TypeSelectorModal;
