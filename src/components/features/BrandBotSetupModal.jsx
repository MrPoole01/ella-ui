import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../../styles/BrandBotSetupModal.scss';

const BrandBotSetupModal = ({
  isOpen,
  onClose,
  onComplete, // (data: { mode, websiteUrl, competitorUrls, files, notes })
  persistedStateKey = 'brandbot-setup-state'
}) => {
  const [currentStep, setCurrentStep] = useState(0); // 0: Welcome, 1: Path, 2: Intake, 3: Summary
  const [mode, setMode] = useState(null); // 'established' | 'new'
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [competitorUrls, setCompetitorUrls] = useState(['']);
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]); // {id, file, name, sizeLabel, type, progress, status, error}
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef(null);

  // New/Reimagined flow specific fields
  const [companyDescription, setCompanyDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [brandFeel, setBrandFeel] = useState('');

  // Restore persisted state when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem(persistedStateKey);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.currentStep !== undefined) setCurrentStep(saved.currentStep);
          if (saved.mode) setMode(saved.mode);
          if (saved.websiteUrl) setWebsiteUrl(saved.websiteUrl);
          if (Array.isArray(saved.competitorUrls)) setCompetitorUrls(saved.competitorUrls);
          if (saved.notes) setNotes(saved.notes);
          if (Array.isArray(saved.files)) setFiles(saved.files);
          if (saved.companyDescription) setCompanyDescription(saved.companyDescription);
          if (saved.targetAudience) setTargetAudience(saved.targetAudience);
          if (saved.brandFeel) setBrandFeel(saved.brandFeel);
        }
      } catch (_) {}
    }
  }, [isOpen, persistedStateKey]);

  // Persist state whenever it changes
  const persist = () => {
    try {
      localStorage.setItem(persistedStateKey, JSON.stringify({
        currentStep,
        mode,
        websiteUrl,
        competitorUrls,
        notes,
        files: files.map(({ file, ...rest }) => rest), // Exclude file object for storage
        companyDescription,
        targetAudience,
        brandFeel
      }));
    } catch (_) {}
  };

  useEffect(() => {
    if (isOpen) {
      persist();
    }
  }, [currentStep, mode, websiteUrl, competitorUrls, notes, files, isOpen, companyDescription, targetAudience, brandFeel]);

  // File handling
  const acceptedTypes = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'image/png': 'PNG',
    'image/jpeg': 'JPG',
    'image/jpg': 'JPG',
    'application/zip': 'ZIP'
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const okType = acceptedTypes[file.type] || ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'png', 'jpg', 'jpeg', 'zip'].includes(ext);
    const okSize = file.size <= 50 * 1024 * 1024;
    return {
      isValid: okType && okSize,
      error: !okType ? 'File type not supported' : !okSize ? 'File size too large (max 50MB)' : null
    };
  };

  const simulateUpload = (fileId) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === fileId) {
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

  const handleFileInput = (inputFiles) => {
    const items = Array.from(inputFiles).map(file => {
      const validation = validateFile(file);
      return {
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        sizeLabel: formatFileSize(file.size),
        type: acceptedTypes[file.type] || file.name.split('.').pop().toUpperCase(),
        progress: 0,
        status: validation.isValid ? 'uploading' : 'error',
        error: validation.error
      };
    });
    setFiles(prev => [...prev, ...items]);
    items.forEach(f => {
      if (f.status === 'uploading') simulateUpload(f.id);
    });
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const retryFile = (fileId) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId && f.file) {
        const v = validateFile(f.file);
        if (v.isValid) {
          const updated = { ...f, status: 'uploading', progress: 0, error: null };
          simulateUpload(updated.id);
          return updated;
        }
      }
      return f;
    }));
  };

  // Drag & drop handlers
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
    if (e.dataTransfer.files?.length) {
      handleFileInput(e.dataTransfer.files);
    }
  };

  // URL handling
  const addCompetitorUrl = () => {
    setCompetitorUrls(prev => [...prev, '']);
  };

  const removeCompetitorUrl = (index) => {
    setCompetitorUrls(prev => prev.filter((_, i) => i !== index));
  };

  const updateCompetitorUrl = (index, value) => {
    setCompetitorUrls(prev => prev.map((url, i) => i === index ? value : url));
  };

  // Auto-prefix https:// to website URL
  const handleWebsiteUrlChange = (value) => {
    let processedValue = value;
    if (value && !value.startsWith('http://') && !value.startsWith('https://') && value.length > 0) {
      processedValue = 'https://' + value;
    }
    setWebsiteUrl(processedValue);
  };

  // Navigation helpers
  const canProceedToNext = useMemo(() => {
    if (currentStep === 0) return true; // Welcome step always allows next
    if (currentStep === 1) return !!mode; // Path step requires mode selection
    if (currentStep === 2 && mode === 'established') return true; // Intake allows skip
    if (currentStep === 3) return true; // Summary allows next
    return false;
  }, [currentStep, mode]);

  const hasUploadingFiles = useMemo(() => {
    return files.some(f => f.status === 'uploading');
  }, [files]);

  // Handlers
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    const data = {
      mode,
      websiteUrl: mode === 'established' ? websiteUrl : null,
      competitorUrls: mode === 'established' ? competitorUrls.filter(url => url.trim() !== '') : [],
      files: files.filter(f => f.status === 'completed'),
      notes: mode === 'established' ? notes : null
    };
    
    // Clear persisted state after completion
    try {
      localStorage.removeItem(persistedStateKey);
    } catch (_) {}
    
    onComplete?.(data);
  };

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
  };

  const handleStartGuidedInterview = () => {
    // Prepare data for Guided Interview Playbook
    const guidedData = {
      mode: 'new',
      websiteUrl,
      files: files.filter(f => f.status === 'completed'),
      notes
    };

    console.log('Starting Guided Interview with data:', guidedData);

    // Dispatch event to trigger Guided Interview Playbook launch
    window.dispatchEvent(new CustomEvent('brandbot:launch_guided_interview', {
      detail: guidedData
    }));

    // Clear persisted state after launch
    try {
      localStorage.removeItem(persistedStateKey);
    } catch (_) {}

    // Close modal
    onClose?.();
  };

  if (!isOpen) return null;

  // Completed files count for summary
  const completedFilesCount = files.filter(f => f.status === 'completed').length;
  const validCompetitorUrls = competitorUrls.filter(url => url.trim() !== '');

  return (
    <>
      {/* Backdrop */}
      <div className="brandbot-setup-modal__backdrop" onClick={onClose} />
      
      {/* Modal */}
      <div className="brandbot-setup-modal">
        {/* Header */}
        <div className="brandbot-setup-modal__header">
          <div className="brandbot-setup-modal__header-content">
            <div className="brandbot-setup-modal__progress-indicator">
              <div className="brandbot-setup-modal__step-counter">
                {currentStep + 1} / 4
              </div>
              <div className="brandbot-setup-modal__progress-bar">
                <div 
                  className="brandbot-setup-modal__progress-fill"
                  style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
                />
              </div>
            </div>
            <button className="brandbot-setup-modal__close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="brandbot-setup-modal__content">
          {currentStep === 0 && (
            // Welcome Step
            <div className="brandbot-setup-modal__step brandbot-setup-modal__step--welcome">
              <div className="brandbot-setup-modal__step-icon">🚀</div>
              <h2 className="brandbot-setup-modal__step-title">Turn Ella into Your Marketing Genius</h2>
              <p className="brandbot-setup-modal__step-subtitle">
                In just a few minutes, we'll set up your personal Brand Bot that knows your company, customers, and market. Start by telling us a bit about your brand.
              </p>
              <div className="brandbot-setup-modal__features">
                <div className="brandbot-setup-modal__feature">
                  <span>Auto-crawl your website</span>
                </div>
                <div className="brandbot-setup-modal__feature">
                  <span>Analyze competitors</span>
                </div>
                <div className="brandbot-setup-modal__feature">
                  <span>Learn from your materials</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            // Path Selection Step
            <div className="brandbot-setup-modal__step brandbot-setup-modal__step--path">
              <h2 className="brandbot-setup-modal__step-title">Who Are You?</h2>
              <p className="brandbot-setup-modal__step-subtitle">
                We'll tailor your setup based on your situation.
              </p>
              
              <div className="brandbot-setup-modal__mode-options">
                <button
                  className={`brandbot-setup-modal__mode-card ${mode === 'established' ? 'brandbot-setup-modal__mode-card--selected' : ''}`}
                  onClick={() => handleModeSelect('established')}
                >
                  <div className="brandbot-setup-modal__mode-icon">📊</div>
                  <h3 className="brandbot-setup-modal__mode-title">Established Brand</h3>
                  <p className="brandbot-setup-modal__mode-description">
                    You have marketing materials, existing messaging, or brand assets ready to share.
                  </p>
                </button>

                <button
                  className={`brandbot-setup-modal__mode-card ${mode === 'new' ? 'brandbot-setup-modal__mode-card--selected' : ''}`}
                  onClick={() => handleModeSelect('new')}
                >
                  <div className="brandbot-setup-modal__mode-icon">🌱</div>
                  <h3 className="brandbot-setup-modal__mode-title">New or Reimagining</h3>
                  <p className="brandbot-setup-modal__mode-description">
                    You're starting fresh or redefining your brand. We'll guide you through discovery.
                  </p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            // Step 2: Intake (content changes based on mode)
            mode === 'established' ? (
            // Established Brand Intake
            <div className="brandbot-setup-modal__step brandbot-setup-modal__step--intake">
              <h2 className="brandbot-setup-modal__step-title">Share Your Brand Details</h2>
              <p className="brandbot-setup-modal__step-subtitle">
                Upload materials and add links. Ella will analyze them to understand your brand better.
              </p>

              {/* Website URL */}
              <div className="brandbot-setup-modal__form-group">
                <label className="brandbot-setup-modal__label">Company Website</label>
                <input
                  type="url"
                  className="brandbot-setup-modal__input"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => handleWebsiteUrlChange(e.target.value)}
                />
                <p className="brandbot-setup-modal__helper-text">
                  Ella will auto-crawl your website in the background.
                </p>
              </div>

              {/* Competitor URLs */}
              <div className="brandbot-setup-modal__form-group">
                <label className="brandbot-setup-modal__label">Competitor URLs (optional)</label>
                <div className="brandbot-setup-modal__competitor-urls">
                  {competitorUrls.map((url, index) => (
                    <div key={index} className="brandbot-setup-modal__competitor-url-row">
                      <input
                        type="url"
                        className="brandbot-setup-modal__input"
                        placeholder={`https://competitor${index + 1}.com`}
                        value={url}
                        onChange={(e) => updateCompetitorUrl(index, e.target.value)}
                      />
                      {competitorUrls.length > 1 && (
                        <button
                          className="brandbot-setup-modal__remove-btn"
                          onClick={() => removeCompetitorUrl(index)}
                          title="Remove"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {competitorUrls.length < 10 && (
                    <button
                      className="brandbot-setup-modal__add-btn"
                      onClick={addCompetitorUrl}
                    >
                      + Add another
                    </button>
                  )}
                </div>
                <p className="brandbot-setup-modal__helper-text">
                  Add up to 10 competitor URLs.
                </p>
              </div>

              {/* File Upload */}
              <div className="brandbot-setup-modal__form-group">
                <label className="brandbot-setup-modal__label">Upload Brand Assets (optional)</label>
                <div
                  ref={dropZoneRef}
                  className={`brandbot-setup-modal__upload-zone ${isDragging ? 'brandbot-setup-modal__upload-zone--dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    onChange={(e) => e.target.files && handleFileInput(e.target.files)}
                    style={{ display: 'none' }}
                    id="brandbot-file-input"
                  />
                  <label htmlFor="brandbot-file-input" className="brandbot-setup-modal__upload-label">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M16 2V14M16 14L9 7M16 14L23 7M28 16V26C28 27.1 27.1 28 26 28H6C4.9 28 4 27.1 4 26V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="brandbot-setup-modal__upload-text">
                      Drag & drop files here or <strong>click to browse</strong>
                    </span>
                    <span className="brandbot-setup-modal__upload-hint">
                      PDF, DOCX, PPTX, PNG, JPG, ZIP (max 50MB each)
                    </span>
                  </label>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="brandbot-setup-modal__file-list">
                    {files.map(f => (
                      <div key={f.id} className="brandbot-setup-modal__file-item">
                        <div className="brandbot-setup-modal__file-info">
                          <div className="brandbot-setup-modal__file-name">{f.name}</div>
                          <div className="brandbot-setup-modal__file-meta">
                            {f.sizeLabel} • {f.type}
                          </div>
                        </div>
                        <div className="brandbot-setup-modal__file-status">
                          {f.status === 'uploading' && (
                            <div className="brandbot-setup-modal__progress">
                              <div className="brandbot-setup-modal__progress-bar-small">
                                <div
                                  className="brandbot-setup-modal__progress-fill-small"
                                  style={{ width: `${f.progress}%` }}
                                />
                              </div>
                              <span className="brandbot-setup-modal__progress-percent">{Math.round(f.progress)}%</span>
                            </div>
                          )}
                          {f.status === 'completed' && (
                            <span className="brandbot-setup-modal__status-completed">✓</span>
                          )}
                          {f.status === 'error' && (
                            <>
                              <span className="brandbot-setup-modal__status-error">{f.error}</span>
                              <button
                                className="brandbot-setup-modal__retry-btn"
                                onClick={() => retryFile(f.id)}
                              >
                                Retry
                              </button>
                            </>
                          )}
                          <button
                            className="brandbot-setup-modal__remove-file-btn"
                            onClick={() => removeFile(f.id)}
                            title="Remove file"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="brandbot-setup-modal__helper-text">
                  Drop files that describe your business, brand, or customers.
                </p>
              </div>

              {/* Optional Notes */}
              <div className="brandbot-setup-modal__form-group">
                <label className="brandbot-setup-modal__label">Additional Notes (optional)</label>
                <textarea
                  className="brandbot-setup-modal__textarea"
                  placeholder="Share any other details about your business, market, or goals..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={1000}
                  rows={3}
                />
                <p className="brandbot-setup-modal__helper-text">
                  {notes.length} / 1000
                </p>
              </div>
            </div>
            ) : (
            // Guided Intake (New/Reimagined Brand)
            <div className="brandbot-setup-modal__step brandbot-setup-modal__step--intake">
              <h2 className="brandbot-setup-modal__step-title">Help Ella Learn About Your Company</h2>
              <p className="brandbot-setup-modal__step-subtitle">
                Answer a few quick questions to get started. All fields are optional.
              </p>

              {/* Website URL */}
              <div className="brandbot-setup-modal__form-group">
                <label className="brandbot-setup-modal__label">Company Website (optional)</label>
                <input
                  type="url"
                  className="brandbot-setup-modal__input"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => handleWebsiteUrlChange(e.target.value)}
                />
                <p className="brandbot-setup-modal__helper-text">
                  Ella can learn about your company from your website.
                </p>
              </div>

              {/* File Upload */}
              <div className="brandbot-setup-modal__form-group">
                <label className="brandbot-setup-modal__label">Upload Materials (optional)</label>
                <div
                  ref={dropZoneRef}
                  className={`brandbot-setup-modal__upload-zone ${isDragging ? 'brandbot-setup-modal__upload-zone--dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    onChange={(e) => e.target.files && handleFileInput(e.target.files)}
                    style={{ display: 'none' }}
                    id="brandbot-guided-file-input"
                  />
                  <label htmlFor="brandbot-guided-file-input" className="brandbot-setup-modal__upload-label">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M16 2V14M16 14L9 7M16 14L23 7M28 16V26C28 27.1 27.1 28 26 28H6C4.9 28 4 27.1 4 26V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="brandbot-setup-modal__upload-text">
                      Drag & drop files here or <strong>click to browse</strong>
                    </span>
                    <span className="brandbot-setup-modal__upload-hint">
                      PDF, DOCX, PPTX, PNG, JPG, ZIP (max 50MB each)
                    </span>
                  </label>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="brandbot-setup-modal__file-list">
                    {files.map(f => (
                      <div key={f.id} className="brandbot-setup-modal__file-item">
                        <div className="brandbot-setup-modal__file-info">
                          <div className="brandbot-setup-modal__file-name">{f.name}</div>
                          <div className="brandbot-setup-modal__file-meta">
                            {f.sizeLabel} • {f.type}
                          </div>
                        </div>
                        <div className="brandbot-setup-modal__file-status">
                          {f.status === 'uploading' && (
                            <div className="brandbot-setup-modal__progress">
                              <div className="brandbot-setup-modal__progress-bar-small">
                                <div
                                  className="brandbot-setup-modal__progress-fill-small"
                                  style={{ width: `${f.progress}%` }}
                                />
                              </div>
                              <span className="brandbot-setup-modal__progress-percent">{Math.round(f.progress)}%</span>
                            </div>
                          )}
                          {f.status === 'completed' && (
                            <span className="brandbot-setup-modal__status-completed">✓</span>
                          )}
                          {f.status === 'error' && (
                            <>
                              <span className="brandbot-setup-modal__status-error">{f.error}</span>
                              <button
                                className="brandbot-setup-modal__retry-btn"
                                onClick={() => retryFile(f.id)}
                              >
                                Retry
                              </button>
                            </>
                          )}
                          <button
                            className="brandbot-setup-modal__remove-file-btn"
                            onClick={() => removeFile(f.id)}
                            title="Remove file"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="brandbot-setup-modal__helper-text">
                  Share any documents, slides, or images about your company.
                </p>
              </div>

              {/* Optional Notes */}
              <div className="brandbot-setup-modal__form-group">
                <label className="brandbot-setup-modal__label">Additional Notes (optional)</label>
                <textarea
                  className="brandbot-setup-modal__textarea"
                  placeholder="Share any other details about your business, market, or goals..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={1000}
                  rows={3}
                />
                <p className="brandbot-setup-modal__helper-text">
                  {notes.length} / 1000
                </p>
              </div>
            </div>
            )
          )}

          {currentStep === 3 && (
            // Step 3: Summary/Confirmation (content changes based on mode)
            mode === 'established' ? (
            // Established Brand Summary
            <div className="brandbot-setup-modal__step brandbot-setup-modal__step--summary">
              <h2 className="brandbot-setup-modal__step-title">Ready to Build Your Brand Bot</h2>
              <p className="brandbot-setup-modal__step-subtitle">
                Ella will analyze your materials and website to understand your company, customers, and brand. This process typically takes a few minutes. Once complete, your Brand Bot will be ready to help with marketing strategies, content creation, and brand consistency.
              </p>

              <div className="brandbot-setup-modal__summary-box">
                <div className="brandbot-setup-modal__summary-section">
                  <h3 className="brandbot-setup-modal__summary-header">Brand Type</h3>
                  <p className="brandbot-setup-modal__summary-value">
                    📊 Established Brand
                  </p>
                </div>

                {websiteUrl && (
                  <div className="brandbot-setup-modal__summary-section">
                    <h3 className="brandbot-setup-modal__summary-header">Website</h3>
                    <p className="brandbot-setup-modal__summary-value">{websiteUrl}</p>
                  </div>
                )}

                {validCompetitorUrls.length > 0 && (
                  <div className="brandbot-setup-modal__summary-section">
                    <h3 className="brandbot-setup-modal__summary-header">Competitors</h3>
                    <ul className="brandbot-setup-modal__summary-list">
                      {validCompetitorUrls.map((url, i) => (
                        <li key={i}>{url}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {completedFilesCount > 0 && (
                  <div className="brandbot-setup-modal__summary-section">
                    <h3 className="brandbot-setup-modal__summary-header">Uploaded Files</h3>
                    <p className="brandbot-setup-modal__summary-value">
                      {completedFilesCount} file{completedFilesCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}

                {notes && (
                  <div className="brandbot-setup-modal__summary-section">
                    <h3 className="brandbot-setup-modal__summary-header">Notes</h3>
                    <p className="brandbot-setup-modal__summary-value">{notes}</p>
                  </div>
                )}
              </div>
            </div>
            ) : (
            // New/Reimagined Brand Confirmation
            <div className="brandbot-setup-modal__step brandbot-setup-modal__step--summary">
              <h2 className="brandbot-setup-modal__step-title">You're Ready to Start</h2>
              <p className="brandbot-setup-modal__step-subtitle">
                Let's begin your brand interview. Ella will ask you guided questions to build out your brand story.
              </p>

              <div className="brandbot-setup-modal__summary-box">
                <div className="brandbot-setup-modal__summary-section">
                  <h3 className="brandbot-setup-modal__summary-header">Your Input</h3>
                  <p className="brandbot-setup-modal__summary-value">
                    {websiteUrl && <div>✓ Website provided</div>}
                    {completedFilesCount > 0 && <div>✓ {completedFilesCount} file{completedFilesCount !== 1 ? 's' : ''} uploaded</div>}
                    {notes && <div>✓ Notes added</div>}
                    {!websiteUrl && completedFilesCount === 0 && !notes && (
                      <p className="brandbot-setup-modal__summary-value" style={{ color: 'var(--theme-text-secondary)' }}>
                        Ready to start from scratch
                      </p>
                    )}
                  </p>
                </div>
              </div>

              <div className="brandbot-setup-modal__milestones">
                <h3 className="brandbot-setup-modal__summary-header">Next Steps</h3>
                <p className="brandbot-setup-modal__step-subtitle" style={{ margin: '8px 0 0 0' }}>
                  The Guided Interview will walk you through a series of questions about your company, target customers, and brand vision. Ella will use your responses to build a comprehensive understanding of your brand and help create marketing strategies tailored to your goals.
                </p>
              </div>
            </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="brandbot-setup-modal__footer">
          <button
            className="brandbot-setup-modal__btn brandbot-setup-modal__btn--secondary"
            onClick={currentStep === 0 ? onClose : handleBack}
          >
            {currentStep === 0 ? 'Close' : 'Back'}
          </button>

          <button
            className="brandbot-setup-modal__btn brandbot-setup-modal__btn--primary"
            onClick={handleNext}
            disabled={!canProceedToNext || hasUploadingFiles}
            style={{ visibility: currentStep === 3 ? 'hidden' : 'visible' }}
          >
            Next
          </button>

          {currentStep === 3 && (
            <button
              className="brandbot-setup-modal__btn brandbot-setup-modal__btn--primary"
              onClick={mode === 'established' ? handleComplete : handleStartGuidedInterview}
              disabled={!canProceedToNext}
            >
              {mode === 'established' ? 'Build My BrandBot' : 'Start Guided Interview'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default BrandBotSetupModal;

