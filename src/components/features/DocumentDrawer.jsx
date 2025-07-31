import React, { useState } from 'react';
import { Button, Select } from '../ui';
import '../../styles/DocumentDrawer.scss';

// Mock document versions
const mockVersions = [
  { id: 1, version: 'Version 1', status: 'approved', updatedDate: '2024-12-10', isActive: true },
  { id: 2, version: 'Version 2', status: 'approved', updatedDate: '2024-12-09' },
  { id: 3, version: 'Version 3', status: 'draft', updatedDate: '2024-12-08' },
  { id: 4, version: 'Version 4', status: 'draft', updatedDate: '2024-12-07' },
  { id: 5, version: 'Version 5', status: 'not_started', updatedDate: '2024-12-06' }
];

const DocumentDrawer = ({ isOpen, onClose, document, onEdit }) => {
  const [selectedVersion, setSelectedVersion] = useState('Version 1');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);

  if (!isOpen || !document) return null;

  const handleEdit = () => {
    setIsEditMode(true);
    if (onEdit) {
      onEdit(document);
    }
  };

  const handleSave = () => {
    console.log('Save document:', document);
    // Implement save logic
  };

  const handleSaveAsDraft = () => {
    console.log('Save as draft:', document);
    // Implement save as draft logic
  };

  const handleSaveExternal = () => {
    console.log('Save to external drive:', document);
    // Implement external save logic
  };

  const handleDownload = () => {
    console.log('Download document:', document);
    // Implement download logic
  };

  const handleBack = () => {
    if (isEditMode) {
      setIsEditMode(false);
    } else {
      onClose();
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
      case 'not_started':
        return '#EA2E2E';
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
      case 'not_started':
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="document-drawer__backdrop" onClick={onClose} />
      
      {/* Drawer */}
      <div className={`document-drawer ${isOpen ? 'document-drawer--open' : ''} ${isEditMode ? 'document-drawer--edit-mode' : ''}`}>
        {/* Header */}
        <div className="document-drawer__header">
          <div className="document-drawer__header-left">
            <div className="document-drawer__title">
              {isEditMode ? 'Edit Document' : 'Review Document'}
            </div>
            <div 
              className="document-drawer__status"
              style={{ color: getStatusColor(document.status) }}
            >
              {getStatusLabel(document.status)}
            </div>
          </div>

          <div className="document-drawer__header-right">
            {/* Version Dropdown */}
            <div className="document-drawer__version-selector">
              <button 
                className="document-drawer__version-button"
                onClick={() => setShowVersionDropdown(!showVersionDropdown)}
              >
                <span>{selectedVersion}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>

              {/* Version Dropdown Panel */}
              {showVersionDropdown && (
                <div className="document-drawer__version-dropdown">
                  {mockVersions.map((version) => (
                    <div 
                      key={version.id}
                      className={`document-drawer__version-item ${version.isActive ? 'document-drawer__version-item--active' : ''}`}
                      onClick={() => {
                        setSelectedVersion(version.version);
                        setShowVersionDropdown(false);
                      }}
                    >
                      <div className="document-drawer__version-info">
                        <div className="document-drawer__version-name">
                          {version.version}
                        </div>
                        <div className="document-drawer__version-date">
                          Updated: {formatDate(version.updatedDate)}
                        </div>
                      </div>
                      <div 
                        className="document-drawer__version-status"
                        style={{ color: getStatusColor(version.status) }}
                      >
                        {getStatusLabel(version.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Close Button */}
            <button className="document-drawer__close" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="document-drawer__subtitle">
          {isEditMode 
            ? 'Make changes to your document. Ella is here to help.'
            : `Review and approve your ${document.title}. Let us know if you'd like refinements or have additional input.`
          }
        </div>

        {/* Content */}
        <div className="document-drawer__content">
          {isEditMode ? (
            /* Edit Mode - Split Layout */
            <div className="document-drawer__edit-layout">
              {/* Document Content */}
              <div className="document-drawer__document-panel">
                <div className="document-drawer__document-content">
                  <div className="document-drawer__execution-info">
                    Execution: 05/12/2025 09:25
                  </div>

                  <div className="document-drawer__document-section">
                    <div className="document-drawer__section-label">Headline/Hook:</div>
                    <div className="document-drawer__section-content">
                      {document.title}
                    </div>
                  </div>

                  <div className="document-drawer__document-section">
                    <div className="document-drawer__section-label">Content:</div>
                    <div className="document-drawer__section-content">
                      This is the main content of the document. In a real implementation, 
                      this would be the actual document content that can be edited.
                    </div>
                  </div>

                  <div className="document-drawer__document-section">
                    <div className="document-drawer__section-label">Tags:</div>
                    <div className="document-drawer__section-content">
                      {document.tags?.join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ella Chat Panel */}
              <div className="document-drawer__chat-panel">
                <div className="document-drawer__chat-header">
                  <div className="document-drawer__ella-avatar">
                    <span>E</span>
                  </div>
                  <div className="document-drawer__ella-info">
                    <div className="document-drawer__ella-name">Ella:</div>
                    <div className="document-drawer__ella-status">Online</div>
                  </div>
                  <div className="document-drawer__chat-timestamp">
                    5/19/2025 09:30
                  </div>
                </div>

                <div className="document-drawer__chat-content">
                  <div className="document-drawer__chat-message">
                    <p>I'm here to help you edit this document. What changes would you like to make?</p>
                    <p>I can help you:</p>
                    <ul>
                      <li>Refine the messaging</li>
                      <li>Adjust the tone</li>
                      <li>Add or modify content</li>
                      <li>Update tags and categorization</li>
                    </ul>
                    <p>What would you like to work on first?</p>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="document-drawer__chat-input">
                  <input 
                    type="text" 
                    placeholder="Type your message to Ella..."
                    className="document-drawer__chat-input-field"
                  />
                  <button className="document-drawer__chat-send">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M14.5 1.5L7 9L14.5 1.5ZM7 9L1.5 14.5L7 9ZM7 9L14.5 14.5L7 9Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* View Mode - Single Panel */
            <div className="document-drawer__view-content">
              <div className="document-drawer__execution-info">
                Execution: {formatDate(document.lastUpdated)} 09:25
              </div>

              <div className="document-drawer__document-section">
                <div className="document-drawer__section-label">Title:</div>
                <div className="document-drawer__section-content">
                  {document.title}
                </div>
              </div>

              <div className="document-drawer__document-section">
                <div className="document-drawer__section-label">Project:</div>
                <div className="document-drawer__section-content">
                  {document.project}
                </div>
              </div>

              <div className="document-drawer__document-section">
                <div className="document-drawer__section-label">Content Type:</div>
                <div className="document-drawer__section-content">
                  {document.type?.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <div className="document-drawer__document-section">
                <div className="document-drawer__section-label">Tags:</div>
                <div className="document-drawer__section-content">
                  <div className="document-drawer__tags">
                    {document.tags?.map((tag, index) => (
                      <span key={index} className="document-drawer__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="document-drawer__document-section">
                <div className="document-drawer__section-label">Sample Content:</div>
                <div className="document-drawer__section-content document-drawer__sample-content">
                  This is where the actual document content would be displayed. 
                  In a real implementation, this would show the full document content 
                  with proper formatting, images, and other media elements.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="document-drawer__footer">
          {isEditMode ? (
            <>
              <div className="document-drawer__footer-left">
                <button className="document-drawer__btn document-drawer__btn--primary" onClick={handleSave}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M12 4L5 11L2 8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Save
                </button>
                <button className="document-drawer__btn document-drawer__btn--secondary" onClick={handleSaveAsDraft}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15.5 2.5H4.5C3.39543 2.5 2.5 3.39543 2.5 4.5V15.5C2.5 16.6046 3.39543 17.5 4.5 17.5H15.5C16.6046 17.5 17.5 16.6046 17.5 15.5V4.5C17.5 3.39543 16.6046 2.5 15.5 2.5Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M6 10L8 12L14 6" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Save as draft
                </button>
              </div>
              <div className="document-drawer__footer-right">
                <button className="document-drawer__btn document-drawer__btn--secondary" onClick={handleSaveExternal}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15.5 2.5H4.5C3.39543 2.5 2.5 3.39543 2.5 4.5V15.5C2.5 16.6046 3.39543 17.5 4.5 17.5H15.5C16.6046 17.5 17.5 16.6046 17.5 15.5V4.5C17.5 3.39543 16.6046 2.5 15.5 2.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Save to External Drive
                </button>
                <button className="document-drawer__btn document-drawer__btn--secondary" onClick={handleDownload}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 12.5L6.25 8.75L7.5 7.5L9.25 9.25V2.5H10.75V9.25L12.5 7.5L13.75 8.75L10 12.5Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2.5 15V16.25C2.5 16.9404 3.05964 17.5 3.75 17.5H16.25C16.9404 17.5 17.5 16.9404 17.5 16.25V15" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Download
                </button>
                <button className="document-drawer__btn document-drawer__btn--ghost" onClick={handleBack}>
                  Back
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="document-drawer__footer-left">
                <button className="document-drawer__btn document-drawer__btn--primary" onClick={handleEdit}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M10.5 1.5L12.5 3.5L4.5 11.5L1.5 12.5L2.5 9.5L10.5 1.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Edit
                </button>
                <button className="document-drawer__btn document-drawer__btn--secondary" onClick={handleSaveAsDraft}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15.5 2.5H4.5C3.39543 2.5 2.5 3.39543 2.5 4.5V15.5C2.5 16.6046 3.39543 17.5 4.5 17.5H15.5C16.6046 17.5 17.5 16.6046 17.5 15.5V4.5C17.5 3.39543 16.6046 2.5 15.5 2.5Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M6 10L8 12L14 6" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Save as draft
                </button>
              </div>
              <div className="document-drawer__footer-right">
                <button className="document-drawer__btn document-drawer__btn--secondary" onClick={handleSaveExternal}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15.5 2.5H4.5C3.39543 2.5 2.5 3.39543 2.5 4.5V15.5C2.5 16.6046 3.39543 17.5 4.5 17.5H15.5C16.6046 17.5 17.5 16.6046 17.5 15.5V4.5C17.5 3.39543 16.6046 2.5 15.5 2.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Save to External Drive
                </button>
                <button className="document-drawer__btn document-drawer__btn--secondary" onClick={handleDownload}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 12.5L6.25 8.75L7.5 7.5L9.25 9.25V2.5H10.75V9.25L12.5 7.5L13.75 8.75L10 12.5Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2.5 15V16.25C2.5 16.9404 3.05964 17.5 3.75 17.5H16.25C16.9404 17.5 17.5 16.9404 17.5 16.25V15" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Download
                </button>
                <button className="document-drawer__btn document-drawer__btn--ghost" onClick={handleBack}>
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DocumentDrawer;