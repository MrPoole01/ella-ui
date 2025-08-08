import React, { useState, useEffect } from 'react';
import './TagManagementModal.scss';

const TagManagementModal = ({ 
  isOpen, 
  onClose, 
  onSave,
  document,
  predefinedTags = []
}) => {
  const [selectedTags, setSelectedTags] = useState([]);

  // Initialize selected tags when modal opens
  useEffect(() => {
    if (isOpen && document) {
      setSelectedTags(document.tags || []);
    }
  }, [isOpen, document]);

  const toggleTag = (tagValue) => {
    setSelectedTags(prev => 
      prev.includes(tagValue) 
        ? prev.filter(tag => tag !== tagValue)
        : [...prev, tagValue]
    );
  };

  const handleSave = () => {
    onSave(document.id, selectedTags);
    onClose();
  };

  const handleCancel = () => {
    setSelectedTags(document?.tags || []);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="tag-management-modal__backdrop" onClick={handleCancel} />
      
      {/* Modal */}
      <div className="tag-management-modal">
        <div className="tag-management-modal__header">
          <h3 className="tag-management-modal__title">Manage Tags</h3>
          <button 
            className="tag-management-modal__close"
            onClick={handleCancel}
          >
            ×
          </button>
        </div>

        <div className="tag-management-modal__content">
          <div className="tag-management-modal__document-info">
            <span className="tag-management-modal__document-title">
              {document?.title}
            </span>
          </div>

          <div className="tag-management-modal__tags">
            <div className="tag-management-modal__tags-label">
              Select tags for this document:
            </div>
            <div className="tag-management-modal__tags-grid">
              {predefinedTags.map(tag => (
                <button
                  key={tag.value}
                  className={`tag-management-modal__tag ${
                    selectedTags.includes(tag.value) 
                      ? 'tag-management-modal__tag--selected' 
                      : ''
                  }`}
                  onClick={() => toggleTag(tag.value)}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="tag-management-modal__footer">
          <button 
            className="tag-management-modal__cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            className="tag-management-modal__save"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

export default TagManagementModal;
