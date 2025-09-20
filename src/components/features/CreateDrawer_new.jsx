import React, { useState, useEffect, useRef } from 'react';
import '../ui/Modal/CreateDrawer.scss';

const CreateDrawer = ({ isOpen, onClose, type, draft, onChangeType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('scope'); // 'scope' or 'authoring'
  
  // Version and scope selection state
  const [selectedVersion, setSelectedVersion] = useState('');
  const [selectedEdition, setSelectedEdition] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [selectedBrandBot, setSelectedBrandBot] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  
  // Template authoring form state
  const [templateForm, setTemplateForm] = useState({
    title: '',
    preview: '',
    description: '',
    thumbnail: '',
    prompt: '',
    icp: '',
    stage: '',
    inputs: [],
    contextAttachments: []
  });
  const [lastSaved, setLastSaved] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activeSection, setActiveSection] = useState('basics');
  
  // UI state
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showEditionDropdown, setShowEditionDropdown] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showBrandBotDropdown, setShowBrandBotDropdown] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  
  // Refs for dropdowns
  const versionRef = useRef(null);
  const sectionRef = useRef(null);
  const editionRef = useRef(null);
  const orgRef = useRef(null);
  const workspaceRef = useRef(null);
  const brandBotRef = useRef(null);

  // Mock data
  const versionOptions = [
    { id: 'ella', label: 'Ella (System)', description: 'Global, platform-wide templates' },
    { id: 'edition', label: 'Special Edition', description: 'Tied to edition (e.g., DTM, Partnernomics)' },
    { id: 'organization', label: 'Organization', description: 'Customer-level organization' },
    { id: 'workspace', label: 'Workspace', description: 'Specific workspace' },
    { id: 'brandbot', label: 'BrandBot', description: 'BrandBot-specific' },
    { id: 'global', label: 'Global', description: 'Across all workspaces within account' }
  ];

  const mockEditions = [
    { id: 'dtm', name: 'DTM Edition' },
    { id: 'partnernomics', name: 'Partnernomics Edition' },
    { id: 'enterprise', name: 'Enterprise Edition' }
  ];

  const mockOrganizations = [
    { id: 'acme', name: 'Acme Corp' },
    { id: 'techstart', name: 'TechStart Inc' },
    { id: 'global_solutions', name: 'Global Solutions Ltd' }
  ];

  const mockWorkspaces = [
    { id: 'creative', name: 'Creative Studio', orgId: 'acme' },
    { id: 'marketing', name: 'Marketing Team', orgId: 'acme' },
    { id: 'development', name: 'Development', orgId: 'techstart' }
  ];

  const mockBrandBots = [
    { id: 'brand_voice', name: 'Brand Voice Bot', workspaceId: 'creative' },
    { id: 'content_creator', name: 'Content Creator Bot', workspaceId: 'marketing' },
    { id: 'technical_writer', name: 'Technical Writer Bot', workspaceId: 'development' }
  ];

  const mockTags = [
    // Ella tags (system, non-editable)
    { id: 'ella_marketing', name: 'Marketing', type: 'ella', editable: false },
    { id: 'ella_sales', name: 'Sales', type: 'ella', editable: false },
    { id: 'ella_support', name: 'Support', type: 'ella', editable: false },
    // Workspace tags
    { id: 'ws_creative', name: 'Creative', type: 'workspace', editable: true },
    { id: 'ws_campaign', name: 'Campaign', type: 'workspace', editable: true },
    // Global tags
    { id: 'global_urgent', name: 'Urgent', type: 'global', editable: true },
    { id: 'global_draft', name: 'Draft', type: 'global', editable: true }
  ];

  useEffect(() => {
    if (isOpen && draft) {
      // Log telemetry event when drawer opens
      logTelemetryEvent('create_drawer_opened', { 
        value: type,
        draft_id: draft.id 
      });

      // Initialize available tags
      setAvailableTags(mockTags);
      setFilteredTags(mockTags);

      // Restore draft state if it exists
      if (draft.scope) {
        setSelectedVersion(draft.scope.version || '');
        setSelectedEdition(draft.scope.edition || '');
        setSelectedOrganization(draft.scope.organization || '');
        setSelectedWorkspace(draft.scope.workspace || '');
        setSelectedBrandBot(draft.scope.brandbot || '');
        setSelectedSection(draft.scope.section || '');
        setSelectedTags(draft.scope.tags || []);
      } else if (draft.version_type) {
        // Fallback to old format
        setSelectedVersion(draft.version_type);
        setSelectedEdition(draft.edition_id || '');
        setSelectedOrganization(draft.organization_id || '');
        setSelectedWorkspace(draft.workspace_id || '');
        setSelectedBrandBot(draft.brandbot_id || '');
        setSelectedSection(draft.section_id || '');
        setSelectedTags(draft.tags || []);
      }
      
      // Restore template form state
      if (draft.template_form) {
        setTemplateForm(draft.template_form);
      }
      
      // Restore current step
      if (draft.current_step) {
        setCurrentStep(draft.current_step);
      }
    }
  }, [isOpen, type, draft]);

  const handleClose = () => {
    // Auto-save draft before closing
    saveDraft();
    onClose();
  };

  const saveDraft = () => {
    // Implementation for saving draft
    logTelemetryEvent('draft_saved', { draft_id: draft?.id });
  };

  // Template form handlers
  const handleTemplateFormChange = (field, value) => {
    setTemplateForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-save after a brief delay
    clearTimeout(window.templateFormSaveTimeout);
    window.templateFormSaveTimeout = setTimeout(() => {
      saveTemplateDraft();
    }, 1000);
  };

  const handleInputAdd = (inputType = 'short_text') => {
    const newInput = {
      id: `input_${Date.now()}`,
      label: '',
      key: '',
      type: inputType,
      required: false,
      defaultValue: '',
      helpText: '',
      placeholder: '',
      options: inputType.includes('select') ? [{ label: '', value: '' }] : undefined
    };
    
    setTemplateForm(prev => ({
      ...prev,
      inputs: [...prev.inputs, newInput]
    }));
  };

  const handleInputUpdate = (inputId, field, value) => {
    setTemplateForm(prev => ({
      ...prev,
      inputs: prev.inputs.map(input => 
        input.id === inputId 
          ? { ...input, [field]: value }
          : input
      )
    }));
    
    // Auto-save
    clearTimeout(window.templateFormSaveTimeout);
    window.templateFormSaveTimeout = setTimeout(() => {
      saveTemplateDraft();
    }, 1000);
  };

  const handleInputRemove = (inputId) => {
    setTemplateForm(prev => ({
      ...prev,
      inputs: prev.inputs.filter(input => input.id !== inputId)
    }));
    saveTemplateDraft();
  };

  const handleInputReorder = (inputId, direction) => {
    setTemplateForm(prev => {
      const inputs = [...prev.inputs];
      const currentIndex = inputs.findIndex(input => input.id === inputId);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex >= 0 && newIndex < inputs.length) {
        [inputs[currentIndex], inputs[newIndex]] = [inputs[newIndex], inputs[currentIndex]];
      }
      
      return { ...prev, inputs };
    });
    saveTemplateDraft();
  };

  const saveTemplateDraft = () => {
    if (!draft?.id) return;
    
    const draftData = {
      ...draft,
      template_form: templateForm,
      scope: {
        version: selectedVersion,
        edition: selectedEdition,
        organization: selectedOrganization,
        workspace: selectedWorkspace,
        brandbot: selectedBrandBot,
        section: selectedSection,
        tags: selectedTags
      },
      current_step: currentStep,
      last_modified: new Date().toISOString()
    };
    
    // Save to localStorage (replace with API call)
    const existingDrafts = JSON.parse(localStorage.getItem('ella-drafts') || '[]');
    const updatedDrafts = existingDrafts.map(d => 
      d.id === draft.id ? draftData : d
    );
    localStorage.setItem('ella-drafts', JSON.stringify(updatedDrafts));
    
    setLastSaved(new Date());
  };

  const validateTemplateForm = () => {
    const errors = {};
    
    if (!templateForm.title.trim()) errors.title = 'Title is required';
    else if (templateForm.title.length > 80) errors.title = 'Title must be 80 characters or less';
    
    if (!templateForm.preview.trim()) errors.preview = 'Preview is required';
    else if (templateForm.preview.length > 160) errors.preview = 'Preview must be 160 characters or less';
    
    if (!templateForm.prompt.trim()) errors.prompt = 'Prompt is required';
    else if (templateForm.prompt.length > 30000) errors.prompt = 'Prompt must be 30,000 characters or less';
    
    if (templateForm.description.length > 1000) errors.description = 'Description must be 1,000 characters or less';
    
    // Validate input keys are unique and properly formatted
    const inputKeys = templateForm.inputs.map(input => input.key).filter(key => key);
    const duplicateKeys = inputKeys.filter((key, index) => inputKeys.indexOf(key) !== index);
    if (duplicateKeys.length > 0) {
      errors.inputs = `Duplicate input keys: ${duplicateKeys.join(', ')}`;
    }
    
    templateForm.inputs.forEach(input => {
      if (input.key && !/^[a-z][a-z0-9_]*$/.test(input.key)) {
        errors.inputs = 'Input keys must be snake_case and start with a letter';
      }
      if (input.key && (input.key.length < 2 || input.key.length > 40)) {
        errors.inputs = 'Input keys must be 2-40 characters long';
      }
    });
    
    return errors;
  };

  const isTemplateFormValid = () => {
    const errors = validateTemplateForm();
    return Object.keys(errors).length === 0;
  };

  const handleContinueToAuthoring = () => {
    if (!selectedVersion) return;
    
    setCurrentStep('authoring');
    saveTemplateDraft();
    
    logTelemetryEvent('template_authoring_started', {
      draft_id: draft?.id,
      type,
      scope: selectedVersion
    });
  };

  const handleBackToScope = () => {
    setCurrentStep('scope');
    saveTemplateDraft();
  };

  const handleChangeType = () => {
    // Log telemetry
    logTelemetryEvent('type_change_requested', {
      current_type: type,
      draft_id: draft?.id
    });
    
    // Close create drawer first
    // Add a small delay to prevent DOM manipulation conflicts
    setTimeout(() => {
      onChangeType();
    }, 100);
    
    // Keep the draft and type state for now - they'll be updated if user selects a different type
  };

  // Helper functions
  const handleVersionSelect = (versionId) => {
    setSelectedVersion(versionId);
    setShowVersionDropdown(false);
    saveDraft();
  };

  const handleEditionSelect = (editionId) => {
    setSelectedEdition(editionId);
    setShowEditionDropdown(false);
    saveDraft();
  };

  const handleTagAdd = (tag) => {
    if (!selectedTags.find(t => t.id === tag.id)) {
      setSelectedTags(prev => [...prev, tag]);
      setTagInput('');
      setFilteredTags(availableTags);
      saveDraft();
    }
  };

  const handleTagRemove = (tagId) => {
    setSelectedTags(prev => prev.filter(t => t.id !== tagId));
    saveDraft();
  };

  const handleTagInputChange = (value) => {
    setTagInput(value);
    if (value) {
      const filtered = availableTags.filter(tag => 
        tag.name.toLowerCase().includes(value.toLowerCase()) &&
        !selectedTags.find(t => t.id === tag.id)
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(availableTags);
    }
  };

  // Generate slug from label
  const generateSlug = (label) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const getVersionLabel = () => {
    const selected = versionOptions.find(v => v.id === selectedVersion);
    return selected ? selected.label : 'Select version...';
  };

  const getTagTypeIcon = (tagType) => {
    switch (tagType) {
      case 'ella':
        return { icon: 'fa-solid fa-star', color: '#FFC700', tooltip: 'Ella System Tag' };
      case 'workspace':
        return { icon: 'fa-solid fa-building', color: '#3B82F6', tooltip: 'Workspace Tag' };
      case 'global':
        return { icon: 'fa-solid fa-globe', color: '#10B981', tooltip: 'Global Tag' };
      default:
        return { icon: 'fa-solid fa-tag', color: '#6B7280', tooltip: 'Tag' };
    }
  };

  const getTypeInfo = () => {
    switch (type) {
      case 'template':
        return {
          title: 'Create Template',
          description: 'Build a reusable template for your team.',
          icon: 'fa-solid fa-file-text'
        };
      case 'playbook':
        return {
          title: 'Create Playbook',
          description: 'Create a series of connected templates.',
          icon: 'fa-solid fa-book'
        };
      case 'group':
        return {
          title: 'Create Playbook Series',
          description: 'Build a comprehensive playbook collection.',
          icon: 'fa-solid fa-layer-group'
        };
      default:
        return {
          title: 'Create Content',
          description: 'Create new content.'
        };
    }
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

  // Render functions for different steps
  const renderScopeContent = () => (
    <div className="create-drawer-form">
      {/* Progress Indicator */}
      <div className="create-drawer-progress">
        <div className="create-drawer-progress-steps">
          <div className="create-drawer-progress-step create-drawer-progress-step--completed">
            <i className="fa-solid fa-check"></i>
            <span>Type Selected</span>
          </div>
          <div className={`create-drawer-progress-step ${selectedVersion ? 'create-drawer-progress-step--completed' : 'create-drawer-progress-step--current'}`}>
            <i className="fa-solid fa-cog"></i>
            <span>Configure Scope</span>
          </div>
          <div className="create-drawer-progress-step">
            <i className="fa-solid fa-edit"></i>
            <span>Build Content</span>
          </div>
        </div>
      </div>
      
      {/* Version Selector - Required */}
      <div className="create-drawer-field">
        <label className="create-drawer-label">
          Where should this be available?
          <span className="create-drawer-required">*</span>
        </label>
        <div className="create-drawer-dropdown" ref={versionRef}>
          <button
            className="create-drawer-dropdown-trigger"
            onClick={() => setShowVersionDropdown(!showVersionDropdown)}
          >
            <span>{getVersionLabel()}</span>
            <i className={`fa-solid fa-chevron-down ${showVersionDropdown ? 'create-drawer-chevron-up' : ''}`}></i>
          </button>
          
          {showVersionDropdown && (
            <div className="create-drawer-dropdown-menu">
              {versionOptions.map((option) => (
                <button
                  key={option.id}
                  className={`create-drawer-dropdown-item ${selectedVersion === option.id ? 'create-drawer-dropdown-item--selected' : ''}`}
                  onClick={() => handleVersionSelect(option.id)}
                >
                  <div className="create-drawer-dropdown-item-content">
                    <span className="create-drawer-dropdown-item-label">{option.label}</span>
                    <span className="create-drawer-dropdown-item-description">{option.description}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Conditional Secondary Selectors */}
      {selectedVersion === 'edition' && (
        <div className="create-drawer-field">
          <label className="create-drawer-label">Select Edition</label>
          <div className="create-drawer-dropdown" ref={editionRef}>
            <button
              className="create-drawer-dropdown-trigger"
              onClick={() => setShowEditionDropdown(!showEditionDropdown)}
            >
              <span>{selectedEdition ? mockEditions.find(e => e.id === selectedEdition)?.name : 'Select edition...'}</span>
              <i className={`fa-solid fa-chevron-down ${showEditionDropdown ? 'create-drawer-chevron-up' : ''}`}></i>
            </button>
            
            {showEditionDropdown && (
              <div className="create-drawer-dropdown-menu">
                {mockEditions.map((edition) => (
                  <button
                    key={edition.id}
                    className={`create-drawer-dropdown-item ${selectedEdition === edition.id ? 'create-drawer-dropdown-item--selected' : ''}`}
                    onClick={() => handleEditionSelect(edition.id)}
                  >
                    {edition.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tags Section */}
      {selectedVersion && (
        <div className="create-drawer-field">
          <label className="create-drawer-label">Tags</label>
          
          {selectedTags.length > 0 && (
            <div className="create-drawer-tags-selected">
              {selectedTags.map((tag) => {
                const typeInfo = getTagTypeIcon(tag.type);
                return (
                  <div key={tag.id} className="create-drawer-tag-chip">
                    <i 
                      className={typeInfo.icon} 
                      style={{ color: typeInfo.color }}
                      title={typeInfo.tooltip}
                    ></i>
                    <span>{tag.name}</span>
                    {tag.editable && (
                      <button
                        className="create-drawer-tag-remove"
                        onClick={() => handleTagRemove(tag.id)}
                        aria-label={`Remove ${tag.name} tag`}
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="create-drawer-tag-input">
            <input
              type="text"
              placeholder="Search and add tags..."
              value={tagInput}
              onChange={(e) => handleTagInputChange(e.target.value)}
              className="create-drawer-input"
            />
            
            {tagInput && filteredTags.length > 0 && (
              <div className="create-drawer-tag-suggestions">
                {filteredTags.slice(0, 5).map((tag) => {
                  const typeInfo = getTagTypeIcon(tag.type);
                  return (
                    <button
                      key={tag.id}
                      className="create-drawer-tag-suggestion"
                      onClick={() => handleTagAdd(tag)}
                    >
                      <i 
                        className={typeInfo.icon} 
                        style={{ color: typeInfo.color }}
                      ></i>
                      <span>{tag.name}</span>
                      <span className="create-drawer-tag-type">({tag.type})</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderAuthoringContent = () => (
    <div className="template-authoring-form">
      {/* Progress Indicator */}
      <div className="create-drawer-progress">
        <div className="create-drawer-progress-steps">
          <div className="create-drawer-progress-step create-drawer-progress-step--completed">
            <i className="fa-solid fa-check"></i>
            <span>Type Selected</span>
          </div>
          <div className="create-drawer-progress-step create-drawer-progress-step--completed">
            <i className="fa-solid fa-check"></i>
            <span>Scope Configured</span>
          </div>
          <div className="create-drawer-progress-step create-drawer-progress-step--current">
            <i className="fa-solid fa-edit"></i>
            <span>Build Content</span>
          </div>
        </div>
      </div>

      {/* Form sections will be implemented here */}
      <div className="template-form-placeholder">
        <h3>Template Authoring Form</h3>
        <p>This is where the template authoring form will be implemented.</p>
        <p>Selected scope: {getVersionLabel()}</p>
        <p>Tags: {selectedTags.map(t => t.name).join(', ')}</p>
      </div>
    </div>
  );

  if (!isOpen) return null;

  const typeInfo = getTypeInfo();

  return (
    <div className="create-drawer-overlay">
      <div className="create-drawer">
        {/* Header */}
        <div className="create-drawer-header">
          <div className="create-drawer-title-section">
            <div className="create-drawer-icon">
              <i className={typeInfo.icon}></i>
            </div>
            <div className="create-drawer-title-content">
              <h2 className="create-drawer-title">{typeInfo.title}</h2>
              <p className="create-drawer-description">{typeInfo.description}</p>
            </div>
          </div>
          <button
            className="create-drawer-close"
            onClick={handleClose}
            aria-label="Close drawer"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="create-drawer-content">
          {currentStep === 'scope' ? renderScopeContent() : renderAuthoringContent()}
        </div>

        {/* Footer */}
        <div className="create-drawer-footer">
          <div className="create-drawer-footer-left">
            {currentStep === 'scope' ? (
              <button
                className="create-drawer-change-type"
                onClick={handleChangeType}
                title="Change type selection"
              >
                <i className="fa-solid fa-edit"></i>
                <span>Change Type</span>
              </button>
            ) : (
              <button
                className="create-drawer-btn create-drawer-btn--secondary"
                onClick={handleBackToScope}
              >
                <i className="fa-solid fa-arrow-left"></i>
                Back to Scope
              </button>
            )}
          </div>
          
          <div className="create-drawer-footer-right">
            <button
              className="create-drawer-btn create-drawer-btn--secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            
            {currentStep === 'scope' ? (
              <button
                className="create-drawer-btn create-drawer-btn--primary"
                disabled={!selectedVersion}
                onClick={handleContinueToAuthoring}
              >
                {selectedVersion ? 'Continue to Form' : 'Select Version to Continue'}
              </button>
            ) : (
              <>
                <button
                  className="create-drawer-btn create-drawer-btn--ghost"
                  onClick={() => setShowPreviewModal(true)}
                >
                  <i className="fa-solid fa-eye"></i>
                  Preview
                </button>
                <button
                  className="create-drawer-btn create-drawer-btn--primary"
                  disabled={!isTemplateFormValid()}
                >
                  Save & Continue
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDrawer;
