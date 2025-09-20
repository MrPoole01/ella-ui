import React, { useState, useEffect, useRef } from 'react';
import '../ui/Modal/CreateDrawer.scss';

const CreateDrawer = ({ isOpen, onClose, type, draft, onChangeType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('scope'); // 'scope' or 'authoring'
  const isAdmin = localStorage.getItem('ella-user-role') === 'admin';
  
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
  
  // Playbook authoring state
  const [playbook, setPlaybook] = useState({
    name: '',
    steps: [], // { id, templateId, templateTitle, templatePreview, stepName, notes, mappings: [] }
    execution: {
      mode: 'step_by_step', // 'step_by_step' | 'auto_run'
      consolidatedSchema: [] // computed for auto-run
    }
  });
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [addStepMode, setAddStepMode] = useState(null); // 'select' | 'create'
  const [templateSearch, setTemplateSearch] = useState('');
  const [inlineTemplateForm, setInlineTemplateForm] = useState({
    title: '',
    preview: '',
    description: '',
    prompt: ''
  });
  // Series (Playbook Group) authoring state
  const [series, setSeries] = useState({
    name: '',
    items: [], // { id, playbookId, name, label, stepCount, preview }
  });
  const [showAddPlaybookModal, setShowAddPlaybookModal] = useState(false);
  const [addPlaybookMode, setAddPlaybookMode] = useState(null); // 'select' | 'create'
  const [playbookSearch, setPlaybookSearch] = useState('');
  const [inlinePlaybookForm, setInlinePlaybookForm] = useState({ name: '', stepCount: 1, preview: '' });
  const [lastSaved, setLastSaved] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activeSection, setActiveSection] = useState('basics');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [validation, setValidation] = useState({ errors: [], warnings: [] });
  const validationRef = useRef(null);
  
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

  // Mock templates for playbook step selection
  const mockTemplates = [
    { 
      id: 't1', 
      title: 'Blog Outline', 
      preview: 'Generate a blog outline based on topic and audience.',
      inputs: [
        { key: 'topic', label: 'Topic', required: true, type: 'short_text' },
        { key: 'audience', label: 'Audience', required: false, type: 'short_text' }
      ]
    },
    { 
      id: 't2', 
      title: 'Email Copy', 
      preview: 'Draft an outreach email with tone and CTA.',
      inputs: [
        { key: 'audience', label: 'Audience', required: true, type: 'short_text' },
        { key: 'tone', label: 'Tone', required: false, type: 'single_select', options: [
          { label: 'Friendly', value: 'friendly' },
          { label: 'Professional', value: 'professional' }
        ] },
        { key: 'cta', label: 'Call To Action', required: true, type: 'long_text' }
      ]
    },
    { 
      id: 't3', 
      title: 'Ad Variations', 
      preview: 'Create multiple ad copy variations for testing.',
      inputs: [
        { key: 'topic', label: 'Topic', required: true, type: 'short_text' },
        { key: 'platform', label: 'Platform', required: false, type: 'single_select', options: [
          { label: 'Facebook', value: 'facebook' },
          { label: 'Google', value: 'google' }
        ] }
      ]
    }
  ];

  // Mock playbooks for series selection
  const mockPlaybooks = [
    { id: 'p1', name: 'Content Pipeline', stepCount: 3, preview: 'Outline → Draft → Edit' },
    { id: 'p2', name: 'Outbound Sequence', stepCount: 2, preview: 'Email → Follow-up' },
    { id: 'p3', name: 'Ad Creative Sprint', stepCount: 4, preview: 'Brief → Variations → QA → Publish' }
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
      // Restore playbook state
      if (draft.playbook) {
        setPlaybook(draft.playbook);
      }
      
      // Restore current step
      if (draft.current_step) {
        setCurrentStep(draft.current_step);
      }

      // Restore series state
      if (draft.series) {
        setSeries(draft.series);
      }
    }
  }, [isOpen, type, draft]);

  const handleClose = () => {
    // Auto-save draft before closing
    saveDraft();
    onClose();
  };

  // Lifecycle actions (mock implementations)
  const handleManualSave = () => {
    saveTemplateDraft();
    logTelemetryEvent('manual_save_clicked', { draft_id: draft?.id, type });
  };

  const handlePublish = () => {
    if (!isAdmin) return;
    setShowPublishModal(true);
  };

  const confirmPublish = () => {
    // Mock publish: set a flag in localStorage
    const published = JSON.parse(localStorage.getItem('ella-published') || '[]');
    published.push({ id: draft?.id, type, scope: selectedVersion, timestamp: Date.now() });
    localStorage.setItem('ella-published', JSON.stringify(published));
    setShowPublishModal(false);
    logTelemetryEvent('publish_confirmed', { draft_id: draft?.id, type, scope: selectedVersion });
  };

  const handleDuplicate = () => {
    const newId = `draft_${Date.now()}`;
    const existingDrafts = JSON.parse(localStorage.getItem('ella-drafts') || '[]');
    const copy = {
      ...(draft || {}),
      id: newId,
      title: `Copy of ${type === 'template' ? (templateForm.title || 'Untitled') : type === 'playbook' ? (playbook.name || 'Untitled Playbook') : (series.name || 'Untitled Series')}`,
      template_form: type === 'template' ? templateForm : undefined,
      playbook: type === 'playbook' ? playbook : undefined,
      series: type === 'group' ? series : undefined,
      current_step: currentStep,
      created_at: new Date().toISOString(),
      last_modified: new Date().toISOString(),
      status: 'draft'
    };
    localStorage.setItem('ella-drafts', JSON.stringify([...existingDrafts, copy]));
    logTelemetryEvent('duplicate_created', { from: draft?.id, to: newId, type });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const existingDrafts = JSON.parse(localStorage.getItem('ella-drafts') || '[]');
    const remaining = existingDrafts.filter(d => d.id !== draft?.id);
    localStorage.setItem('ella-drafts', JSON.stringify(remaining));
    logTelemetryEvent('item_deleted', { id: draft?.id, type });
    setShowDeleteModal(false);
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
      playbook: playbook,
      series: series,
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
    
    // Save draft first
    saveTemplateDraft();
    
    // Log telemetry
    logTelemetryEvent('template_authoring_started', {
      draft_id: draft?.id,
      type,
      scope: selectedVersion
    });
    
    // Add small delay to prevent DOM manipulation conflicts
    setTimeout(() => {
      setCurrentStep('authoring');
    }, 100);
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
        return { icon: '⭐', color: '#FFC700', tooltip: 'Ella System Tag' };
      case 'workspace':
        return { icon: '🏢', color: '#3B82F6', tooltip: 'Workspace Tag' };
      case 'global':
        return { icon: '🌐', color: '#10B981', tooltip: 'Global Tag' };
      default:
        return { icon: '🏷️', color: '#6B7280', tooltip: 'Tag' };
    }
  };

  const getTypeInfo = () => {
    switch (type) {
      case 'template':
        return {
          title: 'Create Template',
          description: 'Build a reusable template for your team.',
          icon: '📄'
        };
      case 'playbook':
        return {
          title: 'Create Playbook',
          description: 'Create a series of connected templates.',
          icon: '📚'
        };
      case 'group':
        return {
          title: 'Create Playbook Series',
          description: 'Build a comprehensive playbook collection.',
          icon: '📋'
        };
      default:
        return {
          title: 'Create Content',
          description: 'Create new content.',
          icon: '📝'
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

  // ---------- Validation ----------
  const validateTemplateBuilder = () => {
    const errors = [];
    const warnings = [];
    // Basics
    if (!templateForm.title || !templateForm.title.trim()) {
      errors.push({ id: 'tpl_title', msg: 'Title is required', to: () => setActiveSection('basics') });
    } else if (templateForm.title.length > 80) {
      errors.push({ id: 'tpl_title_len', msg: 'Title exceeds 80 characters', to: () => setActiveSection('basics') });
    }
    if (!templateForm.preview || !templateForm.preview.trim()) {
      errors.push({ id: 'tpl_preview', msg: 'Preview is required', to: () => setActiveSection('basics') });
    } else if (templateForm.preview.length > 160) {
      errors.push({ id: 'tpl_preview_len', msg: 'Preview exceeds 160 characters', to: () => setActiveSection('basics') });
    }
    if (!templateForm.prompt || !templateForm.prompt.trim()) {
      errors.push({ id: 'tpl_prompt', msg: 'Prompt is required', to: () => setActiveSection('prompt') });
    } else if (templateForm.prompt.length > 30000) {
      errors.push({ id: 'tpl_prompt_len', msg: 'Prompt exceeds 30,000 characters', to: () => setActiveSection('prompt') });
    }
    // Scope
    if (!selectedVersion) {
      errors.push({ id: 'tpl_scope', msg: 'Scope must be selected', to: () => setCurrentStep('scope') });
    }
    // Inputs
    const keys = (templateForm.inputs || []).map(i => i.key).filter(Boolean);
    const badKey = (templateForm.inputs || []).find(i => i.key && (!/^[a-z][a-z0-9_]*$/.test(i.key) || i.key.length < 2 || i.key.length > 40));
    if (badKey) {
      errors.push({ id: 'tpl_key_format', msg: 'Input keys must be snake_case 2–40 chars', to: () => setActiveSection('inputs') });
    }
    const dup = keys.find((k, idx) => keys.indexOf(k) !== idx);
    if (dup) {
      errors.push({ id: 'tpl_key_dup', msg: `Duplicate input key '${dup}'`, to: () => setActiveSection('inputs') });
    }
    return { errors, warnings };
  };

  const validatePlaybookBuilder = () => {
    const errors = [];
    const warnings = [];
    if (!playbook.name || !playbook.name.trim()) {
      errors.push({ id: 'pb_name', msg: 'Playbook name is required', to: () => {} });
    }
    if (!playbook.steps || playbook.steps.length === 0) {
      errors.push({ id: 'pb_steps_empty', msg: 'Add at least one step', to: () => {} });
    }
    // Step template validity
    (playbook.steps || []).forEach((s, i) => {
      const tmpl = mockTemplates.find(t => t.id === s.templateId);
      if (!tmpl) {
        errors.push({ id: `pb_step_${i+1}_tmpl`, msg: `Step ${i+1} has invalid template`, to: () => {} });
      }
    });
    if (!playbook.execution || !playbook.execution.mode) {
      errors.push({ id: 'pb_mode', msg: 'Execution mode must be selected', to: () => {} });
    }
    if (playbook.execution?.mode === 'auto_run') {
      // detect pre-dedupe collisions by originalKey
      const originalKeys = [];
      (playbook.steps || []).forEach((s, idx) => {
        const tmpl = mockTemplates.find(t => t.id === s.templateId);
        (tmpl?.inputs || []).forEach(inp => originalKeys.push(inp.key));
      });
      const collision = originalKeys.find((k, idx) => originalKeys.indexOf(k) !== idx);
      if (collision) {
        warnings.push({ id: 'pb_autorun_keys', msg: `Auto-Run had duplicate key '${collision}'. Keys were suffixed by step index.` });
      }
    }
    return { errors, warnings };
  };

  const validateSeriesBuilder = () => {
    const errors = [];
    const warnings = [];
    if (!series.name || !series.name.trim()) {
      errors.push({ id: 'sr_name', msg: 'Series name is required', to: () => {} });
    }
    if (!series.items || series.items.length === 0) {
      errors.push({ id: 'sr_items', msg: 'Add at least one playbook to the series', to: () => {} });
    }
    // Unique labels
    const labels = (series.items || []).map(i => (i.label || i.name || '').toLowerCase());
    const dup = labels.find((l, idx) => l && labels.indexOf(l) !== idx);
    if (dup) {
      errors.push({ id: 'sr_labels', msg: 'Playbook labels in series must be unique', to: () => {} });
    }
    // References valid (existing or inline okay)
    (series.items || []).forEach((i, idx) => {
      const exists = mockPlaybooks.find(p => p.id === i.playbookId) || i.playbookId?.startsWith('new_');
      if (!exists) errors.push({ id: `sr_ref_${idx+1}`, msg: `Playbook ${idx+1} reference is invalid`, to: () => {} });
    });
    return { errors, warnings };
  };

  const recomputeValidation = () => {
    let res = { errors: [], warnings: [] };
    if (type === 'template') res = validateTemplateBuilder();
    else if (type === 'playbook') res = validatePlaybookBuilder();
    else if (type === 'group') res = validateSeriesBuilder();
    setValidation(res);
  };

  useEffect(() => {
    if (!isOpen) return;
    recomputeValidation();
  }, [isOpen, type, templateForm, selectedVersion, playbook, series]);

  // Render functions for different steps
  const renderScopeContent = () => (
    <div className="create-drawer-form">
      {/* Progress Indicator */}
      <div className="create-drawer-progress">
        <div className="create-drawer-progress-steps">
          <div className="create-drawer-progress-step create-drawer-progress-step--completed">
            <span className="create-drawer-progress-icon">✓</span>
            <span>Type Selected</span>
          </div>
          <div className={`create-drawer-progress-step ${selectedVersion ? 'create-drawer-progress-step--completed' : 'create-drawer-progress-step--current'}`}>
            <span className="create-drawer-progress-icon">⚙️</span>
            <span>Configure Scope</span>
          </div>
          <div className="create-drawer-progress-step">
            <span className="create-drawer-progress-icon">✏️</span>
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
            <span className={`create-drawer-chevron ${showVersionDropdown ? 'create-drawer-chevron-up' : ''}`}>
              {showVersionDropdown ? '▲' : '▼'}
            </span>
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
              <span className={`create-drawer-chevron ${showEditionDropdown ? 'create-drawer-chevron-up' : ''}`}>
                {showEditionDropdown ? '▲' : '▼'}
              </span>
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
                    <span 
                      className="create-drawer-tag-icon"
                      style={{ color: typeInfo.color }}
                      title={typeInfo.tooltip}
                    >
                      {typeInfo.icon}
                    </span>
                    <span>{tag.name}</span>
                    {tag.editable && (
                      <button
                        className="create-drawer-tag-remove"
                        onClick={() => handleTagRemove(tag.id)}
                        aria-label={`Remove ${tag.name} tag`}
                      >
                        <span className="create-drawer-tag-remove-icon">✕</span>
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

  const renderFormSection = () => {
    switch (activeSection) {
      case 'basics':
        return renderBasicsSection();
      case 'prompt':
        return renderPromptSection();
      case 'icp-stage':
        return renderICPStageSection();
      case 'inputs':
        return renderInputsSection();
      case 'context':
        return renderContextSection();
      default:
        return renderBasicsSection();
    }
  };

  const renderBasicsSection = () => (
    <div className="template-form-section" id="basics-section">
      <h3 className="template-form-section-title">Basics</h3>
      <p className="template-form-section-description">
        Define core metadata for surfacing and search
      </p>

      {/* Title */}
      <div className="create-drawer-field">
        <label className="create-drawer-label">
          Title
          <span className="create-drawer-required">*</span>
        </label>
        <input
          type="text"
          className="create-drawer-input"
          placeholder="Enter template title..."
          value={templateForm.title}
          onChange={(e) => handleTemplateFormChange('title', e.target.value)}
          onBlur={() => saveTemplateDraft()}
          maxLength={80}
        />
        <div className="create-drawer-field-hint">
          {templateForm.title.length}/80 characters
        </div>
        {templateForm.title.length > 80 && (
          <div className="create-drawer-field-error">
            Title must be 80 characters or less
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="create-drawer-field">
        <label className="create-drawer-label">
          Preview
          <span className="create-drawer-required">*</span>
        </label>
        <textarea
          className="create-drawer-input create-drawer-textarea"
          placeholder="Brief description that appears in search results..."
          value={templateForm.preview}
          onChange={(e) => handleTemplateFormChange('preview', e.target.value)}
          onBlur={() => saveTemplateDraft()}
          maxLength={160}
          rows={3}
        />
        <div className="create-drawer-field-hint">
          {templateForm.preview.length}/160 characters
        </div>
        {templateForm.preview.length > 160 && (
          <div className="create-drawer-field-error">
            Preview must be 160 characters or less
          </div>
        )}
      </div>

      {/* Description */}
      <div className="create-drawer-field">
        <label className="create-drawer-label">
          Description
          <span className="create-drawer-optional">(optional)</span>
        </label>
        <textarea
          className="create-drawer-input create-drawer-textarea"
          placeholder="Detailed description of the template's purpose and usage..."
          value={templateForm.description}
          onChange={(e) => handleTemplateFormChange('description', e.target.value)}
          onBlur={() => saveTemplateDraft()}
          maxLength={1000}
          rows={4}
        />
        <div className="create-drawer-field-hint">
          {templateForm.description.length}/1,000 characters
        </div>
        {templateForm.description.length > 1000 && (
          <div className="create-drawer-field-error">
            Description must be 1,000 characters or less
          </div>
        )}
      </div>

      {/* Thumbnail */}
      <div className="create-drawer-field">
        <label className="create-drawer-label">
          Thumbnail
          <span className="create-drawer-optional">(optional)</span>
        </label>
        <div className="template-form-thumbnail-upload">
          <div className="template-form-thumbnail-preview">
            {templateForm.thumbnail ? (
              <img src={templateForm.thumbnail} alt="Template thumbnail" />
            ) : (
              <div className="template-form-thumbnail-placeholder">
                <span className="template-form-placeholder-icon">🖼️</span>
                <span>No thumbnail</span>
              </div>
            )}
          </div>
          <div className="template-form-thumbnail-actions">
            <button
              type="button"
              className="create-drawer-btn create-drawer-btn--secondary"
              onClick={() => {/* TODO: Implement file upload */}}
            >
              <span className="create-drawer-btn-icon">📤</span>
              Upload Image
            </button>
            {templateForm.thumbnail && (
              <button
                type="button"
                className="create-drawer-btn create-drawer-btn--ghost"
                onClick={() => handleTemplateFormChange('thumbnail', '')}
              >
                <span className="create-drawer-btn-icon">🗑️</span>
                Remove
              </button>
            )}
          </div>
        </div>
        <div className="create-drawer-field-hint">
          Recommended: 400x300px, JPG or PNG, max 2MB
        </div>
      </div>
    </div>
  );

  const renderPromptSection = () => (
    <div className="template-form-section" id="prompt-section">
      <h3 className="template-form-section-title">Prompt</h3>
      <p className="template-form-section-description">
        Define the system/author prompt body that will be executed
      </p>

      <div className="create-drawer-field">
        <label className="create-drawer-label">
          System Prompt
          <span className="create-drawer-required">*</span>
        </label>
        <textarea
          className="create-drawer-input create-drawer-textarea template-form-prompt-editor"
          placeholder="Enter the prompt that will be sent to the AI system..."
          value={templateForm.prompt}
          onChange={(e) => handleTemplateFormChange('prompt', e.target.value)}
          onBlur={() => saveTemplateDraft()}
          rows={12}
        />
        <div className="create-drawer-field-hint">
          {templateForm.prompt.length.toLocaleString()}/30,000 characters
          {templateForm.prompt.length > 20000 && (
            <span className="template-form-warning"> (Consider breaking into smaller prompts)</span>
          )}
        </div>
        {templateForm.prompt.length > 30000 && (
          <div className="create-drawer-field-error">
            Prompt must be 30,000 characters or less
          </div>
        )}
      </div>

      <div className="template-form-prompt-tips">
        <h4>💡 Prompt Writing Tips</h4>
        <ul>
          <li>Be specific and clear about what you want the AI to do</li>
          <li>Use placeholders like <code>{`{{ input_name }}`}</code> for dynamic content</li>
          <li>Include examples when possible to guide the AI's response</li>
          <li>Define the desired output format and structure</li>
        </ul>
      </div>
    </div>
  );

  const renderICPStageSection = () => (
    <div className="template-form-section" id="icp-stage-section">
      <h3 className="template-form-section-title">ICP & Stage</h3>
      <p className="template-form-section-description">
        Define the ideal customer profile and stage/moment for this template
      </p>

      {/* ICP */}
      <div className="create-drawer-field">
        <label className="create-drawer-label">
          ICP (Ideal Customer Profile)
        </label>
        <select
          className="create-drawer-input"
          value={templateForm.icp}
          onChange={(e) => handleTemplateFormChange('icp', e.target.value)}
          onBlur={() => saveTemplateDraft()}
        >
          <option value="">Select ICP...</option>
          <option value="enterprise">Enterprise</option>
          <option value="smb">Small & Medium Business</option>
          <option value="startup">Startup</option>
          <option value="agency">Agency</option>
          <option value="consultant">Consultant</option>
          <option value="other">Other</option>
        </select>
        
        {templateForm.icp === 'other' && (
          <input
            type="text"
            className="create-drawer-input"
            placeholder="Specify your ICP..."
            value={templateForm.customIcp || ''}
            onChange={(e) => handleTemplateFormChange('customIcp', e.target.value)}
            onBlur={() => saveTemplateDraft()}
            style={{ marginTop: '8px' }}
          />
        )}
      </div>

      {/* Stage/Moment */}
      <div className="create-drawer-field">
        <label className="create-drawer-label">
          Stage/Moment
        </label>
        <input
          type="text"
          className="create-drawer-input"
          placeholder="e.g., Product Launch, Quarterly Planning, Customer Onboarding..."
          value={templateForm.stage}
          onChange={(e) => handleTemplateFormChange('stage', e.target.value)}
          onBlur={() => saveTemplateDraft()}
        />
        <div className="create-drawer-field-hint">
          Describe when this template would typically be used
        </div>
      </div>
    </div>
  );

  const renderInputsSection = () => (
    <div className="template-form-section" id="inputs-section">
      <h3 className="template-form-section-title">Inputs</h3>
      <p className="template-form-section-description">
        Define the input fields that users will fill when running this template
      </p>

      {/* Input Fields List */}
      <div className="template-form-inputs-list">
        {templateForm.inputs.map((input, index) => (
          <div key={input.id} className="template-form-input-card">
            <div className="template-form-input-card-header">
            <div className="template-form-input-card-title">
              <span className="template-form-input-type-icon">{getInputTypeIcon(input.type)}</span>
              <span>{input.label || `Input ${index + 1}`}</span>
              <span className="template-form-input-type-badge">{getInputTypeLabel(input.type)}</span>
            </div>
              <div className="template-form-input-card-actions">
                <button
                  type="button"
                  className="template-form-input-action"
                  onClick={() => handleInputReorder(input.id, 'up')}
                  disabled={index === 0}
                  title="Move up"
                >
                  <span className="template-form-input-action-icon">▲</span>
                </button>
                <button
                  type="button"
                  className="template-form-input-action"
                  onClick={() => handleInputReorder(input.id, 'down')}
                  disabled={index === templateForm.inputs.length - 1}
                  title="Move down"
                >
                  <span className="template-form-input-action-icon">▼</span>
                </button>
                <button
                  type="button"
                  className="template-form-input-action template-form-input-action--danger"
                  onClick={() => handleInputRemove(input.id)}
                  title="Delete input"
                >
                  <span className="template-form-input-action-icon">🗑️</span>
                </button>
              </div>
            </div>
            
            <div className="template-form-input-card-body">
              {/* Input configuration fields */}
              <div className="template-form-input-config">
                <div className="template-form-input-config-row">
                  <div className="template-form-input-config-field">
                    <label>Label *</label>
                    <input
                      type="text"
                      value={input.label}
                      onChange={(e) => {
                        handleInputUpdate(input.id, 'label', e.target.value);
                        // Auto-generate key from label if key is empty or matches old label
                        if (!input.key || input.key === generateSlug(input.label)) {
                          handleInputUpdate(input.id, 'key', generateSlug(e.target.value));
                        }
                      }}
                      placeholder="Enter field label..."
                    />
                  </div>
                  <div className="template-form-input-config-field">
                    <label>Key *</label>
                    <input
                      type="text"
                      value={input.key}
                      onChange={(e) => handleInputUpdate(input.id, 'key', e.target.value)}
                      placeholder="field_key"
                      pattern="^[a-z][a-z0-9_]*$"
                    />
                  </div>
                  <div className="template-form-input-config-field">
                    <label>Type</label>
                    <select
                      value={input.type}
                      onChange={(e) => handleInputUpdate(input.id, 'type', e.target.value)}
                    >
                      <option value="short_text">Short Text</option>
                      <option value="long_text">Long Text</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="single_select">Single Select</option>
                      <option value="multi_select">Multi Select</option>
                      <option value="date">Date</option>
                      <option value="file_upload">File Upload</option>
                      <option value="url">URL</option>
                    </select>
                  </div>
                </div>
                
                <div className="template-form-input-config-row">
                  <div className="template-form-input-config-field">
                    <label>Placeholder</label>
                    <input
                      type="text"
                      value={input.placeholder}
                      onChange={(e) => handleInputUpdate(input.id, 'placeholder', e.target.value)}
                      placeholder="Enter placeholder text..."
                    />
                  </div>
                  <div className="template-form-input-config-field">
                    <label>Default Value</label>
                    <input
                      type="text"
                      value={input.defaultValue}
                      onChange={(e) => handleInputUpdate(input.id, 'defaultValue', e.target.value)}
                      placeholder="Default value..."
                    />
                  </div>
                  <div className="template-form-input-config-field template-form-input-config-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={input.required}
                        onChange={(e) => handleInputUpdate(input.id, 'required', e.target.checked)}
                      />
                      Required
                    </label>
                  </div>
                </div>

                <div className="template-form-input-config-row">
                  <div className="template-form-input-config-field template-form-input-config-full">
                    <label>Help Text</label>
                    <textarea
                      value={input.helpText}
                      onChange={(e) => handleInputUpdate(input.id, 'helpText', e.target.value)}
                      placeholder="Additional help text for users..."
                      rows={2}
                    />
                  </div>
                </div>

                {/* Options for select types */}
                {(input.type === 'single_select' || input.type === 'multi_select') && (
                  <div className="template-form-input-options">
                    <label>Options</label>
                    {input.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="template-form-input-option">
                        <input
                          type="text"
                          placeholder="Label"
                          value={option.label}
                          onChange={(e) => {
                            const newOptions = [...input.options];
                            newOptions[optionIndex] = { ...option, label: e.target.value };
                            handleInputUpdate(input.id, 'options', newOptions);
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={option.value}
                          onChange={(e) => {
                            const newOptions = [...input.options];
                            newOptions[optionIndex] = { ...option, value: e.target.value };
                            handleInputUpdate(input.id, 'options', newOptions);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = input.options.filter((_, i) => i !== optionIndex);
                            handleInputUpdate(input.id, 'options', newOptions);
                          }}
                        >
                          <span className="template-form-option-delete">🗑️</span>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="template-form-add-option"
                      onClick={() => {
                        const newOptions = [...(input.options || []), { label: '', value: '' }];
                        handleInputUpdate(input.id, 'options', newOptions);
                      }}
                    >
                      <span className="template-form-add-option-icon">➕</span>
                      Add Option
                    </button>
                  </div>
                )}

                {/* File type restrictions */}
                {input.type === 'file_upload' && (
                  <div className="template-form-file-restrictions">
                    <p><strong>File Restrictions:</strong></p>
                    <ul>
                      <li>Allowed types: Documents (.pdf, .doc, .docx), Images (.jpg, .png, .gif)</li>
                      <li>Maximum size: 10MB per file</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add Input Button */}
        <div className="template-form-add-input">
          <button
            type="button"
            className="create-drawer-btn create-drawer-btn--primary"
            onClick={() => handleInputAdd()}
          >
            <span className="create-drawer-btn-icon">➕</span>
            Add Input Field
          </button>
          
          {/* Quick add dropdown */}
          <div className="template-form-quick-add">
            <span>Quick add:</span>
            <button onClick={() => handleInputAdd('short_text')}>📝 Text</button>
            <button onClick={() => handleInputAdd('single_select')}>📋 Select</button>
            <button onClick={() => handleInputAdd('file_upload')}>📁 File</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContextSection = () => (
    <div className="template-form-section" id="context-section">
      <h3 className="template-form-section-title">Context Attachments</h3>
      <p className="template-form-section-description">
        Attach reference files or links that provide context for the prompt (distinct from run-time file inputs)
      </p>

      <div className="template-form-context-attachments">
        {templateForm.contextAttachments.length === 0 ? (
          <div className="template-form-empty-state">
            <span className="template-form-empty-icon">📎</span>
            <h4>No context attachments</h4>
            <p>Add reference files or links to provide additional context for this template.</p>
          </div>
        ) : (
          <div className="template-form-attachments-list">
            {templateForm.contextAttachments.map((attachment, index) => (
              <div key={index} className="template-form-attachment-item">
                <div className="template-form-attachment-icon">
                  <span className="template-form-attachment-icon-emoji">{getAttachmentIcon(attachment.type)}</span>
                </div>
                <div className="template-form-attachment-info">
                  <span className="template-form-attachment-name">{attachment.name}</span>
                  <span className="template-form-attachment-type">{attachment.type}</span>
                </div>
                <button
                  type="button"
                  className="template-form-attachment-remove"
                  onClick={() => {
                    const newAttachments = templateForm.contextAttachments.filter((_, i) => i !== index);
                    handleTemplateFormChange('contextAttachments', newAttachments);
                  }}
                >
                  <span className="template-form-attachment-remove-icon">🗑️</span>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="template-form-add-attachment">
          <button
            type="button"
            className="create-drawer-btn create-drawer-btn--secondary"
            onClick={() => {/* TODO: Implement file upload */}}
          >
            <span className="create-drawer-btn-icon">📤</span>
            Upload File
          </button>
          <button
            type="button"
            className="create-drawer-btn create-drawer-btn--secondary"
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) {
                const newAttachments = [...templateForm.contextAttachments, {
                  type: 'link',
                  name: url,
                  url: url
                }];
                handleTemplateFormChange('contextAttachments', newAttachments);
              }
            }}
          >
            <span className="create-drawer-btn-icon">🔗</span>
            Add Link
          </button>
        </div>
      </div>

      {/* Tags Display (Read-only) */}
      <div className="template-form-tags-display">
        <h4>Tags (from Scope step)</h4>
        <div className="template-form-tags-readonly">
          {selectedTags.length > 0 ? (
            selectedTags.map((tag) => {
              const typeInfo = getTagTypeIcon(tag.type);
              return (
                <div key={tag.id} className="template-form-tag-chip">
                  <span 
                    className="template-form-tag-chip-icon"
                    style={{ color: typeInfo.color }}
                  >
                    {typeInfo.icon}
                  </span>
                  <span>{tag.name}</span>
                </div>
              );
            })
          ) : (
            <span className="template-form-no-tags">No tags selected</span>
          )}
        </div>
        <p className="template-form-tags-note">
          To edit tags, go back to the Scope step.
        </p>
      </div>
    </div>
  );

  // Helper functions for inputs section
  const getInputTypeIcon = (type) => {
    switch (type) {
      case 'short_text': return '📝';
      case 'long_text': return '📄';
      case 'number': return '#️⃣';
      case 'boolean': return '✅';
      case 'single_select': return '📋';
      case 'multi_select': return '☑️';
      case 'date': return '📅';
      case 'file_upload': return '📁';
      case 'url': return '🔗';
      default: return '❓';
    }
  };

  const getInputTypeLabel = (type) => {
    switch (type) {
      case 'short_text': return 'Short Text';
      case 'long_text': return 'Long Text';
      case 'number': return 'Number';
      case 'boolean': return 'Boolean';
      case 'single_select': return 'Single Select';
      case 'multi_select': return 'Multi Select';
      case 'date': return 'Date';
      case 'file_upload': return 'File Upload';
      case 'url': return 'URL';
      default: return 'Unknown';
    }
  };

  const getAttachmentIcon = (type) => {
    switch (type) {
      case 'file': return '📄';
      case 'link': return '🔗';
      case 'image': return '🖼️';
      case 'document': return '📄';
      default: return '📎';
    }
  };

  const renderAuthoringContent = () => (
    <div className="template-authoring-form">
      {/* Progress Indicator */}
      <div className="create-drawer-progress">
        <div className="create-drawer-progress-steps">
          <div className="create-drawer-progress-step create-drawer-progress-step--completed">
            <span className="create-drawer-progress-icon">✓</span>
            <span>Type Selected</span>
          </div>
          <div className="create-drawer-progress-step create-drawer-progress-step--completed">
            <span className="create-drawer-progress-icon">✓</span>
            <span>Scope Configured</span>
          </div>
          <div className="create-drawer-progress-step create-drawer-progress-step--current">
            <span className="create-drawer-progress-icon">✏️</span>
            <span>Build Content</span>
          </div>
        </div>
      </div>

      {/* Dynamic authoring layout based on type */}
      {type === 'template' && (
        <>
          {/* Mini TOC */}
          <div className="template-form-toc">
            <div className="template-form-toc-item">
              <button 
                className={`template-form-toc-button ${activeSection === 'basics' ? 'active' : ''}`}
                onClick={() => setActiveSection('basics')}
              >
                📄 Basics
              </button>
            </div>
            <div className="template-form-toc-item">
              <button 
                className={`template-form-toc-button ${activeSection === 'prompt' ? 'active' : ''}`}
                onClick={() => setActiveSection('prompt')}
              >
                ✏️ Prompt
              </button>
            </div>
            <div className="template-form-toc-item">
              <button 
                className={`template-form-toc-button ${activeSection === 'icp-stage' ? 'active' : ''}`}
                onClick={() => setActiveSection('icp-stage')}
              >
                🎯 ICP & Stage
              </button>
            </div>
            <div className="template-form-toc-item">
              <button 
                className={`template-form-toc-button ${activeSection === 'inputs' ? 'active' : ''}`}
                onClick={() => setActiveSection('inputs')}
              >
                📝 Inputs
              </button>
            </div>
            <div className="template-form-toc-item">
              <button 
                className={`template-form-toc-button ${activeSection === 'context' ? 'active' : ''}`}
                onClick={() => setActiveSection('context')}
              >
                📎 Context
              </button>
            </div>
          </div>

          {/* Form Sections */}
          <div className="template-form-sections">
            {renderFormSection()}
          </div>

          {/* Auto-save indicator */}
          {lastSaved && (
            <div className="template-form-autosave">
              <span className="template-form-autosave-icon">✅</span>
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}

          {/* Preview & Validation */}
          <div className="builder-preview-validation">
            <div className="builder-preview">
              <h4 className="builder-section-title">Preview</h4>
              <div className="preview-template-card">
                <div className="preview-title">{templateForm.title || 'Untitled Template'}</div>
                <div className="preview-sub">{templateForm.preview || 'Preview goes here...'}</div>
                {selectedTags?.length > 0 && (
                  <div className="preview-tags">
                    {selectedTags.map(t => <span key={t.id} className="preview-tag">{t.name}</span>)}
                  </div>
                )}
              </div>
              <div className="preview-intake">
                <div className="preview-intake-title">Simulated Intake</div>
                {(templateForm.inputs || []).length === 0 ? (
                  <div className="preview-empty">No inputs defined</div>
                ) : (
                  (templateForm.inputs || []).map((input) => (
                    <div key={input.id} className="preview-intake-field">
                      <div className="preview-label">{input.label || input.key}{input.required && <span className="create-drawer-required">*</span>}</div>
                      {input.type === 'single_select' ? (
                        <select disabled><option>—</option></select>
                      ) : input.type === 'long_text' ? (
                        <textarea disabled rows={2} />
                      ) : (
                        <input disabled type="text" placeholder={input.placeholder || ''} />
                      )}
                      {input.helpText && <div className="preview-help">{input.helpText}</div>}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="builder-validation" ref={validationRef}>
              <h4 className="builder-section-title">Validation</h4>
              {validation.errors.length === 0 && validation.warnings.length === 0 ? (
                <div className="validation-clear">No issues found</div>
              ) : (
                <ul className="validation-list">
                  {validation.errors.map(v => (
                    <li key={v.id} className="validation-item validation-item--error">
                      <span className="validation-badge">Error</span>
                      <span className="validation-msg">{v.msg}</span>
                      <button className="validation-fix" onClick={() => v.to && v.to()}>Fix it</button>
                    </li>
                  ))}
                  {validation.warnings.map(v => (
                    <li key={v.id} className="validation-item validation-item--warning">
                      <span className="validation-badge validation-badge--warning">Warning</span>
                      <span className="validation-msg">{v.msg}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button className="create-drawer-btn" onClick={recomputeValidation}>Re-check</button>
            </div>
          </div>
        </>
      )}

      {type === 'playbook' && (
        <div className="playbook-authoring">
          {/* Playbook name */}
          <div className="create-drawer-field">
            <label className="create-drawer-label">
              Playbook Name
              <span className="create-drawer-required">*</span>
            </label>
            <input
              type="text"
              className="create-drawer-input"
              placeholder="Enter playbook name..."
              value={playbook.name}
              onChange={(e) => {
                setPlaybook(prev => ({ ...prev, name: e.target.value }));
                saveTemplateDraft();
              }}
            />
          </div>

          {/* Execution Settings */}
          <div className="playbook-execution-settings">
            <h4 className="playbook-section-title">Execution Settings</h4>
            <div className="playbook-exec-modes">
              <label className="playbook-radio">
                <input
                  type="radio"
                  name="exec_mode"
                  checked={playbook.execution.mode === 'step_by_step'}
                  onChange={() => {
                    setPlaybook(prev => ({ ...prev, execution: { ...prev.execution, mode: 'step_by_step', consolidatedSchema: [] } }));
                    saveTemplateDraft();
                  }}
                />
                <span className="playbook-radio-label">Step-by-Step (default)</span>
              </label>
              <div className="playbook-radio-help">Review outputs after each step. Provide inputs per step.</div>

              <label className="playbook-radio">
                <input
                  type="radio"
                  name="exec_mode"
                  checked={playbook.execution.mode === 'auto_run'}
                  onChange={() => {
                    setPlaybook(prev => ({ ...prev, execution: { ...prev.execution, mode: 'auto_run' } }));
                    setTimeout(() => recomputeConsolidatedSchema(), 0);
                    saveTemplateDraft();
                  }}
                />
                <span className="playbook-radio-label">Auto-Run</span>
              </label>
              <div className="playbook-radio-help">Provide all inputs up front. System runs all steps in sequence automatically.</div>
            </div>

            {playbook.execution.mode === 'auto_run' && (
              <div className="playbook-consolidated-preview">
                <div className="playbook-consolidated-header">Consolidated Intake Form (Preview)</div>
                {playbook.execution.consolidatedSchema.length === 0 ? (
                  <div className="playbook-empty-small">Add steps to build the form.</div>
                ) : (
                  <div className="playbook-consolidated-list">
                    {playbook.execution.consolidatedSchema.map((field, idx) => (
                      <div key={`${field.key}_${idx}`} className="playbook-consolidated-item">
                        <div className="playbook-consolidated-label">
                          {field.label}
                          {field.required && <span className="create-drawer-required">*</span>}
                        </div>
                        <div className="playbook-consolidated-meta">
                          key: <code>{field.key}</code> • from step {field.stepIndex} ({field.stepName})
                        </div>
                        <div className="playbook-consolidated-input-mock">
                          {/* Mock input preview based on type */}
                          {field.type === 'single_select' ? (
                            <select disabled><option>—</option></select>
                          ) : field.type === 'long_text' ? (
                            <textarea disabled rows={2} />
                          ) : (
                            <input disabled type="text" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Steps list */}
          <div className="playbook-steps-list">
            {playbook.steps.length === 0 && (
              <div className="playbook-empty">
                <span className="playbook-empty-icon">🧩</span>
                <p>No steps yet. Add your first template as a step.</p>
              </div>
            )}

            {playbook.steps.map((step, index) => (
              <div key={step.id} className="playbook-step-card">
                <div className="playbook-step-header">
                  <div className="playbook-step-index">{index + 1}</div>
                  <div className="playbook-step-meta">
                    <div className="playbook-step-template-title">{step.templateTitle || 'Untitled Template'}</div>
                    <div className="playbook-step-template-preview">{step.templatePreview || ''}</div>
                  </div>
                  <div className="playbook-step-actions">
                    <button
                      className="playbook-step-action"
                      disabled={index === 0}
                      title="Move up"
                      onClick={() => handlePlaybookReorder(step.id, 'up')}
                    >▲</button>
                    <button
                      className="playbook-step-action"
                      disabled={index === playbook.steps.length - 1}
                      title="Move down"
                      onClick={() => handlePlaybookReorder(step.id, 'down')}
                    >▼</button>
                    <button
                      className="playbook-step-action playbook-step-remove"
                      title="Remove"
                      onClick={() => handlePlaybookRemove(step.id)}
                    >🗑️</button>
                  </div>
                </div>
                <div className="playbook-step-body">
                  <div className="create-drawer-field">
                    <label className="create-drawer-label">Step Name</label>
                    <input
                      type="text"
                      className="create-drawer-input"
                      placeholder="Defaults to template title"
                      value={step.stepName || ''}
                      onChange={(e) => handlePlaybookStepUpdate(step.id, 'stepName', e.target.value)}
                    />
                  </div>
                  <div className="create-drawer-field">
                    <label className="create-drawer-label">Notes</label>
                    <textarea
                      className="create-drawer-input create-drawer-textarea"
                      placeholder="Optional notes or instructions for this step"
                      rows={3}
                      value={step.notes || ''}
                      onChange={(e) => handlePlaybookStepUpdate(step.id, 'notes', e.target.value)}
                    />
                  </div>
                  {/* Basic mapping placeholder */}
                  <div className="create-drawer-field">
                    <label className="create-drawer-label">Input Mapping</label>
                    <div className="playbook-mapping-placeholder">Map outputs from prior steps to this step's inputs (basic mapping)</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Step */}
          <div className="playbook-add-step">
            <button className="create-drawer-btn create-drawer-btn--primary" onClick={() => setShowAddStepModal(true)}>
              <span className="create-drawer-btn-icon">➕</span>
              Add Step
            </button>
          </div>

          {/* Preview & Validation */}
          <div className="builder-preview-validation">
            <div className="builder-preview">
              <h4 className="builder-section-title">Preview</h4>
              <div className="preview-playbook-seq">
                {(playbook.steps || []).length === 0 ? (
                  <div className="preview-empty">No steps yet</div>
                ) : (
                  playbook.steps.map((s, idx) => (
                    <div key={s.id} className="preview-step">
                      <div className="preview-step-head">
                        <div className="preview-step-index">{idx + 1}</div>
                        <div className="preview-step-title">{s.stepName || s.templateTitle}</div>
                      </div>
                      <div className="preview-step-sub">{s.templatePreview || ''}</div>
                      <details className="preview-step-details">
                        <summary>Intake Preview</summary>
                        <div className="preview-intake">
                          {(mockTemplates.find(t => t.id === s.templateId)?.inputs || []).map((inp, i) => (
                            <div key={`${s.id}_${i}`} className="preview-intake-field">
                              <div className="preview-label">{inp.label}{inp.required && <span className="create-drawer-required">*</span>}</div>
                              {inp.type === 'single_select' ? <select disabled><option>—</option></select> : inp.type === 'long_text' ? <textarea disabled rows={2}/> : <input disabled type="text" />}
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="builder-validation" ref={validationRef}>
              <h4 className="builder-section-title">Validation</h4>
              {validation.errors.length === 0 && validation.warnings.length === 0 ? (
                <div className="validation-clear">No issues found</div>
              ) : (
                <ul className="validation-list">
                  {validation.errors.map(v => (
                    <li key={v.id} className="validation-item validation-item--error">
                      <span className="validation-badge">Error</span>
                      <span className="validation-msg">{v.msg}</span>
                    </li>
                  ))}
                  {validation.warnings.map(v => (
                    <li key={v.id} className="validation-item validation-item--warning">
                      <span className="validation-badge validation-badge--warning">Warning</span>
                      <span className="validation-msg">{v.msg}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button className="create-drawer-btn" onClick={recomputeValidation}>Re-check</button>
            </div>
          </div>
        </div>
      )}

      {type === 'group' && (
        <div className="series-authoring">
          {/* Series name */}
          <div className="create-drawer-field">
            <label className="create-drawer-label">
              Series Name
              <span className="create-drawer-required">*</span>
            </label>
            <input
              type="text"
              className="create-drawer-input"
              placeholder="Enter series name..."
              value={series.name}
              onChange={(e) => { setSeries(prev => ({ ...prev, name: e.target.value })); saveTemplateDraft(); }}
            />
          </div>

          {/* Playbooks list */}
          <div className="series-list">
            {series.items.length === 0 && (
              <div className="series-empty">
                <span className="series-empty-icon">🧩</span>
                <p>No playbooks yet. Add your first playbook.</p>
              </div>
            )}

            {series.items.map((pb, index) => (
              <div key={pb.id} className="series-card">
                <div className="series-card-header">
                  <div className="series-index">{index + 1}</div>
                  <div className="series-meta">
                    <div className="series-name">{pb.label || pb.name}</div>
                    <div className="series-sub">{pb.stepCount || 0} steps • {pb.preview || ''}</div>
                  </div>
                  <div className="series-actions">
                    <button className="series-action" disabled={index === 0} title="Move up" onClick={() => handleSeriesReorder(pb.id, 'up')}>▲</button>
                    <button className="series-action" disabled={index === series.items.length - 1} title="Move down" onClick={() => handleSeriesReorder(pb.id, 'down')}>▼</button>
                    <button className="series-action series-remove" title="Remove" onClick={() => handleSeriesRemove(pb.id)}>🗑️</button>
                  </div>
                </div>
                {/* Expandable preview placeholder */}
                <div className="series-card-body">
                  <div className="create-drawer-field">
                    <label className="create-drawer-label">Label in Series</label>
                    <input
                      type="text"
                      className="create-drawer-input"
                      placeholder="Must be unique within the series"
                      value={pb.label || ''}
                      onChange={(e) => handleSeriesItemUpdate(pb.id, 'label', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="series-add">
            <button className="create-drawer-btn create-drawer-btn--primary" onClick={() => setShowAddPlaybookModal(true)}>
              <span className="create-drawer-btn-icon">➕</span>
              Add Playbook
            </button>
          </div>

          {/* Preview & Validation */}
          <div className="builder-preview-validation">
            <div className="builder-preview">
              <h4 className="builder-section-title">Preview</h4>
              <div className="preview-series">
                {(series.items || []).length === 0 ? (
                  <div className="preview-empty">No playbooks yet</div>
                ) : (
                  series.items.map((pb, idx) => (
                    <div key={pb.id} className="preview-series-item">
                      <div className="preview-step-head">
                        <div className="preview-step-index">{idx + 1}</div>
                        <div className="preview-step-title">{pb.label || pb.name}</div>
                      </div>
                      <div className="preview-step-sub">{pb.stepCount || 0} steps • {pb.preview || ''}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="builder-validation" ref={validationRef}>
              <h4 className="builder-section-title">Validation</h4>
              {validation.errors.length === 0 && validation.warnings.length === 0 ? (
                <div className="validation-clear">No issues found</div>
              ) : (
                <ul className="validation-list">
                  {validation.errors.map(v => (
                    <li key={v.id} className="validation-item validation-item--error">
                      <span className="validation-badge">Error</span>
                      <span className="validation-msg">{v.msg}</span>
                    </li>
                  ))}
                  {validation.warnings.map(v => (
                    <li key={v.id} className="validation-item validation-item--warning">
                      <span className="validation-badge validation-badge--warning">Warning</span>
                      <span className="validation-msg">{v.msg}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button className="create-drawer-btn" onClick={recomputeValidation}>Re-check</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Playbook helpers and handlers
  const isPlaybookValid = () => {
    if (!playbook.name || playbook.name.trim().length === 0) return false;
    if (!playbook.steps || playbook.steps.length === 0) return false;
    // No empty steps: ensure each has a templateId
    if (playbook.steps.some(s => !s.templateId)) return false;
    // Unique step names (case-insensitive)
    const names = playbook.steps.map(s => (s.stepName || s.templateTitle || '').toLowerCase());
    const dup = names.some((n, i) => n && names.indexOf(n) !== i);
    if (dup) return false;
    return true;
  };

  const handleAddExistingTemplate = (template) => {
    const newStep = {
      id: `step_${Date.now()}`,
      templateId: template.id,
      templateTitle: template.title,
      templatePreview: template.preview,
      stepName: template.title,
      notes: '',
      mappings: []
    };
    setPlaybook(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
    setShowAddStepModal(false);
    setAddStepMode(null);
    setTemplateSearch('');
    recomputeConsolidatedSchema();
    saveTemplateDraft();
  };

  const handleCreateInlineTemplate = () => {
    const tempId = `tmp_${Date.now()}`;
    const template = {
      id: tempId,
      title: inlineTemplateForm.title,
      preview: inlineTemplateForm.preview
    };
    const newStep = {
      id: `step_${Date.now()}`,
      templateId: template.id,
      templateTitle: template.title,
      templatePreview: template.preview,
      stepName: template.title,
      notes: '',
      mappings: []
    };
    setPlaybook(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
    setInlineTemplateForm({ title: '', preview: '', description: '', prompt: '' });
    setShowAddStepModal(false);
    setAddStepMode(null);
    recomputeConsolidatedSchema();
    saveTemplateDraft();
  };

  const handlePlaybookReorder = (stepId, direction) => {
    setPlaybook(prev => {
      const steps = [...prev.steps];
      const idx = steps.findIndex(s => s.id === stepId);
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= steps.length) return prev;
      [steps[idx], steps[newIdx]] = [steps[newIdx], steps[idx]];
      return { ...prev, steps };
    });
    saveTemplateDraft();
  };

  const handlePlaybookRemove = (stepId) => {
    if (!window.confirm('Remove this step?')) return;
    setPlaybook(prev => ({ ...prev, steps: prev.steps.filter(s => s.id !== stepId) }));
    saveTemplateDraft();
  };

  const handlePlaybookStepUpdate = (stepId, field, value) => {
    setPlaybook(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === stepId ? { ...s, [field]: value } : s)
    }));
    // Debounced autosave
    clearTimeout(window.playbookSaveTimeout);
    window.playbookSaveTimeout = setTimeout(() => {
      recomputeConsolidatedSchema();
      saveTemplateDraft();
    }, 600);
  };

  // Execution Settings: consolidated schema computation (auto-run)
  const recomputeConsolidatedSchema = () => {
    setPlaybook(prev => {
      if (prev.execution.mode !== 'auto_run') return prev;
      const schema = [];
      const keySet = new Set();
      prev.steps.forEach((step, idx) => {
        const tmpl = mockTemplates.find(t => t.id === step.templateId);
        const inputs = tmpl?.inputs || [];
        inputs.forEach(input => {
          let key = input.key;
          if (keySet.has(key)) {
            key = `${key}_${idx + 1}`; // append step index to resolve conflict
          }
          keySet.add(key);
          schema.push({
            ...input,
            key,
            originalKey: input.key,
            stepIndex: idx + 1,
            stepId: step.id,
            stepName: step.stepName || step.templateTitle
          });
        });
      });
      return { ...prev, execution: { ...prev.execution, consolidatedSchema: schema } };
    });
  };

  // Series helpers
  const isSeriesValid = () => {
    if (!series.name || series.name.trim().length === 0) return false;
    if (!series.items || series.items.length === 0) return false;
    // unique labels
    const labels = series.items.map(i => (i.label || i.name || '').toLowerCase());
    const dup = labels.some((n, i) => n && labels.indexOf(n) !== i);
    if (dup) return false;
    return true;
  };

  const handleSeriesAddExisting = (p) => {
    const newItem = {
      id: `series_item_${Date.now()}`,
      playbookId: p.id,
      name: p.name,
      label: p.name,
      stepCount: p.stepCount,
      preview: p.preview
    };
    setSeries(prev => ({ ...prev, items: [...prev.items, newItem] }));
    setShowAddPlaybookModal(false);
    setAddPlaybookMode(null);
    setPlaybookSearch('');
    saveTemplateDraft();
  };

  const handleSeriesCreateInline = () => {
    const p = inlinePlaybookForm;
    const newItem = {
      id: `series_item_${Date.now()}`,
      playbookId: `new_${Date.now()}`,
      name: p.name,
      label: p.name,
      stepCount: p.stepCount || 1,
      preview: p.preview || ''
    };
    setSeries(prev => ({ ...prev, items: [...prev.items, newItem] }));
    setInlinePlaybookForm({ name: '', stepCount: 1, preview: '' });
    setShowAddPlaybookModal(false);
    setAddPlaybookMode(null);
    saveTemplateDraft();
  };

  const handleSeriesReorder = (itemId, direction) => {
    setSeries(prev => {
      const items = [...prev.items];
      const idx = items.findIndex(i => i.id === itemId);
      const ni = direction === 'up' ? idx - 1 : idx + 1;
      if (ni < 0 || ni >= items.length) return prev;
      [items[idx], items[ni]] = [items[ni], items[idx]];
      return { ...prev, items };
    });
    saveTemplateDraft();
  };

  const handleSeriesRemove = (itemId) => {
    if (!window.confirm('Remove this playbook from the series?')) return;
    setSeries(prev => ({ ...prev, items: prev.items.filter(i => i.id !== itemId) }));
    saveTemplateDraft();
  };

  const handleSeriesItemUpdate = (itemId, field, value) => {
    setSeries(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
    }));
    clearTimeout(window.seriesSaveTimeout);
    window.seriesSaveTimeout = setTimeout(() => saveTemplateDraft(), 500);
  };

  if (!isOpen) return null;

  const typeInfo = getTypeInfo();

  return (
    <div className="create-drawer-overlay">
      <div className="create-drawer">
        {/* Header */}
        <div className="create-drawer-header">
          <div className="create-drawer-title-section">
            <div className="create-drawer-icon">
              <span className="create-drawer-type-icon">{typeInfo.icon}</span>
            </div>
            <div className="create-drawer-title-content">
              <h2 className="create-drawer-title">{typeInfo.title}</h2>
              <p className="create-drawer-description">{typeInfo.description}</p>
              <div className="create-drawer-status">
                <span className="create-drawer-status-badge">Draft</span>
                {lastSaved && (
                  <span className="create-drawer-saved-at">Last saved {Math.ceil((Date.now() - lastSaved.getTime())/60000)}m ago</span>
                )}
              </div>
            </div>
          </div>
          <button
            className="create-drawer-close"
            onClick={handleClose}
            aria-label="Close drawer"
          >
            <span className="create-drawer-close-icon">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="create-drawer-content">
          {currentStep === 'scope' ? renderScopeContent() : renderAuthoringContent()}
        </div>

        {/* Playbook Add Step Modal */}
        {type === 'playbook' && showAddStepModal && (
          <div className="playbook-modal-backdrop" role="dialog" aria-modal="true">
            <div className="playbook-modal">
              <div className="playbook-modal-header">
                <h3>Add Step</h3>
                <button className="playbook-modal-close" onClick={() => { setShowAddStepModal(false); setAddStepMode(null); }}>✕</button>
              </div>
              {!addStepMode && (
                <div className="playbook-modal-content">
                  <button className="create-drawer-btn create-drawer-btn--primary" onClick={() => setAddStepMode('select')}>
                    <span className="create-drawer-btn-icon">📚</span>
                    Select Existing Template
                  </button>
                  <button className="create-drawer-btn create-drawer-btn--secondary" onClick={() => setAddStepMode('create')}>
                    <span className="create-drawer-btn-icon">📄</span>
                    Create New Template Inline
                  </button>
                </div>
              )}
              {addStepMode === 'select' && (
                <div className="playbook-modal-content">
                  <div className="create-drawer-field">
                    <label className="create-drawer-label">Search Templates</label>
                    <input
                      type="text"
                      className="create-drawer-input"
                      placeholder="Search by title..."
                      value={templateSearch}
                      onChange={(e) => setTemplateSearch(e.target.value)}
                    />
                  </div>
                  <div className="playbook-template-list">
                    {mockTemplates.filter(t => t.title.toLowerCase().includes(templateSearch.toLowerCase())).map(t => (
                      <button key={t.id} className="playbook-template-item" onClick={() => handleAddExistingTemplate(t)}>
                        <div className="playbook-template-title">{t.title}</div>
                        <div className="playbook-template-preview">{t.preview}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {addStepMode === 'create' && (
                <div className="playbook-modal-content">
                  <div className="create-drawer-field">
                    <label className="create-drawer-label">Template Title</label>
                    <input
                      type="text"
                      className="create-drawer-input"
                      value={inlineTemplateForm.title}
                      onChange={(e) => setInlineTemplateForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="create-drawer-field">
                    <label className="create-drawer-label">Preview</label>
                    <input
                      type="text"
                      className="create-drawer-input"
                      value={inlineTemplateForm.preview}
                      onChange={(e) => setInlineTemplateForm(prev => ({ ...prev, preview: e.target.value }))}
                    />
                  </div>
                  <div className="create-drawer-field">
                    <label className="create-drawer-label">Prompt</label>
                    <textarea
                      className="create-drawer-input create-drawer-textarea"
                      rows={6}
                      value={inlineTemplateForm.prompt}
                      onChange={(e) => setInlineTemplateForm(prev => ({ ...prev, prompt: e.target.value }))}
                    />
                  </div>
                  <div className="playbook-modal-actions">
                    <button className="create-drawer-btn create-drawer-btn--secondary" onClick={() => { setAddStepMode(null); }}>Back</button>
                    <button className="create-drawer-btn create-drawer-btn--primary" disabled={!inlineTemplateForm.title || !inlineTemplateForm.preview || !inlineTemplateForm.prompt} onClick={handleCreateInlineTemplate}>Add Step</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Series Add Playbook Modal */}
        {type === 'group' && showAddPlaybookModal && (
          <div className="playbook-modal-backdrop" role="dialog" aria-modal="true">
            <div className="playbook-modal">
              <div className="playbook-modal-header">
                <h3>Add Playbook</h3>
                <button className="playbook-modal-close" onClick={() => { setShowAddPlaybookModal(false); setAddPlaybookMode(null); }}>✕</button>
              </div>
              {!addPlaybookMode && (
                <div className="playbook-modal-content">
                  <button className="create-drawer-btn create-drawer-btn--primary" onClick={() => setAddPlaybookMode('select')}>
                    <span className="create-drawer-btn-icon">📚</span>
                    Select Existing Playbook
                  </button>
                  <button className="create-drawer-btn create-drawer-btn--secondary" onClick={() => setAddPlaybookMode('create')}>
                    <span className="create-drawer-btn-icon">📘</span>
                    Create Playbook Inline
                  </button>
                </div>
              )}
              {addPlaybookMode === 'select' && (
                <div className="playbook-modal-content">
                  <div className="create-drawer-field">
                    <label className="create-drawer-label">Search Playbooks</label>
                    <input
                      type="text"
                      className="create-drawer-input"
                      placeholder="Search by name..."
                      value={playbookSearch}
                      onChange={(e) => setPlaybookSearch(e.target.value)}
                    />
                  </div>
                  <div className="playbook-template-list">
                    {mockPlaybooks.filter(p => p.name.toLowerCase().includes(playbookSearch.toLowerCase())).map(p => (
                      <button key={p.id} className="playbook-template-item" onClick={() => handleSeriesAddExisting(p)}>
                        <div className="playbook-template-title">{p.name}</div>
                        <div className="playbook-template-preview">{p.stepCount} steps • {p.preview}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {addPlaybookMode === 'create' && (
                <div className="playbook-modal-content">
                  <div className="create-drawer-field">
                    <label className="create-drawer-label">Playbook Name</label>
                    <input
                      type="text"
                      className="create-drawer-input"
                      value={inlinePlaybookForm.name}
                      onChange={(e) => setInlinePlaybookForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="create-drawer-field">
                    <label className="create-drawer-label">Preview</label>
                    <input
                      type="text"
                      className="create-drawer-input"
                      value={inlinePlaybookForm.preview}
                      onChange={(e) => setInlinePlaybookForm(prev => ({ ...prev, preview: e.target.value }))}
                    />
                  </div>
                  <div className="create-drawer-field">
                    <label className="create-drawer-label">Step Count</label>
                    <input
                      type="number"
                      min={1}
                      className="create-drawer-input"
                      value={inlinePlaybookForm.stepCount}
                      onChange={(e) => setInlinePlaybookForm(prev => ({ ...prev, stepCount: Number(e.target.value || 1) }))}
                    />
                  </div>
                  <div className="playbook-modal-actions">
                    <button className="create-drawer-btn create-drawer-btn--secondary" onClick={() => { setAddPlaybookMode(null); }}>Back</button>
                    <button className="create-drawer-btn create-drawer-btn--primary" disabled={!inlinePlaybookForm.name} onClick={handleSeriesCreateInline}>Add Playbook</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="create-drawer-footer">
          <div className="create-drawer-footer-left">
            {currentStep === 'scope' ? (
              <button
                className="create-drawer-change-type"
                onClick={handleChangeType}
                title="Change type selection"
              >
                <span className="create-drawer-change-type-icon">✏️</span>
                <span>Change Type</span>
              </button>
            ) : (
              <button
                className="create-drawer-btn create-drawer-btn--secondary"
                onClick={handleBackToScope}
              >
                <span className="create-drawer-btn-icon">◀</span>
                Back to Scope
              </button>
            )}
          </div>
          
          <div className="create-drawer-footer-right">
            {currentStep === 'authoring' && (
              <>
                <button className="create-drawer-btn" onClick={handleManualSave}>Save Draft</button>
                <button className="create-drawer-btn" onClick={handleDuplicate}>Duplicate</button>
                {isAdmin && (
                  <>
                    <button className="create-drawer-btn create-drawer-btn--primary" onClick={handlePublish}>Publish</button>
                    <button className="create-drawer-btn create-drawer-btn--danger" onClick={handleDelete}>Delete</button>
                  </>
                )}
              </>
            )}
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
                  <span className="create-drawer-btn-icon">👁️</span>
                  {type === 'playbook' ? 'Preview Playbook' : 'Preview'}
                </button>
                <button
                  className="create-drawer-btn create-drawer-btn--primary"
                  disabled={type === 'template' ? !isTemplateFormValid() : type === 'playbook' ? !isPlaybookValid() : !isSeriesValid()}
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
  
