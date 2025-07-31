import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.scss';

/**
 * Reusable Dropdown component
 * Extracted from Header theme dropdown, WorkspaceDropdown, and various context menus
 */
const Dropdown = ({
  children,
  trigger,
  isOpen: controlledIsOpen,
  onToggle,
  placement = 'bottom-start',
  offset = 8,
  className = '',
  triggerClassName = '',
  contentClassName = '',
  closeOnClickOutside = true,
  closeOnItemClick = true,
  disabled = false,
  ...props
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  // Use controlled or uncontrolled state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = onToggle || setInternalIsOpen;

  const dropdownClasses = [
    'dropdown',
    `dropdown--${placement}`,
    {
      'dropdown--open': isOpen,
      'dropdown--disabled': disabled
    },
    className
  ]
    .filter(Boolean)
    .map(cls => typeof cls === 'object' ? Object.keys(cls).filter(key => cls[key]) : cls)
    .flat()
    .join(' ');

  const handleToggle = (e) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleItemClick = (e) => {
    if (closeOnItemClick) {
      // Small delay to allow the click action to complete
      setTimeout(() => {
        setIsOpen(false);
      }, 100);
    }
  };

  // Close on click outside
  useEffect(() => {
    if (!closeOnClickOutside || !isOpen) return;

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeOnClickOutside, setIsOpen]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, setIsOpen]);

  return (
    <div 
      ref={dropdownRef} 
      className={dropdownClasses}
      {...props}
    >
      <div
        ref={triggerRef}
        className={`dropdown__trigger ${triggerClassName}`}
        onClick={handleToggle}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleToggle(e);
          }
        }}
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          ref={contentRef}
          className={`dropdown__content ${contentClassName}`}
          onClick={handleItemClick}
          style={{
            '--dropdown-offset': `${offset}px`
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;