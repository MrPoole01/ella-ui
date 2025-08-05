import React, { useState, useMemo } from 'react';
import { SearchInput, Button, Select, Dropdown, DropdownItem, DropdownDivider, ContextMenu } from '../ui';
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
  const [selectedTags, setSelectedTags] = useState([]); // Changed to array for multiple selection
  const [sortBy, setSortBy] = useState('date_desc');
  const [documents] = useState(mockSavedDocuments);

  // Get unique projects for filter
  const projectOptions = useMemo(() => [
    { value: 'all', label: 'All Projects' },
    ...getUniqueProjects(documents)
  ], [documents]);

  // Sort options
  const sortOptions = [
    { value: 'date_desc', label: 'Newest to Oldest' },
    { value: 'date_asc', label: 'Oldest to Newest' },
    { value: 'name_asc', label: 'A–Z' },
    { value: 'name_desc', label: 'Z–A' }
  ];

  // Helper functions
  const toggleTag = (tagValue) => {
    setSelectedTags(prev => 
      prev.includes(tagValue) 
        ? prev.filter(tag => tag !== tagValue)
        : [...prev, tagValue]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedProject('all');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedProject !== 'all' || searchTerm.length >= 3;

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Apply search filter
    if (searchTerm.length >= 3) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply project filter
    if (selectedProject !== 'all') {
      filtered = filtered.filter(doc => doc.project === selectedProject);
    }

    // Apply tag filters with AND logic - all selected tags must be present
    if (selectedTags.length > 0) {
      filtered = filtered.filter(doc => 
        selectedTags.every(selectedTag => doc.tags.includes(selectedTag))
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
  }, [documents, searchTerm, selectedProject, selectedTags, sortBy]);

  const handleDocumentClick = (document) => {
    if (onDocumentSelect) {
      onDocumentSelect(document);
    }
  };

  const handleDocumentAction = (action, document) => {
    console.log(`${action} document:`, document);
    // Implement actions based on requirements
    switch (action) {
      case 'edit':
        handleDocumentClick(document);
        break;
      case 'view':
        handleDocumentClick(document);
        break;
      case 'rename':
        // Show rename modal
        break;
      case 'delete':
        // Show delete confirmation
        break;
      case 'move':
        // Show move to project modal
        break;
      case 'manage_tags':
        // Show tag management modal
        console.log('Managing tags for document:', document);
        break;
      case 'download_pdf':
        // Trigger PDF download
        break;
      case 'download_docx':
        // Trigger DOCX download
        break;
      default:
        break;
    }
  };

  // Helper function to render document tags with truncation
  const renderDocumentTags = (tags, maxVisible = 3) => {
    if (!tags || tags.length === 0) return null;

    const visibleTags = tags.slice(0, maxVisible);
    const remainingCount = tags.length - maxVisible;

    return (
      <div className="saved-work-drawer__card-tags">
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
          {/* Tag Filter Chips */}
          <div className="saved-work-drawer__tag-filters">
            <div className="saved-work-drawer__tag-chips">
              {predefinedTags.map(tag => (
                <button
                  key={tag.value}
                  className={`saved-work-drawer__tag-filter-chip ${
                    selectedTags.includes(tag.value) ? 'saved-work-drawer__tag-filter-chip--active' : ''
                  }`}
                  onClick={() => toggleTag(tag.value)}
                >
                  {tag.label}
                </button>
              ))}
            </div>
            
            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button 
                className="saved-work-drawer__clear-filters"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Project and Sort Filters Row */}
          <div className="saved-work-drawer__filter-row">
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
                    <ContextMenu
                      trigger={
                        <button 
                          className="saved-work-drawer__card-menu"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <EllipsisIcon />
                        </button>
                      }
                    >
                      <DropdownItem onClick={() => handleDocumentAction('edit', document)}>
                        Edit / View
                      </DropdownItem>
                      <DropdownItem onClick={() => handleDocumentAction('manage_tags', document)}>
                        Manage Tags
                      </DropdownItem>
                      <DropdownItem onClick={() => handleDocumentAction('rename', document)}>
                        Rename
                      </DropdownItem>
                      <DropdownItem onClick={() => handleDocumentAction('delete', document)}>
                        Delete
                      </DropdownItem>
                      <DropdownItem onClick={() => handleDocumentAction('move', document)}>
                        Move to Project
                      </DropdownItem>
                      <DropdownDivider />
                      <DropdownItem onClick={() => handleDocumentAction('download_pdf', document)}>
                        Download as PDF
                      </DropdownItem>
                      <DropdownItem onClick={() => handleDocumentAction('download_docx', document)}>
                        Download as DOCX
                      </DropdownItem>
                    </ContextMenu>
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
                      <div className="saved-work-drawer__card-author">
                        by {document.author}
                      </div>
                    </div>

                    {/* Tags */}
                    {renderDocumentTags(document.tags)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Matching Elements design */}
        <div className="saved-work-drawer__footer">
          <button 
            className="saved-work-drawer__cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="saved-work-drawer__select-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default SavedWorkDrawer;