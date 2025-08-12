import React, { useState, useMemo, useEffect } from 'react';
import { SearchInput, Button, Select, Dropdown, DropdownItem, DropdownDivider, ContextMenu, TagManagementModal } from '../ui';
import { EllipsisIcon, PlusIcon } from '../icons';
import '../../styles/SavedWorkDrawer.scss';

// Mock data for saved documents - replace with actual API call
const mockSavedDocuments = [
  {
    id: 1,
    title: 'Social Media Campaign - Q4 2024',
    type: 'social_post',
    project: 'Marketing Campaign',
    tags: ['social_post', 'campaign'],
    status: 'approved',
    lastUpdated: '2024-12-10',
    createdDate: '2024-12-01',
    author: 'Brand Bot'
  },
  {
    id: 2,
    title: 'Welcome Email Sequence',
    type: 'email',
    project: 'Customer Onboarding',
    tags: ['email', 'onboarding'],
    status: 'draft',
    lastUpdated: '2024-12-08',
    createdDate: '2024-12-05',
    author: 'Brand Bot'
  },
  {
    id: 3,
    title: 'Product Launch Press Release',
    type: 'press_release',
    project: 'Product Launch',
    tags: ['press_release', 'launch'],
    status: 'approved',
    lastUpdated: '2024-12-07',
    createdDate: '2024-11-30',
    author: 'Brand Bot'
  },
  {
    id: 4,
    title: 'Holiday Campaign Brief',
    type: 'campaign',
    project: 'Holiday Marketing',
    tags: ['campaign', 'holiday'],
    status: 'in_review',
    lastUpdated: '2024-12-09',
    createdDate: '2024-12-02',
    author: 'Brand Bot'
  },
  // Add more mock documents for testing
  {
    id: 5,
    title: 'LinkedIn Post Series - Thought Leadership',
    type: 'social_post',
    project: 'Content Marketing',
    tags: ['social_post', 'linkedin'],
    status: 'approved',
    lastUpdated: '2024-12-06',
    createdDate: '2024-11-28',
    author: 'Brand Bot'
  }
];

// Predefined canned tags - as specified in requirements
const predefinedTags = [
  { value: 'email', label: 'Email' },
  { value: 'social_post', label: 'Social Post' },
  { value: 'campaign', label: 'Campaign' },
  { value: 'landing_page', label: 'Landing Page' },
  { value: 'blog', label: 'Blog' },
  { value: 'paid_ad', label: 'Paid Ad' },
  { value: 'internal', label: 'Internal' },
  { value: 'sales_copy', label: 'Sales Copy' },
  { value: 'other', label: 'Other' }
];

// Get unique projects from documents
const getUniqueProjects = (documents) => {
  const projects = [...new Set(documents.map(doc => doc.project))];
  return projects.map(project => ({ value: project, label: project }));
};

