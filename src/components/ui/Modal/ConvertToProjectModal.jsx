import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ConvertToProjectModal.scss';

const ConvertToProjectModal = ({
  isOpen,
  onClose,
  onConfirm,
  sourceWorkspace,
  orgWorkspaces = [],
  hasChildProjects = false
}) => {
  const [destinationWorkspaceId, setDestinationWorkspaceId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [groupContent, setGroupContent] = useState(true);
  const [archiveSource, setArchiveSource] = useState(true);
  const [errors, setErrors] = useState({});
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);

  // Mock data for available workspaces (excluding source workspace)
  const availableWorkspaces = orgWorkspaces.filter(ws => ws.id !== sourceWorkspace?.id);

  useEffect(() => {
    if (isOpen && sourceWorkspace) {
      setProjectName(sourceWorkspace.name || '');
      setDestinationWorkspaceId('');
      setGroupContent(true);
      setArchiveSource(true);
      setErrors({});
      setIsConverting(false);
      setConversionProgress(0);
    }
  }, [isOpen, sourceWorkspace]);

  const validate = () => {
    const newErrors = {};

    if (!destinationWorkspaceId) {
      newErrors.destinationWorkspaceId = 'Please select a destination workspace';
    }

    if (!projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    } else if (projectName.trim().length > 100) {
      newErrors.projectName = 'Project name cannot exceed 100 characters';
    }

    if (hasChildProjects) {
      newErrors.childProjects = 'You cannot convert this workspace because projects exist. Please move or archive child projects first.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsConverting(true);
    setConversionProgress(0);

    try {
      // Simulate conversion process with progress updates
      const steps = [
        { message: 'Validating conversion...', progress: 20 },
        { message: 'Creating new project...', progress: 40 },
        { message: 'Moving chats and saved work...', progress: 60 },
        { message: 'Transferring files...', progress: 80 },
        { message: 'Finalizing conversion...', progress: 100 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setConversionProgress(step.progress);
      }

      const conversionData = {
        sourceWorkspaceId: sourceWorkspace.id,
        destinationWorkspaceId,
        projectName: projectName.trim(),
        groupContent,
        archiveSource
      };

      if (onConfirm) {
        await onConfirm(conversionData);
      }

      // Success handling will be done by parent component
      onClose();
    } catch (error) {
      console.error('Conversion failed:', error);
      setErrors({ conversion: 'Conversion failed. Please try again.' });
    } finally {
      setIsConverting(false);
      setConversionProgress(0);
    }
  };

  if (!isOpen || !sourceWorkspace) return null;

  return createPortal(
    <>
      <div className="convert-modal__backdrop" onClick={!isConverting ? onClose : undefined} />
      <div className="convert-modal">
        <div className="convert-modal__header">
          <h2 className="convert-modal__title">Convert to Project</h2>
          {!isConverting && (
            <button className="convert-modal__close" onClick={onClose}>×</button>
          )}
        </div>

        {isConverting ? (
          <div className="convert-modal__progress">
            <div className="convert-modal__progress-content">
              <div className="convert-modal__spinner">
                <svg className="convert-modal__spinner-svg" viewBox="0 0 50 50">
                  <circle
                    className="convert-modal__spinner-circle"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="4"
                  />
                </svg>
              </div>
              <h3>Converting Workspace to Project</h3>
              <div className="convert-modal__progress-bar">
                <div 
                  className="convert-modal__progress-fill"
                  style={{ width: `${conversionProgress}%` }}
                />
              </div>
              <p>{conversionProgress}% Complete</p>
            </div>
          </div>
        ) : (
          <>
            <div className="convert-modal__content">
              <div className="convert-modal__info">
                <p>Convert <strong>"{sourceWorkspace.name}"</strong> workspace into a project within another workspace.</p>
              </div>

              {hasChildProjects && (
                <div className="convert-modal__error-banner">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#FEF2F2"/>
                    <path d="M10 6V10M10 14H10.01" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <strong>Conversion Blocked</strong>
                    <p>You cannot convert this workspace because it contains projects. Please move or archive child projects first.</p>
                  </div>
                </div>
              )}

              <div className="convert-modal__field">
                <label htmlFor="destinationWorkspace">
                  Destination Workspace <span className="convert-modal__required">*</span>
                </label>
                <select
                  id="destinationWorkspace"
                  className={`convert-modal__select ${errors.destinationWorkspaceId ? 'convert-modal__select--error' : ''}`}
                  value={destinationWorkspaceId}
                  onChange={(e) => setDestinationWorkspaceId(e.target.value)}
                  disabled={hasChildProjects}
                >
                  <option value="">Select a workspace...</option>
                  {availableWorkspaces.map(workspace => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </select>
                {errors.destinationWorkspaceId && (
                  <div className="convert-modal__error">{errors.destinationWorkspaceId}</div>
                )}
              </div>

              <div className="convert-modal__field">
                <label htmlFor="projectName">
                  Project Name <span className="convert-modal__required">*</span>
                </label>
                <input
                  id="projectName"
                  type="text"
                  className={`convert-modal__input ${errors.projectName ? 'convert-modal__input--error' : ''}`}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  maxLength={100}
                  disabled={hasChildProjects}
                />
                <div className="convert-modal__field-help">
                  {projectName.length}/100 characters
                </div>
                {errors.projectName && (
                  <div className="convert-modal__error">{errors.projectName}</div>
                )}
              </div>

              <div className="convert-modal__section">
                <h4>Options</h4>
                
                <label className="convert-modal__checkbox">
                  <input
                    type="checkbox"
                    checked={groupContent}
                    onChange={(e) => setGroupContent(e.target.checked)}
                    disabled={hasChildProjects}
                  />
                  <span className="convert-modal__checkbox-mark"></span>
                  <div className="convert-modal__checkbox-content">
                    <strong>Group original content</strong>
                    <p>Place workspace content in "Original Workspace Content" folder</p>
                  </div>
                </label>

                <label className="convert-modal__checkbox">
                  <input
                    type="checkbox"
                    checked={archiveSource}
                    onChange={(e) => setArchiveSource(e.target.checked)}
                    disabled={hasChildProjects}
                  />
                  <span className="convert-modal__checkbox-mark"></span>
                  <div className="convert-modal__checkbox-content">
                    <strong>Archive source workspace</strong>
                    <p>Archive the original workspace after successful conversion</p>
                  </div>
                </label>
              </div>

              {errors.conversion && (
                <div className="convert-modal__error-banner">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#FEF2F2"/>
                    <path d="M10 6V10M10 14H10.01" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <strong>Conversion Error</strong>
                    <p>{errors.conversion}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="convert-modal__footer">
              <button 
                className="convert-modal__cancel" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                className="convert-modal__confirm" 
                onClick={handleSubmit}
                disabled={hasChildProjects}
              >
                Convert to Project
              </button>
            </div>
          </>
        )}
      </div>
    </>,
    document.body
  );
};

export default ConvertToProjectModal;
