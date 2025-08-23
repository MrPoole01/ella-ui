import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './InviteUsersModal.scss';

const InviteUsersModal = ({
  isOpen,
  onClose,
  onSendInvites,
  currentUserRole = 'Admin',
  availableWorkspaces = [],
  availableProjects = []
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [emailChips, setEmailChips] = useState([]);
  const [selectedRole, setSelectedRole] = useState('User');
  const [selectedWorkspaces, setSelectedWorkspaces] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [inviteMessage, setInviteMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const emailInputRef = useRef(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setEmailInput('');
      setEmailChips([]);
      setSelectedRole('User');
      setSelectedWorkspaces([]);
      setSelectedProjects([]);
      setInviteMessage('');
      setErrors({});
      setIsProcessing(false);
      // Focus email input after modal opens
      setTimeout(() => emailInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Filter projects based on selected workspaces
  const filteredProjects = selectedWorkspaces.length > 0 
    ? availableProjects.filter(project => 
        selectedWorkspaces.some(workspace => 
          project.workspaces?.includes(workspace.id) || project.workspace === workspace.id
        )
      )
    : availableProjects;

  // Get available roles based on current user's permissions
  const getAvailableRoles = () => {
    const allRoles = [
      { value: 'Guest', label: 'Guest' },
      { value: 'User', label: 'User' },
      { value: 'Workspace Owner', label: 'Workspace Owner' },
      { value: 'Admin', label: 'Admin' }
    ];

    // Filter roles based on current user's maximum grantable role
    switch (currentUserRole) {
      case 'Admin':
        return allRoles;
      case 'Workspace Owner':
        return allRoles.filter(role => !['Admin'].includes(role.value));
      case 'User':
        return allRoles.filter(role => !['Admin', 'Workspace Owner'].includes(role.value));
      default:
        return allRoles.filter(role => role.value === 'Guest');
    }
  };

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Handle email input changes and chip creation
  const handleEmailInputChange = (e) => {
    const value = e.target.value;
    setEmailInput(value);

    // Check for separators (comma, space, newline, semicolon)
    const separators = /[,;\s\n]+/;
    if (separators.test(value)) {
      const emails = value.split(separators)
        .map(email => email.trim())
        .filter(email => email.length > 0);
      
      if (emails.length > 0) {
        addEmailChips(emails);
        setEmailInput('');
      }
    }
  };

  // Handle email input key events
  const handleEmailKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const email = emailInput.trim();
      if (email) {
        addEmailChips([email]);
        setEmailInput('');
      }
    } else if (e.key === 'Backspace' && emailInput === '' && emailChips.length > 0) {
      // Remove last chip when backspacing on empty input
      removeEmailChip(emailChips.length - 1);
    }
  };

  // Add email chips with validation
  const addEmailChips = (emails) => {
    const newChips = [];
    const newErrors = { ...errors };

    emails.forEach(email => {
      const trimmedEmail = email.trim().toLowerCase();
      
      if (!trimmedEmail) return;

      // Check for duplicates
      const isDuplicate = emailChips.some(chip => chip.email.toLowerCase() === trimmedEmail);
      
      if (isDuplicate) {
        newErrors[trimmedEmail] = 'Duplicate email address';
        return;
      }

      // Validate email format
      const isValid = isValidEmail(trimmedEmail);
      
      newChips.push({
        email: trimmedEmail,
        isValid,
        error: isValid ? null : 'Invalid email format'
      });

      if (!isValid) {
        newErrors[trimmedEmail] = 'Invalid email format';
      } else {
        delete newErrors[trimmedEmail];
      }
    });

    setEmailChips(prev => [...prev, ...newChips]);
    setErrors(newErrors);
  };

  // Remove email chip
  const removeEmailChip = (index) => {
    const chipToRemove = emailChips[index];
    setEmailChips(prev => prev.filter((_, i) => i !== index));
    
    // Remove error for this email
    if (chipToRemove) {
      const newErrors = { ...errors };
      delete newErrors[chipToRemove.email];
      setErrors(newErrors);
    }
  };

  // Handle workspace selection
  const handleWorkspaceToggle = (workspace) => {
    setSelectedWorkspaces(prev => {
      const isSelected = prev.find(w => w.id === workspace.id);
      if (isSelected) {
        // Remove workspace and its projects
        const newWorkspaces = prev.filter(w => w.id !== workspace.id);
        setSelectedProjects(prevProjects => 
          prevProjects.filter(project => 
            !project.workspaces?.includes(workspace.id) && project.workspace !== workspace.id
          )
        );
        return newWorkspaces;
      } else {
        // Add workspace
        return [...prev, workspace];
      }
    });
  };

  // Handle project selection
  const handleProjectToggle = (project) => {
    setSelectedProjects(prev => {
      const isSelected = prev.find(p => p.id === project.id);
      if (isSelected) {
        return prev.filter(p => p.id !== project.id);
      } else {
        return [...prev, project];
      }
    });
  };

  // Check if send button should be enabled
  const canSendInvites = () => {
    const validEmails = emailChips.filter(chip => chip.isValid);
    return validEmails.length > 0 && !isProcessing;
  };

  // Handle send invites
  const handleSendInvites = async () => {
    if (!canSendInvites()) return;

    setIsProcessing(true);
    
    const validEmails = emailChips.filter(chip => chip.isValid);
    const inviteData = {
      emails: validEmails.map(chip => chip.email),
      role: selectedRole,
      workspaces: selectedWorkspaces,
      projects: selectedProjects,
      message: inviteMessage.trim(),
      invitedBy: 'Current User' // This would come from auth context
    };

    try {
      const result = await onSendInvites(inviteData);
      
      if (result.success) {
        // Show success and close modal
        onClose();
      } else {
        // Handle per-email errors
        const newErrors = { ...errors };
        result.emailErrors?.forEach(error => {
          newErrors[error.email] = error.message;
        });
        setErrors(newErrors);
      }
    } catch (error) {
      console.error('Error sending invites:', error);
      setErrors({ general: 'Failed to send invites. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle paste events
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const emails = pastedText.split(/[,;\s\n]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    if (emails.length > 0) {
      addEmailChips(emails);
    }
  };

  if (!isOpen) return null;

  const validEmailCount = emailChips.filter(chip => chip.isValid).length;

  return createPortal(
    <>
      <div className="invite-users__backdrop" onClick={onClose} />
      <div className="invite-users">
        <div className="invite-users__header">
          <h2 className="invite-users__title">Invite Users</h2>
          <button className="invite-users__close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="invite-users__content">
          {/* Email Input Section */}
          <div className="invite-users__field">
            <label className="invite-users__label">
              Email Addresses<span className="invite-users__required">*</span>
            </label>
            <div className="invite-users__email-container">
              <div className="invite-users__email-chips">
                {emailChips.map((chip, index) => (
                  <div 
                    key={index} 
                    className={`invite-users__email-chip ${!chip.isValid ? 'invite-users__email-chip--error' : ''}`}
                    title={chip.error || chip.email}
                  >
                    <span className="invite-users__email-chip-text">{chip.email}</span>
                    <button 
                      type="button"
                      className="invite-users__email-chip-remove"
                      onClick={() => removeEmailChip(index)}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
                <input
                  ref={emailInputRef}
                  type="text"
                  value={emailInput}
                  onChange={handleEmailInputChange}
                  onKeyDown={handleEmailKeyDown}
                  onPaste={handlePaste}
                  placeholder={emailChips.length === 0 ? "Enter email addresses (separated by comma, space, or newline)" : ""}
                  className="invite-users__email-input"
                />
              </div>
            </div>
            <div className="invite-users__email-help">
              You can paste multiple email addresses separated by commas, spaces, or new lines.
            </div>
          </div>

          {/* Role Selection */}
          <div className="invite-users__field">
            <label className="invite-users__label">
              Role<span className="invite-users__required">*</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="invite-users__select"
            >
              {getAvailableRoles().map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <div className="invite-users__field-help">
              All invited users will be assigned this role.
            </div>
          </div>

          {/* Workspaces Selection */}
          <div className="invite-users__field">
            <label className="invite-users__label">Workspaces (Optional)</label>
            <div className="invite-users__multi-select">
              <div className="invite-users__selected-items">
                {selectedWorkspaces.map(workspace => (
                  <div key={workspace.id} className="invite-users__selected-chip">
                    <span>{workspace.name}</span>
                    <button 
                      type="button"
                      onClick={() => handleWorkspaceToggle(workspace)}
                      className="invite-users__selected-chip-remove"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="invite-users__dropdown">
                <div className="invite-users__dropdown-header">Available Workspaces</div>
                <div className="invite-users__dropdown-content">
                  {availableWorkspaces.length > 0 ? (
                    availableWorkspaces.map(workspace => {
                      const isSelected = selectedWorkspaces.find(w => w.id === workspace.id);
                      return (
                        <label key={workspace.id} className="invite-users__dropdown-item">
                          <input
                            type="checkbox"
                            checked={!!isSelected}
                            onChange={() => handleWorkspaceToggle(workspace)}
                            className="invite-users__checkbox"
                          />
                          <span>{workspace.name}</span>
                        </label>
                      );
                    })
                  ) : (
                    <div className="invite-users__empty-state">No workspaces available</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Projects Selection */}
          <div className="invite-users__field">
            <label className="invite-users__label">Projects (Optional)</label>
            <div className="invite-users__multi-select">
              <div className="invite-users__selected-items">
                {selectedProjects.map(project => (
                  <div key={project.id} className="invite-users__selected-chip">
                    <span>{project.name}</span>
                    <button 
                      type="button"
                      onClick={() => handleProjectToggle(project)}
                      className="invite-users__selected-chip-remove"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="invite-users__dropdown">
                <div className="invite-users__dropdown-header">
                  {selectedWorkspaces.length > 0 ? 'Projects in Selected Workspaces' : 'Available Projects'}
                </div>
                <div className="invite-users__dropdown-content">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => {
                      const isSelected = selectedProjects.find(p => p.id === project.id);
                      return (
                        <label key={project.id} className="invite-users__dropdown-item">
                          <input
                            type="checkbox"
                            checked={!!isSelected}
                            onChange={() => handleProjectToggle(project)}
                            className="invite-users__checkbox"
                          />
                          <span>{project.name}</span>
                        </label>
                      );
                    })
                  ) : (
                    <div className="invite-users__empty-state">
                      {selectedWorkspaces.length > 0 ? 'No projects in selected workspaces' : 'No projects available'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="invite-users__field">
            <label className="invite-users__label">Welcome Message (Optional)</label>
            <textarea
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              placeholder="Add a personal welcome message to the invitation..."
              className="invite-users__textarea"
              rows={3}
              maxLength={500}
            />
            <div className="invite-users__field-help">
              {inviteMessage.length}/500 characters
            </div>
          </div>

          {/* Preview Summary */}
          {validEmailCount > 0 && (
            <div className="invite-users__preview">
              <div className="invite-users__preview-title">Preview</div>
              <div className="invite-users__preview-content">
                Inviting <strong>{validEmailCount}</strong> user{validEmailCount !== 1 ? 's' : ''} as <strong>{selectedRole}</strong>
                {selectedWorkspaces.length > 0 && (
                  <> to <strong>{selectedWorkspaces.length}</strong> workspace{selectedWorkspaces.length !== 1 ? 's' : ''}</>
                )}
                {selectedProjects.length > 0 && (
                  <> and <strong>{selectedProjects.length}</strong> project{selectedProjects.length !== 1 ? 's' : ''}</>
                )}
                .
              </div>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="invite-users__error">
              {errors.general}
            </div>
          )}
        </div>

        <div className="invite-users__footer">
          <button className="invite-users__cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            className={`invite-users__send ${!canSendInvites() ? 'invite-users__send--disabled' : ''}`}
            onClick={handleSendInvites}
            disabled={!canSendInvites()}
          >
            {isProcessing ? (
              <>
                <svg className="invite-users__spinner" width="16" height="16" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="37.7" strokeDashoffset="37.7">
                    <animate attributeName="stroke-dashoffset" dur="1s" values="37.7;0" repeatCount="indefinite"/>
                  </circle>
                </svg>
                Sending...
              </>
            ) : (
              `Send Invite${validEmailCount !== 1 ? 's' : ''} (${validEmailCount})`
            )}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default InviteUsersModal;
