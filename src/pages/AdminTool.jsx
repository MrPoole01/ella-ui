import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { EllaLogoIcon } from '../components/icons';
import { TypeSelectorModal } from '../components/ui/Modal';
import { CreateDrawer } from '../components/features';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import '../styles/AdminTool.scss';

const AdminTool = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('templates');

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/admin/templates')) {
      setActiveTab('templates');
    } else if (path.includes('/admin/playbooks')) {
      // Map legacy /admin/playbooks to Playbooks tab (Templates slot)
      setActiveTab('templates');
    } else if (path.includes('/admin/users')) {
      setActiveTab('users');
    } else if (path.includes('/admin/playbooks')) {
      setActiveTab('playbooks');
    } else if (path.includes('/admin/brand-bots')) {
      setActiveTab('brand-bots');
    } else if (path.includes('/admin/tags')) {
      setActiveTab('tags');
    } else if (path.includes('/admin/settings')) {
      setActiveTab('settings');
    } else if (path.includes('/admin/dashboard')) {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('ella-auth-token');
    navigate('/login');
  };

  return (
    <div className="admin-tool-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo-section">
            <EllaLogoIcon />
            <h1 className="admin-logo-text">
              Ella<sup>®</sup>
            </h1>
            <span className="admin-tool-label">Admin Tool</span>
          </div>
        </div>

        <div className="admin-user-profile">
          <div className="admin-user-info">
            <img 
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" 
              className="admin-user-avatar" 
              alt="Admin User Avatar"
            />
            <div className="admin-user-details">
              <p className="admin-user-name">Jane Doe</p>
              <p className="admin-user-role">Admin</p>
            </div>
          </div>
        </div>
        
        <nav className="admin-navigation">
          <button 
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'admin-nav-item--active' : ''}`}
            onClick={() => handleNavigation('dashboard', '/admin/dashboard')}
          >
            <i className="fa-solid fa-chart-pie"></i>
            <span>Dashboard</span>
          </button>
          
          <button 
            className={`admin-nav-item ${activeTab === 'users' ? 'admin-nav-item--active' : ''}`}
            onClick={() => handleNavigation('users', '/admin/users')}
          >
            <i className="fa-solid fa-users"></i>
            <span>Users</span>
          </button>
          
          <button 
            className={`admin-nav-item ${activeTab === 'templates' ? 'admin-nav-item--active' : ''}`}
            onClick={() => handleNavigation('templates', '/admin/templates')}
          >
            <i className="fa-solid fa-layer-group"></i>
            <span>Playbooks</span>
          </button>
          
          {/* <button 
            className={`admin-nav-item ${activeTab === 'playbooks' ? 'admin-nav-item--active' : ''}`}
            onClick={() => handleNavigation('playbooks', '/admin/playbooks')}
          >
            <i className="fa-solid fa-book"></i>
            <span>Playbooks</span>
          </button> */}
          
          <button 
            className={`admin-nav-item ${activeTab === 'brand-bots' ? 'admin-nav-item--active' : ''}`}
            onClick={() => handleNavigation('brand-bots', '/admin/brand-bots')}
          >
            <i className="fa-solid fa-robot"></i>
            <span>Brand Bots</span>
          </button>
          
          <button 
            className={`admin-nav-item ${activeTab === 'tags' ? 'admin-nav-item--active' : ''}`}
            onClick={() => handleNavigation('tags', '/admin/tags')}
          >
            <i className="fa-solid fa-tags"></i>
            <span>Tag Management</span>
          </button>
          
          <button 
            className="admin-nav-item"
            onClick={() => navigate('/')}
          >
            <i className="fa-solid fa-comments"></i>
            <span>Back to Chat</span>
          </button>
          
          <button 
            className={`admin-nav-item ${activeTab === 'settings' ? 'admin-nav-item--active' : ''}`}
            onClick={() => handleNavigation('settings', '/admin/settings')}
          >
            <i className="fa-solid fa-cogs"></i>
            <span>Settings</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        <Routes>
          <Route path="/templates" element={<AdminTemplates />} />
          <Route path="/import/:type" element={<AdminImport />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/playbooks" element={<Navigate to="/admin/templates" replace />} />
          <Route path="/brand-bots" element={<AdminBrandBots />} />
          <Route path="/tags" element={<AdminTags />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/" element={<Navigate to="/admin/templates" replace />} />
        </Routes>
      </main>
    </div>
  );
};

// Admin Templates Component
const AdminTemplates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = (localStorage.getItem('ella-user-role') || '') === 'admin';
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [tagsFilter, setTagsFilter] = useState([]); // multi
  const [partnerEditionFilter, setPartnerEditionFilter] = useState([]); // multi
  const [brandBotFilter, setBrandBotFilter] = useState([]); // multi
  const [sortBy, setSortBy] = useState('updated');
  const [currentPage, setCurrentPage] = useState(1);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastKind, setToastKind] = useState('success'); // 'success' | 'error'
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  
  // Modal and drawer states
  const [isTypeSelectorOpen, setIsTypeSelectorOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedCreateType, setSelectedCreateType] = useState('');
  const [currentDraft, setCurrentDraft] = useState(null);

  // Mock templates data
  const mockTemplates = [
    {
      id: 1,
      title: 'Social Media Content Strategy',
      type: 'strategy',
      preview: 'A comprehensive playbook for developing a winning social media strategy from scratch, covering audience analysis, content pillars, and platform selection.',
      timeNeeded: '45 min',
      templateKind: 'system',
      tags: ['Social Media', 'Content', 'Q3 Planning'],
      partnerEdition: true,
      partnerEditionName: 'Partner A',
      brandBot: false,
      brandBotName: '',
      usage: 42,
      createdAt: '2025-07-02T10:00:00Z',
      updatedAt: '2025-09-20T08:30:00Z'
    },
    {
      id: 2,
      title: 'Weekly Email Newsletter',
      type: 'execution',
      preview: 'Generate a compelling weekly newsletter to engage your audience. This template helps structure content, write catchy subject lines, and format for readability.',
      timeNeeded: '15 min',
      templateKind: 'custom',
      tags: ['Email Marketing', 'Newsletter'],
      partnerEdition: false,
      partnerEditionName: '',
      brandBot: true,
      brandBotName: 'Bot X',
      usage: 18,
      createdAt: '2025-06-15T13:10:00Z',
      updatedAt: '2025-09-24T09:45:00Z'
    },
    {
      id: 3,
      title: 'Quarterly Marketing Plan',
      type: 'planning',
      preview: 'Structure your marketing objectives, key results, and initiatives for the upcoming quarter. Includes sections for budget, channels, and KPIs.',
      timeNeeded: '1h 30m',
      templateKind: 'system',
      tags: ['Planning', 'OKR', 'Strategy'],
      partnerEdition: true,
      partnerEditionName: 'Partner B',
      brandBot: false,
      brandBotName: '',
      usage: 33,
      createdAt: '2025-04-11T16:05:00Z',
      updatedAt: '2025-09-18T12:00:00Z'
    },
    {
      id: 4,
      title: 'SEO Blog Post Outline',
      type: 'execution',
      preview: 'Create a keyword-optimized blog post outline that covers all essential on-page SEO elements, from H1 tags to meta descriptions.',
      timeNeeded: '25 min',
      templateKind: 'system',
      tags: ['SEO', 'Blog', 'Writing'],
      partnerEdition: false,
      partnerEditionName: '',
      brandBot: false,
      brandBotName: '',
      usage: 9,
      createdAt: '2025-05-02T08:00:00Z',
      updatedAt: '2025-09-10T14:00:00Z'
    },
    {
      id: 5,
      title: 'Product Launch Comms Plan',
      type: 'strategy',
      preview: 'Coordinate all communication channels for a successful product launch. Includes pre-launch, launch day, and post-launch phases.',
      timeNeeded: '1h',
      templateKind: 'system',
      tags: ['Product Marketing', 'Launch'],
      partnerEdition: false,
      partnerEditionName: '',
      brandBot: false,
      brandBotName: '',
      usage: 21,
      createdAt: '2025-03-05T10:00:00Z',
      updatedAt: '2025-09-12T10:00:00Z'
    },
    {
      id: 6,
      title: 'A/B Test Hypothesis Builder',
      type: 'planning',
      preview: 'Formulate strong, testable hypotheses for your marketing experiments. Ensures you are testing the right things for maximum learning.',
      timeNeeded: '10 min',
      templateKind: 'custom',
      tags: ['CRO', 'Experimentation'],
      partnerEdition: true,
      partnerEditionName: 'Partner A',
      brandBot: true,
      brandBotName: 'Bot Y',
      usage: 27,
      createdAt: '2025-02-18T09:00:00Z',
      updatedAt: '2025-09-22T11:20:00Z'
    },
    {
      id: 7,
      title: 'LinkedIn Thought Leadership Post',
      type: 'execution',
      preview: 'Craft an insightful and engaging LinkedIn post to build your personal or company brand. Focuses on storytelling and a strong hook.',
      timeNeeded: '20 min',
      templateKind: 'system',
      tags: ['LinkedIn', 'Personal Brand'],
      partnerEdition: false,
      partnerEditionName: '',
      brandBot: false,
      brandBotName: '',
      usage: 13,
      createdAt: '2025-01-10T12:20:00Z',
      updatedAt: '2025-09-05T13:00:00Z'
    },
    {
      id: 8,
      title: 'Competitive Analysis Matrix',
      type: 'strategy',
      preview: 'A structured framework to analyze your competitors\' strengths, weaknesses, opportunities, and threats in the market.',
      timeNeeded: '2h',
      templateKind: 'system',
      tags: ['Market Research', 'SWOT'],
      partnerEdition: false,
      partnerEditionName: '',
      brandBot: false,
      brandBotName: '',
      usage: 6,
      createdAt: '2025-06-01T08:30:00Z',
      updatedAt: '2025-09-08T08:10:00Z'
    }
  ];

  // Query param helpers
  const parseCsv = (val) => (val ? val.split(',').filter(Boolean) : []);
  const toCsv = (arr) => (arr && arr.length ? arr.join(',') : '');

  // Load data and read query params
  useEffect(() => {
    setLoading(true);
    setError('');
    // Simulate async fetch
    const timer = setTimeout(() => {
      try {
    setTemplates(mockTemplates);
        const params = new URLSearchParams(location.search);
        setSearchQuery(params.get('q') || '');
        setTypeFilter(params.get('type') || 'all');
        setTagsFilter(parseCsv(params.get('tags')));
        setPartnerEditionFilter(parseCsv(params.get('pe')));
        setBrandBotFilter(parseCsv(params.get('bb')));
        setSortBy(params.get('sort') || 'updated');
        setCurrentPage(Math.max(1, parseInt(params.get('page') || '1', 10)));
      } catch (e) {
        setError('Failed to load playbooks.');
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Persist to query params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (typeFilter && typeFilter !== 'all') params.set('type', typeFilter);
    if (tagsFilter.length) params.set('tags', toCsv(tagsFilter));
    if (partnerEditionFilter.length) params.set('pe', toCsv(partnerEditionFilter));
    if (brandBotFilter.length) params.set('bb', toCsv(brandBotFilter));
    if (sortBy && sortBy !== 'updated') params.set('sort', sortBy);
    if (currentPage && currentPage !== 1) params.set('page', String(currentPage));
    const search = params.toString();
    navigate({ pathname: '/admin/templates', search: search ? `?${search}` : '' }, { replace: true });
  }, [searchQuery, typeFilter, tagsFilter, partnerEditionFilter, brandBotFilter, sortBy, currentPage, navigate]);

  // Create flow handlers
  const handleCreateClick = () => {
    if (!isAdmin) return;
    logTelemetryEvent('admin_create_clicked');
    setIsTypeSelectorOpen(true);
    logTelemetryEvent('type_selector_opened');
  };

  const createDraftMock = async (selectedType) => {
    // RBAC: only admins allowed
    if (!isAdmin) {
      const err = new Error('Forbidden');
      err.status = 403;
      throw err;
    }
    // Validation
    if (selectedType !== 'playbook' && selectedType !== 'series') {
      const err = new Error('Invalid type');
      err.status = 422;
      throw err;
    }
    // Simulate server error via toggle
    const simulate = localStorage.getItem('ella-simulate-create-failure');
    if (simulate === '500') {
      const err = new Error('Server error');
      err.status = 500;
      throw err;
    }
    // Simulate latency
    await new Promise(r => setTimeout(r, 400));
    // Create draft DTO
    const id = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const nowIso = new Date().toISOString();
    const draft = {
      id,
      type: selectedType,
      status: 'draft',
      created_by: 'current_user_id',
      created_at: nowIso,
      last_modified_at: nowIso,
      origin: 'admin',
      progress_step: 'type_selected'
    };
    // Persist to localStorage (mock DB)
    const store = JSON.parse(localStorage.getItem('ella-drafts') || '[]');
    store.unshift(draft);
    localStorage.setItem('ella-drafts', JSON.stringify(store));
    return draft;
  };

  const navigateToImport = (type) => {
    navigate(`/admin/import/${type}`);
  };

  const handleTypeSelectorContinue = (selectedType, draft) => {
    setSelectedCreateType(selectedType);
    setCurrentDraft(draft);
    setIsTypeSelectorOpen(false);
    setIsCreateDrawerOpen(true);
  };

  const handleTypeSelectorCancel = () => {
    setIsTypeSelectorOpen(false);
  };

  const handleCreateDrawerClose = () => {
    setIsCreateDrawerOpen(false);
    setSelectedCreateType('');
    setCurrentDraft(null);
  };

  const handleChangeType = () => {
    // Log telemetry
    logTelemetryEvent('type_change_requested', {
      current_type: selectedCreateType,
      draft_id: currentDraft?.id
    });
    
    // Close create drawer first
    setIsCreateDrawerOpen(false);
    
    // Add a small delay to prevent DOM manipulation conflicts
    setTimeout(() => {
      setIsTypeSelectorOpen(true);
    }, 100);
    
    // Keep the draft and type state for now - they'll be updated if user selects a different type
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

  const handleCardAction = (action, template) => {
    if (action === 'view') {
      logTelemetryEvent('playbook_view', { id: template.id });
      alert(`View details for: ${template.title}`);
      return;
    }
    if (action === 'edit') {
      if (!isAdmin) return;
      logTelemetryEvent('playbook_edit', { id: template.id });
      alert(`Edit: ${template.title}`);
      return;
    }
    if (action === 'duplicate') {
      logTelemetryEvent('playbook_duplicate', { id: template.id });
      const copy = { ...template, id: Math.max(...templates.map(t => t.id)) + 1, title: `${template.title} (Copy)` };
      setTemplates([copy, ...templates]);
      return;
    }
    if (action === 'delete') {
      if (!isAdmin) return;
      if (window.confirm('Are you sure you want to delete this playbook?')) {
        logTelemetryEvent('playbook_delete', { id: template.id });
        setTemplates(templates.filter(t => t.id !== template.id));
      }
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'strategy': return 'admin-type-strategy';
      case 'execution': return 'admin-type-execution';
      case 'planning': return 'admin-type-planning';
      default: return 'admin-type-default';
    }
  };

  // Derived options for multi-selects
  const allTags = Array.from(new Set(templates.flatMap(t => t.tags))).sort();
  const allPartnerNames = Array.from(new Set(templates.map(t => t.partnerEditionName).filter(Boolean))).sort();
  const allBrandBotNames = Array.from(new Set(templates.map(t => t.brandBotName).filter(Boolean))).sort();

  const filteredTemplates = templates.filter(template => {
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch =
      template.title.toLowerCase().includes(q) ||
      template.preview.toLowerCase().includes(q) ||
      (template.tags || []).some(tag => tag.toLowerCase().includes(q));
    
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    
    const matchesTags = tagsFilter.length === 0 || tagsFilter.every(t => (template.tags || []).includes(t));

    const matchesPartner = partnerEditionFilter.length === 0 || partnerEditionFilter.includes(template.partnerEditionName || '');

    const matchesBrandBot = brandBotFilter.length === 0 || brandBotFilter.includes(template.brandBotName || '');

    return matchesSearch && matchesType && matchesTags && matchesPartner && matchesBrandBot;
  });

  // Sorting
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt);
    if (sortBy === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'usage') return (b.usage || 0) - (a.usage || 0);
    return 0;
  });

  const totalPages = Math.ceil(sortedTemplates.length / 24) || 1;
  const startIndex = (currentPage - 1) * 24;
  const paginatedTemplates = sortedTemplates.slice(startIndex, startIndex + 24);

  return (
    <div className="admin-templates">
      {/* Header */}
      <header className="admin-content-header">
        <h1 className="admin-page-title">Playbooks</h1>
        <div className="admin-header-actions">
          {isAdmin && (
          <button className="admin-btn admin-btn--primary" onClick={handleCreateClick}>
            Create
          </button>
          )}
        </div>
      </header>
      
      {/* Filters */}
      <section className="admin-filters-section">
        <div className="admin-filters">
          <div className="admin-search-container">
            <i className="fa-solid fa-search admin-search-icon"></i>
            <input 
              type="text" 
              placeholder="Search by Title, Preview, Keywords..." 
              className="admin-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="admin-filter-controls">
            <select 
              className="admin-select"
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">Type: All</option>
              <option value="strategy">Strategy</option>
              <option value="planning">Planning</option>
              <option value="execution">Execution</option>
            </select>
            
            <select
              className="admin-select"
              value={tagsFilter}
              onChange={(e) => { setTagsFilter(Array.from(e.target.selectedOptions).map(o => o.value)); setCurrentPage(1); }}
            >
              <option value="" disabled>Tags</option>
              {allTags.map(t => (<option key={t} value={t}>{t}</option>))}
            </select>
            
            <select
              className="admin-select"
              value={partnerEditionFilter}
              onChange={(e) => { setPartnerEditionFilter(Array.from(e.target.selectedOptions).map(o => o.value)); setCurrentPage(1); }}
            >
              <option value="" disabled>Partner Edition</option>
              {allPartnerNames.map(n => (<option key={n} value={n}>{n}</option>))}
            </select>
            
            <select
              className="admin-select"
              value={brandBotFilter}
              onChange={(e) => { setBrandBotFilter(Array.from(e.target.selectedOptions).map(o => o.value)); setCurrentPage(1); }}
            >
              <option value="" disabled>Brand Bot</option>
              {allBrandBotNames.map(n => (<option key={n} value={n}>{n}</option>))}
            </select>
          </div>
          
          <div className="admin-sort-controls">
            <span className="admin-sort-label">Sort by:</span>
            <select 
              className="admin-select"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            >
              <option value="updated">Updated</option>
              <option value="created">Created</option>
              <option value="title">Title (A-Z)</option>
              <option value="usage">Usage</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="admin-results-section">
        <div className="admin-templates-grid">
          {loading && (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`s-${i}`} className="admin-template-card">
                <div className="admin-card-content">
                  <div className="admin-card-header">
                    <span className="admin-type-badge skeleton" style={{ width: 80 }}></span>
                    <div className="admin-card-menu"><span className="skeleton" style={{ width: 24, height: 24 }}></span></div>
                  </div>
                  <div className="admin-card-title skeleton" style={{ height: 20, width: '70%', marginTop: 8 }}></div>
                  <div className="admin-card-preview skeleton" style={{ height: 48, width: '100%', marginTop: 8 }}></div>
                  <div className="admin-card-meta">
                    <span className="skeleton" style={{ width: 80, height: 16 }}></span>
                    <span className="skeleton" style={{ width: 60, height: 16 }}></span>
                  </div>
                </div>
              </div>
            ))
          )}
          {!loading && paginatedTemplates.map((template) => (
            <div key={template.id} className="admin-template-card">
              <div className="admin-card-content">
                <div className="admin-card-header">
                  <span className={`admin-type-badge ${getTypeColor(template.type)}`}>
                    {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                  </span>
                  <div className="admin-card-menu" style={{ position: 'relative' }}>
                    <button className="admin-card-menu-btn" onClick={() => setOpenMenuId(openMenuId === template.id ? null : template.id)}>
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    {openMenuId === template.id && (
                      <div className="admin-card-menu-list" style={{ position: 'absolute', right: 0, top: 28, background: 'var(--surface-2, #1f1f1f)', border: '1px solid var(--border, #333)', borderRadius: 8, padding: 8, zIndex: 3 }}>
                        <button className="admin-card-menu-item" onClick={() => { setOpenMenuId(null); handleCardAction('view', template); }}>View Details</button>
                        {isAdmin && <button className="admin-card-menu-item" onClick={() => { setOpenMenuId(null); handleCardAction('edit', template); }}>Edit</button>}
                        <button className="admin-card-menu-item" onClick={() => { setOpenMenuId(null); handleCardAction('duplicate', template); }}>Duplicate</button>
                        {isAdmin && <button className="admin-card-menu-item" onClick={() => { setOpenMenuId(null); handleCardAction('delete', template); }}>Delete</button>}
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="admin-card-title">{template.title}</h3>
                <p className="admin-card-preview">{template.preview}</p>
                
                <div className="admin-card-meta">
                  <span className="admin-time-needed">
                    <i className="fa-regular fa-clock"></i>
                    {template.timeNeeded}
                  </span>
                  <span className={`admin-template-kind ${template.templateKind === 'custom' ? 'admin-template-kind--custom' : ''}`}>
                    {template.templateKind === 'custom' ? 'Custom' : 'System'}
                  </span>
                  {template.brandBot && <i className="fa-solid fa-robot admin-brand-bot-icon" title={template.brandBotName || 'Brand Bot Enabled'}></i>}
                  {template.partnerEdition && <i className="fa-solid fa-handshake admin-partner-icon" title={template.partnerEditionName || 'Partner Edition'}></i>}
                </div>
              </div>
              
              <div className="admin-card-footer">
                <div className="admin-card-tags">
                  {template.tags.map((tag, index) => (
                    <span key={index} className="admin-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && !error && filteredTemplates.length === 0 && (
          <div className="admin-empty-state">
            <i className="fa-solid fa-folder-open admin-empty-icon"></i>
            <h3 className="admin-empty-title">No Playbooks Found</h3>
            <p className="admin-empty-description">
              Your search and filter combination did not return any results. Try adjusting your criteria or create a new template.
            </p>
          </div>
        )}
        {error && (
          <div className="admin-empty-state">
            <i className="fa-solid fa-triangle-exclamation admin-empty-icon"></i>
            <h3 className="admin-empty-title">Something went wrong</h3>
            <p className="admin-empty-description">{error}</p>
            <button className="admin-btn admin-btn--secondary" onClick={() => {
              setError('');
              setLoading(true);
              setTimeout(() => { setTemplates(mockTemplates); setLoading(false); }, 400);
            }}>Retry</button>
          </div>
        )}
      </section>

      {/* Pagination */}
      {!loading && filteredTemplates.length > 0 && (
        <footer className="admin-pagination-footer">
          <span className="admin-pagination-info">
            Showing {startIndex + 1}-{Math.min(startIndex + 24, sortedTemplates.length)} of {sortedTemplates.length} playbooks
          </span>
          <div className="admin-pagination-controls">
            <button 
              className="admin-pagination-btn" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button 
                  key={pageNum}
                  className={`admin-pagination-btn ${currentPage === pageNum ? 'admin-pagination-btn--active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && <span className="admin-pagination-ellipsis">...</span>}
            {totalPages > 5 && (
              <button 
                className="admin-pagination-btn"
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            )}
            
            <button 
              className="admin-pagination-btn" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </footer>
      )}

      {/* Type Selector Modal */}
      <ErrorBoundary 
        name="TypeSelectorModal"
        fallbackMessage="There was an error with the type selector. Please try again."
        onError={() => { setIsTypeSelectorOpen(false); }}
      >
        <TypeSelectorModal
          isOpen={isTypeSelectorOpen}
          onContinue={async (selectedType) => {
            if (!selectedType) return;
            setSelectedCreateType(selectedType);
            logTelemetryEvent('type_selected', { value: selectedType });
            try {
              setIsCreatingDraft(true);
              const draft = await createDraftMock(selectedType);
              logTelemetryEvent('create_draft_success');
              setCurrentDraft(draft);
              setIsTypeSelectorOpen(false);
              setIsCreateDrawerOpen(true);
              logTelemetryEvent('create_drawer_opened', { value: selectedType });
            } catch (e) {
              const status = e?.status || 500;
              if (status === 403) {
                setIsTypeSelectorOpen(false);
                setToastKind('error');
                setToastMsg('You don’t have permission to create items.');
                setTimeout(() => setToastMsg(''), 2500);
              } else if (status === 422) {
                setToastKind('error');
                setToastMsg('Invalid selection. Please choose a valid type.');
                setTimeout(() => setToastMsg(''), 2500);
              } else {
                setToastKind('error');
                setToastMsg('Couldn’t start a new build. Try again.');
                setTimeout(() => setToastMsg(''), 2500);
              }
              logTelemetryEvent('create_draft_failure', { error_code: status });
            } finally {
              setIsCreatingDraft(false);
            }
          }}
          onCancel={() => { setIsTypeSelectorOpen(false); }}
          onClose={() => { setIsTypeSelectorOpen(false); }}
          initialSelectedType={selectedCreateType}
        />
      </ErrorBoundary>

      {/* Create Drawer */}
      <ErrorBoundary 
        name="CreateDrawer"
        fallbackMessage="There was an error with the creation form. Please try again."
        onError={() => { setIsCreateDrawerOpen(false); }}
      >
        <CreateDrawer
          isOpen={isCreateDrawerOpen}
          onClose={() => { setIsCreateDrawerOpen(false); }}
          onChangeType={() => {
            // Allow switching type by returning to modal; keep draft
            setIsCreateDrawerOpen(false);
            setIsTypeSelectorOpen(true);
          }}
          type={selectedCreateType}
          draft={currentDraft}
          loading={isCreatingDraft}
        />
      </ErrorBoundary>

      {toastMsg && (
        <div className={`admin-toast ${toastKind === 'error' ? 'admin-toast--error' : 'admin-toast--success'}`} role="status">{toastMsg}</div>
      )}
    </div>
  );
};

