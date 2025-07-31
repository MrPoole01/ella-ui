import React from 'react';
import './Dropdown.scss';

/**
 * DropdownItem component for individual dropdown options
 */
const DropdownItem = ({
  children,
  onClick,
  disabled = false,
  active = false,
  destructive = false,
  icon,
  rightIcon,
  description,
  className = '',
  ...props
}) => {
  const itemClasses = [
    'dropdown-item',
    {
      'dropdown-item--active': active,
      'dropdown-item--disabled': disabled,
      'dropdown-item--destructive': destructive,
      'dropdown-item--has-icon': icon,
      'dropdown-item--has-right-icon': rightIcon,
      'dropdown-item--has-description': description
    },
    className
  ]
    .filter(Boolean)
    .map(cls => typeof cls === 'object' ? Object.keys(cls).filter(key => cls[key]) : cls)
    .flat()
    .join(' ');

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <div
      className={itemClasses}
      onClick={handleClick}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e);
        }
      }}
      {...props}
    >
      {icon && (
        <div className="dropdown-item__icon">
          {icon}
        </div>
      )}
      
      <div className="dropdown-item__content">
        <div className="dropdown-item__label">
          {children}
        </div>
        {description && (
          <div className="dropdown-item__description">
            {description}
          </div>
        )}
      </div>
      
      {rightIcon && (
        <div className="dropdown-item__right-icon">
          {rightIcon}
        </div>
      )}
    </div>
  );
};

export default DropdownItem;