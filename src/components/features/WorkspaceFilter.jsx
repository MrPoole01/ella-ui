import React, { useState, useEffect } from 'react';
import './WorkspaceFilter.scss';

const WorkspaceFilter = ({ 
  isOpen, 
  onClose, 
  onSortChange, 
  currentSort = 'default',
  className = '' 
}) => {
  const [selectedSort, setSelectedSort] = useState(currentSort);

  const sortOptions = [
    { 
      id: 'default', 
      label: 'Default Order', 
      description: 'Original order',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      id: 'a-z', 
      label: 'A → Z', 
      description: 'Alphabetical ascending',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 12V4l2.5 3L8 4v8M10 6h3l-1.5 2L13 10h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 9h5M10 6l3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      id: 'z-a', 
      label: 'Z → A', 
      description: 'Alphabetical descending',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 4v8l2.5-3L8 12V4M10 10h3l-1.5-2L13 6h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 7h5M10 10l3-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.workspace-filter')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleSortSelect = (sortId) => {
    setSelectedSort(sortId);
    if (onSortChange) {
      onSortChange(sortId);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`workspace-filter ${className}`}>
      <div className="workspace-filter__dropdown">
        <div className="workspace-filter__header">
          <span className="workspace-filter__title">Sort Workspaces</span>
          <button 
            className="workspace-filter__close"
            onClick={onClose}
            aria-label="Close filter"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="workspace-filter__options">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              className={`workspace-filter__option ${selectedSort === option.id ? 'workspace-filter__option--selected' : ''}`}
              onClick={() => handleSortSelect(option.id)}
            >
              <div className="workspace-filter__option-icon">
                {option.icon}
              </div>
              <div className="workspace-filter__option-content">
                <div className="workspace-filter__option-label">
                  {option.label}
                </div>
                <div className="workspace-filter__option-description">
                  {option.description}
                </div>
              </div>
              {selectedSort === option.id && (
                <div className="workspace-filter__option-indicator">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="workspace-filter__footer">
          <div className="workspace-filter__info">
            Choose how to organize your workspaces
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceFilter;
