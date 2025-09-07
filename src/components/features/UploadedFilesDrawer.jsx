import React, { useState, useEffect } from 'react';
import '../../styles/UploadedFilesDrawer.scss';

const UploadedFilesDrawer = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Sample uploaded files data
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 1,
      name: 'Brand Guidelines 2024.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2024-12-15T10:30:00Z',
      uploadedBy: 'Sarah Johnson',
      tags: ['Brand', 'Guidelines'],
      icon: '📄',
      status: 'active'
    },
    {
      id: 2,
      name: 'Marketing Campaign Data.xlsx',
      type: 'XLSX',
      size: '5.8 MB',
      uploadDate: '2024-12-14T14:20:00Z',
      uploadedBy: 'Michael Chen',
      tags: ['Marketing', 'Data'],
      icon: '📊',
      status: 'active'
    },
    {
      id: 3,
      name: 'Product Photos.zip',
      type: 'ZIP',
      size: '12.3 MB',
      uploadDate: '2024-12-13T09:15:00Z',
      uploadedBy: 'Emily Rodriguez',
      tags: ['Product', 'Images'],
      icon: '📦',
      status: 'active'
    },
    {
      id: 4,
      name: 'Meeting Notes Q4.docx',
      type: 'DOCX',
      size: '890 KB',
      uploadDate: '2024-12-12T16:45:00Z',
      uploadedBy: 'David Kim',
      tags: ['Meeting', 'Q4'],
      icon: '📝',
      status: 'active'
    },
    {
      id: 5,
      name: 'Logo Variations.ai',
      type: 'AI',
      size: '15.2 MB',
      uploadDate: '2024-12-11T11:30:00Z',
      uploadedBy: 'Jessica Taylor',
      tags: ['Logo', 'Design'],
      icon: '🎨',
      status: 'active'
    }
  ]);

  const fileTypes = ['all', 'PDF', 'DOCX', 'XLSX', 'ZIP', 'AI', 'JPG', 'PNG'];

  // Get unique tags from all files
  const getUniqueTags = () => {
    const allTags = uploadedFiles.flatMap(file => file.tags || []);
    const uniqueTags = [...new Set(allTags)].sort();
    return uniqueTags.map(tag => ({ value: tag, label: tag }));
  };

  const tagOptions = getUniqueTags();

  // Filter and sort files
  const filteredFiles = uploadedFiles
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = activeFilter === 'all' || file.type === activeFilter;
      const matchesTags = selectedTags.length === 0 || 
                         (file.tags && file.tags.some(tag => selectedTags.includes(tag)));
      return matchesSearch && matchesFilter && matchesTags;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'size':
          aValue = parseFloat(a.size);
          bValue = parseFloat(b.size);
          break;
        case 'uploadDate':
          aValue = new Date(a.uploadDate);
          bValue = new Date(b.uploadDate);
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (size) => {
    return size;
  };

  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id));
    }
  };

  const handleDeleteSelected = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setUploadedFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
    setSelectedFiles([]);
    setShowDeleteModal(false);
  };

  const handleDownload = (file) => {
    console.log('Downloading file:', file.name);
    // Implement download logic
  };

  const handlePreview = (file) => {
    console.log('Previewing file:', file.name);
    // Implement preview logic
  };

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && event.target.classList.contains('uploaded-files-drawer__backdrop')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="uploaded-files-drawer__backdrop" />
      <div className={`uploaded-files-drawer ${isOpen ? 'uploaded-files-drawer--open' : ''}`}>
        {/* Header */}
        <div className="uploaded-files-drawer__header">
          <div className="uploaded-files-drawer__header-left">
            <h2 className="uploaded-files-drawer__title">Manage Uploaded Files</h2>
            <span className="uploaded-files-drawer__count">
              {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button 
            className="uploaded-files-drawer__close"
            onClick={onClose}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Controls - Matching saved-work-drawer__filters structure */}
        <div className="uploaded-files-drawer__controls">
          {/* Filter Row */}
          <div className="uploaded-files-drawer__filter-row">
            {/* Search Field */}
            <div className="uploaded-files-drawer__filter-group uploaded-files-drawer__filter-group--search">
              <div className="uploaded-files-drawer__search">
                <svg className="uploaded-files-drawer__search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M7.25 12.25C10.1495 12.25 12.5 9.8995 12.5 7C12.5 4.1005 10.1495 1.75 7.25 1.75C4.3505 1.75 2 4.1005 2 7C2 9.8995 4.3505 12.25 7.25 12.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.25 13.25L11.25 11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="uploaded-files-drawer__search-input"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {(activeFilter !== 'all' || searchQuery.length >= 3 || selectedTags.length > 0) && (
              <div className="uploaded-files-drawer__clear-filters-container">
                <button 
                  className="uploaded-files-drawer__clear-filters"
                  onClick={() => {
                    setActiveFilter('all');
                    setSearchQuery('');
                    setSelectedTags([]);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Tags Filter */}
            <div className="uploaded-files-drawer__filter-group">
              <label className="uploaded-files-drawer__filter-label">Tags:</label>
              <select 
                value={selectedTags.length > 0 ? selectedTags[0] : ''} 
                onChange={(e) => {
                  if (e.target.value === '') {
                    setSelectedTags([]);
                  } else {
                    setSelectedTags([e.target.value]);
                  }
                }}
                className="uploaded-files-drawer__filter-select"
              >
                <option value="">All Tags</option>
                {tagOptions.map(tag => (
                  <option key={tag.value} value={tag.value}>
                    {tag.label}
                  </option>
                ))}
              </select>
            </div>

            {/* File Type Filter */}
            <div className="uploaded-files-drawer__filter-group">
              <label className="uploaded-files-drawer__filter-label">Type:</label>
              <select 
                value={activeFilter} 
                onChange={(e) => setActiveFilter(e.target.value)}
                className="uploaded-files-drawer__filter-select"
              >
                {fileTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="uploaded-files-drawer__filter-group uploaded-files-drawer__filter-group--right">
              <label className="uploaded-files-drawer__filter-label">Sort by:</label>
              <select 
                value={`${sortBy}-${sortOrder}`} 
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="uploaded-files-drawer__sort-select"
              >
                <option value="uploadDate-desc">Newest First</option>
                <option value="uploadDate-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="size-desc">Largest First</option>
                <option value="size-asc">Smallest First</option>
                <option value="type-asc">Type A-Z</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedFiles.length > 0 && (
            <div className="uploaded-files-drawer__bulk-actions">
              <span className="uploaded-files-drawer__selected-count">
                {selectedFiles.length} selected
              </span>
              <button 
                className="uploaded-files-drawer__bulk-btn uploaded-files-drawer__bulk-btn--danger"
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* File List */}
        <div className="uploaded-files-drawer__content">
          <div className="uploaded-files-drawer__table">
            {/* Table Header */}
            <div className="uploaded-files-drawer__table-header">
              <div className="uploaded-files-drawer__table-cell uploaded-files-drawer__table-cell--checkbox">
                <input
                  type="checkbox"
                  checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                  onChange={handleSelectAll}
                  className="uploaded-files-drawer__checkbox"
                />
              </div>
              <div className="uploaded-files-drawer__table-cell uploaded-files-drawer__table-cell--file">File</div>
              <div className="uploaded-files-drawer__table-cell uploaded-files-drawer__table-cell--type">Type</div>
              <div className="uploaded-files-drawer__table-cell uploaded-files-drawer__table-cell--size">Size</div>
              <div className="uploaded-files-drawer__table-cell uploaded-files-drawer__table-cell--uploaded">Uploaded</div>
              <div className="uploaded-files-drawer__table-cell uploaded-files-drawer__table-cell--tags">Tags</div>
              <div className="uploaded-files-drawer__table-cell uploaded-files-drawer__table-cell--actions">Actions</div>
            </div>

            {/* Table Body */}
            <div className="uploaded-files-drawer__table-body">
              {filteredFiles.map(file => (
                <div key={file.id} className="uploaded-files-drawer__table-row">
                  <div className="uploaded-files-drawer__table-cell uploaded-files-drawer__table-cell--checkbox">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => handleFileSelect(file.id)}
                      className="uploaded-files-drawer__checkbox"
                    />
                  </div>
                  <div className="uploaded-files-drawer__table-cell uploaded-files-drawer__table-cell--file">
                    <div className="uploaded-files-drawer__file-info">
                      <span className="uploaded-files-drawer__file-icon">{file.icon}</span>
                      <div className="uploaded-files-drawer__file-details">
                        <div className="uploaded-files-drawer__file-name">{file.name}</div>
                        <div className="uploaded-files-drawer__file-uploader">by {file.uploadedBy}</div>
                      </div>
                    </div>
                  </div>
                  <div className="uploaded-files-drawer__table-cell uploaded-files-drawer__table-cell--type">
                    <span className="uploaded-files-drawer__file-type">{file.type}</span>
                  </div>
                  <div className="uploaded-files-drawer__table-cell uploaded-files-drawer__table-cell--size">
                    {formatFileSize(file.size)}
                  </div>
                  <div className="uploaded-files-drawer__table-cell uploaded-files-drawer__table-cell--uploaded">
                    {formatDate(file.uploadDate)}
                  </div>
                  <div className="uploaded-files-drawer__table-cell uploaded-files-drawer__table-cell--tags">
                    <div className="uploaded-files-drawer__tags">
                      {file.tags.map(tag => (
                        <span key={tag} className="uploaded-files-drawer__tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="uploaded-files-drawer__table-cell uploaded-files-drawer__table-cell--actions">
                    <div className="uploaded-files-drawer__actions">
                      <button 
                        className="uploaded-files-drawer__action-btn"
                        onClick={() => handlePreview(file)}
                        title="Preview"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        className="uploaded-files-drawer__action-btn"
                        onClick={() => handleDownload(file)}
                        title="Download"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 1v10M4 7l4 4 4-4M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        className="uploaded-files-drawer__action-btn uploaded-files-drawer__action-btn--danger"
                        onClick={() => {
                          setSelectedFiles([file.id]);
                          handleDeleteSelected();
                        }}
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 4h12M6.5 1h3M6 4v8.5M10 4v8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredFiles.length === 0 && (
            <div className="uploaded-files-drawer__empty">
              <div className="uploaded-files-drawer__empty-icon">📁</div>
              <div className="uploaded-files-drawer__empty-title">No files found</div>
              <div className="uploaded-files-drawer__empty-text">
                {searchQuery ? 'Try adjusting your search or filters.' : 'Upload some files to get started.'}
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="uploaded-files-drawer__modal-backdrop">
            <div className="uploaded-files-drawer__modal">
              <div className="uploaded-files-drawer__modal-header">
                <h3>Delete Files</h3>
                <button 
                  className="uploaded-files-drawer__modal-close"
                  onClick={() => setShowDeleteModal(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className="uploaded-files-drawer__modal-content">
                <p>Are you sure you want to delete {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}? This action cannot be undone.</p>
              </div>
              <div className="uploaded-files-drawer__modal-footer">
                <button 
                  className="uploaded-files-drawer__modal-btn uploaded-files-drawer__modal-btn--secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="uploaded-files-drawer__modal-btn uploaded-files-drawer__modal-btn--danger"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadedFilesDrawer;
