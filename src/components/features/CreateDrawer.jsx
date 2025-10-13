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
  const [selectedDrawer, setSelectedDrawer] = useState('playbooks'); // 'playbooks' | 'ellaments'
  const [elementSubtype, setElementSubtype] = useState(''); // company | customer | brand | special_edition
  const [selectedICPs, setSelectedICPs] = useState([]); // when elementSubtype === 'customer'
  const [autosaveError, setAutosaveError] = useState('');
  
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
    title: '',
    preview: '',
    description: '',
    instructions: '',
    knowledgeFiles: [], // top-level knowledge files
    plays: [], // [{ id, title, preview, description, instructions, knowledgeFiles: [], steps: [{ id, title, prompt, inputs: [], notes: '' }] }]
    execution: {
      mode: 'step_by_step', // 'step_by_step' | 'auto_run'
      consolidatedSchema: [] // computed for auto-run
    }
  });
  const [showAddPlayModal, setShowAddPlayModal] = useState(false);
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [addStepMode, setAddStepMode] = useState(null); // 'select' | 'create'
  const [expandedPlayIds, setExpandedPlayIds] = useState([]); // UI collapse state per play
  const [templateSearch, setTemplateSearch] = useState('');
  const [inlineTemplateForm, setInlineTemplateForm] = useState({
    title: '',
    preview: '',
    description: '',
    prompt: ''
  });
  // Series (Playbook Group) authoring state
  const [series, setSeries] = useState({
    title: '',
    preview: '',
    description: '',
    instructions: '',
    knowledgeFiles: [],
    estMinutes: '', // author override
    items: [], // { id, playbookId, name, label, stepCount, preview, estMinutes, tags, section_id, knowledgeFiles }
  });
  const [showAddPlaybookModal, setShowAddPlaybookModal] = useState(false);
  const [addPlaybookMode, setAddPlaybookMode] = useState(null); // 'select' | 'create'
  const [playbookSearch, setPlaybookSearch] = useState('');
  const [inlinePlaybookForm, setInlinePlaybookForm] = useState({ name: '', stepCount: 1, preview: '' });
  const [lastSaved, setLastSaved] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewIssues, setPreviewIssues] = useState({ errors: [], warnings: [] });
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

  // Mock sections catalogs for Playbooks and Ella-ments by availability
  const mockSections = {
    playbooks: {
      ella: [ { id: 'pb_el_1', name: 'Strategy' }, { id: 'pb_el_2', name: 'Execution' }, { id: 'pb_el_3', name: 'Planning' } ],
      edition: [ { id: 'pb_ed_1', name: 'Partner Programs' }, { id: 'pb_ed_2', name: 'Enablement' } ],
      organization: [ { id: 'pb_org_1', name: 'Org Playbooks' } ],
      workspace: [ { id: 'pb_ws_1', name: 'Team Processes' } ],
      brandbot: [ { id: 'pb_bb_1', name: 'Bot Routines' } ],
      global: [ { id: 'pb_gl_1', name: 'Company Standards' } ]
    },
    ellaments: {
      ella: [ { id: 'el_el_1', name: 'Components' }, { id: 'el_el_2', name: 'Snippets' } ],
      edition: [ { id: 'el_ed_1', name: 'Edition Elements' } ],
      organization: [ { id: 'el_org_1', name: 'Org Elements' } ],
      workspace: [ { id: 'el_ws_1', name: 'Workspace Elements' } ],
      brandbot: [ { id: 'el_bb_1', name: 'Bot-Scoped Elements' } ],
      global: [ { id: 'el_gl_1', name: 'Global Elements' } ]
    }
  };

  const mockICPs = [
    { id: 'icp_enterprise', name: 'Enterprise' },
    { id: 'icp_smb', name: 'SMB' },
    { id: 'icp_startup', name: 'Startup' },
    { id: 'icp_agency', name: 'Agency' }
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
    { id: 'p1', name: 'Content Pipeline', stepCount: 3, preview: 'Outline → Draft → Edit', version_type: 'ella', drawer: 'playbooks', section_id: 'pb_el_1', estMinutes: 30, tags: ['Content', 'Writing'], knowledgeFiles: [{ name: 'content_guide.pdf', type: 'file' }] },
    { id: 'p2', name: 'Outbound Sequence', stepCount: 2, preview: 'Email → Follow-up', version_type: 'edition', version_id: 'dtm', drawer: 'playbooks', section_id: 'pb_ed_1', estMinutes: 20, tags: ['Sales', 'Email'], knowledgeFiles: [] },
    { id: 'p3', name: 'Ad Creative Sprint', stepCount: 4, preview: 'Brief → Variations → QA → Publish', version_type: 'workspace', version_id: 'creative', drawer: 'playbooks', section_id: 'pb_ws_1', estMinutes: 45, tags: ['Ads', 'Creative'], knowledgeFiles: [{ name: 'brand_guide.pdf', type: 'file' }] },
    { id: 'p4', name: 'Customer Onboarding', stepCount: 5, preview: 'Welcome → Setup → Training → Support', version_type: 'ella', drawer: 'playbooks', section_id: 'pb_el_2', estMinutes: 60, tags: ['Onboarding', 'Support'], knowledgeFiles: [] }
  ];

  useEffect(() => {
    if (isOpen && draft) {
      // Log telemetry event when drawer opens
      logTelemetryEvent('create_drawer_opened', { 
        value: type,
        draft_id: draft.id 
      });

      // Restore draft state if it exists
      if (draft.scope) {
        setSelectedVersion(draft.scope.version || '');
        setSelectedEdition(draft.scope.edition || '');
        setSelectedOrganization(draft.scope.organization || '');
        setSelectedWorkspace(draft.scope.workspace || '');
        setSelectedBrandBot(draft.scope.brandbot || '');
        setSelectedSection(draft.scope.section || '');
        setSelectedDrawer(draft.scope.drawer || 'playbooks');
        setElementSubtype(draft.scope.element_subtype || '');
        setSelectedICPs(draft.scope.icp_ids || []);
      } else if (draft.version_type) {
        // Fallback to old format
        setSelectedVersion(draft.version_type);
        setSelectedEdition(draft.edition_id || '');
        setSelectedOrganization(draft.organization_id || '');
        setSelectedWorkspace(draft.workspace_id || '');
        setSelectedBrandBot(draft.brandbot_id || '');
        setSelectedSection(draft.section_id || '');
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
        section: selectedSection
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
    // Reset cascading selections
    setSelectedEdition('');
    setSelectedOrganization('');
    setSelectedWorkspace('');
    setSelectedBrandBot('');
    setSelectedSection('');
    autosaveScope({ version_type: versionId });
  };

  const handleEditionSelect = (editionId) => {
    setSelectedEdition(editionId);
    setShowEditionDropdown(false);
    autosaveScope({ version_type: 'edition', version_id: editionId });
  };

  const handleOrgSelect = (orgId) => {
    setSelectedOrganization(orgId);
    setSelectedWorkspace('');
    setSelectedBrandBot('');
    setShowOrgDropdown(false);
    autosaveScope({ version_type: 'organization', version_id: orgId });
  };

  const handleWorkspaceSelect = (wsId) => {
    setSelectedWorkspace(wsId);
    setSelectedBrandBot('');
    setShowWorkspaceDropdown(false);
    autosaveScope({ version_type: 'workspace', version_id: wsId });
  };

  const handleBrandBotSelect = (bbId) => {
    setSelectedBrandBot(bbId);
    setShowBrandBotDropdown(false);
    autosaveScope({ version_type: 'brandbot', version_id: bbId });
  };

  const handleDrawerSelect = (drawer) => {
    setSelectedDrawer(drawer);
    setSelectedSection('');
    // Clear element subtype when switching away from ellaments
    if (drawer !== 'ellaments') {
      setElementSubtype('');
      setSelectedICPs([]);
    }
    autosaveScope({ drawer });
  };

  const handleElementSubtypeSelect = (sub) => {
    setElementSubtype(sub);
    if (sub !== 'customer') setSelectedICPs([]);
    autosaveScope({ element_subtype: sub, icp_ids: sub === 'customer' ? selectedICPs : [] });
  };

  const handleSectionSelect = (sectionId) => {
    setSelectedSection(sectionId);
    setShowSectionDropdown(false);
    autosaveScope({ section_id: sectionId || null });
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

  const getSectionCatalog = () => {
    const domain = selectedDrawer === 'ellaments' ? 'ellaments' : 'playbooks';
    const scope = selectedVersion || 'ella';
    const list = mockSections[domain][scope] || [];
    return list;
  };

  const autosaveScope = (partial) => {
    if (!draft?.id) return;
    try {
      const existingDrafts = JSON.parse(localStorage.getItem('ella-drafts') || '[]');
      const current = existingDrafts.find(d => d.id === draft.id) || draft;
      const next = {
        ...current,
        scope: {
          version: selectedVersion,
          edition: selectedEdition,
          organization: selectedOrganization,
          workspace: selectedWorkspace,
          brandbot: selectedBrandBot,
          section: selectedSection,
          drawer: selectedDrawer,
          element_subtype: elementSubtype,
          icp_ids: selectedICPs,
          ...partial
        },
        version_type: partial?.version_type || current.version_type,
        version_id: partial?.version_id || current.version_id,
        drawer: selectedDrawer,
        section_id: (partial?.section_id ?? selectedSection) || null,
        progress_step: 'scoping',
        last_modified_at: new Date().toISOString()
      };
      const updated = existingDrafts.map(d => d.id === draft.id ? next : d);
      localStorage.setItem('ella-drafts', JSON.stringify(updated));
      logTelemetryEvent('draft_autosave_success', { draft_id: draft.id });
      setAutosaveError('');
    } catch (e) {
      setAutosaveError("Couldn’t save changes. We’ll retry automatically.");
      logTelemetryEvent('draft_autosave_failure', { draft_id: draft?.id, error_code: 500 });
      // Best-effort retry
      setTimeout(() => {
        try {
          const existingDrafts = JSON.parse(localStorage.getItem('ella-drafts') || '[]');
          localStorage.setItem('ella-drafts', JSON.stringify(existingDrafts));
          setAutosaveError('');
          logTelemetryEvent('draft_autosave_success', { draft_id: draft?.id });
        } catch (_) {}
      }, 1500);
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
    // Top-level required
    if (!playbook.title || !playbook.title.trim()) errors.push({ id: 'pb_title', msg: 'Playbook Title is required', to: () => {} });
    if (!playbook.preview || !playbook.preview.trim()) errors.push({ id: 'pb_preview', msg: 'Playbook Preview is required', to: () => {} });
    if ((playbook.preview || '').length > 160) errors.push({ id: 'pb_preview_len', msg: 'Playbook Preview must be ≤160 characters', to: () => {} });
    if (!playbook.instructions || !playbook.instructions.trim()) errors.push({ id: 'pb_instructions', msg: 'Playbook Instructions are required', to: () => {} });
    if (!Array.isArray(playbook.plays) || playbook.plays.length === 0) errors.push({ id: 'pb_plays', msg: 'Add at least one Play', to: () => {} });

    // Validate each Play
    const playTitles = new Set();
    (playbook.plays || []).forEach((p, pIdx) => {
      if (!p.title || !p.title.trim()) errors.push({ id: `play_${pIdx+1}_title`, msg: `Play ${pIdx+1}: Title is required`, to: () => {} });
      if (!p.preview || !p.preview.trim()) errors.push({ id: `play_${pIdx+1}_preview`, msg: `Play ${pIdx+1}: Preview is required`, to: () => {} });
      if ((p.preview || '').length > 160) errors.push({ id: `play_${pIdx+1}_preview_len`, msg: `Play ${pIdx+1}: Preview must be ≤160 chars`, to: () => {} });
      if (!p.instructions || !p.instructions.trim()) errors.push({ id: `play_${pIdx+1}_instr`, msg: `Play ${pIdx+1}: Instructions are required`, to: () => {} });
      if (!Array.isArray(p.steps) || p.steps.length === 0) errors.push({ id: `play_${pIdx+1}_steps`, msg: `Play ${pIdx+1}: Add at least one Step`, to: () => {} });

      // Optional duplicate warning across plays
      const t = (p.title || '').toLowerCase();
      if (t && playTitles.has(t)) warnings.push({ id: `play_${pIdx+1}_dup_title`, msg: `Duplicate Play title '${p.title}'`, to: () => {} });
      playTitles.add(t);

      // Validate steps
      const inputKeys = new Set();
      (p.steps || []).forEach((s, sIdx) => {
        if (!s.title || !s.title.trim()) errors.push({ id: `play_${pIdx+1}_step_${sIdx+1}_title`, msg: `Play ${pIdx+1} • Step ${sIdx+1}: Title is required`, to: () => {} });
        if (!s.prompt || !s.prompt.trim()) errors.push({ id: `play_${pIdx+1}_step_${sIdx+1}_prompt`, msg: `Play ${pIdx+1} • Step ${sIdx+1}: Prompt is required`, to: () => {} });
        (s.inputs || []).forEach(inp => {
          if (!inp.label || !inp.label.trim()) errors.push({ id: `play_${pIdx+1}_step_${sIdx+1}_inp_label`, msg: `Play ${pIdx+1} • Step ${sIdx+1}: Input label is required`, to: () => {} });
          const key = (inp.key || '').trim();
          if (!key || !/^[a-z][a-z0-9_]*$/.test(key) || key.length < 2 || key.length > 40) {
            errors.push({ id: `play_${pIdx+1}_step_${sIdx+1}_inp_key`, msg: `Play ${pIdx+1} • Step ${sIdx+1}: Key must be snake_case (2–40 chars)`, to: () => {} });
          } else if (inputKeys.has(key)) {
            errors.push({ id: `play_${pIdx+1}_step_${sIdx+1}_inp_key_dup`, msg: `Play ${pIdx+1}: Duplicate input key '${key}'`, to: () => {} });
          }
          if (key) inputKeys.add(key);
        });
      });
    });

    return { errors, warnings };
  };

  const validateSeriesBuilder = () => {
    const errors = [];
    const warnings = [];
    if (!series.title || !series.title.trim()) errors.push({ id: 'sr_title', msg: 'Series Title is required', to: () => {} });
    if (!series.preview || !series.preview.trim()) errors.push({ id: 'sr_preview', msg: 'Series Preview is required', to: () => {} });
    if ((series.preview || '').length > 160) errors.push({ id: 'sr_preview_len', msg: 'Series Preview must be ≤160 chars', to: () => {} });
    if (!series.instructions || !series.instructions.trim()) errors.push({ id: 'sr_instr', msg: 'Series Instructions are required', to: () => {} });
    if (!series.items || series.items.length === 0) errors.push({ id: 'sr_items', msg: 'Add at least one playbook to the series', to: () => {} });
    // Unique labels within series
    const labels = (series.items || []).map(i => (i.label || i.name || '').toLowerCase());
    const dup = labels.find((l, idx) => l && labels.indexOf(l) !== idx);
    if (dup) warnings.push({ id: 'sr_labels', msg: 'Playbook labels in series should be unique', to: () => {} });
    return { errors, warnings };
  };

  const recomputeValidation = () => {
    let res = { errors: [], warnings: [] };
    if (type === 'template') res = validateTemplateBuilder();
    else if (type === 'playbook') res = validatePlaybookBuilder();
    else if (type === 'group') res = validateSeriesBuilder();
    setValidation(res);
    setPreviewIssues(res);
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

      {selectedVersion === 'organization' && (
        <div className="create-drawer-field">
          <label className="create-drawer-label">Select Organization</label>
          <div className="create-drawer-dropdown" ref={orgRef}>
            <button className="create-drawer-dropdown-trigger" onClick={() => setShowOrgDropdown(!showOrgDropdown)}>
              <span>{selectedOrganization ? mockOrganizations.find(o => o.id === selectedOrganization)?.name : 'Select organization...'}</span>
              <span className={`create-drawer-chevron ${showOrgDropdown ? 'create-drawer-chevron-up' : ''}`}>{showOrgDropdown ? '▲' : '▼'}</span>
            </button>
            {showOrgDropdown && (
              <div className="create-drawer-dropdown-menu">
                {mockOrganizations.map(org => (
                  <button key={org.id} className={`create-drawer-dropdown-item ${selectedOrganization === org.id ? 'create-drawer-dropdown-item--selected' : ''}`} onClick={() => handleOrgSelect(org.id)}>
                    {org.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedVersion === 'workspace' && (
        <>
          <div className="create-drawer-field">
            <label className="create-drawer-label">Select Organization</label>
            <div className="create-drawer-dropdown" ref={orgRef}>
              <button className="create-drawer-dropdown-trigger" onClick={() => setShowOrgDropdown(!showOrgDropdown)}>
                <span>{selectedOrganization ? mockOrganizations.find(o => o.id === selectedOrganization)?.name : 'Select organization...'}</span>
                <span className={`create-drawer-chevron ${showOrgDropdown ? 'create-drawer-chevron-up' : ''}`}>{showOrgDropdown ? '▲' : '▼'}</span>
              </button>
              {showOrgDropdown && (
                <div className="create-drawer-dropdown-menu">
                  {mockOrganizations.map(org => (
                    <button key={org.id} className={`create-drawer-dropdown-item ${selectedOrganization === org.id ? 'create-drawer-dropdown-item--selected' : ''}`} onClick={() => handleOrgSelect(org.id)}>
                      {org.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="create-drawer-field">
            <label className="create-drawer-label">Select Workspace</label>
            <div className="create-drawer-dropdown" ref={workspaceRef}>
              <button className="create-drawer-dropdown-trigger" onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}>
                <span>{selectedWorkspace ? mockWorkspaces.find(w => w.id === selectedWorkspace)?.name : 'Select workspace...'}</span>
                <span className={`create-drawer-chevron ${showWorkspaceDropdown ? 'create-drawer-chevron-up' : ''}`}>{showWorkspaceDropdown ? '▲' : '▼'}</span>
              </button>
              {showWorkspaceDropdown && (
                <div className="create-drawer-dropdown-menu">
                  {mockWorkspaces.filter(w => !selectedOrganization || w.orgId === selectedOrganization).map(ws => (
                    <button key={ws.id} className={`create-drawer-dropdown-item ${selectedWorkspace === ws.id ? 'create-drawer-dropdown-item--selected' : ''}`} onClick={() => handleWorkspaceSelect(ws.id)}>
                      {ws.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {selectedVersion === 'brandbot' && (
        <>
          <div className="create-drawer-field">
            <label className="create-drawer-label">Select Workspace</label>
            <div className="create-drawer-dropdown" ref={workspaceRef}>
              <button className="create-drawer-dropdown-trigger" onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}>
                <span>{selectedWorkspace ? mockWorkspaces.find(w => w.id === selectedWorkspace)?.name : 'Select workspace...'}</span>
                <span className={`create-drawer-chevron ${showWorkspaceDropdown ? 'create-drawer-chevron-up' : ''}`}>{showWorkspaceDropdown ? '▲' : '▼'}</span>
              </button>
              {showWorkspaceDropdown && (
                <div className="create-drawer-dropdown-menu">
                  {mockWorkspaces.map(ws => (
                    <button key={ws.id} className={`create-drawer-dropdown-item ${selectedWorkspace === ws.id ? 'create-drawer-dropdown-item--selected' : ''}`} onClick={() => handleWorkspaceSelect(ws.id)}>
                      {ws.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="create-drawer-field">
            <label className="create-drawer-label">Select BrandBot</label>
            <div className="create-drawer-dropdown" ref={brandBotRef}>
              <button className="create-drawer-dropdown-trigger" onClick={() => setShowBrandBotDropdown(!showBrandBotDropdown)}>
                <span>{selectedBrandBot ? mockBrandBots.find(b => b.id === selectedBrandBot)?.name : 'Select brandbot...'}</span>
                <span className={`create-drawer-chevron ${showBrandBotDropdown ? 'create-drawer-chevron-up' : ''}`}>{showBrandBotDropdown ? '▲' : '▼'}</span>
              </button>
              {showBrandBotDropdown && (
                <div className="create-drawer-dropdown-menu">
                  {mockBrandBots.filter(b => !selectedWorkspace || b.workspaceId === selectedWorkspace).map(bb => (
                    <button key={bb.id} className={`create-drawer-dropdown-item ${selectedBrandBot === bb.id ? 'create-drawer-dropdown-item--selected' : ''}`} onClick={() => handleBrandBotSelect(bb.id)}>
                      {bb.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Drawer Selector */}
      <div className="create-drawer-field">
        <label className="create-drawer-label">
          Choose a Drawer
          <span className="create-drawer-help">This controls where users will find it.</span>
        </label>
        <div className="create-drawer-segmented">
          <button className={`create-drawer-seg ${selectedDrawer === 'playbooks' ? 'create-drawer-seg--active' : ''}`} onClick={() => handleDrawerSelect('playbooks')}>Playbooks Drawer</button>
          <button className={`create-drawer-seg ${selectedDrawer === 'ellaments' ? 'create-drawer-seg--active' : ''}`} onClick={() => handleDrawerSelect('ellaments')}>Ella-ments Drawer</button>
        </div>
      </div>

      {/* Element Sub-Type (conditional) */}
      {selectedDrawer === 'ellaments' && (
        <div className="create-drawer-field">
          <label className="create-drawer-label">Element Type</label>
          <div className="create-drawer-radios">
            {['company','customer','brand','special_edition'].map(sub => (
              <label key={sub} className="create-drawer-radio">
                <input type="radio" checked={elementSubtype === sub} onChange={() => handleElementSubtypeSelect(sub)} />
                <span className="create-drawer-radio-label">{sub.replace('_',' ')}</span>
              </label>
            ))}
          </div>

          {elementSubtype === 'customer' && (
            <div className="create-drawer-field" style={{ marginTop: 8 }}>
              <label className="create-drawer-label">ICPs</label>
              <select className="create-drawer-input" multiple value={selectedICPs} onChange={(e) => {
                const vals = Array.from(e.target.selectedOptions).map(o => o.value);
                setSelectedICPs(vals);
                autosaveScope({ icp_ids: vals });
              }}>
                {mockICPs.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Section Selector */}
      <div className="create-drawer-field">
        <label className="create-drawer-label">Assign to Section</label>
        <div className="create-drawer-dropdown" ref={sectionRef}>
          <button className="create-drawer-dropdown-trigger" onClick={() => setShowSectionDropdown(!showSectionDropdown)}>
            <span>{selectedSection ? (getSectionCatalog().find(s => s.id === selectedSection)?.name || 'Unknown') : 'Unassigned'}</span>
            <span className={`create-drawer-chevron ${showSectionDropdown ? 'create-drawer-chevron-up' : ''}`}>{showSectionDropdown ? '▲' : '▼'}</span>
          </button>
          {showSectionDropdown && (
            <div className="create-drawer-dropdown-menu">
              <button className={`create-drawer-dropdown-item ${!selectedSection ? 'create-drawer-dropdown-item--selected' : ''}`} onClick={() => handleSectionSelect('')}>Unassigned</button>
              {getSectionCatalog().map(sec => (
                <button key={sec.id} className={`create-drawer-dropdown-item ${selectedSection === sec.id ? 'create-drawer-dropdown-item--selected' : ''}`} onClick={() => handleSectionSelect(sec.id)}>
                  {sec.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {autosaveError && (
        <div className="create-drawer-inline-toast create-drawer-inline-toast--error" role="status">{autosaveError}</div>
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
          {/* Header fields */}
          <div className="create-drawer-field">
            <label className="create-drawer-label">Title <span className="create-drawer-required">*</span></label>
            <input className="create-drawer-input" value={playbook.title} placeholder="Enter playbook title..." onChange={(e) => { setPlaybook(prev => ({ ...prev, title: e.target.value })); saveTemplateDraft(); }} />
          </div>
          <div className="create-drawer-field">
            <label className="create-drawer-label">Preview <span className="create-drawer-required">*</span></label>
            <input className="create-drawer-input" value={playbook.preview} maxLength={160} placeholder="Short summary (≤160 chars)" onChange={(e) => { setPlaybook(prev => ({ ...prev, preview: e.target.value })); saveTemplateDraft(); }} />
            <div className="create-drawer-field-hint">{(playbook.preview || '').length}/160</div>
          </div>
          <div className="create-drawer-field">
            <label className="create-drawer-label">Description <span className="create-drawer-optional">(optional)</span></label>
            <textarea className="create-drawer-input create-drawer-textarea" rows={3} value={playbook.description} onChange={(e) => { setPlaybook(prev => ({ ...prev, description: e.target.value })); saveTemplateDraft(); }} />
          </div>
          <div className="create-drawer-field">
            <label className="create-drawer-label">Instructions <span className="create-drawer-required">*</span></label>
            <textarea className="create-drawer-input create-drawer-textarea" rows={5} value={playbook.instructions} onChange={(e) => { setPlaybook(prev => ({ ...prev, instructions: e.target.value })); saveTemplateDraft(); }} />
          </div>
          <div className="create-drawer-field">
            <label className="create-drawer-label">Knowledge Files <span className="create-drawer-optional">(optional)</span></label>
            <div className="template-form-context-attachments">
              {(playbook.knowledgeFiles || []).length === 0 ? (
                <div className="template-form-empty-state"><span className="template-form-empty-icon">📎</span><h4>No files</h4></div>
              ) : (
                <div className="template-form-attachments-list">
                  {playbook.knowledgeFiles.map((f, i) => (
                    <div key={i} className="template-form-attachment-item">
                      <div className="template-form-attachment-info"><span className="template-form-attachment-name">{f.name}</span><span className="template-form-attachment-type">{f.type}</span></div>
                      <button className="template-form-attachment-remove" onClick={() => { const next = [...playbook.knowledgeFiles]; next.splice(i,1); setPlaybook(prev => ({ ...prev, knowledgeFiles: next })); saveTemplateDraft(); }}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="template-form-add-attachment">
                <button className="create-drawer-btn create-drawer-btn--secondary" onClick={() => { const name = prompt('Mock file name'); if (name) { setPlaybook(prev => ({ ...prev, knowledgeFiles: [...(prev.knowledgeFiles||[]), { name, type: 'file' }] })); saveTemplateDraft(); } }}>📤 Upload File</button>
                <button className="create-drawer-btn create-drawer-btn--secondary" onClick={() => { const url = prompt('Enter URL'); if (url) { setPlaybook(prev => ({ ...prev, knowledgeFiles: [...(prev.knowledgeFiles||[]), { name: url, type: 'link', url }] })); saveTemplateDraft(); } }}>🔗 Add Link</button>
              </div>
            </div>
          </div>

          {/* Plays Section */}
          <div className="playbook-plays">
        <div className="playbook-plays-header">
          <h4 className="playbook-section-title">Add Plays</h4>
          {isAdmin && (
            <div className="playbook-import-actions">
              <button className="create-drawer-btn create-drawer-btn--secondary" onClick={() => downloadPlayDocTemplate()}>Download Doc Template</button>
              <label className="create-drawer-btn create-drawer-btn--primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Upload (up to 10)
                <input type="file" accept=".doc,.docx,.txt,.md" multiple style={{ display: 'none' }} onChange={(e) => handlePlayImportFiles(e)} />
              </label>
            </div>
          )}
        </div>
        <div className="create-drawer-field-hint">Have more than 10 docs? Finish this batch, then click Upload again to add the next set.</div>

        {/* Import results */}
        {importJobs.length > 0 && (
          <div className="playbook-import-results" role="status" aria-live="polite">
            {importJobs.map((job, idx) => (
              <div key={idx} className={`playbook-import-row ${job.status}`}>
                <span className="pir-name">{job.name}</span>
                <span className="pir-status">{job.status === 'queued' ? 'Queued' : job.status === 'parsing' ? 'Parsing…' : job.status === 'success' ? 'Success' : 'Failed'}</span>
                {job.message && <span className="pir-msg">{job.message}</span>}
              </div>
            ))}
          </div>
        )}

        <h4 className="playbook-section-title" style={{ marginTop: 16 }}>Plays</h4>
            {(playbook.plays || []).length === 0 && (
              <div className="playbook-empty"><span className="playbook-empty-icon">🧩</span><p>No plays yet. Add your first play.</p></div>
            )}
            {(playbook.plays || []).map((pl, pIdx) => (
              <div key={pl.id} className="play-card">
                <div className="play-card-summary">
                  <div className="play-index">{pIdx + 1}</div>
                  <div className="play-summary-text">
                    <div className="play-title">{pl.title || 'Untitled Play'}</div>
                    <div className="play-preview">{pl.preview || ''}</div>
                  </div>
                  <div className="play-summary-actions">
                    <button title="Up" disabled={pIdx===0} onClick={() => reorderPlay(pIdx, pIdx-1)}>▲</button>
                    <button title="Down" disabled={pIdx===(playbook.plays.length-1)} onClick={() => reorderPlay(pIdx, pIdx+1)}>▼</button>
                    <button title="Remove" onClick={() => removePlay(pl.id)}>🗑️</button>
                    <button title="Expand/Collapse" onClick={() => togglePlayExpanded(pl.id)}>{expandedPlayIds.includes(pl.id) ? 'Collapse' : 'Expand'}</button>
                  </div>
                </div>

                {expandedPlayIds.includes(pl.id) && (
                  <div className="play-card-details">
                    {/* Play fields */}
                    <div className="create-drawer-field"><label className="create-drawer-label">Play Title <span className="create-drawer-required">*</span></label><input className="create-drawer-input" value={pl.title} onChange={(e)=> updatePlay(pl.id,{ title: e.target.value })} /></div>
                    <div className="create-drawer-field"><label className="create-drawer-label">Play Preview <span className="create-drawer-required">*</span></label><input className="create-drawer-input" maxLength={160} value={pl.preview} onChange={(e)=> updatePlay(pl.id,{ preview: e.target.value })} /></div>
                    <div className="create-drawer-field"><label className="create-drawer-label">Play Description <span className="create-drawer-optional">(optional)</span></label><textarea className="create-drawer-input create-drawer-textarea" rows={3} value={pl.description || ''} onChange={(e)=> updatePlay(pl.id,{ description: e.target.value })} /></div>
                    <div className="create-drawer-field"><label className="create-drawer-label">Play Instructions <span className="create-drawer-required">*</span></label><textarea className="create-drawer-input create-drawer-textarea" rows={4} value={pl.instructions || ''} onChange={(e)=> updatePlay(pl.id,{ instructions: e.target.value })} /></div>
                    <div className="create-drawer-field">
                      <label className="create-drawer-label">Play Knowledge Files <span className="create-drawer-optional">(optional)</span></label>
                      <div className="template-form-context-attachments">
                        {(pl.knowledgeFiles||[]).length === 0 ? (
                          <div className="template-form-empty-state"><span className="template-form-empty-icon">📎</span><h4>No files</h4></div>
                        ) : (
                          <div className="template-form-attachments-list">
                            {(pl.knowledgeFiles||[]).map((f, i) => (
                              <div key={i} className="template-form-attachment-item">
                                <div className="template-form-attachment-info"><span className="template-form-attachment-name">{f.name}</span><span className="template-form-attachment-type">{f.type}</span></div>
                                <button className="template-form-attachment-remove" onClick={() => updatePlayFile(pl.id, i, 'remove')}>🗑️</button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="template-form-add-attachment">
                          <button className="create-drawer-btn create-drawer-btn--secondary" onClick={() => updatePlayFile(pl.id, null, 'add_file')}>📤 Upload File</button>
                          <button className="create-drawer-btn create-drawer-btn--secondary" onClick={() => updatePlayFile(pl.id, null, 'add_link')}>🔗 Add Link</button>
                        </div>
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="play-steps">
                      <h5>Steps</h5>
                      {(pl.steps||[]).length === 0 && (<div className="playbook-empty-small">No steps yet</div>)}
                      {(pl.steps||[]).map((st, sIdx) => (
                        <div key={st.id} className="step-card">
                          <div className="step-header">
                            <div className="step-index">{sIdx+1}</div>
                            <input className="create-drawer-input step-title-input" placeholder={`Step ${sIdx+1}`} value={st.title} onChange={(e)=> updateStep(pl.id, st.id, { title: e.target.value })} />
                            <div className="step-actions">
                              <button title="Up" disabled={sIdx===0} onClick={()=> reorderStep(pl.id, sIdx, sIdx-1)}>▲</button>
                              <button title="Down" disabled={sIdx===(pl.steps.length-1)} onClick={()=> reorderStep(pl.id, sIdx, sIdx+1)}>▼</button>
                              <button title="Remove" onClick={()=> removeStep(pl.id, st.id)}>🗑️</button>
                            </div>
                          </div>
                          <div className="step-body">
                            <div className="create-drawer-field"><label className="create-drawer-label">Prompt <span className="create-drawer-required">*</span></label><textarea className="create-drawer-input create-drawer-textarea" rows={3} value={st.prompt} onChange={(e)=> updateStep(pl.id, st.id, { prompt: e.target.value })} /></div>
                            <div className="create-drawer-field">
                              <label className="create-drawer-label">Inputs (optional)</label>
                              {(st.inputs||[]).map((inp, ii) => (
                                <div key={inp.id} className="step-input-row">
                                  <input className="create-drawer-input" placeholder="Label *" value={inp.label} onChange={(e)=> updateStepInput(pl.id, st.id, inp.id, 'label', e.target.value)} />
                                  <input className="create-drawer-input" placeholder="key_snake_case *" value={inp.key} onChange={(e)=> updateStepInput(pl.id, st.id, inp.id, 'key', e.target.value)} />
                                  <select className="create-drawer-input" value={inp.type} onChange={(e)=> updateStepInput(pl.id, st.id, inp.id, 'type', e.target.value)}>
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
                                  <label className="step-input-checkbox"><input type="checkbox" checked={!!inp.required} onChange={(e)=> updateStepInput(pl.id, st.id, inp.id, 'required', e.target.checked)} /> Required</label>
                                  <button className="step-input-remove" onClick={()=> removeStepInput(pl.id, st.id, inp.id)}>🗑️</button>
                                  {(inp.type === 'single_select' || inp.type === 'multi_select') && (
                                    <div className="step-input-options">
                                      {(inp.options||[]).map((opt, oi)=>(
                                        <div key={oi} className="step-input-option">
                                          <input className="create-drawer-input" placeholder="Option label" value={opt.label} onChange={(e)=> updateStepInputOption(pl.id, st.id, inp.id, oi, 'label', e.target.value)} />
                                          <input className="create-drawer-input" placeholder="value" value={opt.value} onChange={(e)=> updateStepInputOption(pl.id, st.id, inp.id, oi, 'value', e.target.value)} />
                                          <button onClick={()=> removeStepInputOption(pl.id, st.id, inp.id, oi)}>🗑️</button>
                                        </div>
                                      ))}
                                      <button className="create-drawer-btn" onClick={()=> addStepInputOption(pl.id, st.id, inp.id)}>Add Option</button>
                                    </div>
                                  )}
                                </div>
                              ))}
                              <button className="create-drawer-btn create-drawer-btn--secondary" onClick={()=> addStepInput(pl.id, st.id)}>Add Input</button>
                            </div>
                            <div className="create-drawer-field"><label className="create-drawer-label">Notes</label><textarea className="create-drawer-input create-drawer-textarea" rows={2} value={st.notes||''} onChange={(e)=> updateStep(pl.id, st.id, { notes: e.target.value })} /></div>
                          </div>
                        </div>
                      ))}
                      <div className="play-add-step">
                        <button className="create-drawer-btn create-drawer-btn--primary" onClick={()=> addStep(pl.id)}><span className="create-drawer-btn-icon">➕</span>Add Step</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="plays-add">
              <button className="create-drawer-btn create-drawer-btn--primary" onClick={()=> setShowAddPlayModal(true)}><span className="create-drawer-btn-icon">➕</span>Add Play</button>
            </div>
          </div>

          {/* Add Play Modal (inline) */}
          {showAddPlayModal && (
            <div className="playbook-modal-backdrop" role="dialog" aria-modal="true">
              <div className="playbook-modal">
                <div className="playbook-modal-header"><h3>Add Play</h3><button className="playbook-modal-close" onClick={()=> setShowAddPlayModal(false)}>✕</button></div>
                <div className="playbook-modal-content">
                  <button className="create-drawer-btn create-drawer-btn--primary" onClick={()=> addPlayInline()}>Create New Play</button>
                  <button className="create-drawer-btn create-drawer-btn--secondary" onClick={()=> importPlayMock()}>Import Play</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {type === 'group' && (
        <div className="series-authoring">
          {/* Series metadata */}
          <div className="create-drawer-field"><label className="create-drawer-label">Title <span className="create-drawer-required">*</span></label><input className="create-drawer-input" value={series.title} onChange={(e)=> { setSeries(prev=>({ ...prev, title: e.target.value })); saveTemplateDraft(); }} /></div>
          <div className="create-drawer-field"><label className="create-drawer-label">Preview <span className="create-drawer-required">*</span></label><input className="create-drawer-input" maxLength={160} value={series.preview} onChange={(e)=> { setSeries(prev=>({ ...prev, preview: e.target.value })); saveTemplateDraft(); }} /><div className="create-drawer-field-hint">{(series.preview||'').length}/160</div></div>
          <div className="create-drawer-field"><label className="create-drawer-label">Description <span className="create-drawer-optional">(optional)</span></label><textarea className="create-drawer-input create-drawer-textarea" rows={3} value={series.description} onChange={(e)=> { setSeries(prev=>({ ...prev, description: e.target.value })); saveTemplateDraft(); }} /></div>
          <div className="create-drawer-field"><label className="create-drawer-label">Instructions <span className="create-drawer-required">*</span></label><textarea className="create-drawer-input create-drawer-textarea" rows={4} value={series.instructions} onChange={(e)=> { setSeries(prev=>({ ...prev, instructions: e.target.value })); saveTemplateDraft(); }} /></div>
          <div className="create-drawer-field"><label className="create-drawer-label">Knowledge Files <span className="create-drawer-optional">(optional)</span></label>
            <div className="template-form-context-attachments">
              {(series.knowledgeFiles||[]).length===0 ? (<div className="template-form-empty-state"><span className="template-form-empty-icon">📎</span><h4>No files</h4></div>) : (
                <div className="template-form-attachments-list">{(series.knowledgeFiles||[]).map((f,i)=>(<div key={i} className="template-form-attachment-item"><div className="template-form-attachment-info"><span className="template-form-attachment-name">{f.name}</span><span className="template-form-attachment-type">{f.type}</span></div><button className="template-form-attachment-remove" onClick={()=>{ const next=[...(series.knowledgeFiles||[])]; next.splice(i,1); setSeries(prev=>({ ...prev, knowledgeFiles: next })); saveTemplateDraft(); }}>🗑️</button></div>))}</div>
              )}
              <div className="template-form-add-attachment">
                <button className="create-drawer-btn create-drawer-btn--secondary" onClick={()=>{ const name=prompt('Mock file name'); if(name){ setSeries(prev=>({ ...prev, knowledgeFiles:[...(prev.knowledgeFiles||[]),{ name, type:'file' }] })); saveTemplateDraft(); } }}>📤 Upload File</button>
                <button className="create-drawer-btn create-drawer-btn--secondary" onClick={()=>{ const url=prompt('Enter URL'); if(url){ setSeries(prev=>({ ...prev, knowledgeFiles:[...(prev.knowledgeFiles||[]),{ name:url, type:'link', url }] })); saveTemplateDraft(); } }}>🔗 Add Link</button>
              </div>
            </div>
          </div>
          <div className="create-drawer-field"><label className="create-drawer-label">Estimated Time (minutes) <span className="create-drawer-optional">(optional)</span></label><input type="number" min={0} className="create-drawer-input" value={series.estMinutes} onChange={(e)=> { setSeries(prev=>({ ...prev, estMinutes: e.target.value })); saveTemplateDraft(); }} />
            <div className="create-drawer-field-hint">Calculated Estimate: {(series.items||[]).reduce((sum,i)=> sum + (Number(i.estMinutes)||0), 0)} minutes</div>
          </div>

          {/* Composer Section */}
          <div className="series-composer">
            <h4 className="playbook-section-title">Select & Order Playbooks</h4>
            <div className="series-search-row">
              <input className="create-drawer-input" placeholder="Search by title or preview..." value={playbookSearch} onChange={(e)=> setPlaybookSearch(e.target.value)} />
            </div>
            <div className="series-results">
              {getFilteredPlaybooks().filter(p=> p.name.toLowerCase().includes(playbookSearch.toLowerCase())).map(p=> {
                const already = (series.items||[]).some(i=> i.playbookId === p.id);
                return (
                  <div key={p.id} className="series-result-row">
                    <div className="sr-meta">
                      <div className="sr-title">{p.name}</div>
                      <div className="sr-sub">{p.preview}</div>
                    </div>
                    <div className="sr-actions">
                      <button className="create-drawer-btn" disabled={already} onClick={()=> addPlaybookToSeries(p)}>{already ? 'Already added' : 'Add to Series'}</button>
                    </div>
                  </div>
                );
              })}
              {getFilteredPlaybooks().length === 0 && (
                <div className="series-empty">
                  <span className="series-empty-icon">📚</span>
                  <p>No Playbooks found for this Version/Drawer/Section.</p>
                  <p className="series-empty-hint">Create Playbooks in this scope first.</p>
                </div>
              )}
            </div>

            <h4 className="playbook-section-title" style={{ marginTop: 16 }}>Series List</h4>
            {(series.items||[]).length===0 && (<div className="series-empty"><span className="series-empty-icon">🧩</span><p>Add Playbooks to build your Series.</p></div>)}
            {(series.items||[]).map((pb, index)=> (
              <div key={pb.id} className="series-card">
                <div className="series-card-header">
                  <div className="series-index">{index+1}</div>
                  <div className="series-meta"><div className="series-name">{pb.label || pb.name}</div><div className="series-sub">{pb.preview || ''}</div></div>
                  <div className="series-actions">
                    <button className="series-action" disabled={index===0} title="Move up" onClick={()=> handleSeriesReorder(pb.id, 'up')}>▲</button>
                    <button className="series-action" disabled={index===(series.items.length-1)} title="Move down" onClick={()=> handleSeriesReorder(pb.id, 'down')}>▼</button>
                    <button className="series-action series-remove" title="Remove" onClick={()=> handleSeriesRemove(pb.id)}>🗑️</button>
                  </div>
                </div>
                <div className="series-card-body">
                  <div className="create-drawer-field"><label className="create-drawer-label">Label in Series</label><input className="create-drawer-input" placeholder="Must be unique within the series" value={pb.label || ''} onChange={(e)=> handleSeriesItemUpdate(pb.id, 'label', e.target.value)} /></div>
                  {(pb.knowledgeFiles||[]).length>0 && (<div className="preview-files"><strong>Playbook Files:</strong> {(pb.knowledgeFiles||[]).map((f,i)=> <span key={i} className="preview-file">{f.name}</span>)}</div>)}
                </div>
              </div>
            ))}
          </div>

          {/* Preview & Validation */}
          <div className="builder-preview-validation">
            <div className="builder-preview">
              <h4 className="builder-section-title">Series Preview</h4>
              <div className="preview-series">
                <h5>{series.title || 'Untitled Series'}</h5>
                <div className="preview-sub">{series.preview || ''}</div>
                {series.description && <div className="preview-desc">{series.description}</div>}
                <div className="preview-instr"><strong>Instructions:</strong> {series.instructions || '—'}</div>
                {(series.knowledgeFiles||[]).length>0 && (<div className="preview-files"><strong>Files:</strong> {(series.knowledgeFiles||[]).map((f,i)=> <span key={i} className="preview-file">{f.name}</span>)}</div>)}
                <div className="preview-est">Calculated Estimate: {(series.items||[]).reduce((sum,i)=> sum + (Number(i.estMinutes)||0), 0)} min {series.estMinutes && (<span>• Series Estimate: {series.estMinutes} min</span>)}</div>
                <div className="preview-series-list">{(series.items||[]).map((pb, idx)=> (<div key={pb.id} className="preview-series-item"><div className="preview-step-head"><div className="preview-step-index">{idx+1}</div><div className="preview-step-title">{pb.label || pb.name}</div></div><div className="preview-step-sub">{pb.preview || ''}</div></div>))}</div>
              </div>
            </div>
            <div className="builder-validation" ref={validationRef}>
              <h4 className="builder-section-title">Validation</h4>
              {validation.errors.length === 0 && validation.warnings.length === 0 ? (<div className="validation-clear">No issues found</div>) : (
                <ul className="validation-list">
                  {validation.errors.map(v => (<li key={v.id} className="validation-item validation-item--error"><span className="validation-badge">Error</span><span className="validation-msg">{v.msg}</span></li>))}
                  {validation.warnings.map(v => (<li key={v.id} className="validation-item validation-item--warning"><span className="validation-badge validation-badge--warning">Warning</span><span className="validation-msg">{v.msg}</span></li>))}
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

  // -------- Playbook: Plays & Steps handlers --------
  const persistPlaybook = (next) => {
    setPlaybook(next);
    // persist to draft
    clearTimeout(window.playbookAutosaveTimeout);
    window.playbookAutosaveTimeout = setTimeout(() => saveTemplateDraft(), 400);
  };

  const addPlayInline = () => {
    const newPlay = {
      id: `play_${Date.now()}`,
      title: '',
      preview: '',
      description: '',
      instructions: '',
      knowledgeFiles: [],
      steps: []
    };
    const next = { ...playbook, plays: [...(playbook.plays||[]), newPlay] };
    persistPlaybook(next);
    setShowAddPlayModal(false);
    setExpandedPlayIds(prev => [...prev, newPlay.id]);
    logTelemetryEvent('play_added', { source: 'inline', draft_id: draft?.id });
  };

  const importPlayMock = () => {
    const newPlay = {
      id: `play_${Date.now()}`,
      title: 'Imported Play',
      preview: 'Auto-extracted preview',
      description: 'Imported description',
      instructions: 'Imported instructions',
      knowledgeFiles: [{ name: 'imported_doc.docx', type: 'file' }],
      steps: [
        { id: `st_${Date.now()}_1`, title: 'Draft', prompt: 'Write draft', inputs: [], notes: '' },
        { id: `st_${Date.now()}_2`, title: 'Review', prompt: 'Review draft', inputs: [], notes: '' }
      ]
    };
    const next = { ...playbook, plays: [...(playbook.plays||[]), newPlay] };
    persistPlaybook(next);
    setShowAddPlayModal(false);
    setExpandedPlayIds(prev => [...prev, newPlay.id]);
    logTelemetryEvent('play_added', { source: 'import', draft_id: draft?.id });
  };

  // Import UI state
  const [importJobs, setImportJobs] = useState([]); // { name, status: queued|parsing|success|failed, message }

  const downloadPlayDocTemplate = () => {
    const content = `# Ella Play with Steps Template\n\nPLAY:\nTitle: <required>\nPreview: <required, <=160>\nDescription: <optional>\nInstructions: <required>\nKnowledge Files: <optional, URLs or notes>\nEstimated Time (min): <optional>\n\nSTEPS:\n- Step Title: <required>\n  Prompt: <required>\n  Inputs: <optional list>\n  Notes: <optional>\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ella-play-with-steps-template.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePlayImportFiles = async (e) => {
    if (!isAdmin) return;
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const batch = files.slice(0, 10); // enforce 10 per batch
    setImportJobs(prev => [...prev, ...batch.map(f => ({ name: f.name, status: 'queued', message: '' }))]);
    logTelemetryEvent('play_import_batch_started', { count: batch.length });

    for (const f of batch) {
      await processPlayFile(f);
    }

    logTelemetryEvent('playbook_import_completed', { draft_id: draft?.id });
    // reset input to allow same files again if needed
    e.target.value = '';
  };

  const processPlayFile = async (file) => {
    // update to parsing
    setImportJobs(prev => prev.map(j => j.name === file.name ? { ...j, status: 'parsing', message: '' } : j));
    try {
      // Simulate parse delay
      await new Promise(r => setTimeout(r, 600));
      // Mock parse: succeed unless name contains 'fail'
      const shouldFail = /fail/i.test(file.name);
      if (shouldFail) {
        throw { status: 422, message: 'Missing Instructions. Ensure the Instructions section is present.' };
      }
      // Create a mock play from filename
      const base = file.name.replace(/\.[^.]+$/, '');
      const play = {
        id: `play_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        title: base,
        preview: 'Imported from document',
        description: '',
        instructions: 'Follow the steps to produce the deliverable.',
        knowledgeFiles: [],
        estMinutes: 15,
        steps: [
          { id: `st_${Date.now()}_a`, title: 'Analyze Input', prompt: 'Analyze the provided context.', inputs: [], notes: '' },
          { id: `st_${Date.now()}_b`, title: 'Draft Output', prompt: 'Draft the output per guidelines.', inputs: [], notes: '' }
        ]
      };
      // Append to rows in upload order
      const next = { ...playbook, plays: [...(playbook.plays||[]), play] };
      persistPlaybook(next);
      setImportJobs(prev => prev.map(j => j.name === file.name ? { ...j, status: 'success', message: 'Parsed' } : j));
      logTelemetryEvent('play_import_file_parsed_success', { file: file.name });
    } catch (err) {
      const code = err?.status || 500;
      setImportJobs(prev => prev.map(j => j.name === file.name ? { ...j, status: 'failed', message: err?.message || 'Server error' } : j));
      logTelemetryEvent('play_import_file_parsed_failure', { file: file.name, error_code: code });
    }
  };

  const removePlay = (playId) => {
    if (!window.confirm('Remove this play? This will remove all its steps.')) return;
    const next = { ...playbook, plays: (playbook.plays||[]).filter(p => p.id !== playId) };
    persistPlaybook(next);
    setExpandedPlayIds(prev => prev.filter(id => id !== playId));
    logTelemetryEvent('play_removed', { play_id: playId, draft_id: draft?.id });
  };

  const reorderPlay = (from, to) => {
    const arr = [...(playbook.plays||[])];
    if (to < 0 || to >= arr.length) return;
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    persistPlaybook({ ...playbook, plays: arr });
    logTelemetryEvent('play_reordered', { from_index: from, to_index: to, draft_id: draft?.id });
  };

  const togglePlayExpanded = (playId) => {
    setExpandedPlayIds(prev => prev.includes(playId) ? prev.filter(id => id !== playId) : [...prev, playId]);
  };

  const updatePlay = (playId, patch) => {
    const next = {
      ...playbook,
      plays: (playbook.plays||[]).map(p => p.id === playId ? { ...p, ...patch } : p)
    };
    persistPlaybook(next);
  };

  const updatePlayFile = (playId, index, action) => {
    const nextPlays = (playbook.plays||[]).map(p => {
      if (p.id !== playId) return p;
      const files = [...(p.knowledgeFiles||[])];
      if (action === 'remove') files.splice(index, 1);
      if (action === 'add_file') files.push({ name: `file_${Date.now()}.pdf`, type: 'file' });
      if (action === 'add_link') files.push({ name: 'https://example.com', type: 'link' });
      return { ...p, knowledgeFiles: files };
    });
    persistPlaybook({ ...playbook, plays: nextPlays });
  };

  const addStep = (playId) => {
    const nextPlays = (playbook.plays||[]).map(p => {
      if (p.id !== playId) return p;
      const newStep = { id: `step_${Date.now()}`, title: `Step ${(p.steps||[]).length + 1}`, prompt: '', inputs: [], notes: '' };
      return { ...p, steps: [...(p.steps||[]), newStep] };
    });
    persistPlaybook({ ...playbook, plays: nextPlays });
    logTelemetryEvent('step_added', { play_id: playId, draft_id: draft?.id });
  };

  const removeStep = (playId, stepId) => {
    if (!window.confirm('Remove this step?')) return;
    const nextPlays = (playbook.plays||[]).map(p => p.id === playId ? { ...p, steps: (p.steps||[]).filter(s => s.id !== stepId) } : p);
    persistPlaybook({ ...playbook, plays: nextPlays });
    logTelemetryEvent('step_removed', { play_id: playId, draft_id: draft?.id });
  };

  const reorderStep = (playId, from, to) => {
    const nextPlays = (playbook.plays||[]).map(p => {
      if (p.id !== playId) return p;
      const arr = [...(p.steps||[])];
      if (to < 0 || to >= arr.length) return p;
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return { ...p, steps: arr };
    });
    persistPlaybook({ ...playbook, plays: nextPlays });
    logTelemetryEvent('step_reordered', { play_id: playId, from_index: from, to_index: to, draft_id: draft?.id });
  };

  const updateStep = (playId, stepId, patch) => {
    const nextPlays = (playbook.plays||[]).map(p => p.id === playId ? { ...p, steps: (p.steps||[]).map(s => s.id === stepId ? { ...s, ...patch } : s) } : p);
    persistPlaybook({ ...playbook, plays: nextPlays });
  };

  const addStepInput = (playId, stepId) => {
    const nextPlays = (playbook.plays||[]).map(p => {
      if (p.id !== playId) return p;
      const steps = (p.steps||[]).map(s => {
        if (s.id !== stepId) return s;
        const newInput = { id: `inp_${Date.now()}`, label: '', key: '', type: 'short_text', required: false, defaultValue: '', helpText: '', placeholder: '', options: [] };
        return { ...s, inputs: [...(s.inputs||[]), newInput] };
      });
      return { ...p, steps };
    });
    persistPlaybook({ ...playbook, plays: nextPlays });
  };

  const updateStepInput = (playId, stepId, inputId, field, value) => {
    const nextPlays = (playbook.plays||[]).map(p => {
      if (p.id !== playId) return p;
      const steps = (p.steps||[]).map(s => {
        if (s.id !== stepId) return s;
        const inputs = (s.inputs||[]).map(inp => inp.id === inputId ? { ...inp, [field]: value } : inp);
        return { ...s, inputs };
      });
      return { ...p, steps };
    });
    persistPlaybook({ ...playbook, plays: nextPlays });
  };

  const removeStepInput = (playId, stepId, inputId) => {
    const nextPlays = (playbook.plays||[]).map(p => p.id === playId ? { ...p, steps: (p.steps||[]).map(s => s.id === stepId ? { ...s, inputs: (s.inputs||[]).filter(inp => inp.id !== inputId) } : s) } : p);
    persistPlaybook({ ...playbook, plays: nextPlays });
  };

  const updateStepInputOption = (playId, stepId, inputId, optIndex, field, value) => {
    const nextPlays = (playbook.plays||[]).map(p => {
      if (p.id !== playId) return p;
      const steps = (p.steps||[]).map(s => {
        if (s.id !== stepId) return s;
        const inputs = (s.inputs||[]).map(inp => {
          if (inp.id !== inputId) return inp;
          const opts = [...(inp.options||[])];
          opts[optIndex] = { ...opts[optIndex], [field]: value };
          return { ...inp, options: opts };
        });
        return { ...s, inputs };
      });
      return { ...p, steps };
    });
    persistPlaybook({ ...playbook, plays: nextPlays });
  };

  const addStepInputOption = (playId, stepId, inputId) => {
    const nextPlays = (playbook.plays||[]).map(p => {
      if (p.id !== playId) return p;
      const steps = (p.steps||[]).map(s => {
        if (s.id !== stepId) return s;
        const inputs = (s.inputs||[]).map(inp => inp.id === inputId ? { ...inp, options: [...(inp.options||[]), { label: '', value: '' }] } : inp);
        return { ...s, inputs };
      });
      return { ...p, steps };
    });
    persistPlaybook({ ...playbook, plays: nextPlays });
  };

  const removeStepInputOption = (playId, stepId, inputId, optIndex) => {
    const nextPlays = (playbook.plays||[]).map(p => {
      if (p.id !== playId) return p;
      const steps = (p.steps||[]).map(s => {
        if (s.id !== stepId) return s;
        const inputs = (s.inputs||[]).map(inp => {
          if (inp.id !== inputId) return inp;
          const opts = [...(inp.options||[])];
          opts.splice(optIndex, 1);
          return { ...inp, options: opts };
        });
        return { ...s, inputs };
      });
      return { ...p, steps };
    });
    persistPlaybook({ ...playbook, plays: nextPlays });
  };

  // Series-specific helpers
  const getFilteredPlaybooks = () => {
    return mockPlaybooks.filter(p => {
      // Match version constraint
      const versionMatch = p.version_type === selectedVersion && 
        (selectedVersion === 'ella' || selectedVersion === 'global' || 
         (selectedVersion === 'edition' && p.version_id === selectedEdition) ||
         (selectedVersion === 'organization' && p.version_id === selectedOrganization) ||
         (selectedVersion === 'workspace' && p.version_id === selectedWorkspace) ||
         (selectedVersion === 'brandbot' && p.version_id === selectedBrandBot));
      
      // Match drawer (only Playbooks drawer for Series)
      const drawerMatch = p.drawer === 'playbooks';
      
      // Match section if selected
      const sectionMatch = !selectedSection || p.section_id === selectedSection;
      
      return versionMatch && drawerMatch && sectionMatch;
    });
  };

  const addPlaybookToSeries = (playbook) => {
    if ((series.items||[]).some(i => i.playbookId === playbook.id)) return;
    const newItem = {
      id: `series_item_${Date.now()}`,
      playbookId: playbook.id,
      name: playbook.name,
      label: playbook.name,
      stepCount: playbook.stepCount,
      preview: playbook.preview,
      estMinutes: playbook.estMinutes || 0,
      tags: playbook.tags || [],
      section_id: playbook.section_id,
      knowledgeFiles: playbook.knowledgeFiles || []
    };
    setSeries(prev => ({ ...prev, items: [...(prev.items||[]), newItem] }));
    saveTemplateDraft();
    logTelemetryEvent('series_playbook_added', { playbook_id: playbook.id, draft_id: draft?.id });
  };

  // Series helpers
  const isSeriesValid = () => {
    if (!series.title || series.title.trim().length === 0) return false;
    if (!series.preview || series.preview.trim().length === 0) return false;
    if ((series.preview || '').length > 160) return false;
    if (!series.instructions || series.instructions.trim().length === 0) return false;
    if (!series.items || series.items.length === 0) return false;
    return true;
  };

  const handleSeriesAddExisting = (p) => {
    if ((series.items||[]).some(i => i.playbookId === p.id)) return;
    const newItem = {
      id: `series_item_${Date.now()}`,
      playbookId: p.id,
      name: p.name,
      label: p.name,
      stepCount: p.stepCount,
      preview: p.preview,
      estMinutes: p.stepCount ? p.stepCount * 10 : 0,
      knowledgeFiles: []
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
      preview: p.preview || '',
      estMinutes: (p.stepCount || 1) * 10,
      knowledgeFiles: []
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
    logTelemetryEvent('series_reordered', { from_index: direction === 'up' ? idx : idx + 1, to_index: direction === 'up' ? idx - 1 : idx, draft_id: draft?.id });
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
          
      {/* Full-screen Preview Overlay */}
      {showPreviewModal && (type === 'playbook' || type === 'group') && (
        <>
          <div className="preview-overlay__backdrop" onClick={() => setShowPreviewModal(false)} />
          <div className={`preview-overlay ${showPreviewModal ? 'preview-overlay--open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="pb-preview-title">
          <div className="preview-header">
            <div className="preview-header-left">
              <h2 id="pb-preview-title">{type === 'playbook' ? (playbook.title || 'Untitled Playbook') : (series.title || 'Untitled Series')}</h2>
              <span className="preview-status-badge">Draft</span>
              <span className="preview-pill">{selectedDrawer === 'ellaments' ? 'Ella-ments' : 'Playbooks'} • {selectedSection ? (getSectionCatalog().find(s => s.id === selectedSection)?.name || 'Section') : 'Unassigned'}</span>
              <span className="preview-badge">{getVersionLabel()}</span>
            </div>
            <div className="preview-header-right">
              <button className="create-drawer-btn" onClick={() => { recomputeValidation(); logTelemetryEvent('playbook_preview_validated', { errors: previewIssues.errors.length, warnings: previewIssues.warnings.length }); }}>Re-run checks</button>
              <button className="create-drawer-btn" onClick={() => window.print()}>Print / PDF</button>
              {isAdmin && (
                <button className="create-drawer-btn create-drawer-btn--primary" disabled={previewIssues.errors.length > 0 || !selectedSection || !selectedDrawer} onClick={() => {
                  logTelemetryEvent('playbook_publish_clicked', { draft_id: draft?.id });
                  try {
                    // Simulate publish
                    const published = JSON.parse(localStorage.getItem('ella-published') || '[]');
                    published.push({ id: draft?.id, type: 'playbook', scope: selectedVersion, drawer: selectedDrawer, section: selectedSection, published_at: new Date().toISOString(), published_by: 'current_user_id' });
                    localStorage.setItem('ella-published', JSON.stringify(published));
                    setShowPreviewModal(false);
                    logTelemetryEvent('playbook_publish_success', { draft_id: draft?.id });
                    // Success toast
                    alert('Published. It is now available in the selected Drawer/Section.');
                  } catch (e) {
                    logTelemetryEvent('playbook_publish_failure', { draft_id: draft?.id, error_code: 500 });
                    alert("Couldn’t publish. Try again.");
                  }
                }}>Publish</button>
              )}
              <button className="create-drawer-btn" onClick={() => setShowPreviewModal(false)}>Close</button>
            </div>
          </div>

          {/* Validation Banner */}
          {(previewIssues.errors.length > 0 || previewIssues.warnings.length > 0) && (
            <div className={`preview-banner ${previewIssues.errors.length ? 'preview-banner--error' : 'preview-banner--warning'}`} role="status" aria-live="polite">
              {previewIssues.errors.length > 0 && <span className="preview-pill-error">{previewIssues.errors.length} errors</span>}
              {previewIssues.warnings.length > 0 && <span className="preview-pill-warning">{previewIssues.warnings.length} warnings</span>}
            </div>
          )}

          <div className="preview-body">
            <section className="preview-overview" aria-labelledby="preview-overview-title">
              <h3 id="preview-overview-title">Overview</h3>
              <div className="preview-grid">
                <div>
                  <div className="preview-field"><strong>Preview</strong><div>{type === 'playbook' ? (playbook.preview || '—') : (series.preview || '—')}</div></div>
                  {((type === 'playbook' && playbook.description) || (type === 'group' && series.description)) && <div className="preview-field"><strong>Description</strong><div>{type === 'playbook' ? playbook.description : series.description}</div></div>}
                  <div className="preview-field"><strong>Instructions</strong><div>{type === 'playbook' ? (playbook.instructions || '—') : (series.instructions || '—')}</div></div>
                  {((type === 'playbook' && (playbook.knowledgeFiles||[]).length>0) || (type === 'group' && (series.knowledgeFiles||[]).length>0)) && (
                    <div className="preview-field"><strong>Knowledge Files</strong><ul className="preview-files-list">{(type === 'playbook' ? (playbook.knowledgeFiles||[]) : (series.knowledgeFiles||[])).map((f,i)=> <li key={i}>{f.name}</li>)}</ul></div>
                  )}
                  {type === 'group' && (
                    <div className="preview-field"><strong>Estimated Time</strong><div>Calculated: {(series.items||[]).reduce((sum,i)=> sum + (Number(i.estMinutes)||0), 0)} min{series.estMinutes && (<span> • Series: {series.estMinutes} min</span>)}</div></div>
                  )}
                </div>
                <div>
                  <div className="preview-field"><strong>Placement</strong><div>{selectedDrawer === 'ellaments' ? 'Ella-ments' : 'Playbooks'} → {selectedSection ? (getSectionCatalog().find(s => s.id === selectedSection)?.name || 'Section') : 'Unassigned'}</div></div>
                  <div className="preview-field"><strong>Version</strong><div>{getVersionLabel()}</div></div>
                </div>
              </div>
              {isAdmin && <button className="create-drawer-btn create-drawer-btn--secondary" onClick={() => { setShowPreviewModal(false); setCurrentStep('authoring'); }}>{type === 'playbook' ? 'Edit Playbook' : 'Edit Series'}</button>}
            </section>

            {type === 'playbook' && (
              <section className="preview-plays" aria-labelledby="preview-plays-title">
                <h3 id="preview-plays-title">Plays</h3>
                {(playbook.plays||[]).map((p, pi)=> (
                  <details key={p.id} className="preview-play-card" open>
                    <summary>
                      <span className="preview-step-index">{pi+1}</span>
                      <span className="preview-play-title">{p.title || 'Untitled Play'}</span>
                      <span className="preview-play-sub">{p.preview || ''}</span>
                      {isAdmin && <button className="create-drawer-btn create-drawer-btn--ghost" onClick={(e) => { e.preventDefault(); setShowPreviewModal(false); setCurrentStep('authoring'); setExpandedPlayIds(prev => [...new Set([...prev, p.id])]); }}>Edit Play</button>}
                    </summary>
                    <div className="preview-play-body">
                      {p.description && <div className="preview-field"><strong>Description</strong><div>{p.description}</div></div>}
                      <div className="preview-field"><strong>Instructions</strong><div>{p.instructions || '—'}</div></div>
                      {(p.knowledgeFiles||[]).length>0 && (<div className="preview-field"><strong>Files</strong><ul className="preview-files-list">{(p.knowledgeFiles||[]).map((f,i)=> <li key={i}>{f.name}</li>)}</ul></div>)}
                      <div className="preview-steps-table">
                        <div className="preview-steps-header"><span>#</span><span>Step Name</span><span>Prompt</span><span>Inputs</span><span></span></div>
                        {(p.steps||[]).map((s,si)=> (
                          <div key={s.id} className="preview-steps-row">
                            <span>{si+1}</span>
                            <span>{s.title || `Step ${si+1}`}</span>
                            <span className="preview-prompt-cell">{(s.prompt||'').length>140 ? `${s.prompt.slice(0,140)}…` : (s.prompt||'')}</span>
                            <span>{(s.inputs||[]).length} inputs</span>
                            {isAdmin && <button className="create-drawer-btn create-drawer-btn--ghost" onClick={() => { setShowPreviewModal(false); setCurrentStep('authoring'); setExpandedPlayIds(prev => [...new Set([...prev, p.id])]); }}>Edit Step</button>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                ))}
              </section>
            )}

            {type === 'group' && (
              <section className="preview-series-section" aria-labelledby="preview-series-title">
                <h3 id="preview-series-title">Playbook Sequence</h3>
                <div className="preview-series-list">
                  {(series.items||[]).map((pb, idx)=> (
                    <div key={pb.id} className="preview-series-item">
                      <div className="preview-step-head">
                        <div className="preview-step-index">{idx+1}</div>
                        <div className="preview-step-title">{pb.label || pb.name}</div>
                      </div>
                      <div className="preview-step-sub">{pb.preview || ''} • {pb.estMinutes || 0} min</div>
                      {(pb.knowledgeFiles||[]).length>0 && (<div className="preview-files"><strong>Files:</strong> {(pb.knowledgeFiles||[]).map((f,i)=> <span key={i} className="preview-file">{f.name}</span>)}</div>)}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          </div>
        </>
      )}

          <div className="create-drawer-footer-right">
            {currentStep === 'authoring' && (
              <>
                <button className="create-drawer-btn" onClick={handleManualSave}>Save Draft</button>
                <button className="create-drawer-btn" onClick={handleDuplicate}>Duplicate</button>
              </>
            )}
            
            {currentStep === 'authoring' && (
              <button
                className="create-drawer-btn"
                onClick={() => {
                  // Autosave before preview
                  saveTemplateDraft();
                  setShowPreviewModal(true);
                  if (type === 'playbook') logTelemetryEvent('playbook_preview_opened', { draft_id: draft?.id });
                  recomputeValidation();
                }}
              >
                {type === 'playbook' ? 'Preview' : 'Preview'}
              </button>
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
                {currentStep === 'authoring' && isAdmin && (
                  <button className="create-drawer-btn create-drawer-btn--primary" onClick={handlePublish}>Publish</button>
                )}
                <button
                  className="create-drawer-btn create-drawer-btn--primary"
                  disabled={type === 'template' ? !isTemplateFormValid() : type === 'playbook' ? validation.errors.length > 0 : !isSeriesValid()}
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
  
