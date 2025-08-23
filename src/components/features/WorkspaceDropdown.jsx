import React, { useEffect, useState } from 'react';
import { ProjectIcon } from '../icons';
import '../../styles/WorkspaceDropdown.scss';

const WorkspaceDropdown = ({ isOpen, onClose, onWorkspaceCreated, onOpenCreateWorkspace }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeEllipsisMenu, setActiveEllipsisMenu] = useState(null);
  const itemsPerPage = 6;
  // Mock: organization-level brand bots available
  const orgBrandBots = [
    { id: 'bb-1', name: 'Acme BrandBot' },
    { id: 'bb-2', name: 'Contoso BrandBot' }
  ];

  // Mock data - replace with actual data from your state management
  const [pinnedWorkspaces, setPinnedWorkspaces] = useState([
    { id: 1, name: 'Marketing Hub', lastUpdated: '2 days ago', icon: 'folder', isPinned: true },
    { id: 2, name: 'Product Design', lastUpdated: '8 days ago', icon: 'folder', isPinned: true }
  ]);

  const [allWorkspaces, setAllWorkspaces] = useState([
    { id: 1, name: 'Creative Studio', lastUpdated: '2 days ago', isActive: true, isPinned: false },
    { id: 2, name: 'Engineering Team', lastUpdated: '1 week ago', isActive: false, isPinned: false },
    { id: 3, name: 'Sales Operations', lastUpdated: '2 week ago', isActive: false, isPinned: false },
    { id: 4, name: 'Client Projects', lastUpdated: '3 week ago', isActive: false, isPinned: false },
    { id: 5, name: 'Research Lab', lastUpdated: '1 month ago', isActive: false, isPinned: false },
    { id: 6, name: 'Brand Strategy', lastUpdated: '2 months ago', isActive: false, isPinned: false },
    { id: 7, name: 'Data Analytics', lastUpdated: '3 months ago', isActive: false, isPinned: false },
    { id: 8, name: 'Content Factory', lastUpdated: '4 months ago', isActive: false, isPinned: false }
  ]);

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

  // Handle ellipsis menu toggle
  const handleEllipsisClick = (e, workspaceId) => {
    e.stopPropagation();
    setActiveEllipsisMenu(activeEllipsisMenu === workspaceId ? null : workspaceId);
  };

  // Handle pin/unpin workspace
  const handlePinToggle = (workspace) => {
    if (workspace.isPinned) {
      // Unpin: Remove from pinned and add back to all workspaces
      setPinnedWorkspaces(prev => prev.filter(w => w.id !== workspace.id));
      setAllWorkspaces(prev => [...prev, { ...workspace, isPinned: false }].sort((a, b) => a.id - b.id));
    } else {
      // Pin: Remove from all workspaces and add to pinned
      setAllWorkspaces(prev => prev.filter(w => w.id !== workspace.id));
      setPinnedWorkspaces(prev => [...prev, { ...workspace, isPinned: true }]);
    }
    setActiveEllipsisMenu(null);
  };

  // Handle menu actions
  const handleMenuAction = (action, workspace) => {
    console.log(`${action} workspace:`, workspace.name);
    setActiveEllipsisMenu(null);
    
    switch (action) {
      case 'pin':
      case 'unpin':
        handlePinToggle(workspace);
        break;
      case 'rename':
        // TODO: Open rename modal
        break;
      case 'share':
        // TODO: Open share modal
        break;
      case 'unshare':
        // TODO: Handle unshare
        break;
      case 'transfer':
        // TODO: Open transfer ownership modal
        break;
      case 'leave':
        // TODO: Handle leave workspace
        break;
      case 'archive':
        // TODO: Handle archive workspace
        break;
      case 'convert':
        // TODO: Handle convert to project
        break;
      case 'brandbot':
        // TODO: Open BrandBot selector
        break;
      default:
        break;
    }
  };

  // Close ellipsis menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeEllipsisMenu) {
        setActiveEllipsisMenu(null);
      }
    };

    if (activeEllipsisMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeEllipsisMenu]);

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
                  <div className="workspace-dropdown__item-actions">
                    <button
                      className="workspace-dropdown__ellipsis-btn"
                      onClick={(e) => handleEllipsisClick(e, workspace.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" fill="currentColor"/>
                        <path d="M8 4C8.55228 4 9 3.55228 9 3C9 2.44772 8.55228 2 8 2C7.44772 2 7 2.44772 7 3C7 3.55228 7.44772 4 8 4Z" fill="currentColor"/>
                        <path d="M8 14C8.55228 14 9 13.5523 9 13C9 12.4477 8.55228 12 8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z" fill="currentColor"/>
                      </svg>
                    </button>
                    {activeEllipsisMenu === workspace.id && (
                      <div className="workspace-dropdown__ellipsis-menu">
                        <button onClick={() => handleMenuAction('rename', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M6.36 2.68L2.5 6.54V8.96H4.92L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Rename
                        </button>
                        <button onClick={() => handleMenuAction('share', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M10.5 5.25C11.4665 5.25 12.25 4.4665 12.25 3.5C12.25 2.5335 11.4665 1.75 10.5 1.75C9.5335 1.75 8.75 2.5335 8.75 3.5C8.75 3.71 8.785 3.913 8.848 4.102L5.152 6.125C4.816 5.7525 4.336 5.25 3.5 5.25C2.5335 5.25 1.75 6.0335 1.75 7C1.75 7.9665 2.5335 8.75 3.5 8.75C4.336 8.75 4.816 8.2475 5.152 7.875L8.848 9.898C8.785 10.087 8.75 10.29 8.75 10.5C8.75 11.4665 9.5335 12.25 10.5 12.25C11.4665 12.25 12.25 11.4665 12.25 10.5C12.25 9.5335 11.4665 8.75 10.5 8.75C9.664 8.75 9.184 9.2525 8.848 9.625L5.152 7.602C5.215 7.413 5.25 7.21 5.25 7C5.25 6.79 5.215 6.587 5.152 6.398L8.848 4.375C9.184 4.7475 9.664 5.25 10.5 5.25Z" fill="currentColor"/>
                          </svg>
                          Share
                        </button>
                        <button onClick={() => handleMenuAction('unshare', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M10.5 5.25C11.4665 5.25 12.25 4.4665 12.25 3.5C12.25 2.5335 11.4665 1.75 10.5 1.75C9.5335 1.75 8.75 2.5335 8.75 3.5C8.75 3.71 8.785 3.913 8.848 4.102L5.152 6.125C4.816 5.7525 4.336 5.25 3.5 5.25C2.5335 5.25 1.75 6.0335 1.75 7C1.75 7.9665 2.5335 8.75 3.5 8.75C4.336 8.75 4.816 8.2475 5.152 7.875L8.848 9.898C8.785 10.087 8.75 10.29 8.75 10.5C8.75 11.4665 9.5335 12.25 10.5 12.25C11.4665 12.25 12.25 11.4665 12.25 10.5C12.25 9.5335 11.4665 8.75 10.5 8.75C9.664 8.75 9.184 9.2525 8.848 9.625L5.152 7.602C5.215 7.413 5.25 7.21 5.25 7C5.25 6.79 5.215 6.587 5.152 6.398L8.848 4.375C9.184 4.7475 9.664 5.25 10.5 5.25Z" fill="currentColor"/>
                          </svg>
                          Unshare
                        </button>
                        <button onClick={() => handleMenuAction('transfer', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 1.75C4.1005 1.75 1.75 4.1005 1.75 7C1.75 9.8995 4.1005 12.25 7 12.25C9.8995 12.25 12.25 9.8995 12.25 7C12.25 4.1005 9.8995 1.75 7 1.75ZM7 11.375C4.583 11.375 2.625 9.417 2.625 7C2.625 4.583 4.583 2.625 7 2.625C9.417 2.625 11.375 4.583 11.375 7C11.375 9.417 9.417 11.375 7 11.375ZM8.75 5.25L7 7V4.375C7.4832 4.375 7.875 4.7668 7.875 5.25H8.75ZM5.25 8.75L7 7H9.625C9.625 7.4832 9.2332 7.875 8.75 7.875V8.75Z" fill="currentColor"/>
                          </svg>
                          Transfer Ownership
                        </button>
                        <button onClick={() => handleMenuAction('leave', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M5.25 12.25H2.625C2.35 12.25 2.125 12.025 2.125 11.75V2.25C2.125 1.975 2.35 1.75 2.625 1.75H5.25V0.875H2.625C1.8665 0.875 1.25 1.4915 1.25 2.25V11.75C1.25 12.5085 1.8665 13.125 2.625 13.125H5.25V12.25ZM10.5 9.625L9.8125 8.9375L11.375 7.375H5.25V6.625H11.375L9.8125 5.0625L10.5 4.375L13.125 7L10.5 9.625Z" fill="currentColor"/>
                          </svg>
                          Leave
                        </button>
                        <button onClick={() => handleMenuAction('archive', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M12.25 3.5H1.75V2.625C1.75 2.35 1.975 2.125 2.25 2.125H11.75C12.025 2.125 12.25 2.35 12.25 2.625V3.5ZM1.75 4.375H12.25V11.375C12.25 11.65 12.025 11.875 11.75 11.875H2.25C1.975 11.875 1.75 11.65 1.75 11.375V4.375ZM5.25 6.125V7H8.75V6.125H5.25Z" fill="currentColor"/>
                          </svg>
                          Archive
                        </button>
                        <button onClick={() => handleMenuAction('convert', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11.375 1.75H2.625C1.8665 1.75 1.25 2.3665 1.25 3.125V10.875C1.25 11.6335 1.8665 12.25 2.625 12.25H11.375C12.1335 12.25 12.75 11.6335 12.75 10.875V3.125C12.75 2.3665 12.1335 1.75 11.375 1.75ZM11.875 10.875C11.875 11.15 11.65 11.375 11.375 11.375H2.625C2.35 11.375 2.125 11.15 2.125 10.875V3.125C2.125 2.85 2.35 2.625 2.625 2.625H11.375C11.65 2.625 11.875 2.85 11.875 3.125V10.875Z" fill="currentColor"/>
                          </svg>
                          Convert to Project
                        </button>
                        <button onClick={() => handleMenuAction('brandbot', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 1.75C4.1005 1.75 1.75 4.1005 1.75 7C1.75 9.8995 4.1005 12.25 7 12.25C9.8995 12.25 12.25 9.8995 12.25 7C12.25 4.1005 9.8995 1.75 7 1.75ZM5.25 5.25C5.7332 5.25 6.125 5.6418 6.125 6.125C6.125 6.6082 5.7332 7 5.25 7C4.7668 7 4.375 6.6082 4.375 6.125C4.375 5.6418 4.7668 5.25 5.25 5.25ZM8.75 5.25C9.2332 5.25 9.625 5.6418 9.625 6.125C9.625 6.6082 9.2332 7 8.75 7C8.2668 7 7.875 6.6082 7.875 6.125C7.875 5.6418 8.2668 5.25 8.75 5.25ZM7 10.5C5.9165 10.5 4.9585 9.9415 4.375 9.0625H9.625C9.0415 9.9415 8.0835 10.5 7 10.5Z" fill="currentColor"/>
                          </svg>
                          Switch BrandBot
                        </button>
                        <div className="workspace-dropdown__menu-divider"></div>
                        <button onClick={() => handleMenuAction('unpin', workspace)} className="workspace-dropdown__menu-item--pin">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M8.75 1.75L5.25 1.75C4.9668 1.75 4.7332 1.9668 4.7332 2.25L4.7332 7L3.5 8.75L10.5 8.75L9.2668 7L9.2668 2.25C9.2668 1.9668 9.0332 1.75 8.75 1.75ZM7 12.25L7 9.625L7 12.25Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Unpin
                        </button>
                      </div>
                    )}
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
                  <div className="workspace-dropdown__item-content">
                    <div className="workspace-dropdown__item-name">{workspace.name}</div>
                    <div className="workspace-dropdown__item-meta">Last updated {workspace.lastUpdated}</div>
                  </div>
                  <div className="workspace-dropdown__item-actions">
                    <button
                      className="workspace-dropdown__ellipsis-btn"
                      onClick={(e) => handleEllipsisClick(e, workspace.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" fill="currentColor"/>
                        <path d="M8 4C8.55228 4 9 3.55228 9 3C9 2.44772 8.55228 2 8 2C7.44772 2 7 2.44772 7 3C7 3.55228 7.44772 4 8 4Z" fill="currentColor"/>
                        <path d="M8 14C8.55228 14 9 13.5523 9 13C9 12.4477 8.55228 12 8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z" fill="currentColor"/>
                      </svg>
                    </button>
                    {activeEllipsisMenu === workspace.id && (
                      <div className="workspace-dropdown__ellipsis-menu">
                        <button onClick={() => handleMenuAction('rename', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M6.36 2.68L2.5 6.54V8.96H4.92L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Rename
                        </button>
                        <button onClick={() => handleMenuAction('share', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M10.5 5.25C11.4665 5.25 12.25 4.4665 12.25 3.5C12.25 2.5335 11.4665 1.75 10.5 1.75C9.5335 1.75 8.75 2.5335 8.75 3.5C8.75 3.71 8.785 3.913 8.848 4.102L5.152 6.125C4.816 5.7525 4.336 5.25 3.5 5.25C2.5335 5.25 1.75 6.0335 1.75 7C1.75 7.9665 2.5335 8.75 3.5 8.75C4.336 8.75 4.816 8.2475 5.152 7.875L8.848 9.898C8.785 10.087 8.75 10.29 8.75 10.5C8.75 11.4665 9.5335 12.25 10.5 12.25C11.4665 12.25 12.25 11.4665 12.25 10.5C12.25 9.5335 11.4665 8.75 10.5 8.75C9.664 8.75 9.184 9.2525 8.848 9.625L5.152 7.602C5.215 7.413 5.25 7.21 5.25 7C5.25 6.79 5.215 6.587 5.152 6.398L8.848 4.375C9.184 4.7475 9.664 5.25 10.5 5.25Z" fill="currentColor"/>
                          </svg>
                          Share
                        </button>
                        <button onClick={() => handleMenuAction('unshare', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M10.5 5.25C11.4665 5.25 12.25 4.4665 12.25 3.5C12.25 2.5335 11.4665 1.75 10.5 1.75C9.5335 1.75 8.75 2.5335 8.75 3.5C8.75 3.71 8.785 3.913 8.848 4.102L5.152 6.125C4.816 5.7525 4.336 5.25 3.5 5.25C2.5335 5.25 1.75 6.0335 1.75 7C1.75 7.9665 2.5335 8.75 3.5 8.75C4.336 8.75 4.816 8.2475 5.152 7.875L8.848 9.898C8.785 10.087 8.75 10.29 8.75 10.5C8.75 11.4665 9.5335 12.25 10.5 12.25C11.4665 12.25 12.25 11.4665 12.25 10.5C12.25 9.5335 11.4665 8.75 10.5 8.75C9.664 8.75 9.184 9.2525 8.848 9.625L5.152 7.602C5.215 7.413 5.25 7.21 5.25 7C5.25 6.79 5.215 6.587 5.152 6.398L8.848 4.375C9.184 4.7475 9.664 5.25 10.5 5.25Z" fill="currentColor"/>
                          </svg>
                          Unshare
                        </button>
                        <button onClick={() => handleMenuAction('transfer', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 1.75C4.1005 1.75 1.75 4.1005 1.75 7C1.75 9.8995 4.1005 12.25 7 12.25C9.8995 12.25 12.25 9.8995 12.25 7C12.25 4.1005 9.8995 1.75 7 1.75ZM7 11.375C4.583 11.375 2.625 9.417 2.625 7C2.625 4.583 4.583 2.625 7 2.625C9.417 2.625 11.375 4.583 11.375 7C11.375 9.417 9.417 11.375 7 11.375ZM8.75 5.25L7 7V4.375C7.4832 4.375 7.875 4.7668 7.875 5.25H8.75ZM5.25 8.75L7 7H9.625C9.625 7.4832 9.2332 7.875 8.75 7.875V8.75Z" fill="currentColor"/>
                          </svg>
                          Transfer Ownership
                        </button>
                        <button onClick={() => handleMenuAction('leave', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M5.25 12.25H2.625C2.35 12.25 2.125 12.025 2.125 11.75V2.25C2.125 1.975 2.35 1.75 2.625 1.75H5.25V0.875H2.625C1.8665 0.875 1.25 1.4915 1.25 2.25V11.75C1.25 12.5085 1.8665 13.125 2.625 13.125H5.25V12.25ZM10.5 9.625L9.8125 8.9375L11.375 7.375H5.25V6.625H11.375L9.8125 5.0625L10.5 4.375L13.125 7L10.5 9.625Z" fill="currentColor"/>
                          </svg>
                          Leave
                        </button>
                        <button onClick={() => handleMenuAction('archive', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M12.25 3.5H1.75V2.625C1.75 2.35 1.975 2.125 2.25 2.125H11.75C12.025 2.125 12.25 2.35 12.25 2.625V3.5ZM1.75 4.375H12.25V11.375C12.25 11.65 12.025 11.875 11.75 11.875H2.25C1.975 11.875 1.75 11.65 1.75 11.375V4.375ZM5.25 6.125V7H8.75V6.125H5.25Z" fill="currentColor"/>
                          </svg>
                          Archive
                        </button>
                        <button onClick={() => handleMenuAction('convert', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11.375 1.75H2.625C1.8665 1.75 1.25 2.3665 1.25 3.125V10.875C1.25 11.6335 1.8665 12.25 2.625 12.25H11.375C12.1335 12.25 12.75 11.6335 12.75 10.875V3.125C12.75 2.3665 12.1335 1.75 11.375 1.75ZM11.875 10.875C11.875 11.15 11.65 11.375 11.375 11.375H2.625C2.35 11.375 2.125 11.15 2.125 10.875V3.125C2.125 2.85 2.35 2.625 2.625 2.625H11.375C11.65 2.625 11.875 2.85 11.875 3.125V10.875Z" fill="currentColor"/>
                          </svg>
                          Convert to Project
                        </button>
                        <button onClick={() => handleMenuAction('brandbot', workspace)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 1.75C4.1005 1.75 1.75 4.1005 1.75 7C1.75 9.8995 4.1005 12.25 7 12.25C9.8995 12.25 12.25 9.8995 12.25 7C12.25 4.1005 9.8995 1.75 7 1.75ZM5.25 5.25C5.7332 5.25 6.125 5.6418 6.125 6.125C6.125 6.6082 5.7332 7 5.25 7C4.7668 7 4.375 6.6082 4.375 6.125C4.375 5.6418 4.7668 5.25 5.25 5.25ZM8.75 5.25C9.2332 5.25 9.625 5.6418 9.625 6.125C9.625 6.6082 9.2332 7 8.75 7C8.2668 7 7.875 6.6082 7.875 6.125C7.875 5.6418 8.2668 5.25 8.75 5.25ZM7 10.5C5.9165 10.5 4.9585 9.9415 4.375 9.0625H9.625C9.0415 9.9415 8.0835 10.5 7 10.5Z" fill="currentColor"/>
                          </svg>
                          Switch BrandBot
                        </button>
                        <div className="workspace-dropdown__menu-divider"></div>
                        <button onClick={() => handleMenuAction('pin', workspace)} className="workspace-dropdown__menu-item--pin">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M8.75 1.75L5.25 1.75C4.9668 1.75 4.7332 1.9668 4.7332 2.25L4.7332 7L3.5 8.75L10.5 8.75L9.2668 7L9.2668 2.25C9.2668 1.9668 9.0332 1.75 8.75 1.75ZM7 12.25L7 9.625L7 12.25Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Pin
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="workspace-dropdown__pagination">
            <div className="workspace-dropdown__pagination-info">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, allWorkspaces.length)} of {allWorkspaces.length} workspaces
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