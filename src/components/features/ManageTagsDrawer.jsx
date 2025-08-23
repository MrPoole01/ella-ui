import React, { useState, useEffect } from 'react';
import '../../styles/ManageTagsDrawer.scss';

const ManageTagsDrawer = ({ isOpen, onClose, currentUserRole = 'Admin' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [editingTag, setEditingTag] = useState(null);

  // Form state for creating/editing tags
  const [formData, setFormData] = useState({
    name: '',
    scope: 'workspace',
    color: '#659D5E'
  });

  // Sample tags data
  const [tags, setTags] = useState([
    { id: 1, name: 'Marketing', type: 'system', color: '#659D5E', usageCount: 45, isSystem: true },
    { id: 2, name: 'Design', type: 'system', color: '#E6A429', usageCount: 32, isSystem: true },
    { id: 3, name: 'Development', type: 'system', color: '#4A90E2', usageCount: 28, isSystem: true },
    { id: 4, name: 'Campaign', type: 'workspace', color: '#F39C12', usageCount: 23, isSystem: false },
    { id: 5, name: 'Social Post', type: 'workspace', color: '#E74C3C', usageCount: 19, isSystem: false },
    { id: 6, name: 'Brand Guidelines', type: 'global', color: '#9B59B6', usageCount: 15, isSystem: false },
    { id: 7, name: 'Client Work', type: 'workspace', color: '#1ABC9C', usageCount: 12, isSystem: false },
    { id: 8, name: 'Research', type: 'global', color: '#34495E', usageCount: 8, isSystem: false },
    { id: 9, name: 'Testing', type: 'workspace', color: '#E67E22', usageCount: 6, isSystem: false },
    { id: 10, name: 'Documentation', type: 'global', color: '#95A5A6', usageCount: 4, isSystem: false }
  ]);

  // Available colors for tags
  const tagColors = [
    '#659D5E', '#E6A429', '#4A90E2', '#F39C12', '#E74C3C',
    '#9B59B6', '#1ABC9C', '#34495E', '#E67E22', '#95A5A6',
    '#F1C40F', '#E91E63', '#00BCD4', '#FF5722', '#607D8B'
  ];

  // Reset form when drawer opens/closes
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setActiveFilter('all');
      setShowCreateForm(false);
      setEditingTag(null);
      setFormData({ name: '', scope: 'workspace', color: '#659D5E' });
    }
  }, [isOpen]);

  // Check if user can manage tags
  const canManageTags = () => {
    return ['Admin', 'Workspace Owner', 'Tag Manager'].includes(currentUserRole);
  };

  // Filter and sort tags
  const getFilteredAndSortedTags = () => {
    let filteredTags = tags;

    // Apply search filter
    if (searchQuery) {
      filteredTags = filteredTags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (activeFilter !== 'all') {
      filteredTags = filteredTags.filter(tag => tag.type === activeFilter);
    }

    // Apply sorting
    filteredTags.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'usage':
          aValue = a.usageCount;
          bValue = b.usageCount;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filteredTags;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    // Check for duplicate names
    const isDuplicate = tags.some(tag => 
      tag.name.toLowerCase() === formData.name.trim().toLowerCase() &&
      tag.id !== editingTag?.id
    );

    if (isDuplicate) {
      alert('A tag with this name already exists');
      return;
    }

    if (editingTag) {
      // Update existing tag
      setTags(prev => prev.map(tag =>
        tag.id === editingTag.id
          ? { ...tag, name: formData.name.trim(), color: formData.color }
          : tag
      ));
      setEditingTag(null);
    } else {
      // Create new tag
      const newTag = {
        id: Date.now(),
        name: formData.name.trim(),
        type: formData.scope,
        color: formData.color,
        usageCount: 0,
        isSystem: false
      };
      setTags(prev => [...prev, newTag]);
    }

    setShowCreateForm(false);
    setFormData({ name: '', scope: 'workspace', color: '#659D5E' });
  };

  // Handle edit tag
  const handleEditTag = (tag) => {
    if (tag.isSystem) return;
    
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      scope: tag.type,
      color: tag.color
    });
    setShowCreateForm(true);
  };

  // Handle delete tag
  const handleDeleteTag = (tag) => {
    if (tag.isSystem) return;
    
    setTagToDelete(tag);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (tagToDelete) {
      setTags(prev => prev.filter(tag => tag.id !== tagToDelete.id));
      setShowDeleteModal(false);
      setTagToDelete(null);
    }
  };

  // Handle sort
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (!isOpen) return null;

  const filteredTags = getFilteredAndSortedTags();

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`manage-tags-drawer__backdrop ${isOpen ? 'manage-tags-drawer__backdrop--open' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`manage-tags-drawer ${isOpen ? 'manage-tags-drawer--open' : ''}`}>
        <div className="manage-tags-drawer__content">
          {/* Header */}
          <div className="manage-tags-drawer__header">
            <div className="manage-tags-drawer__header-content">
              <h2 className="manage-tags-drawer__title">Manage Tags</h2>
              <p className="manage-tags-drawer__subtitle">
                Organize and manage tags across your workspace
              </p>
            </div>
            <button className="manage-tags-drawer__close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Controls */}
          <div className="manage-tags-drawer__controls">
            {/* Search Row with Create Button */}
            <div className="manage-tags-drawer__search-row">
              <div className="manage-tags-drawer__search">
                <svg className="manage-tags-drawer__search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6.5 12C9.26142 12 11.5 9.76142 11.5 7C11.5 4.23858 9.26142 2 6.5 2C3.73858 2 1.5 4.23858 1.5 7C1.5 9.76142 3.73858 12 6.5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.5 12.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="manage-tags-drawer__search-input"
                />
              </div>

              {/* Create Button */}
              {canManageTags() && (
                <button 
                  className="manage-tags-drawer__create-btn"
                  onClick={() => {
                    setShowCreateForm(true);
                    setEditingTag(null);
                    setFormData({ name: '', scope: 'workspace', color: '#659D5E' });
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Create Tag
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="manage-tags-drawer__filters">
              <button 
                className={`manage-tags-drawer__filter ${activeFilter === 'all' ? 'manage-tags-drawer__filter--active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Tags ({tags.length})
              </button>
              <button 
                className={`manage-tags-drawer__filter ${activeFilter === 'system' ? 'manage-tags-drawer__filter--active' : ''}`}
                onClick={() => setActiveFilter('system')}
              >
                System ({tags.filter(t => t.type === 'system').length})
              </button>
              <button 
                className={`manage-tags-drawer__filter ${activeFilter === 'workspace' ? 'manage-tags-drawer__filter--active' : ''}`}
                onClick={() => setActiveFilter('workspace')}
              >
                Workspace ({tags.filter(t => t.type === 'workspace').length})
              </button>
              <button 
                className={`manage-tags-drawer__filter ${activeFilter === 'global' ? 'manage-tags-drawer__filter--active' : ''}`}
                onClick={() => setActiveFilter('global')}
              >
                Global ({tags.filter(t => t.type === 'global').length})
              </button>
            </div>
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && canManageTags() && (
            <div className="manage-tags-drawer__form-section">
              <div className="manage-tags-drawer__form-header">
                <h3>{editingTag ? 'Edit Tag' : 'Create New Tag'}</h3>
                <button 
                  className="manage-tags-drawer__form-close"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingTag(null);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="manage-tags-drawer__form">
                <div className="manage-tags-drawer__form-row">
                  <div className="manage-tags-drawer__form-field">
                    <label>Tag Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter tag name"
                      required
                      className="manage-tags-drawer__form-input"
                    />
                  </div>

                  {!editingTag && (
                    <div className="manage-tags-drawer__form-field">
                      <label>Scope</label>
                      <select
                        value={formData.scope}
                        onChange={(e) => setFormData(prev => ({ ...prev, scope: e.target.value }))}
                        className="manage-tags-drawer__form-select"
                      >
                        <option value="workspace">Workspace</option>
                        <option value="global">Global</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="manage-tags-drawer__form-field">
                  <label>Color</label>
                  <div className="manage-tags-drawer__color-picker">
                    {tagColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`manage-tags-drawer__color-option ${formData.color === color ? 'manage-tags-drawer__color-option--selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                      />
                    ))}
                  </div>
                </div>

                <div className="manage-tags-drawer__form-actions">
                  <button 
                    type="button" 
                    className="manage-tags-drawer__form-cancel"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingTag(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="manage-tags-drawer__form-submit">
                    {editingTag ? 'Update Tag' : 'Create Tag'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tags Table */}
          <div className="manage-tags-drawer__table-container">
            <div className="manage-tags-drawer__table">
              {/* Table Header */}
              <div className="manage-tags-drawer__table-header">
                <div className="manage-tags-drawer__table-header-cell manage-tags-drawer__table-color">Color</div>
                <div 
                  className="manage-tags-drawer__table-header-cell manage-tags-drawer__table-name"
                  onClick={() => handleSort('name')}
                >
                  Tag Name
                  {sortBy === 'name' && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d={sortOrder === 'asc' ? "M3 7.5L6 4.5L9 7.5" : "M3 4.5L6 7.5L9 4.5"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div 
                  className="manage-tags-drawer__table-header-cell manage-tags-drawer__table-type"
                  onClick={() => handleSort('type')}
                >
                  Type
                  {sortBy === 'type' && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d={sortOrder === 'asc' ? "M3 7.5L6 4.5L9 7.5" : "M3 4.5L6 7.5L9 4.5"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div 
                  className="manage-tags-drawer__table-header-cell manage-tags-drawer__table-usage"
                  onClick={() => handleSort('usage')}
                >
                  Usage
                  {sortBy === 'usage' && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d={sortOrder === 'asc' ? "M3 7.5L6 4.5L9 7.5" : "M3 4.5L6 7.5L9 4.5"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="manage-tags-drawer__table-header-cell manage-tags-drawer__table-actions">Actions</div>
              </div>

              {/* Table Body */}
              <div className="manage-tags-drawer__table-body">
                {filteredTags.map(tag => (
                  <div key={tag.id} className="manage-tags-drawer__table-row">
                    <div className="manage-tags-drawer__table-cell manage-tags-drawer__table-color">
                      <div 
                        className="manage-tags-drawer__color-indicator"
                        style={{ backgroundColor: tag.color }}
                      />
                    </div>
                    <div className="manage-tags-drawer__table-cell manage-tags-drawer__table-name">
                      <span className="manage-tags-drawer__tag-name">{tag.name}</span>
                    </div>
                    <div className="manage-tags-drawer__table-cell manage-tags-drawer__table-type">
                      <span className={`manage-tags-drawer__type-badge manage-tags-drawer__type-badge--${tag.type}`}>
                        {tag.type}
                      </span>
                    </div>
                    <div className="manage-tags-drawer__table-cell manage-tags-drawer__table-usage">
                      <span className="manage-tags-drawer__usage-count">{tag.usageCount}</span>
                    </div>
                    <div className="manage-tags-drawer__table-cell manage-tags-drawer__table-actions">
                      {!tag.isSystem && canManageTags() && (
                        <div className="manage-tags-drawer__row-actions">
                          <button 
                            className="manage-tags-drawer__action-btn"
                            onClick={() => handleEditTag(tag)}
                            title="Edit tag"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M6.36 2.68L2.5 6.54L2.5 8.96L4.92 8.96L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46ZM1.5 5.54L8.78 -1.74C9.17 -2.13 9.81 -2.13 10.2 -1.74L11.24 -0.7C11.63 -0.31 11.63 0.33 11.24 0.72L3.96 7.96L1.5 8.96L1.5 5.54Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button 
                            className="manage-tags-drawer__action-btn manage-tags-drawer__action-btn--danger"
                            onClick={() => handleDeleteTag(tag)}
                            title="Delete tag"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M1.75 3.5L12.25 3.5M5.25 6.5L5.25 10.5M8.75 6.5L8.75 10.5M2.625 3.5L2.625 11.375C2.625 11.9273 3.07272 12.375 3.625 12.375L10.375 12.375C10.9273 12.375 11.375 11.9273 11.375 11.375L11.375 3.5M5.25 3.5L5.25 2.625C5.25 2.07272 5.69772 1.625 6.25 1.625L7.75 1.625C8.30228 1.625 8.75 2.07272 8.75 2.625L8.75 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      )}
                      {tag.isSystem && (
                        <span className="manage-tags-drawer__system-label">System</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {filteredTags.length === 0 && (
              <div className="manage-tags-drawer__empty-state">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 4L29.09 14.26L40 16L32 23.74L34.18 34.62L24 29.27L13.82 34.62L16 23.74L8 16L18.91 14.26L24 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>No tags found</h3>
                <p>
                  {searchQuery || activeFilter !== 'all'
                    ? 'No tags match your current filters.'
                    : 'Create your first tag to get started.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && tagToDelete && (
        <div className="manage-tags-drawer__modal-backdrop">
          <div className="manage-tags-drawer__modal">
            <div className="manage-tags-drawer__modal-header">
              <h3>Delete Tag</h3>
              <button onClick={() => setShowDeleteModal(false)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="manage-tags-drawer__modal-content">
              <p>
                Are you sure you want to delete the tag "<strong>{tagToDelete.name}</strong>"?
              </p>
              <p className="manage-tags-drawer__modal-warning">
                This tag is currently used by <strong>{tagToDelete.usageCount}</strong> item{tagToDelete.usageCount !== 1 ? 's' : ''}. 
                Deleting it will remove the tag from all these items.
              </p>
            </div>
            <div className="manage-tags-drawer__modal-actions">
              <button 
                className="manage-tags-drawer__modal-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="manage-tags-drawer__modal-confirm"
                onClick={confirmDelete}
              >
                Delete Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageTagsDrawer;
