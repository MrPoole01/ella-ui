import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MainContent from '../components/layout/MainContent';
import TemplateDrawer from '../components/features/TemplateDrawer';
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

  const handleTemplateSelected = (prompt) => {
    setExternalPrompt(prompt || '');
    setIsTemplateDrawerOpen(false);
  };

  return (
    <div className="workspace clips-content">
      {/* Header */}
      <Header />
      
      {/* Mobile Layout */}
      <div className="workspace__mobile-layout">
        {/* Mobile Workspace Header */}
        <div className="workspace__mobile-header">
          <div className="workspace__mobile-workspace-info">
            <FolderIcon />
            <span className="workspace__mobile-workspace-name">Workspace 1</span>
          </div>
          <button className="workspace__mobile-menu-btn">
            <EllipsisIcon />
          </button>
        </div>

        {/* Mobile Content */}
        <div className="workspace__mobile-content">
          {/* Ellaments Card - Two Separate Buttons */}
          <div className="workspace__mobile-ellaments-container">
              <button className="workspace__mobile-ellaments-btn">
                <div className="workspace__mobile-ellaments-info">
                  <span className="workspace__mobile-ellaments-title">Ellaments</span>
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
            
            <button className="workspace__mobile-new-chat-btn">
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
              <button className="workspace__mobile-section-action">
                <PlusIcon />
                <span>create a project</span>
              </button>
            </div>
          </div>
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
                <button className="workspace__mobile-input-btn">
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
      </div>

      {/* Desktop Layout */}
      <div className="workspace__main">
        {/* Sidebar */}
        <Sidebar 
          selectedProject={selectedProject} 
          onProjectSelect={setSelectedProject}
          onNewChat={handleNewChat}
          onOpenTemplateDrawer={handleOpenTemplateDrawer}
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
    </div>
  );
};

export default Workspace; 