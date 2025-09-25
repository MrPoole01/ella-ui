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
            <span>Templates</span>
          </button>
          
          <button 
            className={`admin-nav-item ${activeTab === 'playbooks' ? 'admin-nav-item--active' : ''}`}
            onClick={() => handleNavigation('playbooks', '/admin/playbooks')}
          >
            <i className="fa-solid fa-book"></i>
            <span>Playbooks</span>
          </button>
          
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
            <span>Tags</span>
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
          <Route path="/playbooks" element={<AdminPlaybooks />} />
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
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [tagsFilter, setTagsFilter] = useState('');
  const [partnerEditionFilter, setPartnerEditionFilter] = useState('');
  const [brandBotFilter, setBrandBotFilter] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [currentPage, setCurrentPage] = useState(1);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  
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
      partnerEdition: false,
      brandBot: false
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
      brandBot: true
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
      brandBot: false
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
      brandBot: false
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
      brandBot: false
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
      brandBot: true
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
      brandBot: false
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
      brandBot: false
    }
  ];

  useEffect(() => {
    setTemplates(mockTemplates);
  }, []);

  // Create flow handlers
  const handleCreateClick = () => {
    // Log telemetry event
    logTelemetryEvent('admin_create_clicked');
    
    // Open type selector modal
    setIsTypeSelectorOpen(true);
    
    // Log modal opened event
    logTelemetryEvent('type_selector_opened');
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
    console.log(`${action} template:`, template);
    // Implement actions: view, edit, duplicate, delete
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'strategy': return 'admin-type-strategy';
      case 'execution': return 'admin-type-execution';
      case 'planning': return 'admin-type-planning';
      default: return 'admin-type-default';
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredTemplates.length / 24);
  const startIndex = (currentPage - 1) * 24;
  const paginatedTemplates = filteredTemplates.slice(startIndex, startIndex + 24);

  return (
    <div className="admin-templates">
      {/* Header */}
      <header className="admin-content-header">
        <h1 className="admin-page-title">Templates</h1>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn--primary" onClick={handleCreateClick}>
            Create
          </button>
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
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Type: All</option>
              <option value="strategy">Strategy</option>
              <option value="planning">Planning</option>
              <option value="execution">Execution</option>
            </select>
            
            <select className="admin-select">
              <option>Tags</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>SEO</option>
            </select>
            
            <select className="admin-select">
              <option>Partner Edition</option>
              <option>Partner A</option>
              <option>Partner B</option>
            </select>
            
            <select className="admin-select">
              <option>Brand Bot</option>
              <option>Bot X</option>
              <option>Bot Y</option>
            </select>
          </div>
          
          <div className="admin-sort-controls">
            <span className="admin-sort-label">Sort by:</span>
            <select 
              className="admin-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
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
          {paginatedTemplates.map((template) => (
            <div key={template.id} className="admin-template-card">
              <div className="admin-card-content">
                <div className="admin-card-header">
                  <span className={`admin-type-badge ${getTypeColor(template.type)}`}>
                    {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                  </span>
                  <div className="admin-card-menu">
                    <button className="admin-card-menu-btn">
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
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
                  {template.brandBot && <i className="fa-solid fa-robot admin-brand-bot-icon" title="Brand Bot Enabled"></i>}
                  {template.partnerEdition && <i className="fa-solid fa-handshake admin-partner-icon" title="Partner Edition"></i>}
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
        {filteredTemplates.length === 0 && (
          <div className="admin-empty-state">
            <i className="fa-solid fa-folder-open admin-empty-icon"></i>
            <h3 className="admin-empty-title">No Templates Found</h3>
            <p className="admin-empty-description">
              Your search and filter combination did not return any results. Try adjusting your criteria or create a new template.
            </p>
          </div>
        )}
      </section>

      {/* Pagination */}
      {filteredTemplates.length > 0 && (
        <footer className="admin-pagination-footer">
          <span className="admin-pagination-info">
            Showing {startIndex + 1}-{Math.min(startIndex + 24, filteredTemplates.length)} of {filteredTemplates.length} templates
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
        onError={handleTypeSelectorCancel}
      >
        <TypeSelectorModal
          isOpen={isTypeSelectorOpen}
          onContinue={handleTypeSelectorContinue}
          onCancel={handleTypeSelectorCancel}
          onClose={handleTypeSelectorCancel}
          initialSelectedType={selectedCreateType}
          onImportNavigate={(type) => { setIsTypeSelectorOpen(false); navigate(`/admin/import/${type}`); }}
        />
      </ErrorBoundary>

      {/* Create Drawer */}
      <ErrorBoundary 
        name="CreateDrawer"
        fallbackMessage="There was an error with the creation form. Please try again."
        onError={handleCreateDrawerClose}
      >
        <CreateDrawer
          isOpen={isCreateDrawerOpen}
          onClose={handleCreateDrawerClose}
          onChangeType={handleChangeType}
          type={selectedCreateType}
          draft={currentDraft}
        />
      </ErrorBoundary>
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
const AdminBrandBots = () => <div className="admin-placeholder">Brand Bots - Coming Soon</div>;
const AdminTags = () => <div className="admin-placeholder">Tags - Coming Soon</div>;
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
