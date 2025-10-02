import React, { useState } from 'react';
import { Button, Select, TagManagementModal } from '../ui';
import '../../styles/DocumentDrawer.scss';

// Mock document versions
const mockVersions = [
  { id: 5, version: 'Version 5', status: 'not_started', updatedDate: '2024-12-06' },
  { id: 4, version: 'Version 4', status: 'draft', updatedDate: '2024-12-07' },
  { id: 3, version: 'Version 3', status: 'draft', updatedDate: '2024-12-08' },
  { id: 2, version: 'Version 2', status: 'approved', updatedDate: '2024-12-09' },
  { id: 1, version: 'Version 1', status: 'approved', updatedDate: '2024-12-10', isActive: true }
];

// Predefined tags
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

const DocumentDrawer = ({ isOpen, onClose, document, onEdit, workspaceName = 'Workspace', playbookCardTitles = null }) => {
  const [selectedVersion, setSelectedVersion] = useState('Version 1');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [tagManagementModal, setTagManagementModal] = useState({ isOpen: false, document: null });
  const [currentDocument, setCurrentDocument] = useState(document || { tags: [] });
  const [activePlaybookIndex, setActivePlaybookIndex] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  const isPlaybookContext = Array.isArray(playbookCardTitles) && playbookCardTitles.length > 0;
  const resolvedCardTitles = isPlaybookContext ? playbookCardTitles : [];

  // Update currentDocument when document prop changes
  React.useEffect(() => {
    setCurrentDocument(document || { tags: [] });
  }, [document]);

  const handleTagSave = (documentId, newTags) => {
    setCurrentDocument(prev => ({
      ...(prev || {}),
      tags: newTags
    }));
    console.log(`Updated tags for document ${documentId}:`, newTags);
  };

  const handleManageTags = () => {
    setTagManagementModal({ isOpen: true, document: currentDocument });
  };

  // Chat response action handlers
  const handleThumbsUp = () => {
    console.log('Document chat thumbs up clicked');
    // Add your thumbs up logic here
  };

  const handleThumbsDown = () => {
    console.log('Document chat thumbs down clicked');
    // Add your thumbs down logic here
  };

  const handleCopy = async () => {
    try {
      // Get the chat message text
      const chatMessageElement = document.querySelector('.document-drawer__chat-message');
      if (chatMessageElement) {
        const messageText = chatMessageElement.innerText;
        await navigator.clipboard.writeText(messageText);
        console.log('Document chat message copied to clipboard');
        // You could add a toast notification here
      }
    } catch (err) {
      console.error('Failed to copy chat message: ', err);
    }
  };

  if (!isOpen || !document) return null;

  const handleEdit = () => {
    if (isPlaybookContext) {
      setActivePlaybookIndex(0);
      setActiveStep(1);
    }
    setIsEditMode(true);
    if (onEdit) {
      onEdit(document);
    }
  };

  const handleSave = () => {
    console.log('Save document:', document);
    // Exit edit mode and set status to approved when finalizing
    setIsEditMode(false);
    // Update document status to approved (this would typically be done via API)
    if (document) {
      document.status = 'approved';
    }
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
      setActivePlaybookIndex(null);
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
          <div className="document-drawer__breadcrumb-row">
            <div className="document-drawer__breadcrumb">
              <span className="document-drawer__crumb">{workspaceName}</span>
              <span className="document-drawer__crumb-sep">/</span>
              <span className="document-drawer__crumb">{document?.project || 'Project'}</span>
              <span className="document-drawer__crumb-sep">/</span>
              <span className="document-drawer__crumb document-drawer__crumb--current">{document?.title || 'Untitled'}</span>
            </div>
            
            {/* Close Button */}
            <button className="document-drawer__close" onClick={onClose}>
              ×
            </button>
          </div>

          {/* Playbook Cards */}
          {isPlaybookContext && (
            <div className="document-drawer__playbook-cards">
              {resolvedCardTitles.slice(0, 3).map((title, idx) => (
                <div key={idx} className={`document-drawer__playbook-card ${activePlaybookIndex === idx && isEditMode ? 'document-drawer__playbook-card--active' : ''}`}>
                  <div className="document-drawer__playbook-card-header">
                    <h3 className="document-drawer__playbook-card-title">{title}</h3>
                    <button className="document-drawer__playbook-card-info" title="More information">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        <path d="M10 9V14M10 6V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <div className="document-drawer__playbook-card-tags">
                    <span className="document-drawer__playbook-tag">Planning</span>
                    <span className="document-drawer__playbook-tag">Strategy</span>
                    <button className="document-drawer__playbook-save-icon" title="Save">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2L10 6L14.5 6.5L11 10L12 14.5L8 12L4 14.5L5 10L1.5 6.5L6 6L8 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="document-drawer__header-row">
            <div className="document-drawer__header-left">
            <div className="document-drawer__title">
              {isEditMode ? 'Edit Document' : 'Review Document'}
            </div>
            {(!isEditMode || document?.status !== 'approved') && document && (
              <div 
                className="document-drawer__status"
                style={{ color: getStatusColor(document.status) }}
              >
                {getStatusLabel(document.status)}
              </div>
            )}
            </div>

            <div className="document-drawer__header-right">
            {/* Version Dropdown - Only show when NOT in edit mode */}
            {!isEditMode && (
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
            )}
            </div>
          </div>
        </div>

        <div className="document-drawer__subtitle">
          {isEditMode 
            ? 'Make changes to your document. Ella is here to help.'
            : `Review and approve your ${document?.title || 'document'}. Let us know if you'd like refinements or have additional input.`
          }
        </div>

        {/* Content */}
        <div className="document-drawer__content">
          {isEditMode ? (
            /* Edit Mode - Split Layout */
            <div 
              className="document-drawer__edit-layout"
              style={{ height: isPlaybookContext ? 'calc(100vh - 401px)' : 'calc(100vh - 281px)' }}
            >
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
                {isPlaybookContext && (
                  <div className="document-drawer__stepper">
                    {[1,2,3,4,5].map((step, idx) => {
                      const isCompleted = step < activeStep;
                      const isCurrent = step === activeStep;
                      return (
                        <div key={step} className="document-drawer__stepper-item">
                          <div className={`document-drawer__stepper-circle ${isCompleted ? 'document-drawer__stepper-circle--completed' : ''} ${isCurrent ? 'document-drawer__stepper-circle--current' : ''}`}>
                            {isCompleted ? (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M13.3333 4.66675L6.33325 11.6667L3.33325 8.66675" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            ) : (
                              <span>{step}</span>
                            )}
                          </div>
                          {idx < 4 && (
                            <div className={`document-drawer__stepper-connector ${step < activeStep ? 'document-drawer__stepper-connector--active' : ''}`}></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
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
                    
                    {/* Chat Response Actions */}
                    <div className="document-drawer__response-actions">
                      <button className="document-drawer__response-button document-drawer__thumbs-up" title="Thumbs up" onClick={handleThumbsUp}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.864 1.6c.8 0 1.45.65 1.45 1.45v2.9H14.1c.8 0 1.45.65 1.45 1.45 0 .25-.05.5-.15.75l-2 5.5c-.2.5-.65.85-1.2.85H5.4c-.8 0-1.45-.65-1.45-1.45V8.5c0-.4.15-.75.4-1.05l3.5-4.5c.3-.35.7-.55 1.15-.55h.05c.1 0 .2 0 .3.05.1.05.15.15.15.25v1.45c0 .8-.65 1.45-1.45 1.45H6.9l1.95-2.5v-.5zM2.5 7h1v6.5h-1c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1z" fill="currentColor"/>
                        </svg>
                      </button>
                      <button className="document-drawer__response-button document-drawer__thumbs-down" title="Thumbs down" onClick={handleThumbsDown}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.136 14.4c-.8 0-1.45-.65-1.45-1.45v-2.9H1.9c-.8 0-1.45-.65-1.45-1.45 0-.25.05-.5.15-.75l2-5.5c.2-.5.65-.85 1.2-.85H10.6c.8 0 1.45.65 1.45 1.45V7.5c0 .4-.15.75-.4 1.05l-3.5 4.5c-.3.35-.7.55-1.15.55h-.05c-.1 0-.2 0-.3-.05-.1-.05-.15-.15-.15-.25v-1.45c0-.8.65-1.45 1.45-1.45H9.1l-1.95 2.5v.5zM13.5 9h-1V2.5h1c.55 0 1 .45 1 1V8c0 .55-.45 1-1 1z" fill="currentColor"/>
                        </svg>
                      </button>
                      <button className="document-drawer__response-button document-drawer__copy" title="Copy" onClick={handleCopy}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 2h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 1.5c-.275 0-.5.225-.5.5v8c0 .275.225.5.5.5h8c.275 0 .5-.225.5-.5V4c0-.275-.225-.5-.5-.5H4zM1 6v9c0 1.1.9 2 2 2h9v-1.5H3c-.275 0-.5-.225-.5-.5V6H1z" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
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
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18" height="18" viewBox="0 0 18 18">
                      <defs>
                        <clipPath id="clipPathSend">
                          <path d="M0 0L18 0L18 18L0 18L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                        </clipPath>
                      </defs>
                      <g clipPath="url(#clipPathSend)">
                        <path d="M17.7818 0.607503C17.782 0.596637 17.782 0.586165 17.7818 0.575298C17.7811 0.548823 17.7785 0.522742 17.7743 0.496662C17.773 0.488561 17.7726 0.480658 17.7708 0.472558C17.7641 0.439957 17.7546 0.407949 17.7423 0.37693C17.7388 0.367841 17.7342 0.359345 17.7303 0.350454C17.7198 0.326942 17.708 0.304221 17.6943 0.282092C17.6888 0.273004 17.6833 0.263915 17.6771 0.254826C17.657 0.225782 17.6352 0.197924 17.6098 0.172436C17.5841 0.146751 17.5558 0.12482 17.5266 0.104469C17.5183 0.0987397 17.5098 0.093405 17.5011 0.088268C17.4778 0.0738448 17.4539 0.0613974 17.4292 0.0505306C17.4215 0.0471718 17.4142 0.0432202 17.4062 0.040059C17.3744 0.0276115 17.3416 0.0177326 17.3081 0.011015C17.3019 0.0098295 17.2956 0.00943434 17.2895 0.00824887C17.2614 0.003507 17.2332 0.000740905 17.2047 0.00014817C17.1952 -4.93926e-05 17.1859 -4.93926e-05 17.1767 0.000148186C17.1488 0.00074092 17.1209 0.00350701 17.0931 0.00824889C17.0862 0.00943436 17.0795 0.00982952 17.0725 0.0112126C17.0421 0.0173375 17.0121 0.0256358 16.9824 0.0367001L0.384498 6.26496C0.16242 6.34833 0.0114701 6.55599 0.00060336 6.79308C-0.0100659 7.02998 0.121521 7.25067 0.335103 7.35381L7.14266 10.6391L10.4278 17.4467C10.5272 17.6524 10.7352 17.782 10.9618 17.782C10.9709 17.782 10.9798 17.7818 10.9889 17.7814C11.2258 17.7705 11.4337 17.6196 11.517 17.3975L17.7455 0.799747C17.7566 0.770308 17.7647 0.740473 17.7708 0.710244C17.7724 0.702143 17.773 0.69424 17.7741 0.686139C17.7785 0.660059 17.7811 0.633781 17.7818 0.607503ZM14.8354 2.1085L7.4655 9.47837L2.09809 6.88831L14.8354 2.1085ZM10.8937 15.6839L8.30363 10.3167L15.6737 2.94663L10.8937 15.6839Z" fillRule="nonzero" transform="matrix(1 0 0 1 0.098877 0.0989456)" fill="currentColor"/>
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* View Mode - Single Panel */
            <>
              {/* Combined Info Row: Title, Project, Content Type, and Tags */}
              <div className="document-drawer__info-row">
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
                  <div className="document-drawer__section-header">
                    <div className="document-drawer__section-label">Tags:</div>
                    <button 
                      className="document-drawer__manage-tags-link"
                      onClick={handleManageTags}
                    >
                      Manage Tags
                    </button>
                  </div>
                  <div className="document-drawer__section-content">
                    <div className="document-drawer__tags">
                      {/* Add Tag Button */}
                      <button 
                        className="document-drawer__add-tag"
                        onClick={handleManageTags}
                        title="Manage Tags"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      
                      {/* Existing Tags */}
                      {currentDocument?.tags?.map((tag, index) => {
                        const tagInfo = predefinedTags.find(t => t.value === tag);
                        return (
                          <span key={index} className="document-drawer__tag">
                            {tagInfo ? tagInfo.label : tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="document-drawer__view-content">
                <div className="document-drawer__execution-info">
                  Execution: {formatDate(document.lastUpdated)} 09:25
                </div>

                <div className="document-drawer__document-section">
                  <div className="document-drawer__section-label">Sample Content:</div>
                  <div 
                    className="document-drawer__section-content document-drawer__sample-content"
                    style={{ height: isPlaybookContext ? 'calc(100vh - 711px)' : 'calc(100vh - 554px)' }}
                  >
                    This is where the actual document content would be displayed. 
                    In a real implementation, this would show the full document content 
                    with proper formatting, images, and other media elements.
                  </div>
                </div>
              </div>
            </>
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
                  Finalize
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
                  {isPlaybookContext ? 'Run' : 'Edit'}
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

export default DocumentDrawer;