import React, { useState, useEffect, useRef } from 'react';
import '../../styles/PlaybookInputPanel.scss';
import ProjectCreateModal from '../ui/Modal/ProjectCreateModal';

const PlaybookInputPanel = ({ 
  isOpen, 
  onClose, 
  onBackToPreview,
  playbook,
  workspace: initialWorkspace,
  onSubmit,
  showICPs = true
}) => {
  // State management
  const [workspace, setWorkspace] = useState(initialWorkspace || null);
  const [project, setProject] = useState(null);
  const [selectedICPs, setSelectedICPs] = useState([]);
  const [allICPsSelected, setAllICPsSelected] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showICPDropdown, setShowICPDropdown] = useState(false);

  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const workspaceRef = useRef(null);
  const projectRef = useRef(null);
  const icpRef = useRef(null);

  // Mock data - replace with actual API calls
  const [workspaces] = useState([
    { id: 'ws1', name: 'Marketing Team' },
    { id: 'ws2', name: 'Sales Team' },
    { id: 'ws3', name: 'Product Team' }
  ]);

  const [projects, setProjects] = useState([
    { id: 'proj1', name: 'Q4 Campaign', workspaceId: 'ws1', description: 'Marketing campaign' },
    { id: 'proj2', name: 'Product Launch', workspaceId: 'ws1', description: 'Launch activities' },
    { id: 'proj3', name: 'Sales Enablement', workspaceId: 'ws2', description: 'Sales content' }
  ]);

  const [availableICPs] = useState([
    { id: 'icp1', name: 'Enterprise CMOs', workspaceId: 'ws1' },
    { id: 'icp2', name: 'SMB Marketing Managers', workspaceId: 'ws1' },
    { id: 'icp3', name: 'Tech Startups', workspaceId: 'ws1' },
    { id: 'icp4', name: 'Sales Directors', workspaceId: 'ws2' }
  ]);

  // Accepted file types
  const acceptedTypes = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'text/plain': 'TXT',
    'image/png': 'PNG',
    'image/jpeg': 'JPG',
    'image/jpg': 'JPG'
  };

  // Telemetry logging
  const logTelemetry = (event, data = {}) => {
    console.log('Telemetry:', event, {
      ...data,
      timestamp: new Date().toISOString(),
      playbookId: playbook?.id
    });
  };

  // Initialize telemetry on open
  useEffect(() => {
    if (isOpen) {
      logTelemetry('input_panel_opened', {
        playbookName: playbook?.title,
        hasWorkspace: !!workspace
      });
    }
  }, [isOpen]);

  // Log field changes (debounced)
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setTimeout(() => {
      if (specialInstructions) {
        logTelemetry('input_panel_field_changed', { field: 'special_instructions' });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [specialInstructions, isOpen]);

  // Handle workspace change - clear dependent fields
  useEffect(() => {
    if (workspace) {
      setProject(null);
      setSelectedICPs([]);
      setAllICPsSelected(false);
      logTelemetry('input_panel_field_changed', { field: 'workspace' });
    }
  }, [workspace?.id]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (workspaceRef.current && !workspaceRef.current.contains(event.target)) {
        setShowWorkspaceDropdown(false);
      }
      if (projectRef.current && !projectRef.current.contains(event.target)) {
        setShowProjectDropdown(false);
      }
      if (icpRef.current && !icpRef.current.contains(event.target)) {
        setShowICPDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get filtered projects and ICPs for current workspace
  const filteredProjects = workspace 
    ? projects.filter(p => p.workspaceId === workspace.id)
    : [];

  const filteredICPs = workspace
    ? availableICPs.filter(icp => icp.workspaceId === workspace.id)
    : [];

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!workspace) {
      newErrors.workspace = 'Please select a workspace';
    }

    if (!project) {
      newErrors.project = 'Please select or create a project';
    }

    if (showICPs) {
      if (!allICPsSelected && selectedICPs.length === 0) {
        newErrors.icps = 'Please select at least one ICP or choose "All ICPs"';
      }
    }

    // Check if all files are uploaded
    const hasUploadingFiles = files.some(f => f.status === 'uploading' || f.status === 'error');
    if (hasUploadingFiles) {
      newErrors.files = 'Please wait for all files to finish uploading or remove failed files';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus first invalid field
      const firstError = Object.keys(newErrors)[0];
      logTelemetry('input_panel_validation_failed', { first_error_field: firstError });
      
      // Announce to screen readers
      const errorMessage = `Validation failed: ${newErrors[firstError]}`;
      announceToScreenReader(errorMessage);
    }

    return Object.keys(newErrors).length === 0;
  };

  const isValid = () => {
    if (!workspace || !project) return false;
    if (showICPs && !allICPsSelected && selectedICPs.length === 0) return false;
    if (files.some(f => f.status === 'uploading' || f.status === 'error')) return false;
    return true;
  };

  // Screen reader announcements
  const announceToScreenReader = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  // ICP handlers
  const handleICPToggle = (icp) => {
    if (allICPsSelected) {
      setAllICPsSelected(false);
    }

    setSelectedICPs(prev => {
      if (prev.find(i => i.id === icp.id)) {
        return prev.filter(i => i.id !== icp.id);
      } else {
        return [...prev, icp];
      }
    });
  };

  const handleAllICPsToggle = () => {
    if (!allICPsSelected) {
      setSelectedICPs([]);
      setAllICPsSelected(true);
    } else {
      setAllICPsSelected(false);
    }
  };

  // File handling
  const validateFile = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isValidType = acceptedTypes[file.type] || ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'png', 'jpg', 'jpeg'].includes(fileExtension);
    const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
    
    return {
      isValid: isValidType && isValidSize,
      error: !isValidType ? 'File type not supported' : !isValidSize ? 'File size too large (max 50MB)' : null
    };
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles);
    const processedFiles = fileArray.map(file => {
      const validation = validateFile(file);
      const fileExtension = file.name.split('.').pop().toUpperCase();
      
      return {
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: formatFileSize(file.size),
        type: acceptedTypes[file.type] || fileExtension,
        progress: 0,
        status: validation.isValid ? 'uploading' : 'error',
        error: validation.error
      };
    });

    setFiles(prev => [...prev, ...processedFiles]);

    // Simulate upload for valid files
    processedFiles.forEach(fileData => {
      if (fileData.status === 'uploading') {
        simulateUpload(fileData);
      }
    });
  };

  const simulateUpload = (fileData) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === fileData.id) {
          const newProgress = Math.min(f.progress + Math.random() * 20, 100);
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...f, progress: 100, status: 'completed' };
          }
          return { ...f, progress: newProgress };
        }
        return f;
      }));
    }, 300);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const retryFile = (fileId) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        const validation = validateFile(f.file);
        if (validation.isValid) {
          const updatedFile = { ...f, status: 'uploading', progress: 0, error: null };
          simulateUpload(updatedFile);
          return updatedFile;
        }
      }
      return f;
    }));
  };

  // Project creation
  const handleCreateProject = (newProject) => {
    setProjects(prev => [...prev, { ...newProject, workspaceId: workspace.id }]);
    setProject(newProject);
    setShowProjectModal(false);
    announceToScreenReader(`Project ${newProject.name} created and selected`);
  };

  // Submit handlers
  const handlePlayWithElla = () => {
    if (!validate()) return;

    const context = {
      workspace,
      project,
      audience: allICPsSelected ? { type: 'all' } : { type: 'icps', icps: selectedICPs },
      specialInstructions,
      fileIds: files.filter(f => f.status === 'completed').map(f => f.id)
    };

    logTelemetry('input_panel_submitted', {
      mode: 'step_by_step',
      has_icps: !allICPsSelected,
      icp_count: selectedICPs.length,
      has_files: files.length > 0,
      file_count: files.filter(f => f.status === 'completed').length
    });

    announceToScreenReader('Opening Step-by-Step runner');
    onSubmit?.('step-by-step', context);
  };

  const handleAutoRunPlay = () => {
    if (!validate()) return;

    const context = {
      workspace,
      project,
      audience: allICPsSelected ? { type: 'all' } : { type: 'icps', icps: selectedICPs },
      specialInstructions,
      fileIds: files.filter(f => f.status === 'completed').map(f => f.id)
    };

    logTelemetry('input_panel_submitted', {
      mode: 'auto_run',
      has_icps: !allICPsSelected,
      icp_count: selectedICPs.length,
      has_files: files.length > 0,
      file_count: files.filter(f => f.status === 'completed').length
    });

    announceToScreenReader('Opening Auto-run runner');
    onSubmit?.('auto-run', context);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="playbook-input-panel__backdrop" onClick={onClose} />
      <div className="playbook-input-panel">
        {/* Header */}
        <div className="playbook-input-panel__header">
          <div className="playbook-input-panel__header-content">
            <h2 className="playbook-input-panel__title">{playbook?.title || 'Run Playbook'}</h2>
            <button 
              className="playbook-input-panel__back"
              onClick={onBackToPreview}
              aria-label="Back to preview"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Back to Preview</span>
            </button>
          </div>
          <button 
            className="playbook-input-panel__close"
            onClick={onClose}
            aria-label="Close panel"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="playbook-input-panel__body">
          {/* Workspace Selection */}
          <div className="playbook-input-panel__field">
            <label className="playbook-input-panel__label">
              Workspace
              <span className="playbook-input-panel__required">*</span>
            </label>
            <div className="playbook-input-panel__dropdown" ref={workspaceRef}>
              <button
                className={`playbook-input-panel__dropdown-trigger ${errors.workspace ? 'has-error' : ''}`}
                onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
                aria-expanded={showWorkspaceDropdown}
                aria-describedby={errors.workspace ? 'workspace-error' : undefined}
              >
                <span>{workspace?.name || 'Select workspace...'}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {showWorkspaceDropdown && (
                <div className="playbook-input-panel__dropdown-menu">
                  {workspaces.map(ws => (
                    <button
                      key={ws.id}
                      className={`playbook-input-panel__dropdown-item ${workspace?.id === ws.id ? 'selected' : ''}`}
                      onClick={() => {
                        setWorkspace(ws);
                        setShowWorkspaceDropdown(false);
                      }}
                    >
                      {ws.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.workspace && (
              <div className="playbook-input-panel__error" id="workspace-error">{errors.workspace}</div>
            )}
          </div>

          {/* Project Selection */}
          <div className="playbook-input-panel__field">
            <label className="playbook-input-panel__label">
              Project
              <span className="playbook-input-panel__required">*</span>
            </label>
            <div className="playbook-input-panel__dropdown" ref={projectRef}>
              <button
                className={`playbook-input-panel__dropdown-trigger ${errors.project ? 'has-error' : ''}`}
                onClick={() => workspace && setShowProjectDropdown(!showProjectDropdown)}
                disabled={!workspace}
                aria-expanded={showProjectDropdown}
                aria-describedby={errors.project ? 'project-error' : undefined}
              >
                <span>{project?.name || (workspace ? 'Select project...' : 'Select workspace first')}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {showProjectDropdown && workspace && (
                <div className="playbook-input-panel__dropdown-menu">
                  <button
                    className="playbook-input-panel__dropdown-item create-new"
                    onClick={() => {
                      setShowProjectModal(true);
                      setShowProjectDropdown(false);
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 3V11M3 7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Create new project</span>
                  </button>
                  {filteredProjects.length > 0 && (
                    <>
                      <div className="playbook-input-panel__dropdown-divider" />
                      {filteredProjects.map(proj => (
                        <button
                          key={proj.id}
                          className={`playbook-input-panel__dropdown-item ${project?.id === proj.id ? 'selected' : ''}`}
                          onClick={() => {
                            setProject(proj);
                            setShowProjectDropdown(false);
                          }}
                        >
                          <div className="playbook-input-panel__dropdown-item-content">
                            <span className="playbook-input-panel__dropdown-item-label">{proj.name}</span>
                            {proj.description && (
                              <span className="playbook-input-panel__dropdown-item-description">{proj.description}</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
            {errors.project && (
              <div className="playbook-input-panel__error" id="project-error">{errors.project}</div>
            )}
          </div>

          {/* ICPs Selection */}
          {showICPs && workspace && (
            <div className="playbook-input-panel__field">
              <label className="playbook-input-panel__label">
                Audience (ICPs)
                <span className="playbook-input-panel__required">*</span>
              </label>
              
              {/* All ICPs Option */}
              <div className="playbook-input-panel__checkbox-row">
                <label className="playbook-input-panel__checkbox">
                  <input
                    type="checkbox"
                    checked={allICPsSelected}
                    onChange={handleAllICPsToggle}
                  />
                  <span className="playbook-input-panel__checkbox-label">All ICPs</span>
                </label>
              </div>

              {/* ICP Multi-select */}
              {!allICPsSelected && filteredICPs.length > 0 && (
                <div className="playbook-input-panel__dropdown" ref={icpRef}>
                  <button
                    className={`playbook-input-panel__dropdown-trigger ${errors.icps ? 'has-error' : ''}`}
                    onClick={() => setShowICPDropdown(!showICPDropdown)}
                    aria-expanded={showICPDropdown}
                    aria-describedby={errors.icps ? 'icps-error' : undefined}
                  >
                    <span>
                      {selectedICPs.length === 0 
                        ? 'Select ICPs...' 
                        : `${selectedICPs.length} ICP${selectedICPs.length > 1 ? 's' : ''} selected`
                      }
                    </span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  {showICPDropdown && (
                    <div className="playbook-input-panel__dropdown-menu">
                      {filteredICPs.map(icp => (
                        <button
                          key={icp.id}
                          className={`playbook-input-panel__dropdown-item checkbox-item ${selectedICPs.find(i => i.id === icp.id) ? 'selected' : ''}`}
                          onClick={() => handleICPToggle(icp)}
                        >
                          <div className="playbook-input-panel__checkbox-indicator">
                            {selectedICPs.find(i => i.id === icp.id) && (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span>{icp.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {filteredICPs.length === 0 && (
                <div className="playbook-input-panel__helper">
                  No ICPs found — choose All ICPs or add later in the run.
                </div>
              )}
              
              {errors.icps && (
                <div className="playbook-input-panel__error" id="icps-error">{errors.icps}</div>
              )}
            </div>
          )}

          {/* Special Instructions */}
          <div className="playbook-input-panel__field">
            <label className="playbook-input-panel__label">
              Special Instructions
              <span className="playbook-input-panel__optional">(optional)</span>
            </label>
            <textarea
              className="playbook-input-panel__textarea"
              value={specialInstructions}
              onChange={(e) => {
                if (e.target.value.length <= 2000) {
                  setSpecialInstructions(e.target.value);
                }
              }}
              placeholder="Add any special instructions or context for this run..."
              rows={4}
              maxLength={2000}
            />
            <div className="playbook-input-panel__char-count">
              {specialInstructions.length} / 2000
            </div>
          </div>

          {/* File Upload */}
          <div className="playbook-input-panel__field">
            <label className="playbook-input-panel__label">
              Add Files
              <span className="playbook-input-panel__optional">(optional)</span>
            </label>
            
            <div 
              ref={dropZoneRef}
              className={`playbook-input-panel__drop-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 10V30M10 20H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
              </svg>
              <p className="playbook-input-panel__drop-text">
                Drag & drop files here or <span>browse</span>
              </p>
              <p className="playbook-input-panel__drop-hint">
                PDF, DOCX, PPTX, XLSX, TXT, PNG, JPG (max 50MB)
              </p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="playbook-input-panel__file-list">
                {files.map(file => (
                  <div 
                    key={file.id} 
                    className={`playbook-input-panel__file-item ${file.status}`}
                  >
                    <div className="playbook-input-panel__file-info">
                      <div className="playbook-input-panel__file-icon">
                        {file.type}
                      </div>
                      <div className="playbook-input-panel__file-details">
                        <span className="playbook-input-panel__file-name">{file.name}</span>
                        <span className="playbook-input-panel__file-size">{file.size}</span>
                        {file.error && (
                          <span className="playbook-input-panel__file-error">{file.error}</span>
                        )}
                      </div>
                    </div>
                    
                    {file.status === 'uploading' && (
                      <div className="playbook-input-panel__file-progress">
                        <div 
                          className="playbook-input-panel__file-progress-bar"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                    
                    {file.status === 'completed' && (
                      <div className="playbook-input-panel__file-status">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    
                    <div className="playbook-input-panel__file-actions">
                      {file.status === 'error' && (
                        <button
                          className="playbook-input-panel__file-action"
                          onClick={() => retryFile(file.id)}
                          aria-label="Retry upload"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M12 7C12 9.761 9.761 12 7 12C4.239 12 2 9.761 2 7C2 4.239 4.239 2 7 2C8.38 2 9.62 2.56 10.54 3.46M10 2V5H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      )}
                      <button
                        className="playbook-input-panel__file-action"
                        onClick={() => removeFile(file.id)}
                        aria-label="Remove file"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {errors.files && (
              <div className="playbook-input-panel__error">{errors.files}</div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="playbook-input-panel__footer">
          <button
            className="playbook-input-panel__btn playbook-input-panel__btn--primary"
            onClick={handlePlayWithElla}
            disabled={!isValid()}
            title="Guide me step-by-step and chat per step"
            aria-disabled={!isValid()}
            aria-describedby="play-with-ella-tooltip"
          >
            Play with Ella
          </button>
          <button
            className="playbook-input-panel__btn playbook-input-panel__btn--secondary"
            onClick={handleAutoRunPlay}
            disabled={!isValid()}
            title="Fill variables once, generate each Play automatically"
            aria-disabled={!isValid()}
            aria-describedby="auto-run-tooltip"
          >
            Auto-run Play
          </button>
        </div>

        {/* Tooltips (hidden, for aria-describedby) */}
        <div id="play-with-ella-tooltip" className="sr-only">
          Guide me step-by-step and chat per step
        </div>
        <div id="auto-run-tooltip" className="sr-only">
          Fill variables once, generate each Play automatically
        </div>
      </div>

      {/* Project Create Modal */}
      <ProjectCreateModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSubmit={handleCreateProject}
        existingProjects={filteredProjects}
      />

      {/* Screen reader only styles */}
      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </>
  );
};

export default PlaybookInputPanel;

