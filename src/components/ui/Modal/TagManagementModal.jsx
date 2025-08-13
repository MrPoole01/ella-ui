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
  const [customTagName, setCustomTagName] = useState('');
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);

  // Initialize selected tags when modal opens
  useEffect(() => {
    if (isOpen && document) {
      setSelectedTags(document.tags || []);
      setCustomTagName('');
      setShowCustomTagInput(false);
    }
  }, [isOpen, document]);

  const toggleTag = (tagValue) => {
    if (tagValue === 'other') {
      setShowCustomTagInput(true);
      return;
    }
    
    setSelectedTags(prev => 
      prev.includes(tagValue) 
        ? prev.filter(tag => tag !== tagValue)
        : [...prev, tagValue]
    );
  };

  const handleCustomTagAdd = () => {
    if (customTagName.trim()) {
      const customTag = customTagName.trim().toLowerCase().replace(/\s+/g, '_');
      setSelectedTags(prev => [...prev, customTag]);
      setCustomTagName('');
      setShowCustomTagInput(false);
    }
  };

  const handleCustomTagCancel = () => {
    setCustomTagName('');
    setShowCustomTagInput(false);
  };

  const removeCustomTag = (tagValue) => {
    setSelectedTags(prev => prev.filter(t => t !== tagValue));
  };

  const handleSave = () => {
    onSave(document.id, selectedTags);
    onClose();
  };

  const handleCancel = () => {
    setSelectedTags(document?.tags || []);
    setCustomTagName('');
    setShowCustomTagInput(false);
    onClose();
  };

  // Separate predefined and custom tags
  const customTags = selectedTags.filter(tag => !predefinedTags.some(pt => pt.value === tag));
  const availableTags = predefinedTags.map(t => ({ 
    ...t, 
    selected: selectedTags.includes(t.value) 
  }));

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
              {availableTags.map(tag => (
                <button
                  key={tag.value}
                  className={`tag-management-modal__tag ${
                    tag.selected ? 'tag-management-modal__tag--selected' : ''
                  }`}
                  onClick={() => toggleTag(tag.value)}
                >
                  {tag.label}
                </button>
              ))}
            </div>
            
            {customTags.length > 0 && (
              <div className="tag-management-modal__custom-tags">
                <div className="tag-management-modal__custom-tags-label">Custom Tags:</div>
                <div className="tag-management-modal__tags-grid">
                  {customTags.map(tag => (
                    <div key={tag} className="tag-management-modal__custom-tag">
                      <span>{tag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      <button
                        type="button"
                        className="tag-management-modal__remove-tag"
                        onClick={() => removeCustomTag(tag)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showCustomTagInput && (
              <div className="tag-management-modal__custom-tag-input">
                <input
                  type="text"
                  className="tag-management-modal__input"
                  value={customTagName}
                  onChange={(e) => setCustomTagName(e.target.value)}
                  placeholder="Enter custom tag name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomTagAdd();
                    } else if (e.key === 'Escape') {
                      handleCustomTagCancel();
                    }
                  }}
                  autoFocus
                />
                <div className="tag-management-modal__custom-tag-buttons">
                  <button
                    type="button"
                    className="tag-management-modal__custom-tag-add"
                    onClick={handleCustomTagAdd}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="tag-management-modal__custom-tag-cancel"
                    onClick={handleCustomTagCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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
