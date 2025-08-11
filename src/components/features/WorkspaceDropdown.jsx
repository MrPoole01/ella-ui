import React, { useEffect, useState } from 'react';
import { ProjectIcon } from '../icons';
import '../../styles/WorkspaceDropdown.scss';

const WorkspaceDropdown = ({ isOpen, onClose, onWorkspaceCreated, onOpenCreateWorkspace }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  // Mock: organization-level brand bots available
  const orgBrandBots = [
    { id: 'bb-1', name: 'Acme BrandBot' },
    { id: 'bb-2', name: 'Contoso BrandBot' }
  ];

  // Mock data - replace with actual data from your state management
  const pinnedWorkspaces = [
    { id: 1, name: 'Workspace 2', lastUpdated: '2 days ago', icon: 'folder' },
    { id: 2, name: 'Workspace 3', lastUpdated: '8 days ago', icon: 'folder' }
  ];

  const allWorkspaces = [
    { id: 1, name: 'Workspace 1', lastUpdated: '2 days ago', isActive: true },
    { id: 2, name: 'Workspace 4', lastUpdated: '1 week ago', isActive: false },
    { id: 3, name: 'Workspace 5', lastUpdated: '2 week ago', isActive: false },
    { id: 4, name: 'Workspace 6', lastUpdated: '3 week ago', isActive: false },
    { id: 5, name: 'Workspace 7', lastUpdated: '1 month ago', isActive: false },
    { id: 6, name: 'Workspace 8', lastUpdated: '2 months ago', isActive: false },
    { id: 7, name: 'Workspace 9', lastUpdated: '3 months ago', isActive: false },
    { id: 8, name: 'Workspace 10', lastUpdated: '4 months ago', isActive: false }
  ];

  const totalPages = Math.ceil(allWorkspaces.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentWorkspaces = allWorkspaces.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateWorkspace = () => {
    if (onOpenCreateWorkspace) onOpenCreateWorkspace({ orgBrandBots });
    onClose && onClose();
  };

  const handleCreateSubmit = ({ name, setupPath, brandBotId }) => {
    // Simulate workspace creation and update left menu via callback
    const newWorkspace = {
      id: Date.now(),
      name,
      lastUpdated: 'just now',
      isActive: true,
      setupPath,
      brandBotId: brandBotId || null
    };
    if (onWorkspaceCreated) onWorkspaceCreated(newWorkspace);
    setIsCreateOpen(false);
    onClose();
  };

  const handleWorkspaceSelect = (workspace) => {
    // Add your workspace selection logic here
    console.log('Selected workspace:', workspace);
    onClose();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Add search functionality here
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay for blur effect */}
      <div className="workspace-dropdown__backdrop" onClick={onClose} />
      
      <div 
        className={`workspace-dropdown ${isOpen ? 'workspace-dropdown--open' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="workspace-dropdown__container">
          {/* Close Button - Prominent above content */}
          <div className="workspace-dropdown__close-section">
            <div className="header__workspace-text">Workspace Menu</div>
            <button 
              className="workspace-dropdown__close"
              onClick={onClose}
              aria-label="Close workspace dropdown"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Create New Workspace Button */}
          <div className="workspace-dropdown__create">
            <button 
              className="workspace-dropdown__create-btn"
              onClick={handleCreateWorkspace}
            >
              Create New Workspace
            </button>
          </div>

          {/* Search Bar */}
          <div className="workspace-dropdown__search-container">
            <div className="workspace-dropdown__search">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="workspace-dropdown__search-icon">
                <path d="M6.5 11.5C9.26142 11.5 11.5 9.26142 11.5 6.5C11.5 3.73858 9.26142 1.5 6.5 1.5C3.73858 1.5 1.5 3.73858 1.5 6.5C1.5 9.26142 3.73858 11.5 6.5 11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.5 12.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={handleSearch}
                className="workspace-dropdown__search-input"
              />
            </div>
            <button className="workspace-dropdown__search-btn">
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                <defs>
                  <clipPath id="clipPathFilterIcon">
                    <path d="M0 0L16 0L16 16L0 16L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                  </clipPath>
                </defs>
                <g clipPath="url(#clipPathFilterIcon)">
                  <path d="M-0.6 0C-0.6 0.331368 -0.331368 0.6 0 0.6L12 0.6C12.3314 0.6 12.6 0.331368 12.6 0C12.6 -0.331368 12.3314 -0.6 12 -0.6L0 -0.6C-0.331368 -0.6 -0.6 -0.331368 -0.6 0ZM1.4 4C1.4 4.33137 1.66863 4.6 2 4.6L10 4.6C10.3314 4.6 10.6 4.33137 10.6 4C10.6 3.66863 10.3314 3.4 10 3.4L2 3.4C1.66863 3.4 1.4 3.66863 1.4 4ZM3.4 8C3.4 8.33137 3.66863 8.6 4 8.6L8 8.6C8.33137 8.6 8.6 8.33137 8.6 8C8.6 7.66863 8.33137 7.4 8 7.4L4 7.4C3.66863 7.4 3.4 7.66863 3.4 8Z" fillRule="evenodd" transform="matrix(1 0 0 1 2 4)" fill="rgb(17, 24, 39)"/>
                </g>
              </svg>
            </button>
          </div>

          {/* Pinned Workspaces */}
          <div className="workspace-dropdown__section">
            <div className="workspace-dropdown__section-header">
              PINNED WORKSPACES
            </div>
            <div className="workspace-dropdown__items">
              {pinnedWorkspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="workspace-dropdown__item workspace-dropdown__item--pinned"
                  onClick={() => handleWorkspaceSelect(workspace)}
                >
                  <div className="workspace-dropdown__item-icon">
                    <ProjectIcon />
                  </div>
                  <div className="workspace-dropdown__item-content">
                    <div className="workspace-dropdown__item-name">{workspace.name}</div>
                    <div className="workspace-dropdown__item-meta">Last updated {workspace.lastUpdated}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Workspaces */}
          <div className="workspace-dropdown__section">
            <div className="workspace-dropdown__section-header">
              WORKSPACES
            </div>
            <div className="workspace-dropdown__items">
              {currentWorkspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className={`workspace-dropdown__item ${workspace.isActive ? 'workspace-dropdown__item--active' : ''}`}
                  onClick={() => handleWorkspaceSelect(workspace)}
                >
                  <div className="workspace-dropdown__item-content workspace-dropdown__item-content--full">
                    <div className="workspace-dropdown__item-name">{workspace.name}</div>
                    <div className="workspace-dropdown__item-meta">Last updated {workspace.lastUpdated}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="workspace-dropdown__pagination">
            <div className="workspace-dropdown__pagination-info">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, allWorkspaces.length)} of {allWorkspaces.length} tasks
            </div>
            <div className="workspace-dropdown__pagination-controls">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`workspace-dropdown__pagination-btn ${currentPage === i + 1 ? 'workspace-dropdown__pagination-btn--active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal is rendered at a higher level (Header) via onOpenCreateWorkspace */}
    </>
  );
};

export default WorkspaceDropdown; 