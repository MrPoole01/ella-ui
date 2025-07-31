import React, { useState } from 'react';
import { Select, Button } from '../ui';
import { PlusIcon } from '../icons';

// Predefined tags - matches SavedWorkDrawer
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

const TagSelector = ({ currentTags = [], onTagsChange, isOpen, onClose }) => {
  const [selectedTag, setSelectedTag] = useState('');

  const availableTags = predefinedTags.filter(
    tag => !currentTags.includes(tag.value)
  );

  const handleAddTag = () => {
    if (selectedTag && !currentTags.includes(selectedTag)) {
      const newTags = [...currentTags, selectedTag];
      onTagsChange(newTags);
      setSelectedTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = currentTags.filter(tag => tag !== tagToRemove);
    onTagsChange(newTags);
  };

  if (!isOpen) return null;

  return (
    <div className="tag-selector__backdrop" onClick={onClose}>
      <div className="tag-selector" onClick={(e) => e.stopPropagation()}>
        <div className="tag-selector__header">
          <h3>Manage Tags</h3>
          <button className="tag-selector__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="tag-selector__content">
          {/* Current Tags */}
          <div className="tag-selector__section">
            <label>Current Tags:</label>
            <div className="tag-selector__current-tags">
              {currentTags.length === 0 ? (
                <span className="tag-selector__no-tags">No tags added</span>
              ) : (
                currentTags.map((tag) => {
                  const tagLabel = predefinedTags.find(t => t.value === tag)?.label || tag;
                  return (
                    <span key={tag} className="tag-selector__tag">
                      {tagLabel}
                      <button 
                        className="tag-selector__remove-tag"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  );
                })
              )}
            </div>
          </div>

          {/* Add New Tag */}
          {availableTags.length > 0 && (
            <div className="tag-selector__section">
              <label>Add Tag:</label>
              <div className="tag-selector__add-section">
                <Select
                  options={[
                    { value: '', label: 'Select a tag...' },
                    ...availableTags
                  ]}
                  value={selectedTag}
                  onChange={setSelectedTag}
                  placeholder="Select a tag..."
                />
                <Button 
                  variant="primary" 
                  onClick={handleAddTag}
                  disabled={!selectedTag}
                >
                  <PlusIcon />
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="tag-selector__footer">
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TagSelector;