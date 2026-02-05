import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MainContent from '../components/layout/MainContent';
import TemplateDrawer from '../components/features/TemplateDrawer';
import DocumentDrawer from '../components/features/DocumentDrawer';
import EllamentDrawer from '../components/features/EllamentDrawer';
import SavedWorkDrawer from '../components/features/SavedWorkDrawer';
import UploadedFilesDrawer from '../components/features/UploadedFilesDrawer';
import ManageTagsDrawer from '../components/features/ManageTagsDrawer';
import PlaybookRunDrawer from '../components/features/PlaybookRunDrawer';
import PlaybookRunnerDrawer from '../components/features/PlaybookRunnerDrawer';
import PlaybookPreviewDrawer from '../components/features/PlaybookPreviewDrawer';
import QuestionnaireModal from '../components/features/QuestionnaireModal';
import BrandBotSetupModal from '../components/features/BrandBotSetupModal';
import BrandBotSetupModalV2 from '../components/features/BrandBotSetupModalV2';
import {
  FolderIcon, 
  PlusIcon, 
  ChevronUpIcon, 
  EllipsisIcon,
  UserIcon,
  ProjectIcon,
  ClockIcon,
  MenuIcon
} from '../components/icons';
import '../styles/Workspace.scss';

const Workspace = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState(false);
  const [externalPrompt, setExternalPrompt] = useState('');
  const [isRecentChatsExpanded, setIsRecentChatsExpanded] = useState(true);
  const [isWorkspaceSlideMenuOpen, setIsWorkspaceSlideMenuOpen] = useState(false);
  const [isEllamentDrawerOpen, setIsEllamentDrawerOpen] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isMobileProjectMenuOpen, setIsMobileProjectMenuOpen] = useState(false);
  const [showProjectView, setShowProjectView] = useState(false);
  const [isMobileProjectMenuEllipsisOpen, setIsMobileProjectMenuEllipsisOpen] = useState(false);
  const [isRenamingProject, setIsRenamingProject] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [isMobileSectionMenuOpen, setIsMobileSectionMenuOpen] = useState(false);
  const [isMobileFilesMenuOpen, setIsMobileFilesMenuOpen] = useState(false);
  const [isMobileSavedWorkMenuOpen, setIsMobileSavedWorkMenuOpen] = useState(false);
  
  // Drawer states
  const [isShowSavedWorkDrawer, setShowSavedWorkDrawer] = useState(false);
  const [isShowUploadedFilesDrawer, setShowUploadedFilesDrawer] = useState(false);
  const [isShowManageTagsDrawer, setShowManageTagsDrawer] = useState(false);

  // Onboarding modal states
  const [showOnboardingQuestionnaire, setShowOnboardingQuestionnaire] = useState(false);
  const [showBrandBotSetup, setShowBrandBotSetup] = useState(false);
  const [showBrandBotBuilder, setShowBrandBotBuilder] = useState(false);

  // Mic menu states for mobile
  const [showMicMenu, setShowMicMenu] = useState(false);
  const [micMenuLevel, setMicMenuLevel] = useState(1); // 1: main, 2: projects, 3: export
  
  const ellipsisMenuRef = useRef(null);
  
  // Placeholder permissions and brandbot scoping
  const canManageCustomTemplates = true;
  const brandBotId = 'default';
  const currentUserId = 'demo-user';

  // Sample data for mobile layout
  const recentChats = [
    {
      id: 1,
      title: 'Strategy Documents',
      tag: 'Ellaments',
      tagColor: '#A5F2B7',
      tagTextColor: '#057B14',
      lastUpdated: '05/13/2025 @ 4:15pm'
    },
    {
      id: 2,
      title: 'Social Media Campaign Planning for Nostal...',
      tag: 'Project A',
      tagColor: '#B5CCFF',
      tagTextColor: '#1757C1',
      lastUpdated: '05/13/2025 @ 4:15pm'
    },
    {
      id: 3,
      title: 'Nurture Email Sequence Development for T...',
      tag: 'Project A',
      tagColor: '#B5CCFF',
      tagTextColor: '#1757C1',
      lastUpdated: '05/13/2025 @ 4:15pm'
    },
    {
      id: 4,
      title: 'Social Media Post Strategy and Content De...',
      tag: 'Project A',
      tagColor: '#B5CCFF',
      tagTextColor: '#1757C1',
      lastUpdated: '05/13/2025 @ 4:15pm'
    }
  ];

  const handleNewChat = () => {
    setSelectedProject(null);
  };

  const handleOpenTemplateDrawer = () => {
    setIsTemplateDrawerOpen(true);
  };

  const handleCloseTemplateDrawer = () => {
    setIsTemplateDrawerOpen(false);
  };

  const [isDocumentDrawerOpen, setIsDocumentDrawerOpen] = React.useState(false);
  const [documentDrawerData, setDocumentDrawerData] = React.useState(null);
  const [isPlaybookPreviewOpen, setIsPlaybookPreviewOpen] = React.useState(false);
  const [playbookPreviewData, setPlaybookPreviewData] = React.useState(null);
  const [isPlaybookRunDrawerOpen, setIsPlaybookRunDrawerOpen] = React.useState(false);
  const [playbookRunData, setPlaybookRunData] = React.useState(null);
  const [isPlaybookRunnerDrawerOpen, setIsPlaybookRunnerDrawerOpen] = React.useState(false);
  const [playbookRunnerData, setPlaybookRunnerData] = React.useState(null);

  const handleTemplateSelected = (payload) => {
    // Backward compatibility: if a string is passed, treat as prompt
    if (typeof payload === 'string') {
      setExternalPrompt(payload || '');
      setIsTemplateDrawerOpen(false);
      return;
    }

    // If payload instructs to open document drawer
    if (payload && (payload.kind === 'open_document' || payload.kind === 'open_playbook_preview')) {
      // Open Playbook Preview drawer instead of the legacy document drawer
      const playbook = {
        id: 'pb1',
        title: payload?.document?.title || 'Playbook',
        preview: payload?.document?.preview || 'A brief preview of this playbook',
        description: 'What it does and what\'s inside.',
        estimatedTime: '6–12 min',
        tags: ['Planning', 'Strategy'],
        plays: (payload?.playbookCardTitles || []).map((t, i) => ({ id: `p${i+1}`, name: t, blurb: `About ${t}` }))
      };
      setPlaybookPreviewData({
        documentContext: {
          project: payload?.document?.project,
          title: payload?.document?.title
        },
        playbook,
        isSpecialEdition: payload?.isSpecialEdition || false,
        templateData: payload?.templateData || null
      });
      setIsPlaybookPreviewOpen(true);
      setIsTemplateDrawerOpen(false);
      return;
    }

    // Default behavior
    setExternalPrompt('');
    setIsTemplateDrawerOpen(false);
  };

  const handleRunPlaybook = (documentData) => {
    setIsDocumentDrawerOpen(false);
    setPlaybookRunData(documentData);
    setIsPlaybookRunDrawerOpen(true);
  };

  const handleStartFromPreview = (mode, context) => {
    setIsPlaybookPreviewOpen(false);
    const runPayload = {
      playbook: playbookPreviewData?.playbook,
      inputPanelData: context
    };
    if (mode === 'auto-run') {
      setPlaybookRunnerData(runPayload);
      setIsPlaybookRunnerDrawerOpen(true);
    } else {
      setPlaybookRunData(runPayload);
      setIsPlaybookRunDrawerOpen(true);
    }
  };

  const handleClosePlaybookRunDrawer = () => {
    setIsPlaybookRunDrawerOpen(false);
    setPlaybookRunData(null);
  };

  const handleClosePlaybookRunnerDrawer = () => {
    setIsPlaybookRunnerDrawerOpen(false);
    setPlaybookRunnerData(null);
  };

  const handleWorkspaceSlideMenuToggle = () => {
    setIsWorkspaceSlideMenuOpen(!isWorkspaceSlideMenuOpen);
  };

  const handleWorkspaceSlideMenuClose = () => {
    setIsWorkspaceSlideMenuOpen(false);
  };

  const handleOpenEllamentDrawer = () => {
    setIsEllamentDrawerOpen(true);
  };

  const handleCloseEllamentDrawer = () => {
    setIsEllamentDrawerOpen(false);
  };

  const handleOpenProjectMenu = () => {
    setIsProjectMenuOpen(true);
  };

  const handleCloseProjectMenu = () => {
    setIsProjectMenuOpen(false);
  };

  const handleOpenMobileProjectMenu = () => {
    setIsMobileProjectMenuOpen(true);
  };

  const handleCloseMobileProjectMenu = () => {
    setIsMobileProjectMenuOpen(false);
  };

  const handleMobileProjectMenuEllipsisToggle = () => {
    setIsMobileProjectMenuEllipsisOpen(!isMobileProjectMenuEllipsisOpen);
  };

  const handleStartRename = () => {
    setIsRenamingProject(true);
    setRenameValue(selectedProject?.name || '');
    setIsMobileProjectMenuEllipsisOpen(false);
  };

  const handleRenameSubmit = () => {
    if (renameValue.trim()) {
      // Update the selected project name
      setSelectedProject(prev => ({
        ...prev,
        name: renameValue.trim()
      }));
    }
    setIsRenamingProject(false);
    setRenameValue('');
  };

  const handleRenameCancel = () => {
    setIsRenamingProject(false);
    setRenameValue('');
  };

  const handleRenameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      handleRenameCancel();
    }
  };

  const handleCreateNewProject = () => {
    // Create a new project with "Untitled Project" as the name
    const newProject = {
      id: Date.now(), // Simple ID generation
      name: 'Untitled Project',
      description: 'A new project',
      workspace: 'Workspace 1',
      updatedDate: new Date().toLocaleDateString()
    };

    // Set the new project as selected
    setSelectedProject(newProject);
    
    // Show the project view
    setShowProjectView(true);
  };

  const handleResetToStartingView = () => {
    // Reset to starting view
    setShowProjectView(false);
    setSelectedProject(null);
  };

  // Mobile menu handlers for project sections
  const handleMobileSectionMenuOpen = () => {
    setIsMobileSectionMenuOpen(true);
    setIsMobileProjectMenuOpen(false);
  };

  const handleMobileFilesMenuOpen = () => {
    setIsMobileFilesMenuOpen(true);
    setIsMobileProjectMenuOpen(false);
  };

  const handleMobileSavedWorkMenuOpen = () => {
    setIsMobileSavedWorkMenuOpen(true);
    setIsMobileProjectMenuOpen(false);
  };

  const handleMobileSectionMenuClose = () => {
    setIsMobileSectionMenuOpen(false);
  };

  const handleMobileFilesMenuClose = () => {
    setIsMobileFilesMenuOpen(false);
  };

  const handleMobileSavedWorkMenuClose = () => {
    setIsMobileSavedWorkMenuOpen(false);
  };

  // Mic menu handlers
  const handleMicClick = () => {
    setShowMicMenu(!showMicMenu);
    setMicMenuLevel(1);
  };

  const handleMicMenuBack = () => {
    if (micMenuLevel > 1) {
      setMicMenuLevel(micMenuLevel - 1);
    } else {
      setShowMicMenu(false);
    }
  };

  const handleProjectsClick = () => {
    setMicMenuLevel(2);
  };

  const handleSaveAsProjectClick = () => {
    setMicMenuLevel(3);
  };


  // Click outside handler for ellipsis menu and mic menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ellipsisMenuRef.current && !ellipsisMenuRef.current.contains(event.target)) {
        setIsMobileProjectMenuEllipsisOpen(false);
      }
      
      // Close mic menu when clicking outside
      if (!event.target.closest('.workspace__mobile-mic-menu') && 
          !event.target.closest('.workspace__mobile-input-btn')) {
        setShowMicMenu(false);
      }
    };

    if (isMobileProjectMenuEllipsisOpen || showMicMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileProjectMenuEllipsisOpen, showMicMenu]);

  const handleRunBrandBotPlaybook = (mode, data) => {
    // Create a Brand Bot playbook object and open the run drawer directly
    const brandBotPlaybook = {
      id: 'brandbot-1',
      title: 'Brand Bot Playbook',
      description: 'Build or refine your brand through guided plays',
      plays: [
        { id: 'company', name: 'Company', description: 'Define your company' },
        { id: 'customers', name: 'Customers', description: 'Understand your customers' },
        { id: 'brand', name: 'Brand', description: 'Build your brand' }
      ]
    };
    setPlaybookRunData({
      playbook: brandBotPlaybook,
      inputPanelData: {
        workspace: { id: 'ws-current', name: 'Workspace' },
        project: { id: 'proj-current', name: 'Brand Bot' },
        audience: { type: 'all' },
        specialInstructions: '',
        fileIds: [],
        brandBotMode: mode,
        brandBotData: data
      }
    });
    setIsPlaybookRunDrawerOpen(true);
    setIsEllamentDrawerOpen(false);
  };

  // Onboarding handlers
  const handleQuestionnaireComplete = (data) => {
    // Save only the fields we collect (userType and role)
    localStorage.setItem('ella-user-type', data.userType || '');
    localStorage.setItem('ella-user-role', data.role || '');
    
    // Store selected path and mode for BrandBot setup
    if (data.selectedPath) {
      localStorage.setItem('ella-brandbot-selected-path', data.selectedPath);
    }
    if (data.mode) {
      localStorage.setItem('ella-brandbot-mode', data.mode);
    }
    
    localStorage.setItem('ella-onboarding-complete', 'true');

    // Clear the new user flag now that questionnaire is complete
    localStorage.removeItem('ella-is-new-user');

    setShowOnboardingQuestionnaire(false);

    // Check flow flag to determine which modal to open
    const flow = localStorage.getItem('ella-brandbot-flow') || 'old';
    
    if (flow === 'new') {
      // Open new Brand Bot Builder modal
      localStorage.setItem('ella-show-brandbot-builder', 'true');
      setTimeout(() => {
        setShowBrandBotBuilder(true);
      }, 100);
    } else {
      // Open old BrandBot setup modal
      localStorage.setItem('ella-show-brandbot-setup', 'true');
      setTimeout(() => {
        setShowBrandBotSetup(true);
      }, 100);
    }
  };

  const handleBrandBotSetupComplete = (data) => {
    console.log('BrandBot setup completed with data:', data);
    localStorage.setItem('ella-brandbot-setup-complete', 'true');
    setShowBrandBotSetup(false);
    // Stay in workspace - no navigation needed
  };

  const handleBrandBotSetupClose = () => {
    setShowBrandBotSetup(false);
    // Stay in workspace - no navigation needed
  };

  const handleBrandBotBuilderComplete = (data) => {
    console.log('Brand Bot Builder completed with data:', data);
    localStorage.setItem('ella-brandbot-builder-complete', 'true');
    setShowBrandBotBuilder(false);
    // Stay in workspace - no navigation needed
  };

  const handleBrandBotBuilderClose = () => {
    setShowBrandBotBuilder(false);
    // Stay in workspace - no navigation needed
  };

  // Listen for brandbot:run-playbook event
  useEffect(() => {
    const handleBrandBotRunPlaybook = (event) => {
      handleRunBrandBotPlaybook(event.detail.mode, event.detail);
    };
    
    window.addEventListener('brandbot:run-playbook', handleBrandBotRunPlaybook);
    return () => window.removeEventListener('brandbot:run-playbook', handleBrandBotRunPlaybook);
  }, []);

  // Initialize onboarding for new users and check for BrandBot setup flag
  useEffect(() => {
    // Check if user is new and hasn't completed onboarding
    const isNewUser = localStorage.getItem('ella-is-new-user') === 'true';
    let onboardingComplete = localStorage.getItem('ella-onboarding-complete') === 'true';

    if (isNewUser && onboardingComplete) {
      // Clear stale completion flag for new accounts in this browser
      localStorage.removeItem('ella-onboarding-complete');
      onboardingComplete = false;
    }

    console.log('Workspace mounted - Onboarding check:', {
      isNewUser,
      onboardingComplete,
      willShowModal: isNewUser && !onboardingComplete,
      currentState: showOnboardingQuestionnaire
    });

    if (isNewUser && !onboardingComplete) {
      // Don't remove flag here - will be removed when questionnaire completes
      // This prevents React StrictMode double-execution issues
      console.log('Setting showOnboardingQuestionnaire to true');
      setShowOnboardingQuestionnaire(true);
    }
    
    // Check for flag to show BrandBot setup modal (set after questionnaire completion)
    const showBrandBotFlag = localStorage.getItem('ella-show-brandbot-setup') === 'true';
    const showBrandBotBuilderFlag = localStorage.getItem('ella-show-brandbot-builder') === 'true';
    const flow = localStorage.getItem('ella-brandbot-flow') || 'old';
    
    if (showBrandBotBuilderFlag || (showBrandBotFlag && flow === 'new')) {
      localStorage.removeItem('ella-show-brandbot-builder');
      localStorage.removeItem('ella-show-brandbot-setup');
      setShowBrandBotBuilder(true);
    } else if (showBrandBotFlag) {
      localStorage.removeItem('ella-show-brandbot-setup');
      setShowBrandBotSetup(true);
    }
  }, []); // Empty deps - only run on mount

  // Listen for manual onboarding trigger from profile dropdown
  useEffect(() => {
    const handleShowOnboarding = () => {
      setShowOnboardingQuestionnaire(true);
    };

    window.addEventListener('workspace:show-onboarding', handleShowOnboarding);
    return () => window.removeEventListener('workspace:show-onboarding', handleShowOnboarding);
  }, []);

  return (
    <div className="workspace clips-content">
      {/* Header */}
      <Header 
        onResetToStartingView={handleResetToStartingView}
        onOpenProjectMenu={handleOpenProjectMenu}
      />
      
      {/* Mobile Layout */}
      <div className="workspace__mobile-layout">
        {/* Mobile Workspace Header */}
        <div className="workspace__mobile-header">
          <div 
            className="workspace__mobile-workspace-info"
            onClick={() => setShowProjectView(false)}
            style={{ cursor: showProjectView ? 'pointer' : 'default' }}
          >
            <FolderIcon />
            <span className="workspace__mobile-workspace-name">Workspace 1</span>
          </div>
          <button className="workspace__mobile-menu-btn" onClick={handleWorkspaceSlideMenuToggle}>
            <EllipsisIcon />
          </button>
        </div>

        {/* Mobile Content */}
        <div className="workspace__mobile-content">
          {/* Show project view when a project is selected */}
          {showProjectView ? (
            <>
              {/* Ellaments Card - Always visible in project view */}
              <div className="workspace__mobile-ellaments-container">
              <button className="workspace__mobile-ellaments-btn" onClick={handleOpenEllamentDrawer}>
                <div className="workspace__mobile-ellaments-info">
                  <span className="workspace__mobile-ellaments-title">Ella-ments</span>
                </div>
                <div className="MuiBox-root css-mjha5m">
                  <span role="progressbar" aria-valuenow="50" className="MuiCircularProgress-root MuiCircularProgress-determinate MuiCircularProgress-colorPrimary MuiCircularProgress-variantSoft MuiCircularProgress-sizeMd css-rocgce-JoyCircularProgress-root" style={{"--CircularProgress-percent": 50}}>
                    <svg className="MuiCircularProgress-svg css-qw6zo9-JoyCircularProgress-svg">
                      <circle className="MuiCircularProgress-track css-zitgxn-JoyCircularProgress-track"></circle>
                      <circle className="MuiCircularProgress-progress css-1hs7rf2-JoyCircularProgress-progress"></circle>
                    </svg>
                    50%
                  </span>
                </div>
              </button>
            
            <button className="workspace__mobile-new-chat-btn" onClick={handleCreateNewProject}>
              <PlusIcon />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat Interface Project Header - Outside content for mobile positioning */}
          <div className="chat-interface__project-header">
            <div className="chat-interface__project-info">
              <h2 className="chat-interface__project-title">
                {selectedProject?.name || 'Project'}
              </h2>
              <div className="chat-interface__project-breadcrumb">
                <span className="chat-interface__project-breadcrumb-item">Projects</span>
                <svg className="chat-interface__project-breadcrumb-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span className="chat-interface__project-breadcrumb-item">{selectedProject?.name || 'Untitled...'}</span>
              </div>
            </div>
            <button className="chat-interface__project-add" onClick={handleOpenMobileProjectMenu}>
              <span className="chat-interface__project-add-desktop">
                <PlusIcon />
              </span>
              <span className="chat-interface__project-add-mobile">
                Project Menu
              </span>
            </button>
          </div>

          {/* Chat Interface Project Content */}
          <div className="chat-interface__project-content">
            <div className="chat-interface__project-chat">
              <div className="chat-interface__project-message">
                <div className="chat-interface__project-avatar">
                  <span>Ella</span>
                </div>
                <div className="chat-interface__project-message-content">
                  <div className="chat-interface__project-message-header">
                    <span className="chat-interface__project-sender">Ella:</span>
                    <span className="chat-interface__project-timestamp">5/19/2025 09:30</span>
                  </div>
                  <div className="chat-interface__project-message-text">
                    <p>
                      <span>
                        {selectedProject?.name === 'Untitled Project' 
                          ? 'How can I help you?' 
                          : 'Absolutely, I\'m ready to help craft a high-performing nurture email sequence for your campaign. To get started, I\'ll need to clarify a few details to ensure your emails are precisely tailored and impactful:'
                        }
                      </span>
                    </p>
                    {selectedProject?.name !== 'Untitled Project' && (
                      <>
                        <p>
                          <span style={{ fontWeight: 600 }}>Key Info Needed</span>
                        </p>
                        <p>
                          <span style={{ fontWeight: 600 }}>Ideal Customer Profile (ICP):</span>
                        </p>
                        <p>
                          <span>Who is your target audience for this sequence? (e.g., Industry, role/title, company size, pain points)</span>
                        </p>
                        <p>
                          <span style={{ fontWeight: 600 }}>Journey Stages:</span>
                        </p>
                        <p>
                          <span>From which stage of the customer journey are you starting? (e.g., Problem-Aware, Solution-Aware)</span>
                          <br />
                          <span>To which stage do you want to guide them? (e.g., Product-Aware, Ready to Purchase)</span>
                        </p>
                        <p>
                          <span style={{ fontWeight: 600 }}>Product/Service:</span>
                        </p>
                        <p>
                          <span>What product or service are you nurturing them toward? (A brief summary or product name will help.)</span>
                        </p>
                        <p>
                          <span style={{ fontWeight: 600 }}>Special Offers or CTAs:</span>
                        </p>
                        <p>
                          <span>Any specific offers (e.g., free trial, demo, white paper) or CTAs you want to include?</span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Default view - Ellaments Card */}
          <div className="workspace__mobile-ellaments-container">
              <button className="workspace__mobile-ellaments-btn" onClick={handleOpenEllamentDrawer}>
                <div className="workspace__mobile-ellaments-info">
                  <span className="workspace__mobile-ellaments-title">Ella-ments</span>
                </div>
                <div className="MuiBox-root css-mjha5m">
                  <span role="progressbar" aria-valuenow="50" className="MuiCircularProgress-root MuiCircularProgress-determinate MuiCircularProgress-colorPrimary MuiCircularProgress-variantSoft MuiCircularProgress-sizeMd css-rocgce-JoyCircularProgress-root" style={{"--CircularProgress-percent": 50}}>
                    <svg className="MuiCircularProgress-svg css-qw6zo9-JoyCircularProgress-svg">
                      <circle className="MuiCircularProgress-track css-zitgxn-JoyCircularProgress-track"></circle>
                      <circle className="MuiCircularProgress-progress css-1hs7rf2-JoyCircularProgress-progress"></circle>
                    </svg>
                    50%
                  </span>
                </div>
              </button>
            
            <button className="workspace__mobile-new-chat-btn" onClick={handleCreateNewProject}>
              <PlusIcon />
              <span>New Chat</span>
            </button>
          </div>

          {/* Recent Chats Section */}
          <div className="workspace__mobile-section">
            <div className="workspace__mobile-section-header">
              <div className="workspace__mobile-section-title">
                <ClockIcon />
                <span>Recent Chats</span>
              </div>
              <button 
                className="workspace__mobile-section-toggle"
                onClick={() => setIsRecentChatsExpanded(!isRecentChatsExpanded)}
              >
                <ChevronUpIcon className={isRecentChatsExpanded ? 'expanded' : ''} />
              </button>
            </div>

            {isRecentChatsExpanded && (
              <div className="workspace__mobile-section-content">
                {recentChats.map(chat => (
                  <div key={chat.id} className="workspace__mobile-chat-item">
                    <div className="workspace__mobile-chat-content">
                      <div className="workspace__mobile-chat-header">
                        <span className="workspace__mobile-chat-title">{chat.title}</span>
                        <button className="workspace__mobile-chat-menu">
                          <EllipsisIcon />
                        </button>
                      </div>
                      <div className="workspace__mobile-chat-meta">
                        <span className="workspace__mobile-chat-tag">
                          {chat.tag}
                        </span>
                        <span className="workspace__mobile-chat-date">
                          Updated: {chat.lastUpdated}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="workspace__mobile-section">
            <div className="workspace__mobile-section-header">
              <div className="workspace__mobile-section-title">
                <ProjectIcon />
                <span>Projects</span>
              </div>
                <button className="workspace__mobile-section-action" onClick={handleOpenProjectMenu}>
                  <PlusIcon />
                  <span>create a project</span>
                </button>
            </div>
          </div>
        </>
      )}
        </div>

        {/* Mobile Chat Input */}
        <div className="workspace__mobile-chat-input">
          <div className="workspace__mobile-input-area">
            {/* Input Field */}
            <div className="workspace__mobile-input-container">
              <textarea
                className="workspace__mobile-input-field"
                placeholder="Type your message..."
                rows={1}
              />
            </div>
            
            {/* Input Controls */}
            <div className="workspace__mobile-controls">
              <div className="workspace__mobile-left-controls">
                <button className="workspace__mobile-input-btn" onClick={handleMicClick}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <g style={{stroke: 'none', strokeWidth: 0, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'currentColor', fillRule: 'nonzero', opacity: 1}}>
                      <rect x="1" y="1" width="18" height="18" rx="3" ry="3" style={{fill: 'none', stroke: 'currentColor', strokeWidth: 0.5}}/>
                      <path d="M10 5 C10.5523 5 11 5.4477 11 6 L11 14 C11 14.5523 10.5523 15 10 15 C9.4477 15 9 14.5523 9 14 L9 6 C9 5.4477 9.4477 5 10 5 Z" style={{fill: 'currentColor'}}/>
                      <path d="M5 10 C5 9.4477 5.4477 9 6 9 L14 9 C14.5523 9 15 9.4477 15 10 C15 10.5523 14.5523 11 14 11 L6 11 C5.4477 11 5 10.5523 5 10 Z" style={{fill: 'currentColor'}}/>
                    </g>
                  </svg>
                </button>
                <button className="workspace__mobile-input-btn" onClick={handleOpenTemplateDrawer}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <defs>
                      <clipPath id="clipPathTemplateMobile">
                        <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                      </clipPath>
                    </defs>
                    <g clipPath="url(#clipPathTemplateMobile)">
                      <path d="M7.93247 12.1847L1.19685 12.1847C0.536876 12.1847 0 11.6431 0 10.9769L0 1.20778C0 0.541778 0.536876 0 1.19685 0L7.93247 0C8.59245 0 9.12932 0.541778 9.12932 1.20778L9.12932 10.9771C9.12932 11.6431 8.59245 12.1847 7.93247 12.1847ZM1.19685 0.888889C1.02266 0.888889 0.880848 1.032 0.880848 1.20778L0.880848 10.9771C0.880848 11.1529 1.02266 11.296 1.19685 11.296L7.93247 11.296C8.10666 11.296 8.24848 11.1529 8.24848 10.9771L8.24848 1.20778C8.24848 1.032 8.10666 0.888889 7.93247 0.888889L1.19685 0.888889Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)" fill="currentColor"/>
                      <path d="M7.93247 5.83467L1.19685 5.83467C0.536876 5.83467 0 5.29311 0 4.62689L0 1.20778C0 0.541778 0.536876 0 1.19685 0L7.93247 0C8.59245 0 9.12932 0.541778 9.12932 1.20778L9.12932 4.62711C9.12932 5.29311 8.59245 5.83467 7.93247 5.83467ZM1.19685 0.88889C1.02266 0.88889 0.880848 1.032 0.880848 1.20778L0.880848 4.62711C0.880848 4.80267 1.02266 4.94578 1.19685 4.94578L7.93247 4.94578C8.10666 4.94578 8.24848 4.80267 8.24848 4.62689L8.24848 1.20778C8.24848 1.032 8.10666 0.88889 7.93247 0.88889L1.19685 0.88889Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 14.1653)" fill="currentColor"/>
                      <path d="M7.93247 12.1844L1.19685 12.1844C0.536877 12.1844 0 11.6427 0 10.9767L0 1.20756C0 0.541556 0.536877 0 1.19685 0L7.93269 0C8.59267 0 9.12954 0.541778 9.12954 1.20756L9.12954 10.9769C9.12932 11.6429 8.59267 12.1844 7.93247 12.1844ZM1.19685 0.888667C1.02266 0.888667 0.880848 1.03178 0.880848 1.20733L0.880848 10.9767C0.880848 11.1524 1.02266 11.2956 1.19685 11.2956L7.93269 11.2956C8.10666 11.2956 8.24848 11.1524 8.24848 10.9767L8.24848 1.20756C8.24848 1.03178 8.10666 0.888889 7.93247 0.888889L1.19685 0.888667Z" fillRule="nonzero" transform="matrix(1 0 0 1 10.6892 7.81558)" fill="currentColor"/>
                      <path d="M7.93247 5.83467L1.19685 5.83467C0.536877 5.83467 0 5.29289 0 4.62689L0 1.20778C0 0.541778 0.536656 0 1.19685 0L7.93269 0C8.59267 0 9.12932 0.541778 9.12932 1.20778L9.12932 4.62711C9.12932 5.29289 8.59267 5.83467 7.93247 5.83467ZM1.19685 0.888889C1.02266 0.888889 0.880848 1.032 0.880848 1.20778L0.880848 4.62711C0.880848 4.80289 1.02266 4.946 1.19685 4.946L7.93269 4.946C8.10688 4.946 8.2487 4.80289 8.2487 4.62711L8.2487 1.20778C8.24848 1.032 8.10666 0.888889 7.93247 0.888889L1.19685 0.888889Z" fillRule="nonzero" transform="matrix(1 0 0 1 10.6892 0)" fill="currentColor"/>
                    </g>
                  </svg>
                </button>
              </div>
              
              <div className="workspace__mobile-right-controls">
                <button className="workspace__mobile-input-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C13.1046 2 14 2.89543 14 4V12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12V4C10 2.89543 10.8954 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M19 10V12C19 16.4183 15.4183 20 11 20H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M5 10V12C5 16.4183 8.58172 20 13 20H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <button className="workspace__mobile-send-btn">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M17.7818 0.607503C17.782 0.596637 17.782 0.586165 17.7818 0.575298C17.7811 0.548823 17.7785 0.522742 17.7743 0.496662C17.773 0.488561 17.7726 0.480658 17.7708 0.472558C17.7641 0.439957 17.7546 0.407949 17.7423 0.37693C17.7388 0.367841 17.7342 0.359345 17.7303 0.350454C17.7198 0.326942 17.708 0.304221 17.6943 0.282092C17.6888 0.273004 17.6833 0.263915 17.6771 0.254826C17.657 0.225782 17.6352 0.197924 17.6098 0.172436C17.5841 0.146751 17.5558 0.12482 17.5266 0.104469C17.5183 0.0987397 17.5098 0.093405 17.5011 0.088268C17.4778 0.0738448 17.4539 0.0613974 17.4292 0.0505306C17.4215 0.0471718 17.4142 0.0432202 17.4062 0.040059C17.3744 0.0276115 17.3416 0.0177326 17.3081 0.011015C17.3019 0.0098295 17.2956 0.00943434 17.2895 0.00824887C17.2614 0.003507 17.2332 0.000740905 17.2047 0.00014817C17.1952 -4.93926e-05 17.1859 -4.93926e-05 17.1767 0.000148186C17.1488 0.00074092 17.1209 0.00350701 17.0931 0.00824889C17.0862 0.00943436 17.0795 0.00982952 17.0725 0.0112126C17.0421 0.0173375 17.0121 0.0256358 16.9824 0.0367001L0.384498 6.26496C0.16242 6.34833 0.0114701 6.55599 0.00060336 6.79308C-0.0100659 7.02998 0.121521 7.25067 0.335103 7.35381L7.14266 10.6391L10.4278 17.4467C10.5272 17.6524 10.7352 17.782 10.9618 17.782C10.9709 17.782 10.9798 17.7818 10.9889 17.7814C11.2258 17.7705 11.4337 17.6196 11.517 17.3975L17.7455 0.799747C17.7566 0.770308 17.7647 0.740473 17.7708 0.710244C17.7724 0.702143 17.773 0.69424 17.7741 0.686139C17.7785 0.660059 17.7811 0.633781 17.7818 0.607503ZM14.8354 2.1085L7.4655 9.47837L2.09809 6.88831L14.8354 2.1085ZM10.8937 15.6839L8.30363 10.3167L15.6737 2.94663L10.8937 15.6839Z" fill="var(--theme-bg-primary)"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Mic Menu */}
        {showMicMenu && (
          <div className="workspace__mobile-mic-menu">
            {/* Handle */}
            <div className="workspace__mobile-mic-menu-handle" onClick={() => setShowMicMenu(false)}></div>
            
            {micMenuLevel === 1 && (
              <div className="workspace__mobile-mic-menu-main">
                <div className="workspace__mobile-mic-menu-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1.5L9 16.5M1.5 9L16.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Upload a file</span>
                </div>
                <div className="workspace__mobile-mic-menu-item">
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                    <circle cx="9.5" cy="9.5" r="8.5" stroke="currentColor" strokeWidth="1"/>
                    <path d="M6.5 9.5L8.5 11.5L12.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Crawl a website</span>
                </div>
                <div className="workspace__mobile-mic-menu-item">
                  <svg width="18.94" height="15.56" viewBox="0 0 19 16" fill="none">
                    <rect x="1" y="1" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1"/>
                    <path d="M1 4L19 4" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  <span>Take a screenshot</span>
                </div>
                <div className="workspace__mobile-mic-menu-item">
                  <svg width="18.92" height="19.59" viewBox="0 0 19 20" fill="none">
                    <path d="M10 1L17 8L10 15M17 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Add a link/URL</span>
                </div>
                <div className="workspace__mobile-mic-menu-item">
                  <svg width="15.32" height="18.19" viewBox="0 0 15 18" fill="none">
                    <path d="M1 1L1 17L14 9L1 1Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Download as a PDF</span>
                </div>
                <div className="workspace__mobile-mic-menu-item workspace__mobile-mic-menu-item--expandable" onClick={() => setMicMenuLevel(3)}>
                  <div className="workspace__mobile-mic-menu-item-content">
                    <svg width="17.78" height="17.78" viewBox="0 0 18 18" fill="none">
                      <path d="M9 1L12 4L9 7M12 4L1 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Export to...</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="workspace__mobile-mic-menu-divider"></div>
                <div className="workspace__mobile-mic-menu-item workspace__mobile-mic-menu-item--expandable" onClick={handleProjectsClick}>
                  <div className="workspace__mobile-mic-menu-item-content">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1"/>
                      <path d="M6 6L12 6M6 9L12 9M6 12L9 12" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                    <span>Projects</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M7 6L11 10L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            )}

            {micMenuLevel === 2 && (
              <div className="workspace__mobile-mic-menu-projects">
                <div className="workspace__mobile-mic-menu-header">
                  <button className="workspace__mobile-mic-menu-back" onClick={handleMicMenuBack}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M11 6L7 10L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="workspace__mobile-mic-menu-search">
                    <input type="text" placeholder="Search projects" />
                  </div>
                </div>
                <div className="workspace__mobile-mic-menu-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1"/>
                    <path d="M6 6L12 6M6 9L12 9M6 12L9 12" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  <span>Project 1</span>
                </div>
                <div className="workspace__mobile-mic-menu-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1"/>
                    <path d="M6 6L12 6M6 9L12 9M6 12L9 12" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  <span>Project 2</span>
                </div>
                <div className="workspace__mobile-mic-menu-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1"/>
                    <path d="M6 6L12 6M6 9L12 9M6 12L9 12" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  <span>Project 3</span>
                </div>
                <div className="workspace__mobile-mic-menu-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1"/>
                    <path d="M6 6L12 6M6 9L12 9M6 12L9 12" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  <span>Project 4</span>
                </div>
                <div className="workspace__mobile-mic-menu-divider"></div>
                <div className="workspace__mobile-mic-menu-item" onClick={handleSaveAsProjectClick}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1L9 17M1 9L17 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Save as a project</span>
                </div>
              </div>
            )}

            {micMenuLevel === 3 && (
              <div className="workspace__mobile-mic-menu-export">
                <div className="workspace__mobile-mic-menu-header">
                  <button className="workspace__mobile-mic-menu-back" onClick={handleMicMenuBack}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M11 6L7 10L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <span>Export Options</span>
                </div>
                <div className="workspace__mobile-mic-menu-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1"/>
                    <path d="M6 6L12 6M6 9L12 9M6 12L9 12" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  <span>Export as PDF</span>
                </div>
                <div className="workspace__mobile-mic-menu-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1"/>
                    <path d="M6 6L12 6M6 9L12 9M6 12L9 12" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  <span>Export as Word</span>
                </div>
                <div className="workspace__mobile-mic-menu-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1"/>
                    <path d="M6 6L12 6M6 9L12 9M6 12L9 12" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  <span>Export as Text</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Workspace Slide Menu for Mobile */}
        {isWorkspaceSlideMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="workspace-menu-backdrop"
              onClick={handleWorkspaceSlideMenuClose}
            />
            
            {/* Slide-Out Panel */}
            <div className={`workspace-slide-menu ${isWorkspaceSlideMenuOpen ? 'workspace-slide-menu--open' : ''}`}>
              {/* Close Button */}
              <div className="workspace-menu__close-section">
                <button 
                  className="workspace-menu__close"
                  onClick={handleWorkspaceSlideMenuClose}
                  aria-label="Close workspace menu"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="workspace-menu__header">
                <div className="workspace-menu__title">Workspace 1</div>
                <div className="workspace-menu__subtitle">Last updated 2 hours ago</div>
              </div>
              
              <div className="workspace-menu__actions">
                <button 
                  className="workspace-menu__action-btn"
                  onClick={() => {
                    setShowSavedWorkDrawer(true);
                    setIsWorkspaceSlideMenuOpen(false);
                  }}
                >
                  All Saved Work
                </button>
                <button 
                  className="workspace-menu__action-btn"
                  onClick={() => {
                    setIsTemplateDrawerOpen(true);
                    setIsWorkspaceSlideMenuOpen(false);
                  }}
                >
                  Playbook Library
                </button>
                <button 
                  className="workspace-menu__action-btn"
                  onClick={() => {
                    setShowUploadedFilesDrawer(true);
                    setIsWorkspaceSlideMenuOpen(false);
                  }}
                >
                  Workspace Uploads
                </button>
                <button 
                  className="workspace-menu__action-btn"
                  onClick={() => {
                    setShowManageTagsDrawer(true);
                    setIsWorkspaceSlideMenuOpen(false);
                  }}
                >
                  Tag Manager
                </button>
              </div>

              <div className="workspace-menu__options">
                <div className="workspace-menu__option" onClick={() => console.log('Manage Workspace')}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM8 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM8 11a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" fill="#6B7280"/>
                  </svg>
                  <span>Manage Workspace</span>
                </div>

                <div className="workspace-menu__option" onClick={() => console.log('Rename Workspace')}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12.854 3.146a.5.5 0 0 1 0 .708L8.207 8.5l4.647 4.646a.5.5 0 0 1-.708.708L7.5 9.207l-4.646 4.647a.5.5 0 0 1-.708-.708L6.793 8.5 2.146 3.854a.5.5 0 1 1 .708-.708L7.5 7.793l4.646-4.647a.5.5 0 0 1 .708 0z" fill="#6B7280"/>
                  </svg>
                  <span>Rename</span>
                </div>

                <div className="workspace-menu__option" onClick={() => console.log('Share Workspace')}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM4 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="#6B7280"/>
                  </svg>
                  <span>Share</span>
                </div>

                <div className="workspace-menu__option" onClick={() => console.log('Un-Share Workspace')}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM4 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="#6B7280"/>
                  </svg>
                  <span>Un-Share</span>
                </div>

                <div className="workspace-menu__option" onClick={() => console.log('Transfer Workspace')}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2l4 4h-3v6H7V6H4l4-4z" fill="#6B7280"/>
                  </svg>
                  <span>Transfer</span>
                </div>

                <div className="workspace-menu__option" onClick={() => console.log('Download Documents')}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 12l4-4h-3V2H7v6H4l4 4zM2 14h12v2H2v-2z" fill="#6B7280"/>
                  </svg>
                  <span>Download Documents</span>
                </div>

                <div className="workspace-menu__option" onClick={() => console.log('Archive Workspace')}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 3h12v2H2V3zm1 3h10v8H3V6zm3 2v4h4V8H6z" fill="#6B7280"/>
                  </svg>
                  <span>Archive</span>
                </div>

                <div className="workspace-menu__option" onClick={() => console.log('Delete Workspace')}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3V2h4v1h3v1H3V3h3zM4 5h8v9H4V5zm2 2v5h1V7H6zm3 0v5h1V7H9z" fill="#6B7280"/>
                  </svg>
                  <span>Delete</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Project Menu for Mobile */}
        {isProjectMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="project-menu-backdrop"
              onClick={handleCloseProjectMenu}
            />
            
            {/* Slide-Out Panel */}
            <div className={`project-menu ${isProjectMenuOpen ? 'project-menu--open' : ''}`}>
              <div className="project-menu__content">
                {/* Header */}
                <div className="project-menu__header">
                  <button 
                    className="project-menu__close"
                    onClick={handleCloseProjectMenu}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {/* Create Project Button */}
                <div className="project-menu__create">
                  <button 
                    className="project-menu__create-btn"
                    onClick={() => {
                      console.log('Create Project clicked');
                      setIsProjectMenuOpen(false);
                    }}
                  >
                    + Create Project
                  </button>
                </div>

                {/* Search */}
                <div className="project-menu__search">
                  <div className="project-menu__search-container">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6.5 12C9.26142 12 11.5 9.76142 11.5 7C11.5 4.23858 9.26142 2 6.5 2C3.73858 2 1.5 4.23858 1.5 7C1.5 9.76142 3.73858 12 6.5 12Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12.5 12.5L10.5 10.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Search projects..."
                      className="project-menu__search-input"
                    />
                  </div>
                </div>

                {/* Filter Categories */}
                <div className="project-menu__filters">
                  <div className="project-menu__filter-item">
                    <div className="project-menu__filter-content">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M2 3h14v2H2V3zm1 4h12v2H3V7zm2 4h8v2H5v-2z" fill="#6B7280"></path>
                      </svg>
                      <span>All Projects</span>
                    </div>
                    <div className="project-menu__filter-count">3</div>
                  </div>
                  <div className="project-menu__filter-item">
                    <div className="project-menu__filter-content">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 1.5L11.5 6.5H16L12.5 10L14 15L9 12L4 15L5.5 10L2 6.5H6.5L9 1.5Z" fill="#6B7280"></path>
                      </svg>
                      <span>Favorites</span>
                    </div>
                    <div className="project-menu__filter-count">3</div>
                  </div>
                </div>

                {/* Project List */}
                <div className="project-menu__projects">
                  {/* Sample Projects */}
                  <div 
                    className="project-menu__project-card"
                    onClick={() => {
                      setSelectedProject({ id: 1, name: 'Marketing Campaign Q4' });
                      setIsProjectMenuOpen(false);
                      setShowProjectView(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="project-menu__project-header">
                      <h3 className="project-menu__project-title">Marketing Campaign Q4</h3>
                      <div className="project-menu__project-actions">
                        <div className="project-menu__project-menu-container">
                          <button 
                            className="project-menu__project-menu"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Project menu clicked');
                            }}
                          >
                            <EllipsisIcon width={12} height={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="project-menu__project-description">End-of-year marketing push for holiday season</p>
                    <div className="project-menu__project-meta">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <defs>
                          <clipPath id="clipPath-1">
                            <path d="M0 0L12 0L12 12L0 12L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"></path>
                          </clipPath>
                        </defs>
                        <g clipPath="url(#clipPath-1)">
                          <path d="M0 -0.5625C-0.310658 -0.5625 -0.5625 -0.310658 -0.5625 0L-0.5625 2.5Q-0.5625 2.61189 -0.519682 2.71526Q-0.476864 2.81864 -0.397747 2.89775L1.10225 4.39775C1.32192 4.61741 1.67808 4.61741 1.89775 4.39774C2.11742 4.17808 2.11742 3.82192 1.89775 3.60225L0.5625 2.26701L0.5625 0C0.5625 -0.310658 0.310658 -0.5625 0 -0.5625Z" fillRule="evenodd" transform="matrix(1 0 0 1 6 3.5)" fill="rgb(107, 114, 128)"></path>
                          <path d="M4.5 8.4375Q5.30147 8.4375 6.03251 8.1283Q6.73903 7.82947 7.28427 7.28423Q7.82951 6.73899 8.12835 6.03248Q8.43754 5.30146 8.43754 4.50001Q8.43754 3.69855 8.12835 2.96752Q7.82951 2.26101 7.28427 1.71577Q6.73903 1.17053 6.03251 0.871698Q5.30147 0.5625 4.5 0.5625Q3.69854 0.5625 2.96752 0.871697Q2.26101 1.17053 1.71577 1.71577Q1.17053 2.26101 0.871698 2.96752Q0.5625 3.69855 0.5625 4.50001Q0.5625 5.30146 0.871697 6.03248Q1.17053 6.73899 1.71577 7.28423Q2.261 7.82947 2.96752 8.1283Q3.69854 8.4375 4.5 8.4375ZM4.5 9.5625Q3.47041 9.5625 2.52927 9.16443Q1.62066 8.78012 0.920271 8.07973Q0.219875 7.37933 -0.164433 6.47073Q-0.5625 5.52959 -0.5625 4.50001Q-0.5625 3.47041 -0.164433 2.52928Q0.219875 1.62067 0.920271 0.920273Q1.62067 0.219875 2.52927 -0.164433Q3.47041 -0.5625 4.5 -0.5625Q5.5296 -0.5625 6.47075 -0.164434Q7.37936 0.219872 8.07976 0.920271Q8.78016 1.62067 9.16448 2.52928Q9.56254 3.47041 9.56254 4.50001Q9.56255 5.5296 9.16448 6.47073Q8.78016 7.37933 8.07976 8.07973Q7.37936 8.78013 6.47075 9.16443Q5.5296 9.5625 4.5 9.5625Z" fillRule="nonzero" transform="matrix(1 0 0 1 1.50003 1.5)" fill="rgb(107, 114, 128)"></path>
                        </g>
                      </svg>
                      <span>Updated: 11/15/2024 @ 3:30 am</span>
                    </div>
                  </div>

                  <div 
                    className="project-menu__project-card"
                    onClick={() => {
                      setSelectedProject({ id: 2, name: 'Product Launch Beta' });
                      setIsProjectMenuOpen(false);
                      setShowProjectView(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="project-menu__project-header">
                      <h3 className="project-menu__project-title">Product Launch Beta</h3>
                      <div className="project-menu__project-actions">
                        <div className="project-menu__project-menu-container">
                          <button 
                            className="project-menu__project-menu"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Project menu clicked');
                            }}
                          >
                            <EllipsisIcon width={12} height={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="project-menu__project-description">Beta testing and feedback collection for new features</p>
                    <div className="project-menu__project-meta">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <defs>
                          <clipPath id="clipPath-2">
                            <path d="M0 0L12 0L12 12L0 12L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"></path>
                          </clipPath>
                        </defs>
                        <g clipPath="url(#clipPath-2)">
                          <path d="M0 -0.5625C-0.310658 -0.5625 -0.5625 -0.310658 -0.5625 0L-0.5625 2.5Q-0.5625 2.61189 -0.519682 2.71526Q-0.476864 2.81864 -0.397747 2.89775L1.10225 4.39775C1.32192 4.61741 1.67808 4.61741 1.89775 4.39774C2.11742 4.17808 2.11742 3.82192 1.89775 3.60225L0.5625 2.26701L0.5625 0C0.5625 -0.310658 0.310658 -0.5625 0 -0.5625Z" fillRule="evenodd" transform="matrix(1 0 0 1 6 3.5)" fill="rgb(107, 114, 128)"></path>
                          <path d="M4.5 8.4375Q5.30147 8.4375 6.03251 8.1283Q6.73903 7.82947 7.28427 7.28423Q7.82951 6.73899 8.12835 6.03248Q8.43754 5.30146 8.43754 4.50001Q8.43754 3.69855 8.12835 2.96752Q7.82951 2.26101 7.28427 1.71577Q6.73903 1.17053 6.03251 0.871698Q5.30147 0.5625 4.5 0.5625Q3.69854 0.5625 2.96752 0.871697Q2.26101 1.17053 1.71577 1.71577Q1.17053 2.26101 0.871698 2.96752Q0.5625 3.69855 0.5625 4.50001Q0.5625 5.30146 0.871697 6.03248Q1.17053 6.73899 1.71577 7.28423Q2.261 7.82947 2.96752 8.1283Q3.69854 8.4375 4.5 8.4375ZM4.5 9.5625Q3.47041 9.5625 2.52927 9.16443Q1.62066 8.78012 0.920271 8.07973Q0.219875 7.37933 -0.164433 6.47073Q-0.5625 5.52959 -0.5625 4.50001Q-0.5625 3.47041 -0.164433 2.52928Q0.219875 1.62067 0.920271 0.920273Q1.62067 0.219875 2.52927 -0.164433Q3.47041 -0.5625 4.5 -0.5625Q5.5296 -0.5625 6.47075 -0.164434Q7.37936 0.219872 8.07976 0.920271Q8.78016 1.62067 9.16448 2.52928Q9.56254 3.47041 9.56254 4.50001Q9.56255 5.5296 9.16448 6.47073Q8.78016 7.37933 8.07976 8.07973Q7.37936 8.78013 6.47075 9.16443Q5.5296 9.5625 4.5 9.5625Z" fillRule="nonzero" transform="matrix(1 0 0 1 1.50003 1.5)" fill="rgb(107, 114, 128)"></path>
                        </g>
                      </svg>
                      <span>Updated: 11/10/2024 @ 2:20 pm</span>
                    </div>
                  </div>

                  <div 
                    className="project-menu__project-card"
                    onClick={() => {
                      setSelectedProject({ id: 3, name: 'Customer Onboarding' });
                      setIsProjectMenuOpen(false);
                      setShowProjectView(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="project-menu__project-header">
                      <h3 className="project-menu__project-title">Customer Onboarding</h3>
                      <div className="project-menu__project-actions">
                        <div className="project-menu__project-menu-container">
                          <button 
                            className="project-menu__project-menu"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Project menu clicked');
                            }}
                          >
                            <EllipsisIcon width={12} height={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="project-menu__project-description">Streamlining the new customer experience process</p>
                    <div className="project-menu__project-meta">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <defs>
                          <clipPath id="clipPath-3">
                            <path d="M0 0L12 0L12 12L0 12L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"></path>
                          </clipPath>
                        </defs>
                        <g clipPath="url(#clipPath-3)">
                          <path d="M0 -0.5625C-0.310658 -0.5625 -0.5625 -0.310658 -0.5625 0L-0.5625 2.5Q-0.5625 2.61189 -0.519682 2.71526Q-0.476864 2.81864 -0.397747 2.89775L1.10225 4.39775C1.32192 4.61741 1.67808 4.61741 1.89775 4.39774C2.11742 4.17808 2.11742 3.82192 1.89775 3.60225L0.5625 2.26701L0.5625 0C0.5625 -0.310658 0.310658 -0.5625 0 -0.5625Z" fillRule="evenodd" transform="matrix(1 0 0 1 6 3.5)" fill="rgb(107, 114, 128)"></path>
                          <path d="M4.5 8.4375Q5.30147 8.4375 6.03251 8.1283Q6.73903 7.82947 7.28427 7.28423Q7.82951 6.73899 8.12835 6.03248Q8.43754 5.30146 8.43754 4.50001Q8.43754 3.69855 8.12835 2.96752Q7.82951 2.26101 7.28427 1.71577Q6.73903 1.17053 6.03251 0.871698Q5.30147 0.5625 4.5 0.5625Q3.69854 0.5625 2.96752 0.871697Q2.26101 1.17053 1.71577 1.71577Q1.17053 2.26101 0.871698 2.96752Q0.5625 3.69855 0.5625 4.50001Q0.5625 5.30146 0.871697 6.03248Q1.17053 6.73899 1.71577 7.28423Q2.261 7.82947 2.96752 8.1283Q3.69854 8.4375 4.5 8.4375ZM4.5 9.5625Q3.47041 9.5625 2.52927 9.16443Q1.62066 8.78012 0.920271 8.07973Q0.219875 7.37933 -0.164433 6.47073Q-0.5625 5.52959 -0.5625 4.50001Q-0.5625 3.47041 -0.164433 2.52928Q0.219875 1.62067 0.920271 0.920273Q1.62067 0.219875 2.52927 -0.164433Q3.47041 -0.5625 4.5 -0.5625Q5.5296 -0.5625 6.47075 -0.164434Q7.37936 0.219872 8.07976 0.920271Q8.78016 1.62067 9.16448 2.52928Q9.56254 3.47041 9.56254 4.50001Q9.56255 5.5296 9.16448 6.47073Q8.78016 7.37933 8.07976 8.07973Q7.37936 8.78013 6.47075 9.16443Q5.5296 9.5625 4.5 9.5625Z" fillRule="nonzero" transform="matrix(1 0 0 1 1.50003 1.5)" fill="rgb(107, 114, 128)"></path>
                        </g>
                      </svg>
                      <span>Updated: 11/05/2024 @ 9:15 am</span>
                    </div>
                  </div>

                  <div 
                    className="project-menu__project-card"
                    onClick={() => {
                      setSelectedProject({ id: 4, name: 'Project A' });
                      setIsProjectMenuOpen(false);
                      setShowProjectView(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="project-menu__project-header">
                      <h3 className="project-menu__project-title">Project A</h3>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 1.5L11.5 6.5H16L12.5 10L14 15L9 12L4 15L5.5 10L2 6.5H6.5L9 1.5Z" fill="#6B7280"></path>
                      </svg>
                      <div className="project-menu__project-actions">
                        <div className="project-menu__project-menu-container">
                          <button 
                            className="project-menu__project-menu"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Project menu clicked');
                            }}
                          >
                            <EllipsisIcon width={12} height={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="project-menu__project-description">Online shopping platform with modern UI/UX</p>
                    <div className="project-menu__project-meta">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <defs>
                          <clipPath id="clipPath0737389489-1">
                            <path d="M0 0L12 0L12 12L0 12L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"></path>
                          </clipPath>
                        </defs>
                        <g clipPath="url(#clipPath0737389489-1)">
                          <path d="M0 -0.5625C-0.310658 -0.5625 -0.5625 -0.310658 -0.5625 0L-0.5625 2.5Q-0.5625 2.61189 -0.519682 2.71526Q-0.476864 2.81864 -0.397747 2.89775L1.10225 4.39775C1.32192 4.61741 1.67808 4.61741 1.89775 4.39774C2.11742 4.17808 2.11742 3.82192 1.89775 3.60225L0.5625 2.26701L0.5625 0C0.5625 -0.310658 0.310658 -0.5625 0 -0.5625Z" fillRule="evenodd" transform="matrix(1 0 0 1 6 3.5)" fill="rgb(107, 114, 128)"></path>
                          <path d="M4.5 8.4375Q5.30147 8.4375 6.03251 8.1283Q6.73903 7.82947 7.28427 7.28423Q7.82951 6.73899 8.12835 6.03248Q8.43754 5.30146 8.43754 4.50001Q8.43754 3.69855 8.12835 2.96752Q7.82951 2.26101 7.28427 1.71577Q6.73903 1.17053 6.03251 0.871698Q5.30147 0.5625 4.5 0.5625Q3.69854 0.5625 2.96752 0.871697Q2.26101 1.17053 1.71577 1.71577Q1.17053 2.26101 0.871698 2.96752Q0.5625 3.69855 0.5625 4.50001Q0.5625 5.30146 0.871697 6.03248Q1.17053 6.73899 1.71577 7.28423Q2.261 7.82947 2.96752 8.1283Q3.69854 8.4375 4.5 8.4375ZM4.5 9.5625Q3.47041 9.5625 2.52927 9.16443Q1.62066 8.78012 0.920271 8.07973Q0.219875 7.37933 -0.164433 6.47073Q-0.5625 5.52959 -0.5625 4.50001Q-0.5625 3.47041 -0.164433 2.52928Q0.219875 1.62067 0.920271 0.920273Q1.62067 0.219875 2.52927 -0.164433Q3.47041 -0.5625 4.5 -0.5625Q5.5296 -0.5625 6.47075 -0.164434Q7.37936 0.219872 8.07976 0.920271Q8.78016 1.62067 9.16448 2.52928Q9.56254 3.47041 9.56254 4.50001Q9.56255 5.5296 9.16448 6.47073Q8.78016 7.37933 8.07976 8.07973Q7.37936 8.78013 6.47075 9.16443Q5.5296 9.5625 4.5 9.5625Z" fillRule="nonzero" transform="matrix(1 0 0 1 1.50003 1.5)" fill="rgb(107, 114, 128)"></path>
                        </g>
                      </svg>
                      <span>Updated: 05/13/2025</span>
                    </div>
                  </div>

                  <div 
                    className="project-menu__project-card"
                    onClick={() => {
                      setSelectedProject({ id: 5, name: 'Project B' });
                      setIsProjectMenuOpen(false);
                      setShowProjectView(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="project-menu__project-header">
                      <h3 className="project-menu__project-title">Project B</h3>
                      <div className="project-menu__project-actions">
                        <div className="project-menu__project-menu-container">
                          <button 
                            className="project-menu__project-menu"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Project menu clicked');
                            }}
                          >
                            <EllipsisIcon width={12} height={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="project-menu__project-description">Online shopping platform with modern UI/UX</p>
                    <div className="project-menu__project-meta">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <defs>
                          <clipPath id="clipPath0737389489-2">
                            <path d="M0 0L12 0L12 12L0 12L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"></path>
                          </clipPath>
                        </defs>
                        <g clipPath="url(#clipPath0737389489-2)">
                          <path d="M0 -0.5625C-0.310658 -0.5625 -0.5625 -0.310658 -0.5625 0L-0.5625 2.5Q-0.5625 2.61189 -0.519682 2.71526Q-0.476864 2.81864 -0.397747 2.89775L1.10225 4.39775C1.32192 4.61741 1.67808 4.61741 1.89775 4.39774C2.11742 4.17808 2.11742 3.82192 1.89775 3.60225L0.5625 2.26701L0.5625 0C0.5625 -0.310658 0.310658 -0.5625 0 -0.5625Z" fillRule="evenodd" transform="matrix(1 0 0 1 6 3.5)" fill="rgb(107, 114, 128)"></path>
                          <path d="M4.5 8.4375Q5.30147 8.4375 6.03251 8.1283Q6.73903 7.82947 7.28427 7.28423Q7.82951 6.73899 8.12835 6.03248Q8.43754 5.30146 8.43754 4.50001Q8.43754 3.69855 8.12835 2.96752Q7.82951 2.26101 7.28427 1.71577Q6.73903 1.17053 6.03251 0.871698Q5.30147 0.5625 4.5 0.5625Q3.69854 0.5625 2.96752 0.871697Q2.26101 1.17053 1.71577 1.71577Q1.17053 2.26101 0.871698 2.96752Q0.5625 3.69855 0.5625 4.50001Q0.5625 5.30146 0.871697 6.03248Q1.17053 6.73899 1.71577 7.28423Q2.261 7.82947 2.96752 8.1283Q3.69854 8.4375 4.5 8.4375ZM4.5 9.5625Q3.47041 9.5625 2.52927 9.16443Q1.62066 8.78012 0.920271 8.07973Q0.219875 7.37933 -0.164433 6.47073Q-0.5625 5.52959 -0.5625 4.50001Q-0.5625 3.47041 -0.164433 2.52928Q0.219875 1.62067 0.920271 0.920273Q1.62067 0.219875 2.52927 -0.164433Q3.47041 -0.5625 4.5 -0.5625Q5.5296 -0.5625 6.47075 -0.164434Q7.37936 0.219872 8.07976 0.920271Q8.78016 1.62067 9.16448 2.52928Q9.56254 3.47041 9.56254 4.50001Q9.56255 5.5296 9.16448 6.47073Q8.78016 7.37933 8.07976 8.07973Q7.37936 8.78013 6.47075 9.16443Q5.5296 9.5625 4.5 9.5625Z" fillRule="nonzero" transform="matrix(1 0 0 1 1.50003 1.5)" fill="rgb(107, 114, 128)"></path>
                        </g>
                      </svg>
                      <span>Updated: 05/13/2025</span>
                    </div>
                  </div>

                  <div 
                    className="project-menu__project-card"
                    onClick={() => {
                      setSelectedProject({ id: 6, name: 'Project C' });
                      setIsProjectMenuOpen(false);
                      setShowProjectView(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="project-menu__project-header">
                      <h3 className="project-menu__project-title">Project C</h3>
                      <div className="project-menu__project-actions">
                        <div className="project-menu__project-menu-container">
                          <button 
                            className="project-menu__project-menu"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Project menu clicked');
                            }}
                          >
                            <EllipsisIcon width={12} height={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="project-menu__project-description">Online shopping platform with modern UI/UX</p>
                    <div className="project-menu__project-meta">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <defs>
                          <clipPath id="clipPath0737389489-3">
                            <path d="M0 0L12 0L12 12L0 12L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"></path>
                          </clipPath>
                        </defs>
                        <g clipPath="url(#clipPath0737389489-3)">
                          <path d="M0 -0.5625C-0.310658 -0.5625 -0.5625 -0.310658 -0.5625 0L-0.5625 2.5Q-0.5625 2.61189 -0.519682 2.71526Q-0.476864 2.81864 -0.397747 2.89775L1.10225 4.39775C1.32192 4.61741 1.67808 4.61741 1.89775 4.39774C2.11742 4.17808 2.11742 3.82192 1.89775 3.60225L0.5625 2.26701L0.5625 0C0.5625 -0.310658 0.310658 -0.5625 0 -0.5625Z" fillRule="evenodd" transform="matrix(1 0 0 1 6 3.5)" fill="rgb(107, 114, 128)"></path>
                          <path d="M4.5 8.4375Q5.30147 8.4375 6.03251 8.1283Q6.73903 7.82947 7.28427 7.28423Q7.82951 6.73899 8.12835 6.03248Q8.43754 5.30146 8.43754 4.50001Q8.43754 3.69855 8.12835 2.96752Q7.82951 2.26101 7.28427 1.71577Q6.73903 1.17053 6.03251 0.871698Q5.30147 0.5625 4.5 0.5625Q3.69854 0.5625 2.96752 0.871697Q2.26101 1.17053 1.71577 1.71577Q1.17053 2.26101 0.871698 2.96752Q0.5625 3.69855 0.5625 4.50001Q0.5625 5.30146 0.871697 6.03248Q1.17053 6.73899 1.71577 7.28423Q2.261 7.82947 2.96752 8.1283Q3.69854 8.4375 4.5 8.4375ZM4.5 9.5625Q3.47041 9.5625 2.52927 9.16443Q1.62066 8.78012 0.920271 8.07973Q0.219875 7.37933 -0.164433 6.47073Q-0.5625 5.52959 -0.5625 4.50001Q-0.5625 3.47041 -0.164433 2.52928Q0.219875 1.62067 0.920271 0.920273Q1.62067 0.219875 2.52927 -0.164433Q3.47041 -0.5625 4.5 -0.5625Q5.5296 -0.5625 6.47075 -0.164434Q7.37936 0.219872 8.07976 0.920271Q8.78016 1.62067 9.16448 2.52928Q9.56254 3.47041 9.56254 4.50001Q9.56255 5.5296 9.16448 6.47073Q8.78016 7.37933 8.07976 8.07973Q7.37936 8.78013 6.47075 9.16443Q5.5296 9.5625 4.5 9.5625Z" fillRule="nonzero" transform="matrix(1 0 0 1 1.50003 1.5)" fill="rgb(107, 114, 128)"></path>
                        </g>
                      </svg>
                      <span>Updated: 05/13/2025</span>
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="project-menu__pagination">
                    <button className="project-menu__pagination-btn project-menu__pagination-btn--disabled">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <div className="project-menu__pagination-info">
                      <span>Page 1 of 1</span>
                    </div>
                    <button className="project-menu__pagination-btn project-menu__pagination-btn--disabled">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="workspace__main">
        {/* Sidebar */}
        <Sidebar 
          selectedProject={selectedProject} 
          onProjectSelect={setSelectedProject}
          onNewChat={handleNewChat}
          onOpenTemplateDrawer={handleOpenTemplateDrawer}
          onMobileProjectMenuOpen={handleOpenProjectMenu}
        />
        
        {/* Main Content Area */}
        <MainContent 
          selectedProject={selectedProject} 
          onOpenTemplateDrawer={handleOpenTemplateDrawer}
          externalPrompt={externalPrompt}
        />
      </div>

      
      {/* Template Drawer */}
      <TemplateDrawer 
        isOpen={isTemplateDrawerOpen}
        onClose={handleCloseTemplateDrawer}
        onTemplateSelected={handleTemplateSelected}
        canManageCustomTemplates={canManageCustomTemplates}
        brandBotId={brandBotId}
        currentUserId={currentUserId}
      />

      {/* Document Drawer (legacy) opened via Template selection */}
      <DocumentDrawer
        isOpen={isDocumentDrawerOpen}
        onClose={() => { setIsDocumentDrawerOpen(false); setDocumentDrawerData(null); }}
        document={documentDrawerData?.document || null}
        playbookCardTitles={documentDrawerData?.playbookCardTitles || null}
        onEdit={() => {}}
        onRunPlaybook={handleRunPlaybook}
      />

      {/* Playbook Preview Drawer */}
      <PlaybookPreviewDrawer
        isOpen={isPlaybookPreviewOpen}
        onClose={() => { setIsPlaybookPreviewOpen(false); setPlaybookPreviewData(null); }}
        workspaceName={typeof document !== 'undefined' ? (document.querySelector('.header__workspace-text')?.textContent || 'Workspace') : 'Workspace'}
        documentContext={playbookPreviewData?.documentContext || null}
        playbook={playbookPreviewData?.playbook || null}
        onStart={(mode, context) => handleStartFromPreview(mode, context)}
        isSpecialEdition={playbookPreviewData?.isSpecialEdition || false}
        templateData={playbookPreviewData?.templateData || null}
      />

      {/* Playbook Run Drawer */}
      <PlaybookRunDrawer
        isOpen={isPlaybookRunDrawerOpen}
        onClose={handleClosePlaybookRunDrawer}
        playbook={playbookRunData?.playbook || null}
        inputPanelData={playbookRunData?.inputPanelData || null}
      />

      {/* Variable-based (Auto-run) Runner */}
      <PlaybookRunnerDrawer
        isOpen={isPlaybookRunnerDrawerOpen}
        onClose={handleClosePlaybookRunnerDrawer}
        playbook={playbookRunnerData?.playbook || null}
        inputPanelData={playbookRunnerData?.inputPanelData || null}
      />

      {/* Ellament Drawer */}
      <EllamentDrawer
        isOpen={isEllamentDrawerOpen}
        onClose={handleCloseEllamentDrawer}
        onEllamentSelect={(ellament) => {
          console.log('Ellament selected:', ellament);
          setIsEllamentDrawerOpen(false);
        }}
      />

      {/* Saved Work Drawer */}
      <SavedWorkDrawer
        isOpen={isShowSavedWorkDrawer}
        onClose={() => setShowSavedWorkDrawer(false)}
        onDocumentSelect={(document) => {
          console.log('Document selected:', document);
          setShowSavedWorkDrawer(false);
        }}
      />

      {/* Uploaded Files Drawer */}
      <UploadedFilesDrawer
        isOpen={isShowUploadedFilesDrawer}
        onClose={() => setShowUploadedFilesDrawer(false)}
      />

      {/* Manage Tags Drawer */}
      <ManageTagsDrawer
        isOpen={isShowManageTagsDrawer}
        onClose={() => setShowManageTagsDrawer(false)}
      />

      {/* Mobile Project Menu Slide-up */}
      {isMobileProjectMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className={`mobile-project-menu-backdrop ${isMobileProjectMenuOpen ? 'mobile-project-menu-backdrop--open' : ''}`}
            onClick={handleCloseMobileProjectMenu}
          />
          
          {/* Slide-up Menu */}
          <div className={`mobile-project-menu ${isMobileProjectMenuOpen ? 'mobile-project-menu--open' : ''}`}>
            {/* Handle */}
            <div className="mobile-project-menu__handle" onClick={handleCloseMobileProjectMenu}></div>
            
            {/* Header */}
            <div className="mobile-project-menu__header">
              <div className="mobile-project-menu__header-content">
                {isRenamingProject ? (
                  <input
                    type="text"
                    className="mobile-project-menu__rename-input"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={handleRenameKeyDown}
                    onBlur={handleRenameSubmit}
                    autoFocus
                  />
                ) : (
                  <h3>{selectedProject?.name || 'Projects'}</h3>
                )}
                
                {selectedProject && (
                  <div className="mobile-project-menu__ellipsis-container" ref={ellipsisMenuRef}>
                    <button 
                      className="mobile-project-menu__ellipsis-btn"
                      onClick={handleMobileProjectMenuEllipsisToggle}
                    >
                      <EllipsisIcon />
                    </button>
                    
                    {isMobileProjectMenuEllipsisOpen && (
                      <div className="mobile-project-menu__ellipsis-menu">
                        <button 
                          className="mobile-project-menu__ellipsis-item"
                          onClick={handleStartRename}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Rename</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Content - Projects Section */}
            <div className="mobile-project-menu__content">
              <div className="sidebar__projects-section">
                <div 
                  className="sidebar__projects-header"
                  onClick={() => {
                    setIsMobileProjectMenuOpen(false);
                    setIsProjectMenuOpen(true);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className="project-icon">
                    <defs>
                      <clipPath id="clipPath4532578984-project">
                        <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                      </clipPath>
                    </defs>
                    <g clipPath="url(#clipPath4532578984-project)">
                      <defs>
                        <clipPath id="clipPath0426603476-project">
                          <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                        </clipPath>
                      </defs>
                      <g clipPath="url(#clipPath0426603476-project)">
                        <path d="M15.9375 14.375L1.5625 14.375Q0.656407 14.375 0.0157034 13.7343Q-0.625 13.0936 -0.625 12.1875L-0.625 1.5625Q-0.625 0.656408 0.0157039 0.0157039Q0.656408 -0.625 1.5625 -0.625L4.52695 -0.625Q4.8509 -0.624992 5.16094 -0.531102Q5.47097 -0.437213 5.74049 -0.257499L6.82794 0.467469Q6.94349 0.544519 7.07636 0.584758Q7.20923 0.624996 7.34806 0.625L15.9375 0.625Q16.8436 0.625 17.4843 1.2657Q18.125 1.90641 18.125 2.8125L18.125 12.1875Q18.125 13.0936 17.4843 13.7343Q16.8436 14.375 15.9375 14.375ZM16.875 5L16.875 12.1875Q16.875 12.5758 16.6004 12.8504Q16.3258 13.125 15.9375 13.125L1.5625 13.125Q1.17418 13.125 0.899588 12.8504Q0.625 12.5758 0.625 12.1875L0.625 5L16.875 5ZM16.875 3.75L0.625 3.75L0.625 1.5625Q0.625 1.17417 0.899587 0.899587Q1.17417 0.625 1.5625 0.625L4.52695 0.625Q4.66577 0.625003 4.79864 0.665242Q4.93151 0.70548 5.04701 0.782499L6.13456 1.50753Q6.40403 1.68721 6.71406 1.7811Q7.0241 1.87499 7.34803 1.875L15.9375 1.875Q16.3258 1.875 16.6004 2.14959Q16.875 2.42418 16.875 2.8125L16.875 3.75Z" fillRule="evenodd" transform="matrix(1 0 0 1 1.25 3.125)" fill="var(--theme-primary-deep)"/>
                      </g>
                    </g>
                  </svg>
                  <span>Select a Project</span>
                </div>
                
                {/* Project List - You can add your project items here */}
                <div className="sidebar__project-sections">
                  <div className="sidebar__project-section-item" onClick={handleMobileSectionMenuOpen}>
                    <div className="sidebar__project-section-content">
                      Project Chats
                    </div>
                  </div>
                  
                  <div className="sidebar__project-section-item" onClick={handleMobileFilesMenuOpen}>
                    <div className="sidebar__project-section-content">
                      Uploaded Files
                    </div>
                  </div>
                  
                  <div className="sidebar__project-section-item" onClick={handleMobileSavedWorkMenuOpen}>
                    <div className="sidebar__project-section-content">
                      Saved Work
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Section Menu */}
      {isMobileSectionMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="mobile-project-menu-backdrop mobile-project-menu-backdrop--open"
            onClick={handleMobileSectionMenuClose}
          />
          
          {/* Slide-up Menu */}
          <div className="mobile-project-menu mobile-project-menu--open">
            {/* Handle */}
            <div className="mobile-project-menu__handle" onClick={handleMobileSectionMenuClose}></div>
            
            {/* Header */}
            <div className="mobile-project-menu__header">
              <h3>Project Chats</h3>
            </div>
            
            {/* Content */}
            <div className="mobile-project-menu__content">
              <div className="section-menu__content">
                <p>Section menu content would go here...</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Files Menu */}
      {isMobileFilesMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="mobile-project-menu-backdrop mobile-project-menu-backdrop--open"
            onClick={handleMobileFilesMenuClose}
          />
          
          {/* Slide-up Menu */}
          <div className="mobile-project-menu mobile-project-menu--open">
            {/* Handle */}
            <div className="mobile-project-menu__handle" onClick={handleMobileFilesMenuClose}></div>
            
            {/* Header */}
            <div className="mobile-project-menu__header">
              <h3>Uploaded Files</h3>
            </div>
            
            {/* Content */}
            <div className="mobile-project-menu__content">
              <div className="files-menu__content">
                <p>Files menu content would go here...</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Saved Work Menu */}
      {isMobileSavedWorkMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="mobile-project-menu-backdrop mobile-project-menu-backdrop--open"
            onClick={handleMobileSavedWorkMenuClose}
          />
          
          {/* Slide-up Menu */}
          <div className="mobile-project-menu mobile-project-menu--open">
            {/* Handle */}
            <div className="mobile-project-menu__handle" onClick={handleMobileSavedWorkMenuClose}></div>
            
            {/* Header */}
            <div className="mobile-project-menu__header">
              <h3>Saved Work</h3>
            </div>
            
            {/* Content */}
            <div className="mobile-project-menu__content">
              <div className="saved-work-menu__content">
                <p>Saved work menu content would go here...</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Onboarding Modals */}
      {showOnboardingQuestionnaire && (
        <QuestionnaireModal
          isOpen={showOnboardingQuestionnaire}
          onComplete={handleQuestionnaireComplete}
          userType="primary"
        />
      )}

      {showBrandBotSetup && (
        <BrandBotSetupModal
          isOpen={showBrandBotSetup}
          onClose={handleBrandBotSetupClose}
          onComplete={handleBrandBotSetupComplete}
          persistedStateKey="brandbot-workspace-onboarding"
        />
      )}

      {showBrandBotBuilder && (
        <BrandBotSetupModalV2
          isOpen={showBrandBotBuilder}
          onClose={handleBrandBotBuilderClose}
          onComplete={handleBrandBotBuilderComplete}
        />
      )}

    </div>
  );
};

export default Workspace; 

