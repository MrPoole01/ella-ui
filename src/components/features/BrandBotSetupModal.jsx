import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../../styles/BrandBotSetupModal.scss';

const BrandBotSetupModal = ({
  isOpen,
  onClose,
  onComplete, // (data: { mode, websiteUrl, competitorUrls, files, notes, businessCategory, location, companyDescription, targetAudience, brandFeel })
  persistedStateKey = 'brandbot-setup-state'
}) => {
  const [currentStep, setCurrentStep] = useState(0); // 0: Welcome, 1: Brand Type, 2: Information, 3: Review, 4: Processing
  const [mode, setMode] = useState(null); // 'established' | 'new'
  const [selectedPath, setSelectedPath] = useState(null); // 'positioning' | 'auto' | 'playbook' | 'explore'
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [location, setLocation] = useState('');
  const [competitorUrls, setCompetitorUrls] = useState(['']);
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]); // {id, file, name, sizeLabel, type, progress, status, error}
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef(null);

  // New/Reimagined flow specific fields
  const [companyDescription, setCompanyDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [brandFeel, setBrandFeel] = useState('');

  // Processing step state
  const [processingTasks, setProcessingTasks] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingTimeoutRef = useRef(null);

  // URL validation
  const validateUrl = (url) => {
    if (!url || url.trim() === '') return { isValid: true, error: null };
    try {
      const urlObj = new URL(url);
      return { isValid: urlObj.protocol === 'http:' || urlObj.protocol === 'https:', error: null };
    } catch {
      return { isValid: false, error: 'Please provide a valid URL' };
    }
  };

  const websiteUrlValidation = useMemo(() => validateUrl(websiteUrl), [websiteUrl]);
  const competitorUrlsValidation = useMemo(() => 
    competitorUrls.map(url => validateUrl(url)), 
    [competitorUrls]
  );

  const hasInvalidUrls = useMemo(() => {
    if (mode === 'established' && websiteUrl && !websiteUrlValidation.isValid) return true;
    return competitorUrlsValidation.some(v => !v.isValid);
  }, [mode, websiteUrl, websiteUrlValidation, competitorUrlsValidation]);

  // Restore persisted state when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem(persistedStateKey);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.currentStep !== undefined) setCurrentStep(saved.currentStep);
          if (saved.selectedPath) {
            setSelectedPath(saved.selectedPath);
            // Map selectedPath to mode for backward compatibility
            if (saved.selectedPath === 'auto' || saved.selectedPath === 'playbook') {
              setMode('established');
            } else if (saved.selectedPath === 'positioning' || saved.selectedPath === 'explore') {
              setMode('new');
            }
          } else if (saved.mode) {
            // Backward compatibility: map old mode to default path
            setMode(saved.mode);
            if (saved.mode === 'established') {
              setSelectedPath('auto');
            } else if (saved.mode === 'new') {
              setSelectedPath('positioning');
            }
          }
          if (saved.websiteUrl) setWebsiteUrl(saved.websiteUrl);
          if (saved.businessCategory) setBusinessCategory(saved.businessCategory);
          if (saved.location) setLocation(saved.location);
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
        selectedPath,
        websiteUrl,
        businessCategory,
        location,
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
  }, [currentStep, mode, selectedPath, websiteUrl, businessCategory, location, competitorUrls, notes, files, isOpen, companyDescription, targetAudience, brandFeel]);

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

  // Processing simulation
  useEffect(() => {
    if (currentStep === 4 && !isProcessing) {
      setIsProcessing(true);
      
      // Initialize tasks based on mode
      const initialTasks = mode === 'established' ? [
        {
          id: 'task-1',
          title: 'Spawned 5 subtasks',
          status: 'pending',
          expanded: true,
          subtasks: [
            { id: 'sub-1', text: "Crawl the brand's official website to extract its official company name, tagline, and a 2-3 sentence description of its core offering and market position.", status: 'pending' },
            { id: 'sub-2', text: "From the brand's official website, identify its business model (e.g., B2B subscription, Marketplace, Freemium, Enterprise licensing) and primary industry (e.g., SaaS, E-commerce, FinTech, Healthcare).", status: 'pending' },
            { id: 'sub-3', text: "List the main products or services offered by the brand, using their actual product names, as found on its official website. Aim for at least 3 distinct products/services.", status: 'pending' },
            { id: 'sub-4', text: "Determine the brand's primary target audience, including demographics, job roles, or company types they serve, based on information from its official website.", status: 'pending' },
            { id: 'sub-5', text: "Identify the brand's unique value proposition (USP) and its overall brand tone and personality (e.g., 'Professional and authoritative', 'Friendly and approachable', 'Bold and innovative') from its official website.", status: 'pending' }
          ]
        },
        {
          id: 'task-2',
          title: 'Planning research steps...',
          status: 'pending',
          expanded: false,
          subtasks: []
        }
      ] : [
        {
          id: 'task-1',
          title: 'Starting research...',
          status: 'pending',
          expanded: false,
          subtasks: []
        }
      ];

      setProcessingTasks(initialTasks);

      // Simulate task progression
      let taskIndex = 0;
      let subtaskIndex = 0;
      const processNext = () => {
        if (taskIndex < initialTasks.length) {
          const task = initialTasks[taskIndex];
          
          if (task.subtasks && task.subtasks.length > 0 && subtaskIndex < task.subtasks.length) {
            // Process subtask
            setProcessingTasks(prev => prev.map(t => {
              if (t.id === task.id) {
                const updatedSubtasks = [...t.subtasks];
                updatedSubtasks[subtaskIndex] = { ...updatedSubtasks[subtaskIndex], status: 'completed' };
                return { ...t, subtasks: updatedSubtasks, status: 'processing' };
              }
              return t;
            }));
            subtaskIndex++;
            
            if (subtaskIndex >= task.subtasks.length) {
              // Mark task as completed
              setProcessingTasks(prev => prev.map(t => {
                if (t.id === task.id) {
                  return { ...t, status: 'completed' };
                }
                return t;
              }));
              taskIndex++;
              subtaskIndex = 0;
            }
            processingTimeoutRef.current = setTimeout(processNext, 1500);
          } else {
            // Mark simple task as completed
            setProcessingTasks(prev => prev.map(t => {
              if (t.id === task.id) {
                return { ...t, status: 'completed' };
              }
              return t;
            }));
            taskIndex++;
            processingTimeoutRef.current = setTimeout(processNext, 2000);
          }
        } else {
          // All tasks completed, trigger completion
          setTimeout(() => {
            if (mode === 'established') {
              handleComplete();
            } else {
              handleStartGuidedInterview();
            }
          }, 1000);
        }
      };

      processingTimeoutRef.current = setTimeout(processNext, 1000);
    }

    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, [currentStep, mode, isProcessing]);

  // Navigation helpers
  const canProceedToNext = useMemo(() => {
    if (currentStep === 0) return true; // Welcome step always allows next
    if (currentStep === 1) return !!selectedPath; // Brand Type step requires path selection
    if (currentStep === 2) {
      // Information step - check URL validation
      if (hasInvalidUrls) return false;
      return true;
    }
    if (currentStep === 3) return true; // Review allows next
    if (currentStep === 4) return false; // Processing step - no navigation
    return false;
  }, [currentStep, selectedPath, hasInvalidUrls]);

  const hasUploadingFiles = useMemo(() => {
    return files.some(f => f.status === 'uploading');
  }, [files]);

  // Stepper helper
  const getStepState = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'inactive';
  };

  // Handlers
  const handleNext = () => {
    if (currentStep < 4) {
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
      businessCategory: mode === 'established' ? businessCategory : null,
      location: mode === 'established' ? location : null,
      competitorUrls: mode === 'established' ? competitorUrls.filter(url => url.trim() !== '') : [],
      files: files.filter(f => f.status === 'completed'),
      notes: mode === 'established' ? notes : null
    };
    
    // Clear persisted state after completion
    try {
      localStorage.removeItem(persistedStateKey);
    } catch (_) {}
    
    onComplete?.(data);
    onClose?.();
  };

  const handlePathSelect = (path) => {
    setSelectedPath(path);
    // Map path to mode: 'auto' and 'playbook' -> 'established', 'positioning' and 'explore' -> 'new'
    if (path === 'auto' || path === 'playbook') {
      setMode('established');
    } else if (path === 'positioning' || path === 'explore') {
      setMode('new');
    }
  };

  const handleStartGuidedInterview = () => {
    // Prepare data for Guided Interview Playbook
    const guidedData = {
      mode: 'new',
      websiteUrl,
      businessCategory,
      location,
      files: files.filter(f => f.status === 'completed'),
      notes,
      companyDescription,
      targetAudience,
      brandFeel
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

  const steps = [
    { id: 'welcome', label: 'Welcome' },
    { id: 'brand-type', label: 'Brand Type' },
    { id: 'information', label: 'Information' },
    { id: 'review', label: 'Review' },
    { id: 'processing', label: 'Processing' }
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="brandbot-setup-modal__backdrop" onClick={onClose} />
      
      {/* Modal */}
      <div className="brandbot-setup-modal">
        {/* Header */}
        <div className="brandbot-setup-modal__header">
          <div className="brandbot-setup-modal__header-content">
            <div className="brandbot-setup-modal__title-section">
              <svg className="brandbot-setup-modal__sparkle-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                <path d="M20 2v4"></path>
                <path d="M22 4h-4"></path>
                <circle cx="4" cy="20" r="2"></circle>
              </svg>
              <span className="brandbot-setup-modal__title">Company Strategy Ella-ments Builder</span>
            </div>
            <button className="brandbot-setup-modal__close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          {/* Stepper */}
          <div className="brandbot-setup-modal__stepper">
            {steps.map((step, index) => {
              const state = getStepState(index);
              return (
                <React.Fragment key={step.id}>
                  <div className={`brandbot-setup-modal__stepper-item brandbot-setup-modal__stepper-item--${state}`}>
                    <div className="brandbot-setup-modal__stepper-indicator">
                      {state === 'completed' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span className="brandbot-setup-modal__stepper-label">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`brandbot-setup-modal__stepper-separator brandbot-setup-modal__stepper-separator--${state === 'completed' ? 'completed' : state === 'active' ? 'active' : 'inactive'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="brandbot-setup-modal__content">
          {currentStep === 0 && (
            // Welcome Step
            <div className="brandbot-setup-modal__step brandbot-setup-modal__step--welcome">
              <div className="brandbot-setup-modal__step-icon-wrapper">
                <svg className="brandbot-setup-modal__step-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                  <path d="M20 2v4"></path>
                  <path d="M22 4h-4"></path>
                  <circle cx="4" cy="20" r="2"></circle>
                </svg>
              </div>
              <h2 className="brandbot-setup-modal__step-title">Turn Ella into your HD marketer</h2>
              <p className="brandbot-setup-modal__step-subtitle">
                In just a few steps, we'll collect information about your brand to create a personalized BrandBot that understands your unique voice, audience, and goals.
              </p>
              <div className="brandbot-setup-modal__features">
                <div className="brandbot-setup-modal__feature-card">
                  <div className="brandbot-setup-modal__feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                      <path d="M2 12h20"></path>
                    </svg>
                  </div>
                  <div className="brandbot-setup-modal__feature-content">
                    <h3 className="brandbot-setup-modal__feature-title">Share your website</h3>
                    <p className="brandbot-setup-modal__feature-description">Ella will analyze your website to understand your brand positioning</p>
                  </div>
                </div>
                <div className="brandbot-setup-modal__feature-card">
                  <div className="brandbot-setup-modal__feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                      <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                      <path d="M10 9H8"></path>
                      <path d="M16 13H8"></path>
                      <path d="M16 17H8"></path>
                    </svg>
                  </div>
                  <div className="brandbot-setup-modal__feature-content">
                    <h3 className="brandbot-setup-modal__feature-title">Upload brand materials</h3>
                    <p className="brandbot-setup-modal__feature-description">Add pitch decks, brand guides, or any marketing materials</p>
                  </div>
                </div>
                <div className="brandbot-setup-modal__feature-card">
                  <div className="brandbot-setup-modal__feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 8V4H8"></path>
                      <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                      <path d="M2 14h2"></path>
                      <path d="M20 14h2"></path>
                      <path d="M15 13v2"></path>
                      <path d="M9 13v2"></path>
                    </svg>
                  </div>
                  <div className="brandbot-setup-modal__feature-content">
                    <h3 className="brandbot-setup-modal__feature-title">Build your BrandBot</h3>
                    <p className="brandbot-setup-modal__feature-description">Get a personalized AI that speaks in your brand's voice</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            // Brand Type Step
            <div className="brandbot-setup-modal__step brandbot-setup-modal__step--path">
              <h2 className="brandbot-setup-modal__step-title">What would you like to start with?</h2>
              <p className="brandbot-setup-modal__step-subtitle">
                Choose the path that best fits your needs.
              </p>
              
              <div className="brandbot-setup-modal__mode-options">
                <button
                  type="button"
                  className={`brandbot-setup-modal__mode-card ${selectedPath === 'positioning' ? 'brandbot-setup-modal__mode-card--selected' : ''}`}
                  onClick={() => handlePathSelect('positioning')}
                >
                  <div className="brandbot-setup-modal__mode-icon-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                      <path d="M9 18h6"></path>
                      <path d="M10 22h4"></path>
                    </svg>
                  </div>
                  <div className="brandbot-setup-modal__mode-content">
                    <h3 className="brandbot-setup-modal__mode-title">Build a Positioning Statement</h3>
                    <p className="brandbot-setup-modal__mode-description">
                      Work through a guided interview to define your brand's positioning and messaging.
                    </p>
                  </div>
                  <div className="brandbot-setup-modal__mode-radio">
                    {selectedPath === 'positioning' && (
                      <div className="brandbot-setup-modal__mode-radio-check"></div>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  className={`brandbot-setup-modal__mode-card ${selectedPath === 'auto' ? 'brandbot-setup-modal__mode-card--selected' : ''}`}
                  onClick={() => handlePathSelect('auto')}
                >
                  <div className="brandbot-setup-modal__mode-icon-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 12h4"></path>
                      <path d="M10 8h4"></path>
                      <path d="M14 21v-3a2 2 0 0 0-4 0v3"></path>
                      <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path>
                      <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
                    </svg>
                  </div>
                  <div className="brandbot-setup-modal__mode-content">
                    <h3 className="brandbot-setup-modal__mode-title">Auto Brand Bot</h3>
                    <p className="brandbot-setup-modal__mode-description">
                      Use your existing website and materials so Ella can learn quickly.
                    </p>
                  </div>
                  <div className="brandbot-setup-modal__mode-radio">
                    {selectedPath === 'auto' && (
                      <div className="brandbot-setup-modal__mode-radio-check"></div>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  className={`brandbot-setup-modal__mode-card ${selectedPath === 'playbook' ? 'brandbot-setup-modal__mode-card--selected' : ''}`}
                  onClick={() => handlePathSelect('playbook')}
                >
                  <div className="brandbot-setup-modal__mode-icon-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                      <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                      <path d="M10 9H8"></path>
                      <path d="M16 13H8"></path>
                      <path d="M16 17H8"></path>
                    </svg>
                  </div>
                  <div className="brandbot-setup-modal__mode-content">
                    <h3 className="brandbot-setup-modal__mode-title">Construct a Playbook</h3>
                    <p className="brandbot-setup-modal__mode-description">
                      Turn your current brand assets into a tailored playbook and guidance.
                    </p>
                  </div>
                  <div className="brandbot-setup-modal__mode-radio">
                    {selectedPath === 'playbook' && (
                      <div className="brandbot-setup-modal__mode-radio-check"></div>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  className={`brandbot-setup-modal__mode-card ${selectedPath === 'explore' ? 'brandbot-setup-modal__mode-card--selected' : ''}`}
                  onClick={() => handlePathSelect('explore')}
                >
                  <div className="brandbot-setup-modal__mode-icon-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                      <path d="M20 2v4"></path>
                      <path d="M22 4h-4"></path>
                      <circle cx="4" cy="20" r="2"></circle>
                    </svg>
                  </div>
                  <div className="brandbot-setup-modal__mode-content">
                    <h3 className="brandbot-setup-modal__mode-title">Explore Ella</h3>
                    <p className="brandbot-setup-modal__mode-description">
                      Jump in and explore Ella's tools before setting up your brand.
                    </p>
                  </div>
                  <div className="brandbot-setup-modal__mode-radio">
                    {selectedPath === 'explore' && (
                      <div className="brandbot-setup-modal__mode-radio-check"></div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            // Information Step
            mode === 'established' ? (
            // Established Brand Intake
            <div className="brandbot-setup-modal__step brandbot-setup-modal__step--intake">
              <h2 className="brandbot-setup-modal__step-title">Tell us about your brand</h2>
              <p className="brandbot-setup-modal__step-subtitle">
                Share materials that represent your brand.
              </p>

              {/* Website URL */}
              <div className="brandbot-setup-modal__form-group">
                <label className="brandbot-setup-modal__label">Company website</label>
                <input
                  type="url"
                  className={`brandbot-setup-modal__input ${websiteUrl && !websiteUrlValidation.isValid ? 'brandbot-setup-modal__input--error' : ''}`}
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => handleWebsiteUrlChange(e.target.value)}
                />
                {websiteUrl && !websiteUrlValidation.isValid && (
                  <p className="brandbot-setup-modal__error-text">{websiteUrlValidation.error}</p>
                )}
                <p className="brandbot-setup-modal__helper-text">
                  Ella will auto-crawl your website in the background.
                </p>
              </div>

              {/* Business Category and Location */}
              <div className="brandbot-setup-modal__form-row">
                <div className="brandbot-setup-modal__form-group">
                  <label className="brandbot-setup-modal__label">Business category</label>
                  <input
                    type="text"
                    className="brandbot-setup-modal__input"
                    placeholder="e.g., fintech, e-commerce, healthcare SaaS"
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                  />
                </div>
                <div className="brandbot-setup-modal__form-group">
                  <label className="brandbot-setup-modal__label">Location</label>
                  <input
                    type="text"
                    className="brandbot-setup-modal__input"
                    placeholder="e.g., New York, London, UK"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Competitor URLs */}
              <div className="brandbot-setup-modal__form-group">
                <label className="brandbot-setup-modal__label">Competitor websites</label>
                <div className="brandbot-setup-modal__competitor-urls">
                  {competitorUrls.map((url, index) => (
                    <div key={index} className="brandbot-setup-modal__competitor-url-row">
                      <input
                        type="url"
                        className={`brandbot-setup-modal__input ${url && !competitorUrlsValidation[index]?.isValid ? 'brandbot-setup-modal__input--error' : ''}`}
                        placeholder="https://competitor-1.com"
                        value={url}
                        onChange={(e) => updateCompetitorUrl(index, e.target.value)}
                      />
                      {competitorUrls.length > 1 && (
                        <button
                          type="button"
                          className="brandbot-setup-modal__remove-btn"
                          onClick={() => removeCompetitorUrl(index)}
                          title="Remove"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 11v6"></path>
                            <path d="M14 11v6"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                            <path d="M3 6h18"></path>
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  {competitorUrls.length < 10 && (
                    <button
                      type="button"
                      className="brandbot-setup-modal__add-btn"
                      onClick={addCompetitorUrl}
                    >
                      Add another
                    </button>
                  )}
                </div>
              </div>

              {/* File Upload */}
              <div className="brandbot-setup-modal__form-group">
                <label className="brandbot-setup-modal__label">Brand materials</label>
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v12"></path>
                      <path d="m17 8-5-5-5 5"></path>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    </svg>
                    <div className="brandbot-setup-modal__upload-text-group">
                      <p className="brandbot-setup-modal__upload-text">Upload files</p>
                      <p className="brandbot-setup-modal__upload-hint">Drag and drop or click to upload</p>
                    </div>
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
                                type="button"
                                className="brandbot-setup-modal__retry-btn"
                                onClick={() => retryFile(f.id)}
                              >
                                Retry
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            className="brandbot-setup-modal__remove-file-btn"
                            onClick={() => removeFile(f.id)}
                            title="Remove file"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 11v6"></path>
                              <path d="M14 11v6"></path>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                              <path d="M3 6h18"></path>
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="brandbot-setup-modal__helper-text">
                  Upload pitch decks, brand guides, or any marketing materials that help Ella understand your brand.
                </p>
              </div>

              {/* Additional Notes */}
              <div className="brandbot-setup-modal__form-group">
                <label className="brandbot-setup-modal__label">Additional notes</label>
                <textarea
                  className="brandbot-setup-modal__textarea"
                  placeholder="Share any additional context about your brand, target audience, or specific goals..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={1000}
                  rows={4}
                />
                <p className="brandbot-setup-modal__helper-text">
                  {notes.length} / 1000
                </p>
              </div>
            </div>
            ) : (
            // New/Reimagined Brand Intake
            <div className="brandbot-setup-modal__step brandbot-setup-modal__step--intake">
              <h2 className="brandbot-setup-modal__step-title">Help Ella learn about your company</h2>
              <p className="brandbot-setup-modal__step-subtitle">
                Share what you can — everything is optional. This helps Ella ask better questions in your guided interview.
              </p>

              {/* Website URL */}
              <div className="brandbot-setup-modal__form-group">
                <label className="brandbot-setup-modal__label">Website URL</label>
                <input
                  type="url"
                  className={`brandbot-setup-modal__input ${websiteUrl && !websiteUrlValidation.isValid ? 'brandbot-setup-modal__input--error' : ''}`}
                  placeholder="https://yourcompany.com"
                  value={websiteUrl}
                  onChange={(e) => handleWebsiteUrlChange(e.target.value)}
                />
                {websiteUrl && !websiteUrlValidation.isValid && (
                  <p className="brandbot-setup-modal__error-text">{websiteUrlValidation.error}</p>
                )}
                <p className="brandbot-setup-modal__helper-text">
                  Ella will review your site to understand your brand.
                </p>
              </div>

              {/* Business Category and Location */}
              <div className="brandbot-setup-modal__form-row">
                <div className="brandbot-setup-modal__form-group">
                  <label className="brandbot-setup-modal__label">Business category</label>
                  <input
                    type="text"
                    className="brandbot-setup-modal__input"
                    placeholder="e.g., fintech, e-commerce"
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                  />
                </div>
                <div className="brandbot-setup-modal__form-group">
                  <label className="brandbot-setup-modal__label">Location</label>
                  <input
                    type="text"
                    className="brandbot-setup-modal__input"
                    placeholder="e.g., New York, London"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="brandbot-setup-modal__form-group">
                <label className="brandbot-setup-modal__label">Brand materials (optional)</label>
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v12"></path>
                      <path d="m17 8-5-5-5 5"></path>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    </svg>
                    <div className="brandbot-setup-modal__upload-text-group">
                      <p className="brandbot-setup-modal__upload-text">Upload files</p>
                      <p className="brandbot-setup-modal__upload-hint">Drag and drop or click to upload</p>
                    </div>
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
                                type="button"
                                className="brandbot-setup-modal__retry-btn"
                                onClick={() => retryFile(f.id)}
                              >
                                Retry
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            className="brandbot-setup-modal__remove-file-btn"
                            onClick={() => removeFile(f.id)}
                            title="Remove file"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 11v6"></path>
                              <path d="M14 11v6"></path>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                              <path d="M3 6h18"></path>
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="brandbot-setup-modal__helper-text">
                  Upload any existing materials — pitch decks, logos, style guides.
                </p>
              </div>

              {/* Quick Questions Section */}
              <div className="brandbot-setup-modal__quick-questions">
                <div className="brandbot-setup-modal__quick-questions-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                    <path d="M9 18h6"></path>
                    <path d="M10 22h4"></path>
                  </svg>
                  <span>Quick questions</span>
                </div>
                
                <div className="brandbot-setup-modal__form-group">
                  <label className="brandbot-setup-modal__label">What does your company do?</label>
                  <textarea
                    className="brandbot-setup-modal__textarea"
                    placeholder="We help small businesses manage their finances..."
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="brandbot-setup-modal__form-group">
                  <label className="brandbot-setup-modal__label">Who are your main customers or audiences?</label>
                  <textarea
                    className="brandbot-setup-modal__textarea"
                    placeholder="Small business owners, freelancers, startups..."
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="brandbot-setup-modal__form-group">
                  <label className="brandbot-setup-modal__label">What do you want people to feel about your brand?</label>
                  <textarea
                    className="brandbot-setup-modal__textarea"
                    placeholder="Trustworthy, innovative, approachable..."
                    value={brandFeel}
                    onChange={(e) => setBrandFeel(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
            )
          )}

          {currentStep === 3 && (
            // Review Step
            mode === 'established' ? (
            // Established Brand Review
            <div className="brandbot-setup-modal__step brandbot-setup-modal__step--summary">
              <div className="brandbot-setup-modal__review-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <h2 className="brandbot-setup-modal__step-title">Ready to build your BrandBot</h2>
              <p className="brandbot-setup-modal__step-subtitle">
                Here's a summary of what you've shared. Ella will use this to create your personalized BrandBot.
              </p>

              <div className="brandbot-setup-modal__summary-grid">
                <div className="brandbot-setup-modal__summary-card">
                  <div className="brandbot-setup-modal__summary-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                      <path d="M2 12h20"></path>
                    </svg>
                  </div>
                  <div className="brandbot-setup-modal__summary-card-content">
                    <span className="brandbot-setup-modal__summary-card-label">Website</span>
                    <span className="brandbot-setup-modal__summary-card-value">{websiteUrl || 'No website provided'}</span>
                  </div>
                </div>

                <div className="brandbot-setup-modal__summary-card">
                  <div className="brandbot-setup-modal__summary-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 12h4"></path>
                      <path d="M10 8h4"></path>
                      <path d="M14 21v-3a2 2 0 0 0-4 0v3"></path>
                      <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path>
                      <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
                    </svg>
                  </div>
                  <div className="brandbot-setup-modal__summary-card-content">
                    <span className="brandbot-setup-modal__summary-card-label">Category</span>
                    <span className="brandbot-setup-modal__summary-card-value">{businessCategory || 'Not specified'}</span>
                  </div>
                </div>

                <div className="brandbot-setup-modal__summary-card">
                  <div className="brandbot-setup-modal__summary-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="brandbot-setup-modal__summary-card-content">
                    <span className="brandbot-setup-modal__summary-card-label">Location</span>
                    <span className="brandbot-setup-modal__summary-card-value">{location || 'Not specified'}</span>
                  </div>
                </div>

                <div className="brandbot-setup-modal__summary-card">
                  <div className="brandbot-setup-modal__summary-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                      <path d="M2 12h20"></path>
                    </svg>
                  </div>
                  <div className="brandbot-setup-modal__summary-card-content">
                    <span className="brandbot-setup-modal__summary-card-label">Competitors</span>
                    <span className="brandbot-setup-modal__summary-card-value">
                      {validCompetitorUrls.length > 0 ? `${validCompetitorUrls.length} added` : 'No competitors added'}
                    </span>
                  </div>
                </div>

                <div className="brandbot-setup-modal__summary-card">
                  <div className="brandbot-setup-modal__summary-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                      <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                      <path d="M10 9H8"></path>
                      <path d="M16 13H8"></path>
                      <path d="M16 17H8"></path>
                    </svg>
                  </div>
                  <div className="brandbot-setup-modal__summary-card-content">
                    <span className="brandbot-setup-modal__summary-card-label">Brand Materials</span>
                    <span className="brandbot-setup-modal__summary-card-value">
                      {completedFilesCount > 0 ? `${completedFilesCount} file${completedFilesCount !== 1 ? 's' : ''}` : 'No files uploaded'}
                    </span>
                  </div>
                </div>

                <div className="brandbot-setup-modal__summary-card">
                  <div className="brandbot-setup-modal__summary-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div className="brandbot-setup-modal__summary-card-content">
                    <span className="brandbot-setup-modal__summary-card-label">Notes</span>
                    <span className="brandbot-setup-modal__summary-card-value">{notes || 'No additional notes'}</span>
                  </div>
                </div>
              </div>

              {/* What happens next callout */}
              <div className="brandbot-setup-modal__callout">
                <svg className="brandbot-setup-modal__callout-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                  <path d="M20 2v4"></path>
                  <path d="M22 4h-4"></path>
                  <circle cx="4" cy="20" r="2"></circle>
                </svg>
                <div className="brandbot-setup-modal__callout-content">
                  <h3 className="brandbot-setup-modal__callout-title">What happens next?</h3>
                  <p className="brandbot-setup-modal__callout-text">
                    When you click <strong>Build my Brand Bot</strong>, Ella will analyze your materials in the background and create a personalized AI assistant that understands your brand voice, target audience, and messaging.
                  </p>
                </div>
              </div>
            </div>
            ) : (
            // New/Reimagined Brand Review
            <div className="brandbot-setup-modal__step brandbot-setup-modal__step--summary">
              <div className="brandbot-setup-modal__review-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <h2 className="brandbot-setup-modal__step-title">You're ready to start your brand interview</h2>
              <p className="brandbot-setup-modal__step-subtitle">
                No worries — Ella will learn about your brand through the guided interview.
              </p>

              {/* What happens next callout */}
              <div className="brandbot-setup-modal__callout">
                <svg className="brandbot-setup-modal__callout-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"></path>
                </svg>
                <div className="brandbot-setup-modal__callout-content">
                  <h3 className="brandbot-setup-modal__callout-title">What happens next?</h3>
                  <p className="brandbot-setup-modal__callout-text">
                    Click "Start Guided Interview" to begin a conversation with Ella. She'll ask questions to understand your brand vision, values, and voice — then create your personalized BrandBot.
                  </p>
                </div>
              </div>
            </div>
            )
          )}

          {currentStep === 4 && (
            // Processing Step
            <div className="brandbot-setup-modal__step brandbot-setup-modal__step--processing">
              <h2 className="brandbot-setup-modal__step-title">Researching Your Brand</h2>
              <p className="brandbot-setup-modal__step-subtitle">
                Ella is analyzing your brand and competitive landscape...
              </p>

              <div className="brandbot-setup-modal__processing-tasks">
                {processingTasks.map((task) => (
                  <div key={task.id} className="brandbot-setup-modal__processing-task">
                    <button
                      type="button"
                      className="brandbot-setup-modal__processing-task-header"
                      onClick={() => {
                        setProcessingTasks(prev => prev.map(t => 
                          t.id === task.id ? { ...t, expanded: !(t.expanded || false) } : t
                        ));
                      }}
                    >
                      <div className="brandbot-setup-modal__processing-task-status">
                        {task.status === 'completed' ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brandbot-setup-modal__processing-check">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="m9 12 2 2 4-4"></path>
                          </svg>
                        ) : task.status === 'processing' ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brandbot-setup-modal__processing-spinner">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                          </svg>
                        ) : null}
                      </div>
                      <span className="brandbot-setup-modal__processing-task-title">{task.title}</span>
                      {task.subtasks && task.subtasks.length > 0 && (
                        <span className="brandbot-setup-modal__processing-task-count">
                          ({task.subtasks.filter(st => st.status === 'completed').length}/{task.subtasks.length})
                        </span>
                      )}
                      {task.status === 'completed' && (
                        <span className="brandbot-setup-modal__processing-task-status-text">(completed)</span>
                      )}
                    </button>
                    {task.expanded && task.subtasks && task.subtasks.length > 0 && (
                      <div className="brandbot-setup-modal__processing-subtasks">
                        {task.subtasks.map((subtask) => (
                          <div key={subtask.id} className="brandbot-setup-modal__processing-subtask">
                            <div className={`brandbot-setup-modal__processing-subtask-indicator brandbot-setup-modal__processing-subtask-indicator--${subtask.status}`}>
                              {subtask.status === 'completed' ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <path d="m9 12 2 2 4-4"></path>
                                </svg>
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brandbot-setup-modal__processing-spinner">
                                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                                </svg>
                              )}
                            </div>
                            <p className="brandbot-setup-modal__processing-subtask-text">{subtask.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="brandbot-setup-modal__footer">
          <button
            type="button"
            className="brandbot-setup-modal__btn brandbot-setup-modal__btn--secondary"
            onClick={currentStep === 0 ? onClose : handleBack}
          >
            {currentStep === 0 ? 'Exit' : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
                Back
              </>
            )}
          </button>

          {currentStep < 3 && (
            <button
              type="button"
              className="brandbot-setup-modal__btn brandbot-setup-modal__btn--primary"
              onClick={handleNext}
              disabled={!canProceedToNext || hasUploadingFiles}
            >
              Next
              {currentStep < 2 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              )}
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="button"
              className="brandbot-setup-modal__btn brandbot-setup-modal__btn--primary"
              onClick={handleNext}
              disabled={!canProceedToNext}
            >
              {mode === 'established' ? (
                <>
                  Build my Brand Bot
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                    <path d="M20 2v4"></path>
                    <path d="M22 4h-4"></path>
                    <circle cx="4" cy="20" r="2"></circle>
                  </svg>
                </>
              ) : (
                <>
                  Start Guided Interview
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"></path>
                  </svg>
                </>
              )}
            </button>
          )}

          {currentStep === 4 && (
            <button
              type="button"
              className="brandbot-setup-modal__btn brandbot-setup-modal__btn--primary brandbot-setup-modal__btn--processing"
              disabled
            >
              Processing...
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default BrandBotSetupModal;