const SavedWorkDrawer = ({ isOpen, onClose, onDocumentSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all'); // Single category selection
  const [sortBy, setSortBy] = useState('date_desc');
  const [documents, setDocuments] = useState(mockSavedDocuments);
  const [activeDocumentMenu, setActiveDocumentMenu] = useState(null);
  const [tagManagementModal, setTagManagementModal] = useState({ isOpen: false, document: null });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDocumentMenu && !event.target.closest('.saved-work-drawer__card-menu-container')) {
        setActiveDocumentMenu(null);
      }
    };

    if (activeDocumentMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeDocumentMenu]);

  // Get unique projects for filter
  const projectOptions = useMemo(() => [
    { value: 'all', label: 'All Projects' },
    ...getUniqueProjects(documents)
  ], [documents]);

  // Category options for dropdown
  const categoryOptions = useMemo(() => [
    { value: 'all', label: 'All Categories' },
    ...predefinedTags
  ], []);

  // Sort options
  const sortOptions = [
    { value: 'date_desc', label: 'Newest to Oldest' },
    { value: 'date_asc', label: 'Oldest to Newest' },
    { value: 'name_asc', label: 'A–Z' },
    { value: 'name_desc', label: 'Z–A' }
  ];

  // Helper functions
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedProject('all');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedProject !== 'all' || searchTerm.length >= 3;

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Apply search filter
    if (searchTerm.length >= 3) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply project filter
    if (selectedProject !== 'all') {
      filtered = filtered.filter(doc => doc.project === selectedProject);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => 
        (doc.tags || []).includes(selectedCategory)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        case 'date_asc':
          return new Date(a.lastUpdated) - new Date(b.lastUpdated);
        case 'name_asc':
          return a.title.localeCompare(b.title);
        case 'name_desc':
          return b.title.localeCompare(a.title);
        case 'project':
          return a.project.localeCompare(b.project);
        default:
          return 0;
      }
    });

    return filtered;
  }, [documents, searchTerm, selectedProject, selectedCategory, sortBy]);

  const handleDocumentClick = (document) => {
    if (onDocumentSelect) {
      onDocumentSelect(document);
    }
  };

  const handleDocumentMenuClick = (documentId, event) => {
    event.stopPropagation();
    setActiveDocumentMenu(activeDocumentMenu === documentId ? null : documentId);
  };

  const handleDocumentAction = (action, document) => {
    setActiveDocumentMenu(null); // Close menu
    console.log(`${action} document:`, document);
    
    // Implement actions based on requirements
    switch (action) {
      case 'edit':
        handleDocumentClick(document);
        break;
      case 'share':
        // Implement share functionality
        console.log('Sharing document:', document);
        break;
      case 'archive':
        // Implement archive functionality
        console.log('Archiving document:', document);
        break;
      case 'move':
        // Show move to project modal
        console.log('Moving document:', document);
        break;
      case 'manage_tags':
        // Show tag management modal
        setTagManagementModal({ isOpen: true, document });
        break;
      case 'delete':
        // Show delete confirmation
        console.log('Deleting document:', document);
        break;
      default:
        break;
    }
  };

  const handleTagSave = (documentId, newTags) => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === documentId 
          ? { ...doc, tags: newTags }
          : doc
      )
    );
    console.log(`Updated tags for document ${documentId}:`, newTags);
  };

  // Helper function to render document tags with truncation
  const renderDocumentTags = (tags, maxVisible = 3, document) => {
    const visibleTags = tags && tags.length > 0 ? tags.slice(0, maxVisible) : [];
    const remainingCount = tags ? tags.length - maxVisible : 0;

    return (
      <div className="saved-work-drawer__card-tags">
        {/* Add Tag Button */}
        <button 
          className="saved-work-drawer__add-tag"
          onClick={(e) => {
            e.stopPropagation();
            handleDocumentAction('manage_tags', document);
          }}
          title="Manage Tags"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Existing Tags */}
        {visibleTags.map(tag => {
          const tagInfo = predefinedTags.find(t => t.value === tag);
          return (
            <span key={tag} className="saved-work-drawer__tag-chip">
              {tagInfo ? tagInfo.label : tag}
            </span>
          );
        })}
        {remainingCount > 0 && (
          <span className="saved-work-drawer__tag-more">+{remainingCount} more</span>
        )}
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#16A34A';
      case 'draft':
        return '#E98B2D';
      case 'in_review':
        return '#2563EB';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'draft':
        return 'Draft';
      case 'in_review':
        return 'In Review';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="saved-work-drawer__backdrop" onClick={onClose} />
      
      {/* Drawer */}
      <div className={`saved-work-drawer ${isOpen ? 'saved-work-drawer--open' : ''}`}>
        {/* Header */}
        <div className="saved-work-drawer__header">
          <div className="saved-work-drawer__title">Saved Work</div>
          <button className="saved-work-drawer__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="saved-work-drawer__subtitle">
          Manage all your documents created through Ella
        </div>

        {/* Filtering UI */}
        <div className="saved-work-drawer__filters">
          {/* Filter Row */}
          <div className="saved-work-drawer__filter-row">
            {/* Search Field */}
            <div className="saved-work-drawer__filter-group saved-work-drawer__filter-group--search">
              <SearchInput
                placeholder="Search saved work..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm('')}
                variant="search"
              />
            </div>
            {/* Category Filter */}
            {/* Clear Filters Button */}
            {hasActiveFilters && (
            <div className="saved-work-drawer__clear-filters-container">
              <button 
                className="saved-work-drawer__clear-filters"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
            )}
            <div className="saved-work-drawer__filter-group">
              <label className="saved-work-drawer__filter-label">Category:</label>
              <Select
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
                options={categoryOptions}
                className="saved-work-drawer__category-select"
              />
            </div>

            {/* Project Filter */}
            <div className="saved-work-drawer__filter-group">
              <label className="saved-work-drawer__filter-label">Project:</label>
              <Select
                value={selectedProject}
                onChange={(value) => setSelectedProject(value)}
                options={projectOptions}
                className="saved-work-drawer__project-select"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="saved-work-drawer__filter-group saved-work-drawer__filter-group--right">
              <label className="saved-work-drawer__filter-label">Sort by:</label>
              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                options={sortOptions}
                className="saved-work-drawer__sort-select"
              />
            </div>
          </div>
        </div>

        {/* Document Grid */}
        <div className="saved-work-drawer__content">
          {filteredDocuments.length === 0 ? (
            <div className="saved-work-drawer__empty">
              <div className="saved-work-drawer__empty-icon">📄</div>
              <div className="saved-work-drawer__empty-title">
                {hasActiveFilters
                  ? 'No saved work matches your filters.'
                  : 'No saved documents yet'
                }
              </div>
              <div className="saved-work-drawer__empty-text">
                {hasActiveFilters
                  ? 'Try adjusting your search or filters'
                  : 'Documents you create with Ella will appear here'
                }
              </div>
            </div>
          ) : (
            <div className="saved-work-drawer__grid">
              {filteredDocuments.map((document) => (
                <div 
                  key={document.id} 
                  className="saved-work-drawer__card"
                  onClick={() => handleDocumentClick(document)}
                >
                  {/* Card Header */}
                  <div className="saved-work-drawer__card-header">
                    <div className="saved-work-drawer__card-title">
                      {document.title}
                    </div>
                    <div className="saved-work-drawer__card-menu-container">
                      <button 
                        className="saved-work-drawer__card-menu"
                        onClick={(e) => handleDocumentMenuClick(document.id, e)}
                      >
                        <EllipsisIcon />
                      </button>
                      
                      {activeDocumentMenu === document.id && (
                        <div className="saved-work-drawer__document-dropdown">
                          <button 
                            className="saved-work-drawer__document-dropdown-option"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDocumentAction('edit', document);
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M6.36 2.68L2.5 6.54L2.5 8.96L4.92 8.96L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46ZM1.5 5.54L8.78 -1.74C9.17 -2.13 9.81 -2.13 10.2 -1.74L11.24 -0.7C11.63 -0.31 11.63 0.33 11.24 0.72L3.96 7.96L1.5 8.96L1.5 5.54Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Edit
                          </button>
                          <button 
                            className="saved-work-drawer__document-dropdown-option"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDocumentAction('share', document);
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M11 9.5C10.59 9.5 10.22 9.65 9.93 9.88L4.69 7.26C4.73 7.09 4.75 6.91 4.75 6.75C4.75 6.59 4.73 6.41 4.69 6.24L9.93 3.62C10.22 3.85 10.59 4 11 4C12.1 4 13 3.1 13 2C13 0.9 12.1 0 11 0C9.9 0 9 0.9 9 2C9 2.16 9.02 2.34 9.06 2.51L3.82 5.13C3.53 4.9 3.16 4.75 2.75 4.75C1.65 4.75 0.75 5.65 0.75 6.75C0.75 7.85 1.65 8.75 2.75 8.75C3.16 8.75 3.53 8.6 3.82 8.37L9.06 10.99C9.02 11.16 9 11.34 9 11.5C9 12.6 9.9 13.5 11 13.5C12.1 13.5 13 12.6 13 11.5C13 10.4 12.1 9.5 11 9.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Share
                          </button>
                          <button 
                            className="saved-work-drawer__document-dropdown-option"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDocumentAction('archive', document);
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M12.25 3.5L1.75 3.5L1.75 11.25C1.75 11.8 2.2 12.25 2.75 12.25L11.25 12.25C11.8 12.25 12.25 11.8 12.25 11.25L12.25 3.5ZM5.25 7L8.75 7M0.5 1.75L13.5 1.75C13.78 1.75 14 1.97 14 2.25L14 3.5L0 3.5L0 2.25C0 1.97 0.22 1.75 0.5 1.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Archive
                          </button>
                          <button 
                            className="saved-work-drawer__document-dropdown-option"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDocumentAction('move', document);
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2.5 1.75L11.5 1.75C12.05 1.75 12.5 2.2 12.5 2.75L12.5 4.75M1.5 5.75L10.5 5.75C11.05 5.75 11.5 6.2 11.5 6.75L11.5 11.25C11.5 11.8 11.05 12.25 10.5 12.25L1.5 12.25C0.95 12.25 0.5 11.8 0.5 11.25L0.5 6.75C0.5 6.2 0.95 5.75 1.5 5.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Move
                          </button>
                          <button 
                            className="saved-work-drawer__document-dropdown-option"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDocumentAction('manage_tags', document);
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M7 1.5L12.5 7L7 12.5L1.5 7L7 1.5ZM7 4C6.17 4 5.5 4.67 5.5 5.5C5.5 6.33 6.17 7 7 7C7.83 7 8.5 6.33 8.5 5.5C8.5 4.67 7.83 4 7 4Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Manage Tags
                          </button>
                          <hr className="saved-work-drawer__document-dropdown-divider" />
                          <button 
                            className="saved-work-drawer__document-dropdown-option saved-work-drawer__document-dropdown-option--danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDocumentAction('delete', document);
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M1.75 3.5L12.25 3.5M5.25 3.5L5.25 2.25C5.25 1.7 5.7 1.25 6.25 1.25L7.75 1.25C8.3 1.25 8.75 1.7 8.75 2.25L8.75 3.5M10.5 3.5L10.5 11.25C10.5 11.8 10.05 12.25 9.5 12.25L4.5 12.25C3.95 12.25 3.5 11.8 3.5 11.25L3.5 3.5M5.75 6.25L5.75 9.5M8.25 6.25L8.25 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Content - Matching Elements design */}
                  <div className="saved-work-drawer__card-content">
                    <div className="saved-work-drawer__card-status">
                      <span className="saved-work-drawer__status-label">Status:</span>
                      <span 
                        className="saved-work-drawer__status-value"
                        style={{ color: getStatusColor(document.status) }}
                      >
                        {getStatusLabel(document.status)}
                      </span>
                    </div>
                    
                    <div className="saved-work-drawer__card-meta">
                      <div className="saved-work-drawer__card-date">
                        Last task review: {formatDate(document.lastUpdated)}
                      </div>
                      {/* <div className="saved-work-drawer__card-author">
                        by {document.author}
                      </div> */}
                    </div>

                    {/* Tags */}
                    {renderDocumentTags(document.tags, 3, document)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Matching Elements design */}
        <div className="saved-work-drawer__footer">
          <button 
            className="saved-work-drawer__close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* Tag Management Modal */}
        <TagManagementModal
          isOpen={tagManagementModal.isOpen}
          onClose={() => setTagManagementModal({ isOpen: false, document: null })}
          onSave={handleTagSave}
          document={tagManagementModal.document}
          predefinedTags={predefinedTags}
        />
      </div>
    </>
  );
};

export default SavedWorkDrawer;