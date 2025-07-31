import React, { useState, useMemo } from 'react';
import { SearchInput, Button, Select, Dropdown, DropdownItem, ContextMenu } from '../ui';
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

// Predefined tags - can be expanded later
const predefinedTags = [
  { value: 'email', label: 'Email' },
  { value: 'social_post', label: 'Social Post' },
  { value: 'campaign', label: 'Campaign' },
  { value: 'press_release', label: 'Press Release' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'launch', label: 'Launch' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'newsletter', label: 'Newsletter' }
];

// Get unique projects from documents
const getUniqueProjects = (documents) => {
  const projects = [...new Set(documents.map(doc => doc.project))];
  return projects.map(project => ({ value: project, label: project }));
};

const SavedWorkDrawer = ({ isOpen, onClose, onDocumentSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [documents] = useState(mockSavedDocuments);

  // Get unique projects for filter
  const projectOptions = useMemo(() => [
    { value: 'all', label: 'All Projects' },
    ...getUniqueProjects(documents)
  ], [documents]);

  // Get tag options for filter
  const tagOptions = useMemo(() => [
    { value: 'all', label: 'All Tags' },
    ...predefinedTags
  ], []);

  // Sort options
  const sortOptions = [
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'name_asc', label: 'A-Z' },
    { value: 'name_desc', label: 'Z-A' },
    { value: 'project', label: 'Project' }
  ];

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

    // Apply tag filter
    if (selectedTag !== 'all') {
      filtered = filtered.filter(doc => doc.tags.includes(selectedTag));
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
  }, [documents, searchTerm, selectedProject, selectedTag, sortBy]);

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

        {/* Filter Tabs */}
        <div className="saved-work-drawer__filter-tabs">
          <button 
            className={`saved-work-drawer__tab ${selectedTag === 'all' ? 'saved-work-drawer__tab--active' : ''}`}
            onClick={() => setSelectedTag('all')}
          >
            All Documents
          </button>
          <button 
            className={`saved-work-drawer__tab ${selectedTag === 'email' ? 'saved-work-drawer__tab--active' : ''}`}
            onClick={() => setSelectedTag('email')}
          >
            Email
          </button>
          <button 
            className={`saved-work-drawer__tab ${selectedTag === 'social_post' ? 'saved-work-drawer__tab--active' : ''}`}
            onClick={() => setSelectedTag('social_post')}
          >
            Social Posts
          </button>
          <button 
            className={`saved-work-drawer__tab ${selectedTag === 'campaign' ? 'saved-work-drawer__tab--active' : ''}`}
            onClick={() => setSelectedTag('campaign')}
          >
            Campaigns
          </button>
        </div>

        {/* Document Grid */}
        <div className="saved-work-drawer__content">
          {filteredDocuments.length === 0 ? (
            <div className="saved-work-drawer__empty">
              <div className="saved-work-drawer__empty-icon">📄</div>
              <div className="saved-work-drawer__empty-title">
                {searchTerm.length >= 3 || selectedProject !== 'all' || selectedTag !== 'all' 
                  ? 'No documents found' 
                  : 'No saved documents yet'
                }
              </div>
              <div className="saved-work-drawer__empty-text">
                {searchTerm.length >= 3 || selectedProject !== 'all' || selectedTag !== 'all'
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
                      <DropdownItem onClick={() => handleDocumentAction('rename', document)}>
                        Rename
                      </DropdownItem>
                      <DropdownItem onClick={() => handleDocumentAction('delete', document)}>
                        Delete
                      </DropdownItem>
                      <DropdownItem onClick={() => handleDocumentAction('move', document)}>
                        Move to Project
                      </DropdownItem>
                      <Dropdown.Divider />
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