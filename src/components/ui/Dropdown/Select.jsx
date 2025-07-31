import React, { useState } from 'react';
import Dropdown from './Dropdown';
import DropdownItem from './DropdownItem';
import './Dropdown.scss';

/**
 * Select component - dropdown for form selections
 */
const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  error,
  size = 'medium',
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const selectClasses = [
    'select',
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

  const handleSelect = (option) => {
    onChange?.(option.value, option);
    setIsOpen(false);
  };

  const trigger = (
    <div className={selectClasses}>
      <div className="select__value">
        {selectedOption ? selectedOption.label : placeholder}
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
        className="select-dropdown"
        contentClassName="select-dropdown__content"
        {...props}
      >
        {options.map((option) => (
          <DropdownItem
            key={option.value}
            onClick={() => handleSelect(option)}
            active={value === option.value}
            disabled={option.disabled}
          >
            {option.label}
          </DropdownItem>
        ))}
      </Dropdown>
      {error && (
        <div className="select-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default Select;