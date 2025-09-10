import React, { useEffect, useState } from 'react';
import { ProjectIcon } from '../icons';
import '../../styles/OrganizationDropdown.scss';

const OrganizationDropdown = ({ isOpen, onClose, onOrganizationCreated, onOpenCreateOrganization, selectedOrganization, onOrganizationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeEllipsisMenu, setActiveEllipsisMenu] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');
  const itemsPerPage = 6;

  // Mock data - replace with actual data from your state management
  const [pinnedOrganizations, setPinnedOrganizations] = useState([
    { id: 101, name: 'Acme Corp', lastUpdated: '2 days ago', icon: 'corporate', isPinned: true, workspaceCount: 8 },
    { id: 102, name: 'TechStart Inc', lastUpdated: '1 week ago', icon: 'corporate', isPinned: true, workspaceCount: 5 }
  ]);

  const [allOrganizations, setAllOrganizations] = useState([
    { id: 1, name: 'Global Dynamics', lastUpdated: '3 days ago', isActive: true, isPinned: false, workspaceCount: 12 },
    { id: 2, name: 'Innovation Labs', lastUpdated: '1 week ago', isActive: false, isPinned: false, workspaceCount: 7 },
    { id: 3, name: 'Creative Solutions', lastUpdated: '2 weeks ago', isActive: false, isPinned: false, workspaceCount: 4 },
    { id: 4, name: 'Digital Agency', lastUpdated: '3 weeks ago', isActive: false, isPinned: false, workspaceCount: 9 },
    { id: 5, name: 'Startup Ventures', lastUpdated: '1 month ago', isActive: false, isPinned: false, workspaceCount: 3 },
    { id: 6, name: 'Enterprise Corp', lastUpdated: '2 months ago', isActive: false, isPinned: false, workspaceCount: 15 }
  ]);

  // Sort organizations based on selected sort order
  const sortOrganizations = (organizations, sortOrder) => {
    switch (sortOrder) {
      case 'a-z':
        return [...organizations].sort((a, b) => a.name.localeCompare(b.name));
      case 'z-a':
        return [...organizations].sort((a, b) => b.name.localeCompare(a.name));
      case 'workspaces':
        return [...organizations].sort((a, b) => b.workspaceCount - a.workspaceCount);
      case 'default':
      default:
        return organizations;
    }
  };

  const sortedOrganizations = sortOrganizations(allOrganizations, sortOrder);
  const sortedPinnedOrganizations = sortOrganizations(pinnedOrganizations, sortOrder);

  const totalPages = Math.ceil(sortedOrganizations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrganizations = sortedOrganizations.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateOrganization = () => {
    if (onOpenCreateOrganization) onOpenCreateOrganization();
    onClose && onClose();
  };

  const handleOrganizationSelect = (organization) => {
    // Update selected organization via callback
    if (onOrganizationSelect) {
      onOrganizationSelect(organization);
    }
    console.log('Selected organization:', organization);
    onClose();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Add search functionality here
  };

  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  // Handle ellipsis menu toggle
  const handleEllipsisClick = (e, organizationId) => {
    e.stopPropagation();
    setActiveEllipsisMenu(activeEllipsisMenu === organizationId ? null : organizationId);
  };

  // Handle pin/unpin organization
  const handlePinToggle = (organization) => {
    if (organization.isPinned) {
      // Unpin: Remove from pinned and add back to all organizations
      setPinnedOrganizations(prev => prev.filter(w => w.id !== organization.id));
      setAllOrganizations(prev => [...prev, { ...organization, isPinned: false }].sort((a, b) => a.id - b.id));
    } else {
      // Pin: Remove from all organizations and add to pinned
      setAllOrganizations(prev => prev.filter(w => w.id !== organization.id));
      setPinnedOrganizations(prev => [...prev, { ...organization, isPinned: true }]);
    }
    setActiveEllipsisMenu(null);
  };

  // Handle menu actions
  const handleMenuAction = (action, organization) => {
    console.log(`${action} organization:`, organization.name);
    setActiveEllipsisMenu(null);
    
    switch (action) {
      case 'pin':
      case 'unpin':
        handlePinToggle(organization);
        break;
      case 'rename':
        // TODO: Open rename modal
        break;
      case 'settings':
        // TODO: Open organization settings
        break;
      case 'billing':
        // TODO: Open billing settings
        break;
      case 'members':
        // TODO: Open members management
        break;
      case 'leave':
        // TODO: Handle leave organization
        break;
      case 'archive':
        // TODO: Handle archive organization
        break;
      default:
        break;
    }
  };

  // Close ellipsis menu and filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeEllipsisMenu && !event.target.closest('.organization-dropdown__ellipsis-menu')) {
        setActiveEllipsisMenu(null);
      }
      if (filterOpen && !event.target.closest('.organization-filter') && !event.target.closest('.organization-dropdown__search-btn')) {
        setFilterOpen(false);
      }
    };

    if (activeEllipsisMenu || filterOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeEllipsisMenu, filterOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay for blur effect */}
      <div className="organization-dropdown__backdrop" onClick={onClose} />
      
      <div 
        className={`organization-dropdown ${isOpen ? 'organization-dropdown--open' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="organization-dropdown__container">
          {/* Close Button - Prominent above content */}
          <div className="organization-dropdown__close-section">
            <div className="header__organization-text">Organization Menu</div>
            <button 
              className="organization-dropdown__close"
              onClick={onClose}
              aria-label="Close organization dropdown"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Create New Organization Button */}
          <div className="organization-dropdown__create">
            <button 
              className="organization-dropdown__create-btn"
              onClick={handleCreateOrganization}
            >
              Create New Organization
            </button>
          </div>

          {/* Search Bar */}
          <div className="organization-dropdown__search-container">
            <div className="organization-dropdown__search">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="organization-dropdown__search-icon">
                <path d="M6.5 11.5C9.26142 11.5 11.5 9.26142 11.5 6.5C11.5 3.73858 9.26142 1.5 6.5 1.5C3.73858 1.5 1.5 3.73858 1.5 6.5C1.5 9.26142 3.73858 11.5 6.5 11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.5 12.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={handleSearch}
                className="organization-dropdown__search-input"
              />
            </div>
            <div className="organization-dropdown__search-btn-container">
              <button 
                className={`organization-dropdown__search-btn ${filterOpen ? 'organization-dropdown__search-btn--active' : ''}`}
                onClick={handleFilterToggle}
                aria-label="Filter organizations"
              >
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
          </div>

          {/* Pinned Organizations */}
          {sortedPinnedOrganizations.length > 0 && (
            <div className="organization-dropdown__section">
              <div className="organization-dropdown__section-header">
                PINNED ORGANIZATIONS
              </div>
              <div className="organization-dropdown__items">
                {sortedPinnedOrganizations.map((organization) => (
                  <div
                    key={organization.id}
                    className={`organization-dropdown__item organization-dropdown__item--pinned ${selectedOrganization?.id === organization.id ? 'organization-dropdown__item--selected' : ''}`}
                    onClick={() => handleOrganizationSelect(organization)}
                  >
                    <div className="organization-dropdown__item-icon">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 1.5L11.5 6.5H16L12.5 10L14 15L9 12L4 15L5.5 10L2 6.5H6.5L9 1.5Z" fill="#6B7280"/>
                      </svg>
                    </div>
                    <div className="organization-dropdown__item-content">
                      <div className="organization-dropdown__item-name">{organization.name}</div>
                      <div className="organization-dropdown__item-meta">{organization.workspaceCount} workspaces • Last updated {organization.lastUpdated}</div>
                    </div>
                    <div className="organization-dropdown__item-actions">
                      <button
                        className="organization-dropdown__ellipsis-btn"
                        onClick={(e) => handleEllipsisClick(e, organization.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" fill="currentColor"/>
                          <path d="M8 4C8.55228 4 9 3.55228 9 3C9 2.44772 8.55228 2 8 2C7.44772 2 7 2.44772 7 3C7 3.55228 7.44772 4 8 4Z" fill="currentColor"/>
                          <path d="M8 14C8.55228 14 9 13.5523 9 13C9 12.4477 8.55228 12 8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z" fill="currentColor"/>
                        </svg>
                      </button>
                      {activeEllipsisMenu === organization.id && (
                        <div className="organization-dropdown__ellipsis-menu">
                          <button onClick={() => handleMenuAction('rename', organization)}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M6.36 2.68L2.5 6.54V8.96H4.92L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Rename
                          </button>
                          <button onClick={() => handleMenuAction('settings', organization)}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M7 4.375C5.7595 4.375 4.75 5.3845 4.75 6.625C4.75 7.8655 5.7595 8.875 7 8.875C8.2405 8.875 9.25 7.8655 9.25 6.625C9.25 5.3845 8.2405 4.375 7 4.375ZM11.375 5.6875L10.75 5.0625C10.6875 4.9375 10.625 4.8125 10.5625 4.6875L11.1875 3.9375C11.3125 3.8125 11.3125 3.625 11.1875 3.5L10.5 2.8125C10.375 2.6875 10.1875 2.6875 10.0625 2.8125L9.3125 3.4375C9.1875 3.375 9.0625 3.3125 8.9375 3.25L8.3125 2.625C8.1875 2.4375 8 2.375 7.8125 2.375H6.1875C6 2.375 5.8125 2.4375 5.6875 2.625L5.0625 3.25C4.9375 3.3125 4.8125 3.375 4.6875 3.4375L3.9375 2.8125C3.8125 2.6875 3.625 2.6875 3.5 2.8125L2.8125 3.5C2.6875 3.625 2.6875 3.8125 2.8125 3.9375L3.4375 4.6875C3.375 4.8125 3.3125 4.9375 3.25 5.0625L2.625 5.6875C2.4375 5.8125 2.375 6 2.375 6.1875V7.8125C2.375 8 2.4375 8.1875 2.625 8.3125L3.25 8.9375C3.3125 9.0625 3.375 9.1875 3.4375 9.3125L2.8125 10.0625C2.6875 10.1875 2.6875 10.375 2.8125 10.5L3.5 11.1875C3.625 11.3125 3.8125 11.3125 3.9375 11.1875L4.6875 10.5625C4.8125 10.625 4.9375 10.6875 5.0625 10.75L5.6875 11.375C5.8125 11.5625 6 11.625 6.1875 11.625H7.8125C8 11.625 8.1875 11.5625 8.3125 11.375L8.9375 10.75C9.0625 10.6875 9.1875 10.625 9.3125 10.5625L10.0625 11.1875C10.1875 11.3125 10.375 11.3125 10.5 11.1875L11.1875 10.5C11.3125 10.375 11.3125 10.1875 11.1875 10.0625L10.5625 9.3125C10.625 9.1875 10.6875 9.0625 10.75 8.9375L11.375 8.3125C11.5625 8.1875 11.625 8 11.625 7.8125V6.1875C11.625 6 11.5625 5.8125 11.375 5.6875Z" fill="currentColor"/>
                            </svg>
                            Settings
                          </button>
                          <button onClick={() => handleMenuAction('billing', organization)}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M12.25 3.5H1.75V2.625C1.75 2.35 1.975 2.125 2.25 2.125H11.75C12.025 2.125 12.25 2.35 12.25 2.625V3.5ZM1.75 4.375H12.25V11.375C12.25 11.65 12.025 11.875 11.75 11.875H2.25C1.975 11.875 1.75 11.65 1.75 11.375V4.375ZM7 8.75C7.69 8.75 8.25 8.19 8.25 7.5C8.25 6.81 7.69 6.25 7 6.25C6.31 6.25 5.75 6.81 5.75 7.5C5.75 8.19 6.31 8.75 7 8.75Z" fill="currentColor"/>
                            </svg>
                            Billing
                          </button>
                          <button onClick={() => handleMenuAction('members', organization)}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M4.375 3.5C4.375 4.4665 3.5915 5.25 2.625 5.25C1.6585 5.25 0.875 4.4665 0.875 3.5C0.875 2.5335 1.6585 1.75 2.625 1.75C3.5915 1.75 4.375 2.5335 4.375 3.5ZM13.125 3.5C13.125 4.4665 12.3415 5.25 11.375 5.25C10.4085 5.25 9.625 4.4665 9.625 3.5C9.625 2.5335 10.4085 1.75 11.375 1.75C12.3415 1.75 13.125 2.5335 13.125 3.5ZM8.75 7C8.75 7.9665 7.9665 8.75 7 8.75C6.0335 8.75 5.25 7.9665 5.25 7C5.25 6.0335 6.0335 5.25 7 5.25C7.9665 5.25 8.75 6.0335 8.75 7ZM0 10.5C0 9.0335 1.1585 7.875 2.625 7.875C4.0915 7.875 5.25 9.0335 5.25 10.5V12.25H0V10.5ZM8.75 10.5C8.75 9.0335 9.9085 7.875 11.375 7.875C12.8415 7.875 14 9.0335 14 10.5V12.25H8.75V10.5ZM4.375 12.25V10.5C4.375 9.52 4.795 8.645 5.4685 8.0125C6.265 9.625 7.8225 10.5 9.625 10.5V12.25H4.375Z" fill="currentColor"/>
                            </svg>
                            Members
                          </button>
                          <div className="organization-dropdown__menu-divider"></div>
                          <button onClick={() => handleMenuAction('unpin', organization)} className="organization-dropdown__menu-item--pin">
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
          )}

          {/* All Organizations */}
          <div className="organization-dropdown__section">
            <div className="organization-dropdown__section-header">
              ORGANIZATIONS
            </div>
            <div className="organization-dropdown__items">
              {currentOrganizations.map((organization) => (
                <div
                  key={organization.id}
                  className={`organization-dropdown__item ${organization.isActive ? 'organization-dropdown__item--active' : ''} ${selectedOrganization?.id === organization.id ? 'organization-dropdown__item--selected' : ''}`}
                  onClick={() => handleOrganizationSelect(organization)}
                >
                  <div className="organization-dropdown__item-content">
                    <div className="organization-dropdown__item-name">{organization.name}</div>
                    <div className="organization-dropdown__item-meta">{organization.workspaceCount} workspaces • Last updated {organization.lastUpdated}</div>
                  </div>
                  <div className="organization-dropdown__item-actions">
                    <button
                      className="organization-dropdown__ellipsis-btn"
                      onClick={(e) => handleEllipsisClick(e, organization.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" fill="currentColor"/>
                        <path d="M8 4C8.55228 4 9 3.55228 9 3C9 2.44772 8.55228 2 8 2C7.44772 2 7 2.44772 7 3C7 3.55228 7.44772 4 8 4Z" fill="currentColor"/>
                        <path d="M8 14C8.55228 14 9 13.5523 9 13C9 12.4477 8.55228 12 8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z" fill="currentColor"/>
                      </svg>
                    </button>
                    {activeEllipsisMenu === organization.id && (
                      <div className="organization-dropdown__ellipsis-menu">
                        <button onClick={() => handleMenuAction('rename', organization)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M6.36 2.68L2.5 6.54V8.96H4.92L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Rename
                        </button>
                        <button onClick={() => handleMenuAction('settings', organization)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 4.375C5.7595 4.375 4.75 5.3845 4.75 6.625C4.75 7.8655 5.7595 8.875 7 8.875C8.2405 8.875 9.25 7.8655 9.25 6.625C9.25 5.3845 8.2405 4.375 7 4.375ZM11.375 5.6875L10.75 5.0625C10.6875 4.9375 10.625 4.8125 10.5625 4.6875L11.1875 3.9375C11.3125 3.8125 11.3125 3.625 11.1875 3.5L10.5 2.8125C10.375 2.6875 10.1875 2.6875 10.0625 2.8125L9.3125 3.4375C9.1875 3.375 9.0625 3.3125 8.9375 3.25L8.3125 2.625C8.1875 2.4375 8 2.375 7.8125 2.375H6.1875C6 2.375 5.8125 2.4375 5.6875 2.625L5.0625 3.25C4.9375 3.3125 4.8125 3.375 4.6875 3.4375L3.9375 2.8125C3.8125 2.6875 3.625 2.6875 3.5 2.8125L2.8125 3.5C2.6875 3.625 2.6875 3.8125 2.8125 3.9375L3.4375 4.6875C3.375 4.8125 3.3125 4.9375 3.25 5.0625L2.625 5.6875C2.4375 5.8125 2.375 6 2.375 6.1875V7.8125C2.375 8 2.4375 8.1875 2.625 8.3125L3.25 8.9375C3.3125 9.0625 3.375 9.1875 3.4375 9.3125L2.8125 10.0625C2.6875 10.1875 2.6875 10.375 2.8125 10.5L3.5 11.1875C3.625 11.3125 3.8125 11.3125 3.9375 11.1875L4.6875 10.5625C4.8125 10.625 4.9375 10.6875 5.0625 10.75L5.6875 11.375C5.8125 11.5625 6 11.625 6.1875 11.625H7.8125C8 11.625 8.1875 11.5625 8.3125 11.375L8.9375 10.75C9.0625 10.6875 9.1875 10.625 9.3125 10.5625L10.0625 11.1875C10.1875 11.3125 10.375 11.3125 10.5 11.1875L11.1875 10.5C11.3125 10.375 11.3125 10.1875 11.1875 10.0625L10.5625 9.3125C10.625 9.1875 10.6875 9.0625 10.75 8.9375L11.375 8.3125C11.5625 8.1875 11.625 8 11.625 7.8125V6.1875C11.625 6 11.5625 5.8125 11.375 5.6875Z" fill="currentColor"/>
                          </svg>
                          Settings
                        </button>
                        <button onClick={() => handleMenuAction('billing', organization)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M12.25 3.5H1.75V2.625C1.75 2.35 1.975 2.125 2.25 2.125H11.75C12.025 2.125 12.25 2.35 12.25 2.625V3.5ZM1.75 4.375H12.25V11.375C12.25 11.65 12.025 11.875 11.75 11.875H2.25C1.975 11.875 1.75 11.65 1.75 11.375V4.375ZM7 8.75C7.69 8.75 8.25 8.19 8.25 7.5C8.25 6.81 7.69 6.25 7 6.25C6.31 6.25 5.75 6.81 5.75 7.5C5.75 8.19 6.31 8.75 7 8.75Z" fill="currentColor"/>
                          </svg>
                          Billing
                        </button>
                        <button onClick={() => handleMenuAction('members', organization)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M4.375 3.5C4.375 4.4665 3.5915 5.25 2.625 5.25C1.6585 5.25 0.875 4.4665 0.875 3.5C0.875 2.5335 1.6585 1.75 2.625 1.75C3.5915 1.75 4.375 2.5335 4.375 3.5ZM13.125 3.5C13.125 4.4665 12.3415 5.25 11.375 5.25C10.4085 5.25 9.625 4.4665 9.625 3.5C9.625 2.5335 10.4085 1.75 11.375 1.75C12.3415 1.75 13.125 2.5335 13.125 3.5ZM8.75 7C8.75 7.9665 7.9665 8.75 7 8.75C6.0335 8.75 5.25 7.9665 5.25 7C5.25 6.0335 6.0335 5.25 7 5.25C7.9665 5.25 8.75 6.0335 8.75 7ZM0 10.5C0 9.0335 1.1585 7.875 2.625 7.875C4.0915 7.875 5.25 9.0335 5.25 10.5V12.25H0V10.5ZM8.75 10.5C8.75 9.0335 9.9085 7.875 11.375 7.875C12.8415 7.875 14 9.0335 14 10.5V12.25H8.75V10.5ZM4.375 12.25V10.5C4.375 9.52 4.795 8.645 5.4685 8.0125C6.265 9.625 7.8225 10.5 9.625 10.5V12.25H4.375Z" fill="currentColor"/>
                          </svg>
                          Members
                        </button>
                        <div className="organization-dropdown__menu-divider"></div>
                        <button onClick={() => handleMenuAction('pin', organization)} className="organization-dropdown__menu-item--pin">
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
          {totalPages > 1 && (
            <div className="organization-dropdown__pagination">
              <div className="organization-dropdown__pagination-info">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedOrganizations.length)} of {sortedOrganizations.length} organizations
              </div>
              <div className="organization-dropdown__pagination-controls">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`organization-dropdown__pagination-btn ${currentPage === i + 1 ? 'organization-dropdown__pagination-btn--active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrganizationDropdown;
