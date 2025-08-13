import React, { useState } from 'react';
import Dropdown from './Dropdown';
import DropdownItem from './DropdownItem';
import './Dropdown.scss';

/**
 * MultiSelect component - dropdown for multiple selections
 */
const MultiSelect = ({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options...',
  disabled = false,
  error,
  size = 'medium',
  className = '',
  maxDisplayCount = 2,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // Update tempValue when value prop changes
  React.useEffect(() => {
    setTempValue(value);
  }, [value]);

  // Reset tempValue when dropdown opens
  React.useEffect(() => {
    if (isOpen) {
      setTempValue(value);
    }
  }, [isOpen, value]);

  const selectedOptions = options.filter(option => value.includes(option.value));
  
  const selectClasses = [
    'select',
    'select--multi',
    `select--${size}`,
    {
      'select--error': error,
      'select--disabled': disabled,
      'select--open': isOpen
    },
    className
  ]
    .filter(Boolean)
    .map(cls => typeof cls === 'object' ? Object.keys(cls).filter(key => cls[key]) : cls)
    .flat()
    .join(' ');

  const handleSelect = (option, event) => {
    event?.stopPropagation(); // Prevent dropdown from closing
    
    const newValue = tempValue.includes(option.value)
      ? tempValue.filter(v => v !== option.value)
      : [...tempValue, option.value];
    
    // Update temporary state for multi-select behavior
    setTempValue(newValue);
  };

  const handleConfirm = () => {
    onChange?.(tempValue, options.filter(opt => tempValue.includes(opt.value)));
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempValue([]);
  };

  const handleCancel = () => {
    setTempValue(value); // Reset to original value
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }
    
    if (selectedOptions.length === 1) {
      return selectedOptions[0].label;
    }
    
    if (selectedOptions.length <= maxDisplayCount) {
      return selectedOptions.map(opt => opt.label).join(', ');
    }
    
    return `${selectedOptions.slice(0, maxDisplayCount).map(opt => opt.label).join(', ')} +${selectedOptions.length - maxDisplayCount} more`;
  };

  const trigger = (
    <div className={selectClasses}>
      <div className="select__value">
        {getDisplayText()}
      </div>
      <div className="select__arrow">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path 
            d="M3 4.5L6 7.5L9 4.5" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="select-container">
      <Dropdown
        trigger={trigger}
        isOpen={isOpen}
        onToggle={setIsOpen}
        disabled={disabled}
        className="select-dropdown multi-select-dropdown"
        contentClassName="select-dropdown__content"
        {...props}
      >
        {/* Scrollable options area */}
        <div className="multi-select-options">
          {options.map((option) => (
            <DropdownItem
              key={option.value}
              onClick={(event) => handleSelect(option, event)}
              active={tempValue.includes(option.value)}
              disabled={option.disabled}
              className="multi-select-item"
            >
              <div className="multi-select-item__content">
                <div className="multi-select-item__checkbox">
                  {tempValue.includes(option.value) && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path 
                        d="M2 6L5 9L10 3" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="multi-select-item__label">{option.label}</span>
              </div>
            </DropdownItem>
          ))}
        </div>
        
        {/* Sticky action buttons */}
        <div className="multi-select-actions">
          <button
            type="button"
            className="multi-select-action multi-select-action--clear"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            type="button"
            className="multi-select-action multi-select-action--confirm"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </Dropdown>
      {error && (
        <div className="select-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