// Placeholder components for other admin sections
const AdminDashboard = () => <div className="admin-placeholder">Dashboard - Coming Soon</div>;
const AdminUsers = () => <div className="admin-placeholder">Users - Coming Soon</div>;
const AdminPlaybooks = () => {
  const [playbooks, setPlaybooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaybook, setSelectedPlaybook] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);

  // Mock playbooks with steps
  const mockPlaybooks = [
    {
      id: 'p1',
      name: 'Content Pipeline',
      description: 'Outline → Draft → Edit',
      tags: ['Content', 'Workflow'],
      steps: [
        { title: 'Blog Outline', preview: 'Create an outline', requiredInputs: ['topic*', 'audience'] },
        { title: 'Draft Post', preview: 'Write draft', requiredInputs: ['outline*'] },
        { title: 'Edit & Polish', preview: 'Refine draft', requiredInputs: [] }
      ]
    },
    {
      id: 'p2',
      name: 'Outbound Sequence',
      description: 'Email → Follow-up',
      tags: ['Sales'],
      steps: [
        { title: 'Initial Outreach Email', preview: 'Draft initial email', requiredInputs: ['audience*', 'tone'] },
        { title: 'Follow-up Email', preview: 'Write a follow-up', requiredInputs: ['cta*'] }
      ]
    },
    {
      id: 'p3',
      name: 'Ad Creative Sprint',
      description: 'Brief → Variations → QA → Publish',
      tags: ['Ads', 'Creative'],
      steps: [
        { title: 'Brief', preview: 'Campaign brief', requiredInputs: ['objective*'] },
        { title: 'Variations', preview: 'Generate variations', requiredInputs: ['platform'] },
        { title: 'QA', preview: 'Quality check', requiredInputs: [] },
        { title: 'Publish', preview: 'Ship live', requiredInputs: [] }
      ]
    }
  ];

  useEffect(() => {
    setPlaybooks(mockPlaybooks);
  }, []);

  const filtered = playbooks.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.description||'').toLowerCase().includes(searchQuery.toLowerCase()));

  const openPreview = (pb) => {
    setSelectedPlaybook(pb);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedPlaybook(null);
  };

  const runPlaybook = () => {
    // Close preview and open runner drawer (mock)
    setIsPreviewOpen(false);
    setIsRunnerOpen(true);
  };

  const closeRunner = () => setIsRunnerOpen(false);

  return (
    <div className="admin-templates">
      {/* Header */}
      <header className="admin-content-header">
        <h1 className="admin-page-title">Playbooks</h1>
        <div className="admin-header-actions">
          <div className="admin-search-container" style={{ width: 320 }}>
            <span className="admin-search-icon">🔎</span>
            <input
              className="admin-search-input"
              placeholder="Search Playbooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Grid */}
      <section className="admin-results-section">
        <div className="admin-templates-grid">
          {filtered.map((pb) => (
            <div key={pb.id} className="admin-template-card">
              <div className="admin-card-content">
                <div className="admin-card-header">
                  <span className="admin-type-badge admin-type-planning">Playbook</span>
                  <div className="admin-card-menu">
                    <button className="admin-card-menu-btn" onClick={() => openPreview(pb)} title="Preview">
                      <span>ℹ️</span>
                    </button>
                  </div>
                </div>

                <h3 className="admin-card-title">{pb.name}</h3>
                <p className="admin-card-preview">{pb.description || 'No description provided.'}</p>

                <div className="admin-card-meta">
                  <span className="admin-time-needed"><span>🧩</span>{pb.steps.length} steps</span>
                </div>
              </div>
              <div className="admin-card-footer">
                <div className="admin-card-tags">
                  {(pb.tags||[]).map((t, i) => (
                    <span className="admin-tag" key={i}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Preview Panel */}
      {isPreviewOpen && selectedPlaybook && (
        <div className="preview-panel-overlay" onClick={(e) => { if (e.target.classList.contains('preview-panel-overlay')) closePreview(); }}>
          <aside className="preview-panel">
            <header className="preview-panel-header">
              <div className="preview-panel-title">
                <span className="preview-panel-icon">📚</span>
                <h3>{selectedPlaybook.name}</h3>
              </div>
              <button className="preview-panel-close" onClick={closePreview}>✕</button>
            </header>
            <section className="preview-panel-body">
              <div className="preview-meta">
                <div className="preview-meta-row"><span className="pm-label">Description</span><span className="pm-value">{selectedPlaybook.description || 'No description provided.'}</span></div>
                <div className="preview-meta-row"><span className="pm-label">Tags</span><span className="pm-value">{(selectedPlaybook.tags||[]).join(', ') || '—'}</span></div>
                <div className="preview-meta-row"><span className="pm-label">Steps</span><span className="pm-value">{selectedPlaybook.steps.length}</span></div>
              </div>

              <div className="preview-steps">
                <h4 className="preview-section-title">Sequence</h4>
                {selectedPlaybook.steps.map((s, idx) => (
                  <details key={idx} className="preview-step-item" open>
                    <summary>
                      <span className="preview-step-index">{idx + 1}</span>
                      <span className="preview-step-title">{s.title}</span>
                      <span className="preview-step-sub">{s.preview || ''}</span>
                    </summary>
                    <div className="preview-step-content">
                      <div className="preview-intake">
                        <div className="preview-intake-title">Required Inputs</div>
                        {(s.requiredInputs || []).length === 0 ? (
                          <div className="preview-empty">None</div>
                        ) : (
                          <ul className="preview-input-list">
                            {s.requiredInputs.map((ri, i) => <li key={i}>{ri}</li>)}
                          </ul>
                        )}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
            <footer className="preview-panel-footer">
              <button className="admin-btn admin-btn--secondary" onClick={closePreview}>Close</button>
              <button className="admin-btn admin-btn--primary" onClick={runPlaybook}>Run Playbook</button>
            </footer>
          </aside>
        </div>
      )}

      {/* Runner Drawer (mock) */}
      {isRunnerOpen && selectedPlaybook && (
        <div className="preview-panel-overlay" onClick={(e) => { if (e.target.classList.contains('preview-panel-overlay')) closeRunner(); }}>
          <aside className="preview-panel">
            <header className="preview-panel-header">
              <div className="preview-panel-title">
                <span className="preview-panel-icon">▶️</span>
                <h3>Run: {selectedPlaybook.name}</h3>
              </div>
              <button className="preview-panel-close" onClick={closeRunner}>✕</button>
            </header>
            <section className="preview-panel-body">
              <div className="preview-intake">
                <div className="preview-intake-title">Step 1 Intake (read-only demo)</div>
                <div className="preview-empty">Runner UI is a placeholder in this demo.</div>
              </div>
            </section>
            <footer className="preview-panel-footer">
              <button className="admin-btn admin-btn--secondary" onClick={closeRunner}>Close</button>
            </footer>
          </aside>
        </div>
      )}
    </div>
  );
};
const AdminBrandBots = () => {
  const [orgAutobotEnabled, setOrgAutobotEnabled] = useState(true);
  const [editions, setEditions] = useState([
    { id: 'edition-1', name: 'Edition 1', autobotEnabled: true },
    { id: 'edition-2', name: 'Edition 2', autobotEnabled: true },
    { id: 'edition-3', name: 'Edition 3', autobotEnabled: false }
  ]);
  const [collections, setCollections] = useState([
    { id: 'collection-1', name: 'Collection 1', autobotEnabled: true },
    { id: 'collection-2', name: 'Collection 2', autobotEnabled: true }
  ]);
  const [disabledOrgs, setDisabledOrgs] = useState([]);
  const [orgs] = useState([
    { id: 'org-1', name: 'Organization 1' },
    { id: 'org-2', name: 'Organization 2' },
    { id: 'org-3', name: 'Organization 3' }
  ]);

  const handleOrgAutobotToggle = () => {
    setOrgAutobotEnabled(prev => !prev);
  };

  const handleEditionToggle = (editionId) => {
    setEditions(prev => prev.map(ed => 
      ed.id === editionId ? { ...ed, autobotEnabled: !ed.autobotEnabled } : ed
    ));
  };

  const handleCollectionToggle = (collectionId) => {
    setCollections(prev => prev.map(col => 
      col.id === collectionId ? { ...col, autobotEnabled: !col.autobotEnabled } : col
    ));
  };

  const handleOrgDisableToggle = (orgId) => {
    setDisabledOrgs(prev => 
      prev.includes(orgId) 
        ? prev.filter(id => id !== orgId)
        : [...prev, orgId]
    );
  };

  return (
    <div className="admin-brand-bots">
      <div className="admin-content-header">
        <h2 className="admin-page-title">Brand Bots / Autobot Controls</h2>
      </div>

      <div className="admin-results-section">
        {/* Org-level Autobot Toggle */}
        <div className="admin-brand-bots-section">
          <div className="admin-brand-bots-section-header">
            <h3 className="admin-brand-bots-section-title">Organization-Level Autobot</h3>
            <div className="admin-toggle-wrapper">
              <button
                className={`admin-toggle ${orgAutobotEnabled ? 'admin-toggle--on' : ''}`}
                onClick={handleOrgAutobotToggle}
              >
                <div className="admin-toggle-handle"></div>
              </button>
              <span className="admin-toggle-label">
                {orgAutobotEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          <p className="admin-brand-bots-section-description">
            Enable or disable Autobot for the entire organization. When disabled, Autobot will not be available to any users in the organization.
          </p>
        </div>

        {/* Edition/Collection Toggles */}
        <div className="admin-brand-bots-section">
          <h3 className="admin-brand-bots-section-title">Edition-Level Controls</h3>
          <p className="admin-brand-bots-section-description">
            Control Autobot availability for specific editions.
          </p>
          <div className="admin-brand-bots-list">
            {editions.map(edition => (
              <div key={edition.id} className="admin-brand-bots-item">
                <div className="admin-brand-bots-item-info">
                  <span className="admin-brand-bots-item-name">{edition.name}</span>
                </div>
                <div className="admin-toggle-wrapper">
                  <button
                    className={`admin-toggle ${edition.autobotEnabled ? 'admin-toggle--on' : ''}`}
                    onClick={() => handleEditionToggle(edition.id)}
                    disabled={!orgAutobotEnabled}
                  >
                    <div className="admin-toggle-handle"></div>
                  </button>
                  <span className="admin-toggle-label">
                    {edition.autobotEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-brand-bots-section">
          <h3 className="admin-brand-bots-section-title">Collection-Level Controls</h3>
          <p className="admin-brand-bots-section-description">
            Control Autobot availability for specific collections.
          </p>
          <div className="admin-brand-bots-list">
            {collections.map(collection => (
              <div key={collection.id} className="admin-brand-bots-item">
                <div className="admin-brand-bots-item-info">
                  <span className="admin-brand-bots-item-name">{collection.name}</span>
                </div>
                <div className="admin-toggle-wrapper">
                  <button
                    className={`admin-toggle ${collection.autobotEnabled ? 'admin-toggle--on' : ''}`}
                    onClick={() => handleCollectionToggle(collection.id)}
                    disabled={!orgAutobotEnabled}
                  >
                    <div className="admin-toggle-handle"></div>
                  </button>
                  <span className="admin-toggle-label">
                    {collection.autobotEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Org-Specific Disable */}
        <div className="admin-brand-bots-section">
          <h3 className="admin-brand-bots-section-title">Organization-Specific Controls</h3>
          <p className="admin-brand-bots-section-description">
            Disable Autobot for specific organizations. This overrides all other settings for the selected organizations.
          </p>
          <div className="admin-brand-bots-list">
            {orgs.map(org => (
              <div key={org.id} className="admin-brand-bots-item">
                <div className="admin-brand-bots-item-info">
                  <span className="admin-brand-bots-item-name">{org.name}</span>
                </div>
                <div className="admin-toggle-wrapper">
                  <button
                    className={`admin-toggle admin-toggle--danger ${disabledOrgs.includes(org.id) ? 'admin-toggle--on' : ''}`}
                    onClick={() => handleOrgDisableToggle(org.id)}
                  >
                    <div className="admin-toggle-handle"></div>
                  </button>
                  <span className="admin-toggle-label">
                    {disabledOrgs.includes(org.id) ? 'Disabled' : 'Enabled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
const AdminTags = () => {
  const [editions, setEditions] = useState([
    { id: 'dtm', name: 'DTM Edition', kind: 'Edition' },
    { id: 'partner', name: 'Partner Edition', kind: 'Edition' },
    { id: 'col-a', name: 'Content Collection A', kind: 'Collection' },
    { id: 'col-b', name: 'Content Collection B', kind: 'Collection' }
  ]);
  const [selectedEditionId, setSelectedEditionId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAsc, setIsAsc] = useState(true); // default A–Z
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState('');

  // Ensure we have a tags store in localStorage
  useEffect(() => {
    const existing = localStorage.getItem('ella-tags');
    if (!existing) {
      const seed = {
        dtm: [
          { name: 'SEO', usageCount: 12 },
          { name: 'Content', usageCount: 7 },
          { name: 'Newsletter', usageCount: 3 }
        ],
        partner: [
          { name: 'Sales', usageCount: 4 },
          { name: 'Outbound', usageCount: 2 },
          { name: 'ABM', usageCount: 1 }
        ],
        'col-a': [
          { name: 'Legal', usageCount: 0 },
          { name: 'Product', usageCount: 5 }
        ],
        'col-b': []
      };
      localStorage.setItem('ella-tags', JSON.stringify(seed));
    }
  }, []);

  const readTagsStore = () => JSON.parse(localStorage.getItem('ella-tags') || '{}');
  const writeTagsStore = (store) => localStorage.setItem('ella-tags', JSON.stringify(store));

  const getCurrentEdition = () => editions.find(e => e.id === selectedEditionId) || null;

  const currentTags = () => {
    if (!selectedEditionId) return [];
    const store = readTagsStore();
    const list = store[selectedEditionId] || [];
    const filtered = list.filter(t => t.name.toLowerCase().includes((searchQuery || '').toLowerCase()));
    const sorted = [...filtered].sort((a, b) => {
      const cmp = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      return isAsc ? cmp : -cmp;
    });
    return sorted;
  };

  const onAddTag = (e) => {
    e.preventDefault();
    if (!selectedEditionId) return;
    const name = (newTagName || '').trim();
    if (!name) {
      setFormError('Tag Name is required');
      return;
    }
    const store = readTagsStore();
    const list = store[selectedEditionId] || [];
    const exists = list.some(t => t.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      setFormError('This tag already exists for this Edition.');
      return;
    }
    const updated = [...list, { name, usageCount: 0 }];
    store[selectedEditionId] = updated;
    writeTagsStore(store);
    const edition = getCurrentEdition();
    setToast(`Tag ‘${name}’ added to ${edition ? edition.name : 'selection'}.`);
    setShowAddForm(false);
    setNewTagName('');
    setFormError('');
    // auto hide toast
    setTimeout(() => setToast(''), 2500);
  };

  const resetAddForm = () => {
    setShowAddForm(false);
    setNewTagName('');
    setFormError('');
  };

  const tags = currentTags();

  return (
    <div className="admin-templates">
      <header className="admin-content-header">
        <h1 className="admin-page-title">Tag Management</h1>
        <div className="admin-header-actions">
          <div className="admin-search-container" style={{ width: 320 }}>
            <i className="fa-solid fa-search admin-search-icon"></i>
            <input
              className="admin-search-input"
              placeholder="Search tags…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="admin-btn admin-btn--primary"
            onClick={() => { setShowAddForm(true); setFormError(''); }}
            disabled={!selectedEditionId}
            title={!selectedEditionId ? 'Select an Edition/Collection first' : 'Add Tag'}
          >
            Add Tag
          </button>
        </div>
      </header>

      <section className="admin-filters-section">
        <div className="admin-filters">
          <select
            className="admin-select"
            value={selectedEditionId}
            onChange={(e) => { setSelectedEditionId(e.target.value); setSearchQuery(''); resetAddForm(); }}
          >
            <option value="">Select Edition or Collection</option>
            {editions.map(ed => (
              <option key={ed.id} value={ed.id}>{ed.name}</option>
            ))}
          </select>

          <div className="admin-sort-controls">
            <span className="admin-sort-label">Sort:</span>
            <button
              className="admin-btn admin-btn--secondary"
              onClick={() => setIsAsc(!isAsc)}
              disabled={!selectedEditionId}
              title="Toggle A–Z / Z–A"
            >
              {isAsc ? 'A–Z' : 'Z–A'}
            </button>
          </div>
        </div>
        {!selectedEditionId && (
          <div className="admin-inline-help">Select an Edition or Collection to view and manage its system tags.</div>
        )}
      </section>

      {showAddForm && selectedEditionId && (
        <section className="admin-results-section">
          <form className="admin-inline-form" onSubmit={onAddTag}>
            <div className="admin-inline-form-row">
              <label className="admin-inline-label">Tag Name</label>
              <input
                className="admin-input"
                placeholder="Enter tag name"
                value={newTagName}
                onChange={(e) => { setNewTagName(e.target.value); if (formError) setFormError(''); }}
                autoFocus
              />
            </div>
            {formError && <div className="admin-inline-error">{formError}</div>}
            <div className="admin-inline-actions">
              <button type="button" className="admin-btn admin-btn--secondary" onClick={resetAddForm}>Cancel</button>
              <button type="submit" className="admin-btn admin-btn--primary">Save</button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-results-section">
        {selectedEditionId && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '70%' }}>
                    Tag Name
                    <button
                      className="admin-table-sort"
                      onClick={() => setIsAsc(!isAsc)}
                      title="Toggle sort"
                      style={{ marginLeft: 8 }}
                    >
                      {isAsc ? '▲' : '▼'}
                    </button>
                  </th>
                  <th style={{ width: '30%' }}>Usage Count</th>
                </tr>
              </thead>
              <tbody>
                {tags.length === 0 ? (
                  <tr>
                    <td colSpan={2}>
                      <div className="admin-empty-state">
                        <i className="fa-solid fa-folder-open admin-empty-icon"></i>
                        <h3 className="admin-empty-title">No Tags Found</h3>
                        <p className="admin-empty-description">{searchQuery ? 'No tags match your search.' : 'Add tags to make them available for content tagging in this scope.'}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tags.map((t, i) => (
                    <tr key={`${t.name}-${i}`}>
                      <td>{t.name}</td>
                      <td>{t.usageCount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {toast && (
        <div className="admin-toast admin-toast--success" role="status">{toast}</div>
      )}
    </div>
  );
};
const AdminSettings = () => <div className="admin-placeholder">Settings - Coming Soon</div>;

export default AdminTool;
// Admin Import Page
const AdminImport = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [placement, setPlacement] = useState({
    edition: '',
    locationType: '',
    locationId: '',
    drawer: '',
    section: ''
  });
  const [sections, setSections] = useState([]);
  const [files, setFiles] = useState([]);
  const [batchResults, setBatchResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const canUpload = placement.edition && placement.drawer && placement.section && files.length > 0 && files.length <= 10;

  const downloadTemplate = () => {
    const blob = new Blob([
      `# Ella ${type === 'template' ? 'Template' : type === 'playbook' ? 'Playbook' : 'Playbook Series'} Import\n\n` +
      `ASSET_ID: <auto>\n` +
      `PARAMETERS: title, preview, description, prompt, instructions, required_elements, knowledge_files, input_fields, next_suggested_templates` +
      `${type === 'playbook' ? '\nPLAYBOOK: plays[], estimated_time, additional_context' : ''}` +
      `${type === 'group' ? '\nSERIES: playbooks[] (each with title, description, plays[])' : ''}`
    ], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ella-${type}-doc-template.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected.slice(0, 10));
  };

  const parseDocMock = async (file) => {
    // Simulate parsing; in real app, send to backend.
    await new Promise(r => setTimeout(r, 500 + Math.random() * 800));
    const success = Math.random() > 0.1;
    return success ? { status: 'success', name: file.name, fields: { title: file.name.replace(/\.[^.]+$/, ''), preview: 'Parsed preview', description: '', prompt: '', instructions: '' }, tags: ['auto'], keywords: ['auto'] } : { status: 'failed', name: file.name, reason: 'Invalid header block' };
  };

  const startBatch = async () => {
    if (!canUpload) return;
    setIsProcessing(true);
    const results = [];
    for (const f of files) {
      // eslint-disable-next-line no-await-in-loop
      const r = await parseDocMock(f);
      results.push(r);
    }
    setBatchResults(results);
    setIsProcessing(false);
    setFiles([]);
  };

  const successCount = batchResults.filter(r => r.status === 'success').length;

  return (
    <div className="admin-import">
      <header className="admin-content-header">
        <h1 className="admin-page-title">Import {type === 'template' ? 'Templates' : type === 'playbook' ? 'Playbooks' : 'Playbook Series'}</h1>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn--secondary" onClick={() => navigate(-1)}>Back</button>
          <button className="admin-btn admin-btn--primary" onClick={downloadTemplate}>Download Doc Template</button>
        </div>
      </header>

      <section className="admin-filters-section">
        <div className="admin-filters">
          <select className="admin-select" value={placement.edition} onChange={(e) => setPlacement({ ...placement, edition: e.target.value, section: '' })}>
            <option value="">Edition/Collection</option>
            <option value="dtm">DTM Edition</option>
            <option value="partner">Partner Edition</option>
          </select>
          <select className="admin-select" value={placement.locationType} onChange={(e) => setPlacement({ ...placement, locationType: e.target.value })}>
            <option value="">Location</option>
            <option value="org">Organization</option>
            <option value="workspace">Workspace</option>
            <option value="brandbot">BrandBot</option>
          </select>
          <select className="admin-select" value={placement.drawer} onChange={(e) => setPlacement({ ...placement, drawer: e.target.value, section: '' })}>
            <option value="">Drawer</option>
            <option value="templates">Templates</option>
            <option value="ellaments">Ella-ments</option>
          </select>
          <select className="admin-select" value={placement.section} onChange={(e) => setPlacement({ ...placement, section: e.target.value })}>
            <option value="">Section</option>
            {/* In real app, populate from API for edition+drawer */}
            <option value="planning">Planning</option>
            <option value="execution">Execution</option>
            <option value="strategy">Strategy</option>
          </select>
        </div>
        {!placement.section && (
          <div className="admin-inline-help">Select Edition/Collection, Location, Drawer and Section before uploading. If no Sections exist, create them first.</div>
        )}
      </section>

      <section className="admin-results-section">
        <div className="admin-import-uploader">
          <input type="file" accept=".doc,.docx,.txt,.md" multiple onChange={handleFiles} />
          <div className="admin-inline-help">Upload up to 10 docs per batch. You can upload another batch after processing completes.</div>
          <button className="admin-btn admin-btn--primary" disabled={!canUpload || isProcessing} onClick={startBatch}>
            {isProcessing ? 'Processing…' : 'Start Import'}
          </button>
        </div>

        {batchResults.length > 0 && (
          <div className="admin-import-results">
            <div className="admin-import-summary">{successCount} succeeded, {batchResults.length - successCount} failed</div>
            <ul className="admin-import-list">
              {batchResults.map((r, idx) => (
                <li key={idx} className={`admin-import-item ${r.status}`}>
                  <span className="name">{r.name}</span>
                  {r.status === 'success' ? (
                    <span className="status">✅ Parsed</span>
                  ) : (
                    <span className="status">❌ {r.reason}</span>
                  )}
                </li>
              ))}
            </ul>
            <div className="admin-import-actions">
              <button className="admin-btn admin-btn--secondary" onClick={() => setBatchResults([])}>Clear Results</button>
              <button className="admin-btn admin-btn--primary" disabled={successCount === 0}>Confirm & Create</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
